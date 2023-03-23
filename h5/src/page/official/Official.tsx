import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Official.module.scss';
import Header from '@/components/header/Header';
import { ObjType } from '@/types/Common';
import MyList from '@/components/myList/MyList';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

const Official: FC = () => {
  // List列表数据
  const [state, setState] = useState<ObjType[]>([]);
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  // 是否加载更多
  const [hasMore, setHasMore] = useState(true);
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  const navigate = useNavigate();

  const viewDetail = (data: ObjType) => {
    navigate(`detail/${data.id}`);
  };

  const queryPageActivity = async (
    pageNo: number,
    pageSize: number,
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post(
      '/config-api/officialSponsorship/queryOfficialSponsorshipList',
      {
        pageNo,
        pageSize,
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
  // 下拉刷新
  const refreshState = async () => {
    await queryPageActivity(1, pageParams.pageSize, true);
  };

  return (
    <div className={`${styles['official-container']}`}>
      <Header title='官方赞助' right left />
      <div className={styles.main}>
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
                <div className={styles.content} key={item.id}>
                  <img
                    src={item.imgUrl}
                    alt='logo'
                    onClick={() => viewDetail(item)}
                  />
                </div>
              ))}
            </>
          </MyList>
        )}
      </div>
    </div>
  );
};
export default Official;
