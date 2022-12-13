import { FC } from 'react';

import styles from './index.module.scss';

const CustomerService: FC = () => {
  return (
    <div className={styles.customerbox}>
      <img
        className={styles.logo}
        src={require('@/assets/images/customerservice/icon-logo.png')}
        alt=''
      />
      <img
        className={styles.tele}
        src={require('@/assets/images/customerservice/icon-Telegram@2x.png')}
        alt=''
        onClick={() => window.open('https://t.me/scoot4eth')}
      />
      <img
        className={styles.tele}
        src={require('@/assets/images/customerservice/icon-ehatsapp@2x.png')}
        alt=''
        onClick={() =>
          window.open(
            'https://api.whatsapp.com/send/?phone=+639490564866&text&type=phone_number&app_absent=0'
          )
        }
      />
      <img
        className={styles.tele}
        src={require('@/assets/images/customerservice/邮箱联系@2x.png')}
        alt=''
        onClick={() => window.open('mailto:Service@bet123.io')}
      />
    </div>
  );
};
export default CustomerService;
