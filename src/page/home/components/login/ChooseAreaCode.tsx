import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@/redux/hook';
import styles from './ChooseAreaCode.module.scss';

interface typecounty {
  en: string;
  remark: string;
  id: string;
  zh_CN: string;
  areaCodekey: string;
}

interface typeClassName {
  en: 'China' | 'Philippines';
  remark: string;
  id: string;
  zh_CN: string;
  areaCodekey: string;
}
interface typeChooseArea {
  area: Array<typecounty>;
  chooseArea: any;
}
const ChooseAreaCode: FC<typeChooseArea> = ({ area, chooseArea }) => {
  const { t } = useTranslation();
  const chooseItem = (item: any) => {
    chooseArea(item.areaCodekey);
  };
  const [tempList, setTempList] = useState(area);
  const currentLanguage = useSelector((s) => s.indexData.currentLanguage);
  const searchData = (e: any) => {
    const data = e.target.value.toString();
    if (data === '') {
      return setTempList(area);
    }
    const filterList = tempList.filter((item) => {
      return (
        item.areaCodekey.indexOf(data) >= 0 ||
        item.zh_CN.indexOf(data) >= 0 ||
        item.en.toLocaleLowerCase().indexOf(data) >= 0
      );
    });

    if (filterList.length > 0) {
      setTempList(filterList);
    } else {
      setTempList([]);
    }
  };
  return (
    <div className={styles['ChooseAreaCode-wrap']}>
      <div className={styles.choose_area_code_wrap}>
        <div className={styles.search_box}>
          <span className={styles.search_img} />
          <input
            type='text'
            placeholder={t('login.Pleaseselectacountryorregion')}
            className={styles['search-control']}
            onInput={searchData}
          />
        </div>
        <div className={styles.list_content_wrap}>
          <ul className={styles.list_content}>
            {tempList.map((item: typecounty) => {
              return (
                <li
                  className={styles.list_box}
                  onClick={() => chooseItem(item)}
                  key={item.id}
                >
                  <p className={styles['left-box']}>
                    <span className={styles[(item as typeClassName).en]} />
                    <span
                      className={styles.county_name}
                    >{`+${item.areaCodekey}`}</span>
                  </p>
                  <span>{currentLanguage === 'en' ? item.en : item.zh_CN}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChooseAreaCode;
