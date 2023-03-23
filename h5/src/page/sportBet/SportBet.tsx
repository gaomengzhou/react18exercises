import { FC } from 'react';
import styles from './SportBet.module.scss';
import Header from '@/components/header/Header';
import sport1 from '@/assets/images/newbie/sport1.png';
import sport2 from '@/assets/images/newbie/sport2.png';
import sport3 from '@/assets/images/newbie/sport3.png';
import sport4 from '@/assets/images/newbie/sport4.png';
import sport5 from '@/assets/images/newbie/sport5.png';

const SportBet: FC = () => {
  return (
    <div className={`${styles['bankPay-container']}`}>
      <Header title='体育投注教程' left />
      <div className={styles['bankPay-body']}>
        <div className={`${styles['bankPay-main']}`}>
          <div className={`${styles['bankPay-content-scroll']}`}>
            <h3>
              <div>1</div>
              <p>点击首页“今日” ，“早盘”，找到您想要的赛事</p>
            </h3>
            <img src={sport1} alt='教程1' />
            <h3>
              <div>2</div>
              <p>点击快速投注项可直接投注</p>
            </h3>
            <h3>
              <div>3</div>
              <p>点击进入赛事详情，查看更多投注项</p>
            </h3>
            <img src={sport2} alt='教程2' />

            <h3 className={styles.lastName}>
              <div>4</div>
              <p>输入投注金额</p>
            </h3>
            <h3>
              <div>5</div>
              <p>点击确认投注</p>
            </h3>
            <img src={sport3} alt='教程3' />
            <h3>
              <div>6</div>
              <p>投注确认中，点击“确定”按钮</p>
            </h3>
            <img src={sport4} alt='教程4' />
            <h3 className={styles.lastName}>
              <div>7</div>
              <p>“投注成功”</p>
            </h3>
            <img src={sport5} alt='教程5' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SportBet;
