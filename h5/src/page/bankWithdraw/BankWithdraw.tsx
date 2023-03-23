import { FC } from 'react';
import styles from './BankWithdraw.module.scss';
import Header from '@/components/header/Header';
import bankW from '@/assets/images/newbie/bankW.png';

const BankWithdraw: FC = () => {
  return (
    <div className={`${styles['bankWithdraw-container']}`}>
      <Header title='银行卡提现教程' left />
      <div className={styles['bankWithdraw-body']}>
        <div className={`${styles['bankWithdraw-main']}`}>
          <div className={`${styles['bankWithdraw-content-scroll']}`}>
            <h3>
              <div>1</div>
              <p>在提现导航栏中选择“银行卡提现</p>
            </h3>
            <h3>
              <div>2</div>
              <p>在收款银行中选择需要提现到的银行卡</p>
            </h3>
            <h3>
              <div>3</div>
              <p>输入或者选择您要提现的金额</p>
            </h3>
            <img src={bankW} alt='教程1' />
            {/* <h3 className={styles.lastName}>
              <div>4</div>
              <p>前往支付宝支付页面</p>
            </h3>
            <img src={alipay2} alt='教程2' /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BankWithdraw;
