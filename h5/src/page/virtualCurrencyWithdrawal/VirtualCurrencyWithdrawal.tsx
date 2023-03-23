import { FC } from 'react';
import styles from './VirtualCurrencyWithdrawal.module.scss';
import Header from '@/components/header/Header';
import usdtW from '@/assets/images/newbie/usdtW.png';

const VirtualCurrencyWithdrawal: FC = () => {
  return (
    <div className={`${styles['virtualCurrencyWithdrawal-container']}`}>
      <Header title='虚拟货币提现教程' left />
      <div className={styles['virtualCurrencyWithdrawal-body']}>
        <div className={`${styles['virtualCurrencyWithdrawal-main']}`}>
          <div
            className={`${styles['virtualCurrencyWithdrawal-content-scroll']}`}
          >
            <h3>
              <div>1</div>
              <p>在支付方式中选择“支付宝支付”</p>
            </h3>
            <h3>
              <div>2</div>
              <p>在选择渠道中选择“支付渠道”</p>
            </h3>
            <h3>
              <div>3</div>
              <p>输入或者选择您要充值的金额</p>
            </h3>
            <img src={usdtW} alt='教程1' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default VirtualCurrencyWithdrawal;
