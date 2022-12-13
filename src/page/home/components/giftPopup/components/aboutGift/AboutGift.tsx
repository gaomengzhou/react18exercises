import { FC } from 'react';
import { Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import styles from './AboutGift.module.scss';
import logo from '@/assets/images/插图-gift.png';
import { useSelector } from '@/redux/hook';
import CustomImg from '@/components/customImg/CustomImg';

const AboutGift: FC = () => {
  const { t } = useTranslation();
  const {
    walletList: { list },
  } = useSelector((s) => s.indexData);
  const giftWallet = list.filter((item) => item.currencyType === 0)[0];
  const handleClick = async () => {
    const res = await $fetch.post('/lottery-api/virtualWallet/receiveGift');
    if (!res.success) return Toast.show(res.message);
  };
  return (
    <div className={styles.about}>
      <div className={styles.info}>
        <div className={styles.imgBox}>
          <CustomImg lazy src={logo} alt='logo' />
        </div>
        <div className={styles.mid}>
          <div>
            <p>{t('giftPopup.locked')}</p>
            <span>{giftWallet.lockBalance}</span>
          </div>
          <div>
            <p>{t('giftPopup.unlocked')}</p>
            <span>{giftWallet.waitReceiveBalance}</span>
          </div>
        </div>
        <div className={styles.bot}>
          <button
            disabled={+giftWallet.waitReceiveBalance < 10}
            className={`${
              +giftWallet.waitReceiveBalance < 10 && styles['btn-disable']
            }`}
            onClick={handleClick}
          >
            {t('giftPopup.claim')}
          </button>
          <p>{t('giftPopup.minClaim')}</p>
        </div>
      </div>
      <div className={styles.qa}>
        <div>
          <h3>{t('giftPopup.whatIsGift')}</h3>
          <p>{t('giftPopup.thisIsGift')}</p>
        </div>
        <div>
          <h3>{t('giftPopup.howToUnlockGift')}</h3>
          <p>{t('giftPopup.toUnlockGift')}</p>
        </div>
        <span>
          {`${t('giftPopup.unLockAmount')}=${t(
            'giftPopup.sportsValidBetting'
          )}*${giftWallet.currencyDetailVO.sportsUnlockRate}%+${t(
            'giftPopup.liveValidBetting'
          )}*${giftWallet.currencyDetailVO.realPersonUnlockRate}%+${t(
            'giftPopup.slotValidBetting'
          )}*${giftWallet.currencyDetailVO.electronicUnlockRate}%`}
        </span>
      </div>
    </div>
  );
};
export default AboutGift;
