import { FC } from 'react';

import styles from './Ask.module.scss';
import Header from '@/components/header/Header';
import ask from '@/assets/images/newbie/ask.png';

const Ask: FC = () => {
  return (
    <div className={`${styles['ask-container']}`}>
      <Header title='我的充值/提现单号' left right />
      <div className={styles['ask-body']}>
        <div className={`${styles['ask-main']}`}>
          <div className={styles.content}>
            <div className={styles.title}>
              <div></div>
              <h3>如何寻找我的充值/提现单号?</h3>
            </div>
            <p>{`我的>资金明细中复制充值订单号，前往客服询问`}</p>
            <img src={ask} alt='订单' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Ask;
