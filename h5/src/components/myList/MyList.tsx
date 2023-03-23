import { FC } from 'react';
import { DotLoading, InfiniteScroll, PullToRefresh } from 'antd-mobile';
import styles from './MyList.module.scss';
import { ObjType } from '@/types/Common';
import NoData from '@/components/noDataYet/NoData';

interface InfiniteScrollContentProps {
  hasMore?: boolean;
  state: ObjType[];
}
const InfiniteScrollContent: FC<InfiniteScrollContentProps> = ({
  hasMore,
  state,
}) => {
  return (
    <div>
      {hasMore ? (
        <>
          <span>加载中</span>
          <DotLoading />
        </>
      ) : state.length > 0 ? (
        <span>已全部加载</span>
      ) : (
        <NoData />
      )}
    </div>
  );
};
interface MyListProps {
  state: ObjType[];
  hasMore: boolean;
  getData: () => Promise<any>;
  children: JSX.Element;
  refreshState?: () => void;
  className?: string;
}
const MyList: FC<MyListProps> = ({
  hasMore,
  getData,
  children,
  refreshState,
  className,
  state,
}) => {
  const loadMore = () => {
    return getData();
  };
  const onRefresh = async () => {
    if (!refreshState) return;
    await refreshState();
  };
  return refreshState ? (
    <PullToRefresh onRefresh={onRefresh}>
      <div className={`${styles.list} ${className}`}>{children}</div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
        <InfiniteScrollContent hasMore={hasMore} state={state} />
      </InfiniteScroll>
    </PullToRefresh>
  ) : (
    <>
      <div>{children}</div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
        <InfiniteScrollContent hasMore={hasMore} state={state} />
      </InfiniteScroll>
    </>
  );
};
export default MyList;
