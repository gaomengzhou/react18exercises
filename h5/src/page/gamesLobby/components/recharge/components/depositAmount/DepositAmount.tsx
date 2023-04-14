import { Dispatch, FC, SetStateAction } from 'react';
import styles from './DepositAmount.module.scss';
import { ObjType } from '@/types/Common';

interface DepositAmountProps {
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  dataSource: ObjType[];
  paymentType: number;
}

const DepositAmount: FC<DepositAmountProps> = ({
  amount,
  setAmount,
  dataSource,
  paymentType,
}) => {
  return (
    <div className={styles['deposit-amount-container']}>
      {paymentType !== 5 ? (
        <div className={styles.inp}>
          <input
            type='number'
            value={amount}
            placeholder='选定金额或者输入金额'
            onChange={(e) => setAmount(e.target.value)}
            disabled
          />
          <p>¥</p>
        </div>
      ) : (
        <>
          <div className={styles.inp}>
            <input
              type='number'
              value={amount}
              placeholder='选定数量或者输入数量'
              onChange={(e) => setAmount(e.target.value)}
              disabled
            />
            <p>₮</p>
            <span>USDT</span>
          </div>
          <div className={styles.usdtTips}>
            <p>汇率为:1USDT ≈ 6.89元</p>
            <p>
              本次充值 ≈ <span>0.00</span>元
            </p>
          </div>
        </>
      )}

      <div className={styles.amount}>
        {dataSource.map((item: ObjType, index) => (
          <button
            key={index}
            className={`${+item.fastAmount === +amount && styles.activeBtn}`}
            onClick={() => setAmount(item.fastAmount)}
          >
            {paymentType !== 5 ? '¥' : '₮'}
            <span>{+item.fastAmount}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default DepositAmount;
