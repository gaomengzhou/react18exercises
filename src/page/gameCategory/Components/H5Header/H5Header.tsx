import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@/redux/hook';
import styles from './H5Header.module.scss';

const H5Header: FC<{ type: string }> = ({ type }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const gotoOnlineService = (e: any) => {
    e.stopPropagation();
    if (!platformConfig.customerServiceUrl) return;
    window.open(platformConfig.customerServiceUrl);
  };
  return (
    <div className={styles.header}>
      <div className={styles.left} onClick={() => navigate('/')}>
        <i />
      </div>
      <div className={styles.title}>
        {type === '3' ? t('gameCategory.allLive') : t('gameCategory.allSlots')}
      </div>
      <div className={styles.right} onClick={gotoOnlineService}>
        {t('gameCategory.liveSupport')}
      </div>
    </div>
  );
};
export default H5Header;
