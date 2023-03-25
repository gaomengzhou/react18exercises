import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import styles from './VirtualWalletWithdrawInfo.module.scss';
import { ObjType } from '@/types/Common';
import { cardNumberFormat } from '@/utils/tools/method';

const dotList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
interface VirtualWalletWithdrawInfoProps {
  userWithdrawInfo: ObjType;
  currPayment: ObjType;
  setVisible: Dispatch<SetStateAction<boolean>>;
  addPayment: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => typeof e | void;
}
const VirtualWalletWithdrawInfo: FC<VirtualWalletWithdrawInfoProps> = ({
  userWithdrawInfo,
  currPayment,
  setVisible,
  addPayment,
  onChange,
}) => {
  // 选择绑定的卡片或钱包
  const selectTheBoundPayment = () => {
    setVisible(true);
  };

  return (
    <div className={styles.withdrawInfo}>
      <h6>收款钱包</h6>
      {userWithdrawInfo.virtualAccountInfoList.length < 1 ? (
        <div className={styles['add-payment']} onClick={addPayment}>
          <span>+</span>
          添加虚拟币钱包
        </div>
      ) : (
        <div className={styles.currPayment} onClick={selectTheBoundPayment}>
          <div className={styles.currPaymentLeft}>
            {currPayment.logoUrl && (
              <div className={styles.imgBox}>
                <img src={currPayment.logoUrl} alt='bankLogo' />
              </div>
            )}
            <div className={styles.currPaymentLeftInfo}>
              <h3>{currPayment.paymentChannelName}</h3>
              <div>
                {dotList.map((dot) => (
                  <b
                    key={dot}
                    className={`${dot % 4 === 0 && styles.marginB}`}
                  />
                ))}
                <p>{cardNumberFormat(currPayment.virtualAddress)}</p>
              </div>
            </div>
          </div>
          <i className='iconfont icon-a-5_1_1_mine_xi_right_arrow' />
        </div>
      )}

      <h6>提币数量</h6>
      <div className={styles.amount}>
        <input type='text' onChange={onChange} placeholder='请输入提币数量' />
      </div>
    </div>
  );
};
export default VirtualWalletWithdrawInfo;