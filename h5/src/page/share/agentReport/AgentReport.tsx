import { FC, useEffect, useState } from 'react';
import styles from './AgentReport.module.scss';
import Header2 from '@/components/header2/Header2';
import DateActionSheet from '@/components/dateActionSheet/DateActionSheet';
import { toast } from '@/utils/tools/toast';

const times = [
  { id: 1, time: '今天' },
  { id: 2, time: '昨天' },
  { id: 3, time: '近7日' },
  { id: 4, time: '近30日' },
];
const AgentReport: FC = () => {
  const [clickRight, setClickRight] = useState(false);
  const [active, setActive] = useState(1);
  const [dateActive, setDateActive] = useState(1);
  // 报表数据
  const [dataSource, setDataSource] = useState({
    betAmount: '',
    betUserCount: 0,
    commission: '',
    newUserCount: 0,
    profit: '',
    rechargeUserCount: 0,
  });
  const tabs = [
    { id: 1, title: '全部' },
    { id: 2, title: '直属' },
  ];

  const getCurrDate = (activeId: number) => {
    switch (activeId) {
      case 1:
        return '今天';
      case 2:
        return '昨天';
      case 3:
        return '近7日';
      case 4:
        return '近30日';
      default:
        return '今天';
    }
  };
  /**
   * 查询代理报表
   * @param statisticsWay 统计方式|1:全部下级数据|2:直属数据
   * @param timeType 时间类型|1:今天|2:昨天|3:本周|4:本月
   */
  const queryDataReportNew = async (
    statisticsWay: number,
    timeType: number
  ) => {
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/lottery-api/teamDataReport/queryAgentReport',
      { statisticsWay, timeType }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setDataSource(res.data);
  };

  const onClick = async (num: number) => {
    await queryDataReportNew(active, num);
  };

  // componentDidMount
  useEffect(() => {
    queryDataReportNew(active, dateActive);
    // eslint-disable-next-line
  }, [active]);
  return (
    <div className={styles.agentReportContainer}>
      <Header2
        title='代理报表'
        rightText={getCurrDate(dateActive)}
        setClickRight={setClickRight}
      />
      <DateActionSheet
        active={dateActive}
        setActive={setDateActive}
        times={times}
        showDate={clickRight}
        setShowDate={setClickRight}
        onClick={onClick}
      />
      <div className={styles.agentReportMain}>
        <div className={styles.agentReportTabs}>
          <div>
            {tabs.map((item) => (
              <button
                className={`${active === item.id && styles.active}`}
                key={item.id}
                onClick={() => setActive(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.items}>
            <div>
              <p>{dataSource.commission}</p>
              <span>佣金收入</span>
            </div>
            <div>
              <p>{dataSource.betAmount}</p>
              <span>团队投注</span>
            </div>
            <div>
              <p>{dataSource.profit}</p>
              <span>团队盈利</span>
            </div>
            <div>
              <p>{dataSource.newUserCount}</p>
              <span>团队人数</span>
            </div>
            <div>
              <p>{dataSource.betUserCount}</p>
              <span>投注人数</span>
            </div>
            <div>
              <p>{dataSource.rechargeUserCount}</p>
              <span>充值人数</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgentReport;
