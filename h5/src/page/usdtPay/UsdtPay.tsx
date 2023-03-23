import { FC } from 'react';
import styles from './UsdtPay.module.scss';
import Header from '@/components/header/Header';
import usdt1 from '@/assets/images/newbie/usdt1.png';
import usdt2 from '@/assets/images/newbie/usdt2.png';

const UsdtPay: FC = () => {
  return (
    <div className={`${styles['usdtPay-container']}`}>
      <Header title='新手教程' left right />
      <div className={styles['usdtPay-body']}>
        <div className={`${styles['usdtPay-main']}`}>
          <div className={`${styles['usdtPay-content-scroll']}`}>
            <h3>
              <div>1</div>
              <p>在支付方式中选择“USDT转账”</p>
            </h3>
            <h3>
              <div>2</div>
              <p>在选择渠道中选择“支付渠道”</p>
            </h3>
            <h3>
              <div>3</div>
              <p>输入或者选择您要充值的金额</p>
            </h3>
            <img src={usdt1} alt='教程1' />
            <h3 className={styles.lastName}>
              <div>4</div>
              <p>扫面二维码支付</p>
            </h3>
            <img src={usdt2} alt='教程2' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UsdtPay;
