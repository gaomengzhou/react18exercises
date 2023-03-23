import { Dispatch, FC, SetStateAction } from 'react';
import styles from './DepositAmount.module.scss';
import { ObjType } from '@/types/Common';

interface DepositAmountProps {
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  dataSource: ObjType[];
}

const DepositAmount: FC<DepositAmountProps> = ({
  amount,
  setAmount,
  dataSource,
}) => {
  return (
    <div className={styles['deposit-amount-container']}>
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
      <div className={styles.amount}>
        {dataSource.map((item: ObjType, index) => (
          <button key={index} onClick={() => setAmount(item.fastAmount)}>
            ¥<span>{+item.fastAmount}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default DepositAmount;
