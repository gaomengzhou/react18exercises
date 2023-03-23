import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MineHeader.module.scss';
import setting from '@/assets/images/icon-设置.png';

const MineHeader: FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles['mine-header-container']}>
      <img
        className={styles.left}
        src={setting}
        alt='setting'
        onClick={() => navigate('/security')}
      />
      <p className={styles.middle}>我的</p>
      <div
        className={styles.right}
        onClick={() => navigate('/customer-service')}
      >
        <i className='iconfont icon-other_service' />
        <p>客服</p>
      </div>
    </div>
  );
};
export default MineHeader;
