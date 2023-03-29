import { FC } from 'react';
import { Mask } from 'antd-mobile';
import styles from './HomeInitLoading.module.scss';
import loading from '@/assets/images/footBallLoading.gif';
import { useSelector } from '@/redux/hook';

// 带遮罩层的loading
const HomeInitLoading: FC = () => {
  const showBetVisible = useSelector((state) => state.indexData.showBetVisible);
  return (
    <div>
      <Mask visible={showBetVisible}>
        <div className={styles['bet-loading-content']}>
          <div className={styles.loading}>
            <img src={loading} alt='loading' />
            <p>加载中...</p>
          </div>
        </div>
      </Mask>
    </div>
  );
};
export default HomeInitLoading;
