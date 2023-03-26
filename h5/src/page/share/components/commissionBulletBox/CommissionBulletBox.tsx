import { Dispatch, FC, memo, SetStateAction } from 'react';
import { Mask } from 'antd-mobile';
import styles from './CommissionBulletBox.module.scss';
import success from '@/assets/images/share/success.png';
import fail from '@/assets/images/share/fail.png';

interface CommissionBulletBoxProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  isSuccess: boolean;
}
const CommissionBulletBox: FC<CommissionBulletBoxProps> = ({
  visible,
  setVisible,
  isSuccess,
}) => {
  return (
    <>
      <Mask
        getContainer={() => document.getElementById('root') as HTMLElement}
        onMaskClick={() => setVisible(false)}
        visible={visible}
      />
      <div
        className={`${styles.commissionBulletBox} ${
          visible && styles.commissionBulletBoxEnlarge
        }`}
      >
        <div className={styles.commissionBulletBoxClose}>
          <i
            onClick={() => setVisible(false)}
            className='iconfont icon-a-5_37_Agent_close'
          />
        </div>
        <div className={styles.commissionBulletBoxMain}>
          <img src={isSuccess ? success : fail} alt='logo' />
          <p className={`${!isSuccess && styles.fail}`}>
            {isSuccess ? '领取成功' : '领取失败'}
          </p>
          <button onClick={() => setVisible(false)}>确定</button>
        </div>
      </div>
    </>
  );
};
export default memo(CommissionBulletBox);
