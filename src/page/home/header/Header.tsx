import { Button, Toast } from 'antd-mobile';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import indexData, { changeLanguageAction } from '@/redux/index/slice';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import iconen from '@/assets/images/icon-语言选择-En@2x.png';
import iconzh from '@/assets/images/icon-语言选择-简体中文@2x.png';
import menuLogo from '@/assets/images/index/icon-菜单@3x.png';
import styles from './Header.module.scss';
import RightSidebarTop from '../components/rightSidebarTop/RightSidebarTop';
import UserCenterForRightSidebar from '../components/userCenterForRightSidebar/UserCenterForRightSidebar';
import Recharge from '../components/recharge/Recharge';
import WorldCup from '../components/worldCup/WorldCup';
import CustomImg from '@/components/customImg/CustomImg';

export type WorldCupAdProps = {
  day: string[];
  hour: string[];
  min: string[];
  s: string[];
};
interface headerProps {
  setShowLeftSidebar: Dispatch<SetStateAction<boolean>>;
  setShowRightSidebar: Dispatch<SetStateAction<boolean>>;
  time: WorldCupAdProps;
}

const Header: FC<headerProps> = ({
  setShowLeftSidebar,
  setShowRightSidebar,
  time,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch1 = useAppDispatch();
  const [isShowLanguagePop, setIsShowLanguagePop] = useState(false);
  const currentLanguage = useSelector(
    (s: RootState) => s.indexData.currentLanguage
  );
  const showWorldCup = useSelector((s) => s.indexData.showWorldCup);
  const { token, headUrl } = useSelector((s) => s.indexData.userinfo);
  const location = useLocation();
  const handle = () => {
    dispatch1(indexData.actions.setLoginShow(1));
  };
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
  const dispatch = useAppDispatch();
  // const toggleLanguage = () => {
  //   setIsShowLanguagePop(true);
  // };
  const mouseOverEvent = () => {
    setIsShowLanguagePop(true);
  };
  const mouseOuntEvent = () => {
    setIsShowLanguagePop(false);
  };
  const chooseChangeLanguage = (lang: string) => {
    dispatch(changeLanguageAction(lang));
    i18n.changeLanguage(lang);
    setIsShowLanguagePop(false);
  };

  const logout = async () => {
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });
    const result = await $fetch.post('/lottery-login-api/user/logout', {});
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }
    dispatch(indexData.actions.clearUserinfo());
    localStorage.removeItem('userInfo');
    setShowRightSidebar(false);
    Toast.clear();
  };

  return (
    <header
      className={`${styles.header} ${
        location.pathname === '/' &&
        showWorldCup &&
        styles['word-cup-ad-height']
      }`}
      id='header'
    >
      {location.pathname === '/' && showWorldCup && <WorldCup time={time} />}

      <div className={styles.headerAuto}>
        <div className={styles.left}>
          <menu onClick={() => setShowLeftSidebar(true)}>
            <CustomImg
              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
              src={menuLogo}
              alt='img'
            />
          </menu>
          <i className={styles.avatar} onClick={() => navigate('/')} />
        </div>
        <div className={styles.right}>
          {token && <Recharge />}
          {!token && (
            <Button
              className={styles.loginBtn}
              onClick={handle}
              type='button'
              color='primary'
              size='small'
            >
              {t('header.login')}
            </Button>
          )}
          {token && (
            <div className={styles.loginInfo}>
              <CustomImg
                src={headUrl}
                onClick={() => setShowRightSidebar(true)}
              />
              <div className={styles.userinfo}>
                <RightSidebarTop />
                <UserCenterForRightSidebar />
                <div className={styles['sign-out']}>
                  <button onClick={logout}>{t('rightSidebar.SignOut')}</button>
                </div>
              </div>
            </div>
          )}
          <div
            className={styles.Languages}
            onMouseOver={mouseOverEvent}
            onFocus={mouseOverEvent}
            onMouseOut={mouseOuntEvent}
            onBlur={mouseOuntEvent}
          >
            <div
              className={currentLanguage === 'zh' ? styles.imgZh : styles.imgEn}
            ></div>
            <div className={styles.countryText}>{t('header.language')}</div>
            <div
              className={`${styles.icon_arrow}  ${
                isShowLanguagePop ? styles.open : ''
              }`}
            ></div>
            {isShowLanguagePop ? (
              <div className={styles.LanguagesWrap}>
                {LanguagesList.map((item) => {
                  return (
                    <div
                      key={item.text}
                      className={styles.LanguageItem}
                      onClick={() => chooseChangeLanguage(item.lang)}
                    >
                      <CustomImg src={item.icon} />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
