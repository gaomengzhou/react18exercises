import { FC, useState } from 'react';
import styles from './FlowAudit.module.scss';
import Header from '@/components/header/Header';
import FlowDetails from '@/page/flowAudit/components/flowDetails/FlowDetails';
import AmountDetails from '@/page/flowAudit/components/amountDetails/AmountDetails';

const FlowAudit: FC = () => {
  const [active, setActive] = useState(1);
  const tabs = [
    { id: 1, name: '流水详情' },
    { id: 2, name: '金额明细' },
  ];
  const displayComponent = () => {
    switch (active) {
      case 1:
        return <FlowDetails />;
      case 2:
        return <AmountDetails />;
      default:
        return <FlowDetails />;
    }
  };
  return (
    <div className={styles['flow-audit-container']}>
      <Header title='流水审核' left right />
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.tabs}>
            <div className={styles.item}>
              {tabs.map((item) => (
                <button
                  key={item.id}
                  className={`${item.id === active && styles.active}`}
                  onClick={() => setActive(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          {displayComponent()}
        </div>
      </div>
    </div>
  );
};
export default FlowAudit;
