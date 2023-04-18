import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import styles from './VirtualWalletWithdrawInfo.module.scss';
import { ObjType } from '@/types/Common';

interface VirtualWalletWithdrawInfoProps {
  userWithdrawInfo: ObjType[];
  currPayment: ObjType;
  setVisible: Dispatch<SetStateAction<boolean>>;
  addPayment: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => typeof e | void;
  amount: string;
  exchangeRate: string | null;
}
const VirtualWalletWithdrawInfo: FC<VirtualWalletWithdrawInfoProps> = ({
  userWithdrawInfo,
  currPayment,
  setVisible,
  addPayment,
  onChange,
  amount,
  exchangeRate,
}) => {
  // 选择绑定的卡片或钱包
  const selectTheBoundPayment = () => {
    setVisible(true);
  };

  return (
    <div className={styles.withdrawInfo}>
      <h6>
        收款钱包
        {exchangeRate ? (
          <span>当前汇率:1 USDT-TRC20 = {exchangeRate} 元</span>
        ) : (
          exchangeRate
        )}
      </h6>
      {userWithdrawInfo.length < 1 ? (
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
              <h3>{currPayment.withdrawName}</h3>
              <div>
                <p>{currPayment.withdrawAccount}</p>
              </div>
            </div>
          </div>
          <i className='iconfont icon-a-5_1_1_mine_xi_right_arrow' />
        </div>
      )}

      <h6>提币数量</h6>
      <div className={styles.amount}>
        <input
          type='number'
          min={0}
          value={amount}
          onChange={onChange}
          placeholder='请输入提币数量'
        />
      </div>
    </div>
  );
};
export default VirtualWalletWithdrawInfo;
