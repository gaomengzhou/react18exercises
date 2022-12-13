import { FC } from 'react';
import { useTranslation } from 'react-i18next';
// import useUrlState from '@ahooksjs/use-url-state';
import { changeServeStatus, changeServeName } from '@/redux/security';
import { useAppDispatch } from '@/redux/hook';
import porn from '@/assets/images/index/icon-18+@3x.png';
import youtube from '@/assets/images/index/icon-关注我们-youtu@3x.png';
import facebook from '@/assets/images/index/icon-关注我们facebook@3x.png';
import twitter from '@/assets/images/index/icon-关注我们tw@3x.png';
import instagram from '@/assets/images/index/icon-关注我们-in@3x.png';
import telegram from '@/assets/images/index/icon-关注我们-te@3x.png';
import discord from '@/assets/images/index/icon-关注我们-discord@x2.png';
import bbin from '@/assets/images/index/icon-游戏提供商-bbin@3x.png';
import ag from '@/assets/images/index/icon-游戏提供商-AG@3x.png';
import pg from '@/assets/images/index/icon-游戏提供商-PG@3x.png';
import sky from '@/assets/images/index/icon-游戏提供商-SW@3x.png';
import saba from '@/assets/images/index/icon-游戏提供商-Saba@3x.png';
import styles from './Footer.module.scss';
// import { changeIsShowPopUpActivityAction } from '@/redux/wallet';
import CustomImg from '@/components/customImg/CustomImg';

const Footer: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const [, setUrlState] = useUrlState({ path: '/', params: '' });
  const goToDetail = (id: string) => {
    dispatch(changeServeName(id));
    dispatch(changeServeStatus(1));
  };
  const logoList = [
    {
      id: 1,
      img: youtube,
      src: 'https://www.youtube.com/channel/UCVvWTkuLHbpzqPiOTC4wTYA',
    },
    { id: 2, img: facebook, src: 'https://facebook.com/bet123official' },
    { id: 3, img: twitter, src: 'https://twitter.com/bet123official' },
    { id: 4, img: instagram, src: 'https://www.instagram.com/bet123official/' },
    { id: 5, img: telegram, src: 'https://t.me/bet123iocypto' },
    { id: 6, img: discord, src: 'https://discord.com/invite/Wve27Uyq' },
  ];
  const linkTo = (src: string): void => {
    window.open(src, '_blank');
  };
  const popUpClick = () => {
    // setUrlState({ path: 'PopUpActivity', params: '' });
    // dispatch(changeIsShowPopUpActivityAction(true));
  };
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <CustomImg src={porn} alt='' className='logo' />
          <p>{t('footer.Asaresponsiblegamingplatform')}</p>
        </div>
        <div className={styles.blocks}>
          <div className={styles.items}>
            <div className={styles.title}>
              <p>Bet123.io</p>
              <b />
            </div>
            <div>
              <span
                className={styles.pointer}
                onClick={() => goToDetail(t('footer.aboutus'))}
              >
                {t('footer.aboutus')}{' '}
              </span>
              <span
                className={styles.pointer}
                onClick={() => goToDetail(t('footer.CONTACTUS'))}
              >
                {t('footer.CONTACTUS')}
              </span>
              <span
                className={styles.pointer}
                onClick={() => goToDetail(t('footer.TermsofService'))}
              >
                {t('footer.TermsofService')}
              </span>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.title}>
              <p>{t('footer.CONTACTUS')}</p>
              <b />
            </div>
            <div className={styles.contactus}>
              <span>Service@bet123.io</span>
              <span>
                {t('footer.onlinecustomerservice')}
                {t('footer.Welcometocontactusanytime')}
              </span>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.title}>
              <p>{t('footer.Followus')}</p>
              <b />
            </div>
            <div className={styles.myLogo}>
              {logoList.map((item) => (
                <CustomImg
                  key={item.id}
                  src={item.img}
                  alt='logo'
                  onClick={() => linkTo(item.src)}
                />
              ))}
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.title}>
              <p>{t('footer.Platform')}</p>
              <b />
            </div>
            <div className={styles.partnerLogo}>
              <CustomImg src={bbin} />
              <CustomImg src={ag} />
              <CustomImg src={pg} />
              <CustomImg src={sky} />
              <CustomImg src={saba} />
            </div>
          </div>
        </div>
        <div className={`${styles.items} ${styles.copyright}`}>
          <p onClick={popUpClick}>
            {t('footer.Gamblingisaddictivepleasebecareful')}
          </p>
          <span>Copyright&copy; 2022 Bet123.io All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
};
export default Footer;
