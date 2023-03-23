import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notice from '@/assets/images/messages/Message_TongZhi_Icon@2x.png';
import rightArrow from '@/assets/images/messages/Message_Arrow@2x.png';
import MyList from '@/components/myList/MyList';
import { ObjType } from '@/types/Common';
import styles from './Notice.module.scss';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

const Notice: FC = () => {
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  // 消息集合
  const [state, setState] = useState<ObjType[]>([]);

  // 查询页面通知
  const queryPageUserLetter = async (
    pageNo: number,
    pageSize: number,
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post(
      '/lottery-api/userLetter/queryPageUserLetter',
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

  const refreshState = async () => {
    await queryPageUserLetter(pageParams.pageNo, pageParams.pageSize, true);
  };

  // 查看消息详情
  const viewMessage = (data: ObjType) => {
    window.localStorage.setItem('msg', JSON.stringify(data));
    navigate(`details/notice/${data.id}`);
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
            queryPageUserLetter(pageParams.pageNo, pageParams.pageSize)
          }
        >
          <>
            {state.map((item) => (
              <div
                onClick={() => viewMessage(item)}
                key={item.id}
                className={styles['notice-content']}
              >
                <div className={`${styles['notice-logo']}`}>
                  <img src={notice} alt='logo' />
                </div>
                <div className={styles['notice-content-right']}>
                  <div className={styles['notice-right-top']}>
                    <p>{item.title}</p>
                    <span>{item.createTime}</span>
                  </div>
                  <div className={styles['notice-right-bottom']}>
                    <p>{item.content}</p>
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
export default Notice;
