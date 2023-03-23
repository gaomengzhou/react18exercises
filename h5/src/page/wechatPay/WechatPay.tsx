import { FC } from 'react';
import styles from './WechatPay.module.scss';
import Header from '@/components/header/Header';
import wechat1 from '@/assets/images/newbie/wechat1.png';
import wechat2 from '@/assets/images/newbie/wechat2.png';

const WechatPay: FC = () => {
  return (
    <div className={`${styles['wechatPay-container']}`}>
      <Header title='新手教程' left right />
      <div className={styles['wechatPay-body']}>
        <div className={`${styles['wechatPay-main']}`}>
          <div className={`${styles['wechatPay-content-scroll']}`}>
            <h3>
              <div>1</div>
              <p>在支付方式中选择“微信支付”</p>
            </h3>
            <h3>
              <div>2</div>
              <p>在选择渠道中选择“支付渠道”</p>
            </h3>
            <h3>
              <div>3</div>
              <p>输入或者选择您要充值的金额</p>
            </h3>
            <img src={wechat1} alt='教程1' />
            <h3 className={styles.lastName}>
              <div>4</div>
              <p>前往微信支付页面</p>
            </h3>
            <img src={wechat2} alt='教程2' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WechatPay;
