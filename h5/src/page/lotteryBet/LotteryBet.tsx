import { FC } from 'react';
import styles from './LotteryBet.module.scss';
import Header from '@/components/header/Header';
import lottery1 from '@/assets/images/newbie/lottery1.png';
import lottery2 from '@/assets/images/newbie/lottery2.png';
import lottery3 from '@/assets/images/newbie/lottery3.png';

const LotteryBet: FC = () => {
  return (
    <div className={`${styles['lotteryBet-container']}`}>
      <Header title='彩票投注教程' left />
      <div className={styles['lotteryBet-body']}>
        <div className={`${styles['lotteryBet-main']}`}>
          <div className={`${styles['lotteryBet-content-scroll']}`}>
            <h3>
              <div>1</div>
              <p>在提现导航栏中选择“投注”</p>
            </h3>
            <h3>
              <div>2</div>
              <p>选择“玩法”</p>
            </h3>
            <h3>
              <div>3</div>
              <p>选择需要下注的“投注项”</p>
            </h3>
            <h3 className={styles.lastName}>
              <div>4</div>
              <p>点击“投注按钮”</p>
            </h3>
            <img src={lottery1} alt='教程1' />
            <h3>
              <div>5</div>
              <p>列表中确认“投注项和金额”</p>
            </h3>
            <h3>
              <div>6</div>
              <p>点击“投注按钮”</p>
            </h3>
            <img src={lottery2} alt='教程2' />
            <h3 className={styles.lastName}>
              <div>7</div>
              <p>下注完成</p>
            </h3>
            <img src={lottery3} alt='教程3' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LotteryBet;
