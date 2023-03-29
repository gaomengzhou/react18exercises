import { FC } from 'react';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import styles from './TeamManagementContent.module.scss';
import MyList from '@/components/myList/MyList';
import { ObjType } from '@/types/Common';

interface TeamManagementContentProps {
  state: ObjType[];
  hasMore: boolean;
  pageParam: { pageNo: number; pageSize: number };
  timeType: number;
  userId: string;
  getData: (
    // eslint-disable-next-line no-unused-vars
    pageParam: TeamManagementContentProps['pageParam'],
    // eslint-disable-next-line no-unused-vars
    timeType: TeamManagementContentProps['timeType'],
    // eslint-disable-next-line no-unused-vars
    userId: TeamManagementContentProps['userId']
  ) => Promise<'' | ToastHandler | undefined>;
}
const TeamManagementContent: FC<TeamManagementContentProps> = ({
  state,
  hasMore,
  getData,
  pageParam,
  timeType,
  userId,
}) => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <p className={styles.p1}>排名</p>
        <p className={styles.p2}>账户</p>
        <p className={styles.p3}>ID</p>
        <p className={styles.p4}>业绩&自身有效投注</p>
      </div>
      <div className={styles.main}>
        <MyList
          state={state}
          hasMore={hasMore}
          getData={() => getData(pageParam, timeType, userId)}
        >
          <>
            {state.map((item, i) => (
              <div
                className={styles.items}
                key={item.userId}
                style={{ backgroundColor: i % 2 === 1 ? '#fff' : '' }}
              >
                <p className={styles.p1}>{item.sort}</p>
                <p className={styles.p2}>{item.userName}</p>
                <p className={styles.p3}>{item.userId}</p>
                <p className={styles.p4}>{item.betAmount}</p>
              </div>
            ))}
          </>
        </MyList>
      </div>
    </div>
  );
};
export default TeamManagementContent;
