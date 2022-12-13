import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguageAction } from '@/redux/index/slice';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import iconzh from '@/assets/images/icon-语言选择-简体中文@2x.png';
import iconen from '@/assets/images/icon-语言选择-En@2x.png';
import close from '../../images/icon-语言选择-收起@2x.png';
import styles from './Language.module.scss';

const Language: FC = () => {
  const LanguagesList = [
    {
      icon: iconzh,
      text: '简',
      name: '简体中文',
      lang: 'zh',
    },
    {
      icon: iconen,
      text: 'En',
      name: 'English',
      lang: 'en',
    },
  ];
  const [isShowLanguagePop, setIsShowLanguagePop] = useState(false);
  const currentLanguage = useSelector(
    (s: RootState) => s.indexData.currentLanguage
  );
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const toggleLanguage = () => {
    setIsShowLanguagePop(!isShowLanguagePop);
  };
  const chooseChangeLanguage = (lang: string) => {
    dispatch(changeLanguageAction(lang));
    i18n.changeLanguage(lang);
    setIsShowLanguagePop(false);
  };
  return (
    <div className={styles['lang-box']}>
      <div className={styles.lang} onClick={toggleLanguage}>
        <div className={styles.title}>
          <img src={currentLanguage === 'zh' ? iconzh : iconen} alt='' />
          <span>{t('header.languageLeftBar')}</span>
        </div>
        <img
          src={close}
          className={`${isShowLanguagePop ? styles.active : ''}  ${
            styles.img_arrow
          }`}
          alt=''
        />
      </div>
      <div>
        <div
          className={`${styles.LanguagesWrap} ${
            isShowLanguagePop && styles.showLanguagesWrap
          }`}
        >
          {LanguagesList.map((item) => {
            return (
              <div
                key={item.text}
                className={styles.LanguageItem}
                onClick={() => chooseChangeLanguage(item.lang)}
              >
                <img src={item.icon} alt='' />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Language;
