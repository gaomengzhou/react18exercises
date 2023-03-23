import { FC } from 'react';
import styles from './ProgressBar.module.scss';
import { VipInfoType } from '@/page/gamesLobby/components/mine/source';

const ProgressBar: FC<VipInfoType> = ({
  currentVipLevel,
  nextVipLevel,
  vipCurrentBetAmount,
  vipValidBetAmount,
  vipCurrentRechargeScore,
  vipRechargeScore,
  vipType,
}) => {
  const levelBar = () => {
    if (+vipType === 0) {
      return (+vipCurrentBetAmount / +vipValidBetAmount) * 100;
    }
    if (+vipType === 1) {
      return (+vipCurrentRechargeScore / +vipRechargeScore) * 100;
    }
  };
  return (
    <div className={`${styles['progress-bar-container']}`}>
      <div className={styles['progress-bar-title']}>
        <div>
          <p>V{currentVipLevel}</p>
          <h6>当前打码量:</h6>
          <span className={styles.red}>{+vipCurrentBetAmount}</span>
          <b>/</b>
          <span>{+vipValidBetAmount}</span>
        </div>
        <p>V{nextVipLevel}</p>
      </div>
      <div className={styles['progress-bar']}>
        <p
          className={styles.bar}
          style={{
            width: `${levelBar()}%`,
          }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
