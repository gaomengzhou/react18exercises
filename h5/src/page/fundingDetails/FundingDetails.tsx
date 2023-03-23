import { FC, useEffect, useState } from 'react';
import styles from './FundingDetails.module.scss';
import Header2 from '@/components/header2/Header2';
import FundingDetailsActionSheet from '@/components/fundingDetailsActionSheet/FundingDetailsActionSheet';
import { ObjType } from '@/types/Common';
import MyList from '@/components/myList/MyList';
import { timeInterval } from '@/utils/tools/method';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

const dates = [
  { id: 1, date: '今天' },
  { id: 2, date: '昨日' },
  { id: 3, date: '近7日' },
  { id: 4, date: '近30日' },
];

interface FundingDetailsProps {
  active?: number;
}
const FundingDetails: FC<FundingDetailsProps> = () => {
  const [clickRight, setClickRight] = useState(false);
  const [tabActive, setTabActive] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // 业务类型
  const [businessType, setBusinessType] = useState<ObjType>({
    businessType: '',
    businessTypeName: '全部',
    sortOrder: 1,
  });
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  const [typeList, setTypeList] = useState<ObjType[]>([
    { businessType: '', businessTypeName: '全部', sortOrder: 1 },
  ]);
  const [state, setState] = useState<ObjType[]>([]);

  // 查询所有业务类型
  const queryAllBusinessType = async () => {
    const res = await $fetch.post(
      ' /lottery-api/walletLog/queryAllBusinessType'
    );
    if (!res.success) return toast.fail(res);
    const arr = res.data.filter((item: ObjType) => item.code === 'fund');
    setTypeList((val) => [...val, ...arr[0].walletLogTypeList]);
  };

  // 查询资金明细
  const queryPageWalletLog = async (
    pageNo: number,
    pageSize: number,
    timer: { [key: string]: string },
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post('/lottery-api/walletLog/queryPageWalletLog', {
      startTime: timer.startTime,
      endTime: timer.endTime,
      pageNo,
      pageSize,
      businessType: businessType.businessType,
    });
    setInitLoading(false);
    if (!res.success) {
      setHasMore(false);
      return toast.fail(res);
    }
    if (res.data.records.length < 1) {
      setHasMore(false);
      setState([]);
      return;
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

  /**
   *  选择时间区间
   * @param id 1:今天|2:昨天|3:近7天|4:近30天
   */
  const handelClick = (id: number) => {
    setState([]);
    setHasMore(true);
    setPageParams({ pageNo: 1, pageSize: 10 });
    setTabActive(id);
  };

  const click = (data: ObjType) => {
    setBusinessType(data);
  };
  const refreshState = async () => {
    if (state.length >= pageParams.pageSize) {
      setHasMore(true);
      setPageParams({ pageNo: 1, pageSize: 10 });
    }
    await queryPageWalletLog(
      1,
      pageParams.pageSize,
      timeInterval(tabActive),
      true
    );
  };

  const fundingDetailsActionSheetSubmit = () => {
    setHasMore(true);
    setPageParams({ pageNo: 1, pageSize: 10 });
    setState([]);
  };

  // componentDidMount
  useEffect(() => {
    queryAllBusinessType();
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles['funding-details-container']}>
      <Header2
        title='资金明细'
        rightText='筛选'
        setClickRight={setClickRight}
      />
      <FundingDetailsActionSheet
        onSubmit={fundingDetailsActionSheetSubmit}
        setBusinessType={setBusinessType}
        visible={clickRight}
        setVisible={setClickRight}
        state={typeList}
        className='from-my-header-mask-top-4rem'
        onClick={click}
      />
      <div className={styles.date}>
        <div className={styles.content}>
          <div className={styles.item}>
            {dates.map((item) => (
              <p
                key={item.id}
                className={`${item.id === tabActive && styles['active-p']}`}
                onClick={() => handelClick(item.id)}
              >
                {item.date}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.main}>
        {initLoading ? (
          <InitLoading />
        ) : (
          <MyList
            state={state}
            hasMore={hasMore}
            getData={() =>
              queryPageWalletLog(
                pageParams.pageNo,
                pageParams.pageSize,
                timeInterval(tabActive)
              )
            }
            refreshState={refreshState}
          >
            <>
              {state.map((item, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.top}>
                    <p>{item.businessTypeName}</p>
                    <span>{item.createTime}</span>
                  </div>
                  <div className={styles.middle}>
                    <p>{item.businessTypeName2}</p>
                    <span>{item.transactionAmount}</span>
                  </div>
                  <div className={styles.bott}>
                    <p>币种: CNY</p>
                    <span>成功</span>
                  </div>
                </div>
              ))}
            </>
          </MyList>
        )}
      </div>
    </div>
  );
};
export default FundingDetails;
