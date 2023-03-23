import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gongGaoMessage from '@/assets/images/messages/Message_GongGao_Icon@2x.png';
import rightArrow from '@/assets/images/messages/Message_Arrow@2x.png';
import MyList from '@/components/myList/MyList';
import { ObjType } from '@/types/Common';
import styles from './Bulletin.module.scss';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

const Bulletin: FC = () => {
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  const [state, setState] = useState<ObjType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  // 查询页面公告
  const queryPageAnnouncement = async (
    pageNo: number,
    pageSize: number,
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post(
      '/config-api/announcement/queryPageAnnouncement',
      { pageNo, pageSize }
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

  // 阅读留言
  const readMessage = async () => {
    const res = await $fetch.post('/lottery-api/platformMessage/readMessage');
    if (!res.success) return toast.fail(res);
  };

  // componentDidMount
  useEffect(() => {
    readMessage();
  }, []);

  const refreshState = async () => {
    await queryPageAnnouncement(1, pageParams.pageSize, true);
  };

  // 查看消息详情
  const viewMessage = (data: ObjType) => {
    navigate(`details/bulletin/${data.id}`);
  };

  return (
    <div style={{ height: '100%' }}>
      {initLoading ? (
        <InitLoading />
      ) : (
        <MyList
          state={state}
          hasMore={hasMore}
          refreshState={refreshState}
          getData={() =>
            queryPageAnnouncement(pageParams.pageNo, pageParams.pageSize)
          }
        >
          <>
            {state.map((item) => (
              <div
                key={item.id}
                className={styles['bulletin-content']}
                onClick={() => viewMessage(item)}
              >
                <div className={`${styles['bulletin-logo']}`}>
                  <img src={gongGaoMessage} alt='logo' />
                </div>
                <div className={styles['bulletin-content-right']}>
                  <div className={styles['bulletin-right-top']}>
                    <p>{item.title}</p>
                    <span>{item.createTime}</span>
                  </div>
                  <div className={styles['bulletin-right-bottom']}>
                    <p>{item.rollContent}</p>
                    <img src={rightArrow} alt='arrow' />
                  </div>
                </div>
              </div>
            ))}
          </>
        </MyList>
      )}
    </div>
  );
};
export default Bulletin;
