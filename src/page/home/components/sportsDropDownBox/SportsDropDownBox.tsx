import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './SportsDropDownBox.module.scss';
import checkedLogo from '../../images/icon-侧边栏-选中@3x.png';
import { LeftSidebarProps } from '../../leftSidebar/LeftSidebar';
import { toSportGame } from '../../HomeMethod';
import CustomImg from '@/components/customImg/CustomImg';

interface SportsDropDownBoxProps extends LeftSidebarProps {
  setChangeName: Dispatch<SetStateAction<string>>;
  active: number;
  dropDown: boolean;
  setDropDown: Dispatch<SetStateAction<boolean>>;
}

const SportsDropDownBox: FC<SportsDropDownBoxProps> = ({
  setChangeName,
  active,
  dropDown,
  setDropDown,
  setShowLeftSidebar,
}) => {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { token } = useSelector((s) => s.indexData.userinfo);
  const [data, setData] = useState([
    { id: 1, name: '', checked: false, gameCode: 'BBINTY' },
    { id: 2, name: '', checked: false, gameCode: 'OBTY' },
    { id: 3, name: '', checked: false, gameCode: 'HGTY' },
    { id: 4, name: '', checked: false, gameCode: 'SBTY' },
  ]);
  useEffect(() => {
    const name = [
      t('leftSidebar.BBINSports'),
      t('leftSidebar.OBSports'),
      t('leftSidebar.CrownSports'),
      t('leftSidebar.SabaSports'),
    ];
    const arr = data.map((item, i) => {
      item.name = name[i];
      return item;
    });
    setData(arr);
    const tabName = data.filter((item) => {
      return item.checked;
    });
    if (tabName.length > 0) {
      setChangeName(tabName[0].name);
    } else {
      setChangeName(t('main.Sports'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);
  useEffect(() => {
    if (!token) {
      dispatch(indexData.actions.setLeftSidebarTopTabs(0));
      setDropDown(false);
      setChangeName(t('main.Sports'));
      const arr = data.map((item) => {
        item.checked = false;
        return item;
      });
      setData(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const checked = (obj: any) => {
    const arr = data.map((item) => {
      if (item.id === obj.id) {
        item.checked = true;
        setChangeName(item.name);
      } else {
        item.checked = false;
      }
      return item;
    });
    setData(arr);
    setDropDown(false);
    setShowLeftSidebar(false);
    toSportGame(navigator, obj.gameCode);
    // 传2改变侧边栏图标的高亮. 2是体育类
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(2));
  };
  return (
    <div
      className={`${styles.box} ${
        active !== 1 || !dropDown ? null : styles.show
      }`}
    >
      {data.map((item) => (
        <div
          className={`${styles.items} ${item.checked && styles.checked}`}
          key={item.id}
          onClick={() => checked(item)}
        >
          <p>{item.name}</p>
          {item.checked && <CustomImg src={checkedLogo} />}
        </div>
      ))}
    </div>
  );
};
export default SportsDropDownBox;
