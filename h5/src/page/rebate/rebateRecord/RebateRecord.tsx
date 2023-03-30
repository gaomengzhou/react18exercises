import { FC, useState } from 'react';
import styles from './RebateRecord.module.scss';
import Header2 from '@/components/header2/Header2';
import DateActionSheet from '@/components/dateActionSheet/DateActionSheet';
import { ObjType } from '@/types/Common';
import MyList from '@/components/myList/MyList';
import { timeInterval } from '@/utils/tools/method';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

// 日期集合
const dateList = [
  { id: 1, time: '今天' },
  { id: 2, time: '昨天' },
  { id: 3, time: '近7日' },
  { id: 4, time: '近30日' },
];

const RebateRecord: FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const [active, setActive] = useState(0);
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  const getCurrDate = (activeId: number) => {
    switch (activeId) {
      case 0:
        return '今天';
      case 1:
        return '昨天';
      case 2:
        return '近7日';
      case 3:
        return '近30日';
      default:
        return '今天';
    }
  };

  // 选择日期范围
  const [showDate, setShowDate] = useState(false);
  const [state, setState] = useState<ObjType[]>([]);
  // 查询返水记录
  const queryPageThirdWashBetRecord = async (
    pageNo: number,
    pageSize: number,
    timer: { [key: string]: string },
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post(
      '/lottery-api/thirdWashBetRecord/queryPageThirdWashBetRecord',
      {
        pageNo: 1,
        pageSize: 10,
        startTime: timer.startTime,
        endTime: timer.endTime,
      }
    );
    setInitLoading(false);
    if (!res.success) return toast.fail(res);
    setPageParams((value) => {
      return { ...value, pageNo: value.pageNo + 1 };
    });
    if (res.data.records.length < 1 && !refresh) {
      return setHasMore(false);
    }
    if (refresh) {
      setPageParams({ pageNo: 1, pageSize });
      setState(res.data.records);
      if (res.data.records.length >= pageParams.pageSize) {
        setHasMore(true);
      }
    } else {
      setState((val) => {
        if (res.data.records.length < pageParams.pageSize) {
          setHasMore(false);
        }
        return [...val, ...res.data.records];
      });
    }
  };
  const refreshState = async () => {
    await queryPageThirdWashBetRecord(
      1,
      pageParams.pageSize,
      timeInterval(active + 1),
      true
    );
  };
  const onClick = (data: number) => {
    console.log(data);
    queryPageThirdWashBetRecord(
      1,
      pageParams.pageSize,
      timeInterval(data + 1),
      true
    );
  };

  return (
    <div className={`${styles['rebate-record-container']}`}>
      <Header2
        setClickRight={setShowDate}
        clickRight={showDate}
        rightText={getCurrDate(active)}
        title='返水记录'
      />
      <DateActionSheet
        showDate={showDate}
        setShowDate={setShowDate}
        times={dateList}
        onClick={onClick}
        className='from-my-header-mask-top-4rem'
        active={active}
        setActive={setActive}
      />
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.title}>
            <p>类型/时间</p>
            <p>有效投注</p>
            <p>返水比例</p>
            <p>返水金额</p>
          </div>
          <div className={styles.scroll}>
            {initLoading ? (
              <InitLoading />
            ) : (
              <MyList
                state={state}
                hasMore={hasMore}
                getData={() =>
                  queryPageThirdWashBetRecord(
                    pageParams.pageNo,
                    pageParams.pageSize,
                    timeInterval(active + 1)
                  )
                }
                refreshState={refreshState}
              >
                <>
                  {state.map((item, i) => (
                    <div className={styles.content} key={i}>
                      <div className={styles.items}>
                        <p>{item.thirdGameName}</p>
                        <span>{item.receiveTime}</span>
                      </div>
                      <p className={`${styles.bet} ${styles.items}`}>
                        {item.validBetAmount}
                      </p>
                      <p className={`${styles.rebate} ${styles.items}`}>
                        {item.rebateRate}%
                      </p>
                      <p className={`${styles.amount} ${styles.items}`}>
                        +{item.systemSentWashBetAmount}
                      </p>
                    </div>
                  ))}
                </>
              </MyList>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RebateRecord;
