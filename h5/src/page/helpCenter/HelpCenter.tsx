import { FC, useState } from 'react';
import styles from './HelpCenter.module.scss';
import Header from '@/components/header/Header';

const HelpCenter: FC = () => {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, name: '如何注册' },
    { id: 2, name: '充提说明' },
    { id: 3, name: '优惠规则' },
    { id: 4, name: '常见问题' },
  ];
  return (
    <div className={`${styles['helpCenter-container']}`}>
      <Header title='帮助中心' left right />
      <div className={styles['helpCenter-body']}>
        <div className={`${styles['helpCenter-main']}`}>
          <div className={styles['helpCenter-tabs-main']}>
            <div className={styles['helpCenter-tabs']}>
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
          <div className={`${styles['helpCenter-content-scroll']}`}>
            <div className={`${styles['helpCenter-content-details']}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HelpCenter;
