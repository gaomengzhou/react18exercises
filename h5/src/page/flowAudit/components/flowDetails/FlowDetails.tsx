import { FC, useState } from 'react';
import styles from './FlowDetails.module.scss';
import MyList from '@/components/myList/MyList';
import { ObjType } from '@/types/Common';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

const FlowDetails: FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const [state, setState] = useState<ObjType[]>([]);
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 20 });
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  // 查询流水详情
  const queryPageFlowAuditRecord = async (
    pageNo: number,
    pageSize: number,
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post(
      '/lottery-api/lottery/flowAuditRecord/queryPageFlowAuditRecord',
      { pageNo, pageSize }
    );
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
  const refreshState = async (): Promise<void> => {
    if (state.length >= pageParams.pageSize) {
      setHasMore(true);
      setPageParams((val) => {
        return { ...val, pageNo: 1 };
      });
    }
    await queryPageFlowAuditRecord(1, pageParams.pageSize, true);
  };
  return (
    <div className={styles.center}>
      <div className={styles['center-title']}>
        <p>流水时间</p>
        <p>需求打码</p>
        <p>实际打码</p>
        <p>状态</p>
      </div>
      <div className={`${styles['center-body']}`}>
        {initLoading ? (
          <InitLoading />
        ) : (
          <MyList
            state={state}
            hasMore={hasMore}
            getData={() =>
              queryPageFlowAuditRecord(pageParams.pageNo, pageParams.pageSize)
            }
            refreshState={refreshState}
          >
            <>
              {state.map((item, i) => (
                <div className={styles.item} key={item.id || i}>
                  <p>{item.createTime.replace(/-/g, '/')}</p>
                  <p>{item.needBetAmount}</p>
                  <p>{item.realBetAmount}</p>
                  <p>{+item.auditStatus === 0 ? '未通过' : '通过'}</p>
                </div>
              ))}
            </>
          </MyList>
        )}
      </div>
    </div>
  );
};
export default FlowDetails;
