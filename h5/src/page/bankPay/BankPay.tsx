import { FC } from 'react';
import styles from './BankPay.module.scss';
import Header from '@/components/header/Header';
import bank1 from '@/assets/images/newbie/bank1.png';
import bank2 from '@/assets/images/newbie/bank2.png';
import bank3 from '@/assets/images/newbie/bank3.png';

const BankPay: FC = () => {
  return (
    <div className={`${styles['bankPay-container']}`}>
      <Header title='新手教程' left right />
      <div className={styles['bankPay-body']}>
        <div className={`${styles['bankPay-main']}`}>
          <div className={`${styles['bankPay-content-scroll']}`}>
            <h3>
              <div>1</div>
              <p>在支付方式中选择“银行卡转账”</p>
            </h3>
            <h3>
              <div>2</div>
              <p>输入存款人姓名</p>
            </h3>
            <h3>
              <div>3</div>
              <p>输入或者选择您要充值的金额</p>
            </h3>
            <img src={bank1} alt='教程1' />
            <h3 className={styles.lastName}>
              <div>4</div>
              <p>确认存入的金额以及支付时间</p>
            </h3>
            <h3>
              <div>5</div>
              <p>确认存入的银行/姓名/账号/地址</p>
            </h3>
            <h3>
              <div>6</div>
              <p>点击提交存款申请</p>
            </h3>
            <img src={bank2} alt='教程2' />
            <h3 className={styles.lastName}>
              <div>7</div>
              <p>核对信息无误后点击确认按钮</p>
            </h3>
            <img src={bank3} alt='教程3' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BankPay;
