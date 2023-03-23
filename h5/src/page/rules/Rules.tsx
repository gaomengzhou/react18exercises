import { FC, useState } from 'react';
import styles from './Rules.module.scss';
import Header from '@/components/header/Header';

const Rules: FC = () => {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, name: '棋牌规则' },
    { id: 2, name: '视讯规则' },
    { id: 3, name: '电子规则' },
    { id: 4, name: '体育规则' },
  ];
  return (
    <div className={`${styles['rules-container']}`}>
      <Header title='游戏规则' left right />
      <div className={styles['rules-body']}>
        <div className={`${styles['rules-main']}`}>
          <div className={styles['rules-tabs-main']}>
            <div className={styles['rules-tabs']}>
              {tabs.map((item) => (
                <button
                  className={`${active === item.id && styles['active-button']}`}
                  key={item.id}
                  onClick={() => setActive(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className={`${styles['rules-content-scroll']}`}>
            <div className={`${styles['rules-content-details']}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Rules;
