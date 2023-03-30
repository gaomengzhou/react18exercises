import { FC, useState } from 'react';
import { SearchBar } from 'antd-mobile';
import Header from '@/components/header/Header';
import styles from './TeamManagement.module.scss';
import TeamManagementContent from '@/page/share/components/teamManagementContent/TeamManagementContent';
import { toast } from '@/utils/tools/toast';
import { ObjType } from '@/types/Common';

const TeamManagement: FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const [active, setActive] = useState(1);
  // 页码参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 20 });
  // 搜索框的value
  const [searchVal, setSearchVal] = useState('');
  // 团队管理的数据
  const [teamSource, setTeamSource] = useState<ObjType[]>([]);
  // title数据
  const [teamTitleSource, setTeamTitleSource] = useState<ObjType>({
    itemPage: {},
    loginUserCount: 0,
    rechargeUserCount: 0,
    totalUserCount: 0,
  });
  const tabs = [
    {
      id: 1,
      number: teamTitleSource.totalUserCount,
      title: '团队人数',
      icon: 'iconfont icon-a-1_2_9_game_icon-xuanzhong',
    },
    {
      id: 2,
      number: teamTitleSource.rechargeUserCount,
      title: '充值人数',
      icon: 'iconfont icon-a-1_2_9_game_icon-xuanzhong',
    },
    {
      id: 3,
      number: teamTitleSource.loginUserCount,
      title: '今日活跃',
      icon: 'iconfont icon-a-1_2_9_game_icon-xuanzhong',
    },
  ];
  // 团队管理查询
  const queryManageDataReport = async (
    pageParam: typeof pageParams,
    timeType: number,
    userId: string
  ) => {
    if (pageParam.pageNo === 1) toast.loading({ mask: false });
    const res = await $fetch.post(
      '/lottery-api/teamDataReport/queryManageDataReport',
      {
        pageNo: pageParam.pageNo,
        pageSize: pageParam.pageSize,
        timeType,
        userId,
      }
    );
    if (pageParam.pageNo === 1) toast.clear();
    if (!res.success) {
      setHasMore(false);
      return toast.fail(res);
    }
    setTeamTitleSource(res.data);
    setPageParams((value) => {
      return { ...value, pageNo: value.pageNo + 1 };
    });
    setTeamSource((val) => {
      if (res.data.itemPage.records.length < pageParams.pageSize) {
        setHasMore(false);
      }

      return [...val, ...res.data.itemPage.records];
    });
  };
  const onSearch = (v: string) => {
    setSearchVal(v);
  };

  // 点击选项卡
  const handleTab = (id: number) => {
    if (active === id) return;
    setSearchVal('');
    setActive(id);
    // 设置成空数据,高度不够自动刷新.
    setTeamSource([]);
    setHasMore(true);
    setPageParams((val) => {
      return { ...val, pageNo: 1 };
    });
  };

  return (
    <div className={styles.teamManagementContainer}>
      <Header title='团队管理' right left />
      <div className={styles.teamManagementTabs}>
        {tabs.map((item) => (
          <div
            key={item.id}
            className={`${styles.teamManagementTabsItems}`}
            onClick={() => handleTab(item.id)}
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
      <div className={styles.teamManagementMain}>
        <div className={styles.inputBox}>
          <SearchBar
            className={styles.input}
            placeholder='请输入会员ID'
            value={searchVal}
            onChange={onSearch}
            style={{ '--background': '#fff' }}
          />
          <button
            onClick={() => {
              setHasMore(true);
              setTeamSource([]);
              setPageParams({ pageNo: 1, pageSize: 10 });
            }}
          >
            搜索
          </button>
        </div>
        <div className={styles.teamManagementContent}>
          <TeamManagementContent
            getData={queryManageDataReport}
            state={teamSource}
            hasMore={hasMore}
            pageParam={pageParams}
            timeType={active}
            userId={searchVal}
          />
        </div>
      </div>
    </div>
  );
};
export default TeamManagement;
