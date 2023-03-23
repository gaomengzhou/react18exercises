import { FC, useEffect, useState } from 'react';
import Header2 from '@/components/header2/Header2';
import { ObjType } from '@/types/Common';
import DateActionSheet from '@/components/dateActionSheet/DateActionSheet';
import styles from './PerformanceInquiry.module.scss';
import { toast } from '@/utils/tools/toast';

// 日期
const times = [
  { id: 1, time: '今天' },
  { id: 2, time: '昨天' },
  { id: 3, time: '近7日' },
  { id: 4, time: '近30日' },
];
const PerformanceInquiry: FC = () => {
  const [active, setActive] = useState(1);
  const [dateActive, setDateActive] = useState(1);

  const [dataSource, setDataSource] = useState({
    agentBetAmount: '0',
    betAmount: '0',
    directBetAmount: '0',
    itemList: [],
  });
  const tabs = [
    {
      id: 1,
      number: dataSource.betAmount,
      title: '总业绩',
      icon: 'iconfont icon-a-1_2_9_game_icon-xuanzhong',
    },
    {
      id: 2,
      number: dataSource.directBetAmount,
      title: '直属业绩',
      icon: 'iconfont icon-a-1_2_9_game_icon-xuanzhong',
    },
    {
      id: 3,
      number: dataSource.agentBetAmount,
      title: '代理业绩',
      icon: 'iconfont icon-a-1_2_9_game_icon-xuanzhong',
    },
  ];
  /**
   * 业绩查询
   * @param achievementType 业绩类型|1:总业绩|2:直属业绩|3:代理业绩
   * @param timeType 时间类型|1:今天|2:昨天|3:本周|4:本月
   */
  const queryAchievementReport = async (
    achievementType: number,
    timeType: number
  ) => {
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/lottery-api/teamDataReport/queryAchievementReport',
      {
        achievementType,
        timeType,
      }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setDataSource(res.data);
  };
  useEffect(() => {
    queryAchievementReport(active, dateActive);
    // eslint-disable-next-line
  }, [active]);
  // 选择日期范围
  const [showDate, setShowDate] = useState(false);
  const onClick = (timeType: number) => {
    queryAchievementReport(active, timeType);
  };
  // 将id转换为文本
  const convertIdToText = (type: number) => {
    switch (type) {
      case 1:
        return '今天';
      case 2:
        return '昨天';
      case 3:
        return '近7日';
      case 4:
        return '近30日 ';
      default:
        return '今天';
    }
  };
  // 游戏id转换为名字
  const formatStatus = (status: number) => {
    switch (status) {
      case 1:
        return '棋牌';
      case 2:
        return '真人';
      case 3:
        return '体育';
      case 4:
        return '电子';
      case 5:
        return '捕鱼';
      case 6:
        return '电竞';
      default:
        return '棋牌';
    }
  };
  return (
    <div className={styles.performanceInquiryContainer}>
      <Header2
        setClickRight={setShowDate}
        rightText={convertIdToText(dateActive)}
        title='业绩查询'
      />
      <DateActionSheet
        showDate={showDate}
        setShowDate={setShowDate}
        onClick={onClick}
        times={times}
        className='from-my-header-mask-top-4rem'
        top='4rem'
        active={dateActive}
        setActive={setDateActive}
      />
      <div className={styles.performanceInquiryTabs}>
        {tabs.map((item) => (
          <div
            key={item.id}
            className={`${styles.performanceInquiryTabsTabsItems}`}
            onClick={() => setActive(item.id)}
          >
            <p className={`${active === item.id && styles['active-color']}`}>
              {item.number}
            </p>
            <span className={`${active === item.id && styles['active-color']}`}>
              {item.title}
            </span>
            <i
              className={`${item.icon} ${
                active === item.id && styles['active-color']
              }`}
            />
          </div>
        ))}
      </div>
      <div className={styles.performanceInquiryContent}>
        {dataSource.itemList.map((item: ObjType, index) => (
          <div key={index} className={styles.performanceInquiryContainerItems}>
            <div className={styles.left}>
              <b />
              <img src={item.logoUrl} alt='logo' />
              <p>{formatStatus(item.thirdGameTypeId)}</p>
            </div>
            <div className={styles.other}>
              <p>{item.betAmount}</p>
              <span>业绩</span>
            </div>
            <div className={styles.other}>
              <p>{item.commission}</p>
              <span>佣金</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PerformanceInquiry;
