import {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from './Select.module.scss';
import { SelectMoreProps } from '../../GameCategory';

interface SelectProps {
  selectActive: boolean;
  setSelectActive: Dispatch<SetStateAction<boolean>>;
  selectMoreProps: SelectMoreProps[];
  setSelectMoreProps: Dispatch<SetStateAction<SelectMoreProps[]>>;
  setMultipleChoice: Dispatch<SetStateAction<number[]>>;
  getData: () => Promise<ToastHandler | void>;
  multipleChoice: number[];
}
const Select: FC<SelectProps> = ({
  selectActive,
  setSelectActive,
  selectMoreProps,
  setSelectMoreProps,
  setMultipleChoice,
  getData,
  multipleChoice,
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  // 判断选中的个数
  const [number, setNumber] = useState(0);
  // 选中的参数
  const [params, setParams] = useState<any[]>([]);
  // 刚刚进入页面
  const [initPage, setInitPage] = useState(true);
  useEffect(() => {
    if (selectActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectActive]);
  // 路由切换多选清空
  useEffect(() => {
    setParams([]);
  }, [location, location.search]);

  // 监听全先选
  useEffect(() => {
    if (number === selectMoreProps.length - 1 && !selectMoreProps[0].checked) {
      if (selectMoreProps.length - 1 !== 0) {
        setSelectMoreProps(
          selectMoreProps.map((item) => {
            item.checked = true;
            return item;
          })
        );
        setNumber(selectMoreProps.length);
      }
    } else if (
      selectMoreProps[0].checked &&
      number === selectMoreProps.length - 1
    ) {
      const arr = selectMoreProps.map((item) => {
        if (item.thirdGameId === -1) item.checked = false;
        return item;
      });
      setSelectMoreProps(arr);
      setNumber(number - 1);
    }
    setMultipleChoice(params);
    // eslint-disable-next-line
  }, [number, params]);

  // 点击分类进入的
  useEffect(() => {
    if (initPage) {
      let id: number | undefined;
      const searchClass = Object.fromEntries(searchParams).class;
      selectMoreProps.forEach((item) => {
        if (item.thirdGameCode.includes(searchClass)) {
          item.checked = true;
          setNumber(1);
          id = item.thirdGameId;
        }
      });
      if (id) {
        setParams([id]);
        setMultipleChoice([id]);
        if (multipleChoice.length > 0) {
          setInitPage(false);
          getData();
        }
      }
    }
  }, [
    selectMoreProps,
    multipleChoice,
    initPage,
    searchParams,
    setMultipleChoice,
    getData,
  ]);

  // 重置
  const reset = (e: SyntheticEvent): void => {
    e.stopPropagation();
    setNumber(0);
    setSelectMoreProps(
      selectMoreProps.map((item) => {
        item.checked = false;
        return item;
      })
    );
    setParams([]);
  };

  // 多选
  const toChecked = (e: SyntheticEvent, data: SelectMoreProps): void => {
    e.stopPropagation();
    if (!data.checked) {
      setParams(() => {
        params.push(data.thirdGameId);
        return params;
      });
    } else {
      const index = params.indexOf(data.thirdGameId);
      const arr = params.filter((item) => item !== params[index]);
      setParams(arr);
    }
    if (data.checked) {
      setNumber(number - 1);
    } else {
      setNumber(number + 1);
    }
    setSelectMoreProps(
      selectMoreProps.map((items) => {
        if (items.thirdGameId === data.thirdGameId) {
          items.checked = !items.checked;
        }
        return items;
      })
    );

    if (data.thirdGameId === -1 && data.checked) {
      const arr: any[] = [];
      const allChecked = selectMoreProps.map((item) => {
        item.checked = true;
        arr.push(item.thirdGameId);
        return item;
      });
      setSelectMoreProps(allChecked);
      setNumber(selectMoreProps.length);
      arr.shift();
      setParams(arr);
    }

    if (data.thirdGameId === -1 && !data.checked) {
      const allChecked = selectMoreProps.map((item) => {
        item.checked = false;
        return item;
      });
      setSelectMoreProps(allChecked);
      setNumber(0);
      setParams([]);
    }
  };

  // 确信
  const onConfirm = (e: SyntheticEvent) => {
    e.stopPropagation();
    setSelectActive(false);
    getData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollBody}>
        {selectMoreProps.map((item) => (
          <div className={styles.padding} key={item.thirdGameId}>
            <div className={styles.items} onClick={(e) => e.stopPropagation()}>
              <div onClick={(e) => toChecked(e, item)}>
                <i className={`${item.checked && styles['checked-i']}`} />
                <p>{item.thirdGmaeName}</p>
              </div>
              <span>{item.count}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.button}>
        <button onClick={reset}>{t('common.Reset')}</button>
        <button onClick={onConfirm}>{t('common.Confirm')}</button>
      </div>
    </div>
  );
};
export default Select;
