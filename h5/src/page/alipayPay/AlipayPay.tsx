import { FC } from 'react';
import styles from './AlipayPay.module.scss';
import Header from '@/components/header/Header';
import alipay1 from '@/assets/images/newbie/alipay1.png';
import alipay2 from '@/assets/images/newbie/alipay2.png';

const AlipayPay: FC = () => {
  return (
    <div className={`${styles['alipayPay-container']}`}>
      <Header title='新手教程' left right />
      <div className={styles['alipayPay-body']}>
        <div className={`${styles['alipayPay-main']}`}>
          <div className={`${styles['alipayPay-content-scroll']}`}>
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
            <img src={alipay1} alt='教程1' />
            <h3 className={styles.lastName}>
              <div>4</div>
              <p>前往支付宝支付页面</p>
            </h3>
            <img src={alipay2} alt='教程2' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlipayPay;
