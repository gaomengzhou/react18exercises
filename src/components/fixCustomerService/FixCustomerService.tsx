import { FC } from 'react';
import { useSelector } from '@/redux/hook';
import styles from './FixCustomerService.module.scss';

const FixCustomerService: FC = () => {
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const gotoOnlineService = () => {
    if (platformConfig.customerServiceUrl) {
      window.open(platformConfig.customerServiceUrl);
    }
    console.log('platformConfig', platformConfig);
  };
  return (
    <div onClick={gotoOnlineService} className={styles.wrap}>
      <div className={styles.onlineCustomer}></div>
    </div>
  );
};
export default FixCustomerService;
