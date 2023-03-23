import { FC, useState } from 'react';
import styles from './Messages.module.scss';
import Header from '@/components/header/Header';
import Bulletin from '@/page/messages/components/bulletin/Bulletin';
import Notice from '@/page/messages/components/notice/Notice';

const tabs = [
  { id: 1, name: '公告' },
  { id: 2, name: '通知' },
];
const Messages: FC = () => {
  const messageActive = window.sessionStorage.getItem('messageActive') || 1;
  const [active, setActive] = useState(Number(messageActive));
  const handleClickTabs = (id: number) => {
    setActive(id);
    window.sessionStorage.setItem('messageActive', `${id}`);
  };

  return (
    <div className={`${styles['messages-container']}`}>
      <Header title='我的消息' left right />
      <div className={styles['messages-body']}>
        <div className={`${styles['messages-main']}`}>
          <div className={styles['messages-tabs-main']}>
            <div className={styles['messages-tabs']}>
              {tabs.map((item) => (
                <button
                  className={`${active === item.id && styles['active-button']}`}
                  key={item.id}
                  onClick={() => handleClickTabs(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className={`${styles['messages-content-scroll']}`}>
            {active === 1 ? <Bulletin /> : <Notice />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Messages;
