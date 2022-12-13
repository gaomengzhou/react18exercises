import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './CustomerService.module.scss';

// interface customerService {
//   handleIsShow: any;
// }
const CustomerService: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const handleIsShowFn = (type: number) => {
    dispatch(indexData.actions.setLoginShow(type));
  };
  const gotoOnlineService = (e: any) => {
    e.stopPropagation();
    if (!platformConfig.customerServiceUrl) return;
    window.open(platformConfig.customerServiceUrl);
  };
  const stopProp = (e: MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div className={styles.customerService} onClick={() => stopProp}>
      <span className={styles.orange} onClick={gotoOnlineService}>
        {t('login.onlineservice')}
      </span>
      <span> {t('login.Noaccountyet')}</span>
      <span className={styles.blue} onClick={() => handleIsShowFn(3)}>
        {t('login.register')}
      </span>
    </div>
  );
};

export default CustomerService;
