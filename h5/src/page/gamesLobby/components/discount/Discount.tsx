import { FC, useEffect, useState } from 'react';
import { JumboTabs } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import MyList from '@/components/myList/MyList';
import InitLoading from '@/components/initLoading/InitLoading';
import Header from '@/components/header/Header';
import styles from './Discount.module.scss';
import { toast } from '@/utils/tools/toast';

interface TabItem {
  id: number;
  typeName: string;
  sort: number;
}
interface ListItem {
  activityName: string;
  appSmallImgUrl: string;
  description: string;
  endTime: string;
  h5SmallImgUrl: string;
  id: number;
  isEnabled: number;
  pcSmallImgUrl: string;
  startTime: string;
}

let tabsActive = '-999';
const Discount: FC = () => {
  const [tabs, setTabs] = useState<TabItem[] | null>(null);
  // List列表数据
  const [state, setState] = useState<ListItem[]>([]);
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  // 是否加载更多
  const [hasMore, setHasMore] = useState(true);
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  const getActTabs = async () => {
    const res = await $fetch.post('/config-api/activity/queryAllActivityType', {
      t: Date.now,
    });
    if (!res.success) return;
    setTabs(res.data);
    tabsActive = `${res.data[0].id}`;
    // this.inputObj.yzm = '';
  };
  const queryPageActivity = async (
    pageNo: number,
    pageSize: number,
    refresh = false
  ) => {
    if (tabsActive === '-999') return;
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post('/config-api/activity/queryPageActivity', {
      pageNo,
      pageSize,
      activityTypeId: tabsActive,
    });
    setInitLoading(false);
    if (!res.success) {
      setHasMore(false);
      return toast.fail(res);
    }
    if (res.data.records.length < 1) {
      return setHasMore(false);
    }
    setPageParams((value) => {
      return { ...value, pageNo: value.pageNo + 1 };
    });
    if (res.data.records.length < pageParams.pageSize) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    setState((val) => {
      if (refresh) return res.data.records;
      return [...val, ...res.data.records];
    });
  };
  // 下拉刷新
  const refreshState = async () => {
    if (state.length >= pageParams.pageSize) {
      setHasMore(true);
      setPageParams({ pageNo: 1, pageSize: 10 });
    }
    await queryPageActivity(1, pageParams.pageSize, true);
  };
  // const getActList = async (id: number) => {
  //   const res = await $fetch.post('/config-api/activity/queryPageActivity', {
  //     activityTypeId: id,
  //     pageNo: 1,
  //     pageSize: 30,
  //   });
  //   if (!res.success) return;
  //   setLists(res.data.records);
  // };
  const navigate = useNavigate();

  const viewDetail = (data: ListItem) => {
    navigate(`/discount-details/${data.id}`);
  };
  useEffect(() => {
    if (!tabs) getActTabs();
    // eslint-disable-next-line
  }, [tabs]);
  return (
    <div className={styles['discount-container']}>
      <Header title='活动' right />
      <div className={styles['main-box']}>
        {tabs && tabs.length > 0 && (
          <div className={styles.headerNav}>
            <JumboTabs
              defaultActiveKey={`${tabs[0].id}`}
              onChange={(key) => {
                tabsActive = key;
                setInitLoading(true);
                if (tabsActive !== '-999') {
                  queryPageActivity(1, pageParams.pageSize, true);
                }
              }}
            >
              {tabs.map((item) => (
                <JumboTabs.Tab
                  title=''
                  description={item.typeName}
                  key={item.id}
                ></JumboTabs.Tab>
              ))}
            </JumboTabs>
          </div>
        )}
        <div className={styles.contentList}>
          {initLoading ? (
            <InitLoading />
          ) : (
            <MyList
              state={state}
              hasMore={hasMore}
              getData={() =>
                queryPageActivity(pageParams.pageNo, pageParams.pageSize)
              }
              refreshState={refreshState}
            >
              <>
                {state.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => viewDetail(item)}
                    className={styles.listItem}
                  >
                    <img src={item.h5SmallImgUrl} alt='活动图' />
                    <h4>{item.activityName}</h4>
                  </div>
                ))}
              </>
            </MyList>
          )}
        </div>
      </div>
    </div>
  );
};
export default Discount;
