import { FC } from 'react';
import styles from './AgentIntroductionTabsContent.module.scss';
import { ObjType } from '@/types/Common';

interface AgentIntroductionTabsContentProps {
  state: ObjType[];
}
const AgentIntroductionTabsContent: FC<AgentIntroductionTabsContentProps> = ({
  state,
}) => {
  return (
    <div className={styles.AgentIntroductionTabsContentContainer}>
      <div className={styles.AgentIntroductionTabsContentHeader}>
        无限代理佣金说明
      </div>
      <div className={styles.AgentIntroductionTabsContentTitle}>
        <p>代理级别</p>
        <p>业绩额度</p>
        <p>返佣金额</p>
      </div>
      <div className={styles.AgentIntroductionTabsContentBody}>
        {state.map((item, i) => (
          <div key={i} className={`${i % 2 === 1 && styles.bg}`}>
            <p>{item.levelName}</p>
            <p>{item.commissionQuota}</p>
            <p>{item.commissionRate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AgentIntroductionTabsContent;
