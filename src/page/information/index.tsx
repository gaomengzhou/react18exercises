import { FC, useState, useEffect } from 'react';
import { Tabs, InfiniteScroll, Toast, Collapse, DotLoading } from 'antd-mobile';
// import icon from '@/assets/images/security/icon-绑定-展开.png';
import { useTranslation } from 'react-i18next';
import { isLogin } from '@/utils/tools/method';
import { useAppDispatch } from '@/redux/hook';
import { getUnreadMessageCount } from '@/redux/index/slice';
import styles from './index.module.scss';

const Information: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const [visible, setVisible] = useState(false);
  // const [selected, setSelected] = useState('未读');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageNumber2, setPageNumber2] = useState(1);
  const [announcement, setAnnouncement] = useState([]);
  const [userLetter, setUserLetter] = useState([]);
  const [contentmore, setContentmore] = useState({
    content: '',
    title: '',
    createTime: '',
    id: '',
  });
  const [announcementCount, setAnnouncementCount] = useState(false);
  const [userLettermore, setUserLettermore] = useState({
    content: '',
    title: '',
    createTime: '',
    id: '',
    letterId: '',
  });
  const [hasMore, setHasMore] = useState(false);
  const [hasMore2, setHasMore2] = useState(false);
  const getUnreadMessageCounts = async () => {
    if (!isLogin()) return;
    const res = await $fetch.post(
      '/lottery-api/platformMessage/getUnreadMessageCount'
    );
    if (!res.success) return Toast.show(res.message);
    const aa = Number(res.data?.letterCount);
    setAnnouncementCount(aa > 0);
  };
  const queryPageAnnouncement = async () => {
    const res = await $fetch.post(
      '/config-api/announcement/queryPageAnnouncement',
      {
        pageNo: pageNumber,
        pageSize: 10,
      }
    );
    if (!res.success) return Toast.show(res.message);
    setAnnouncement(res.data?.records);
    setContentmore(res.data?.records[0]);
    if (res.code === 1) {
      await getUnreadMessageCounts();
    }
  };

  useEffect(() => {
    queryPageAnnouncement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const queryPageUserLetter = async () => {
    const res = await $fetch.post(
      '/lottery-api/userLetter/queryPageUserLetter',
      {
        pageNo: pageNumber2,
        pageSize: 10,
      }
    );
    if (!res.success) return Toast.show(res.message);
    setUserLetter(res.data.records);
    setUserLettermore(res.data.records[0]);
    if (res.code === 1) {
      dispatch(getUnreadMessageCount());
    }
  };

  // const statusList = [
  //   {
  //     id: 1,
  //     content: '未读',
  //   },
  //   { id: 2, content: '已读' },
  // ];
  const gotocontent = (item: any) => {
    setContentmore(item);
  };
  const gotocontent2 = (item: any) => {
    setUserLettermore(item);
    // if (item.isReaded === 1) {
    //   return false;
    // }
    // item.isReaded = 1;
    // $fetch
    //   .post('/lottery-api/userLetter/editUserLetter', {
    //     ...item,
    //   })
    //   .then(() => {
    //     dispatch(getUnreadMessageCount());
    //     queryPageUserLetter();
    //   });
  };
  const changTab = (key: any) => {
    if (key === 'announcement') {
      queryPageAnnouncement();
    } else if (key === 'preson') {
      queryPageUserLetter();
      setAnnouncementCount(false);
    }
  };
  const loadMore = async () => {
    setPageNumber(pageNumber + 1);
    const res = await $fetch.post(
      '/config-api/announcement/queryPageAnnouncement',
      {
        pageNo: pageNumber,
        pageSize: 10,
      }
    );
    setAnnouncement(res.data?.records);
    setContentmore(res.data?.records[0]);
    setHasMore(res.data?.totalPage <= pageNumber);
  };
  const loadMore2 = async () => {
    setPageNumber2(pageNumber2 + 1);
    const res = await $fetch.post(
      '/lottery-api/userLetter/queryPageUserLetter',
      {
        pageNo: pageNumber2,
        pageSize: 10,
      }
    );
    setUserLetter(res.data?.records);
    setUserLettermore(res.data?.records[0]);
    setHasMore2(res.data?.totalPage <= pageNumber2);
  };
  return (
    <div>
      <div className={styles.activitybox}>
        <Tabs activeLineMode='fixed' onChange={(key) => changTab(key)}>
          <Tabs.Tab title={t('activity.announcement')} key='announcement'>
            {announcementCount && <div className={styles.messageCount}></div>}
            {/* <div className={styles.inputbox}>
              <div className={styles.checkListContainer}>
                <Checkbox>标记为所有已读</Checkbox>
              </div>
              <div
                className={styles.left}
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                {selected}
                <img
                  className={`${styles.icon} ${
                    visible ? styles.upTransfrom : ''
                  }`}
                  src={icon}
                  alt='icon'
                />
                {visible && (
                  <div className={styles.mask}>
                    {statusList.map((item) => {
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelected(item.content);
                          }}
                        >
                          {item.content}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div> */}
            <div className={styles.bigbox}>
              <ul className={styles.mainbox}>
                {announcement?.map((item: any, index) => (
                  <li
                    key={index}
                    className={
                      contentmore?.id === item?.id ? styles.actived : ''
                    }
                    onClick={() => gotocontent(item)}
                  >
                    <div className={styles.title}>{item?.title}</div>
                    {/* <div className={styles.redbox}></div> */}
                    <div className={styles.time1}>{item?.createTime}</div>
                    <div className={styles.content}>
                      <Collapse defaultActiveKey={['0']}>
                        <Collapse.Panel key={`${index}`} title={item?.title}>
                          <div className={styles.time}>{item?.createTime}</div>
                          <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: item?.content }}
                          ></div>
                        </Collapse.Panel>
                      </Collapse>
                    </div>
                  </li>
                ))}
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
                  {hasMore ? <DotLoading /> : <span>{t('activity.more')}</span>}
                </InfiniteScroll>
              </ul>
              <div className={styles.rightbox}>
                <div className={styles.title}>{contentmore?.title}</div>
                <div className={styles.time2}>{contentmore?.createTime}</div>
                <div
                  className={styles.contentbox} // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: contentmore?.content }}
                ></div>
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab title={t('activity.personal')} key='preson'>
            {/* {announcementCount && <div className={styles.messageCount}></div>} */}

            {/* <div className={styles.inputbox}>
              <div className={styles.checkListContainer}>
                <Checkbox>标记为所有已读</Checkbox>
              </div>
              <div
                className={styles.left}
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                {selected}
                <img
                  className={`${styles.icon} ${
                    visible ? styles.upTransfrom : ''
                  }`}
                  src={icon}
                  alt='icon'
                />
                {visible && (
                  <div className={styles.mask}>
                    {statusList.map((item) => {
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelected(item.content);
                          }}
                        >
                          {item.content}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div> */}
            <div className={styles.bigbox}>
              <ul className={styles.mainbox}>
                {userLetter?.map((item: any, index) => (
                  <li
                    key={index}
                    className={
                      userLettermore?.letterId === item?.letterId
                        ? styles.actived
                        : ''
                    }
                    onClick={() => gotocontent2(item)}
                  >
                    <div className={styles.title}>{item?.title}</div>
                    <div className={styles.time1}>{item?.createTime}</div>
                    <div className={styles.content}>
                      {/* {!item?.isReaded && <div className={styles.redbox}></div>} */}
                      <Collapse defaultActiveKey={['0']}>
                        <Collapse.Panel key={`${index}`} title={item?.title}>
                          <div className={styles.time}>{item?.createTime}</div>
                          <div
                            className={styles.content1}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: item?.content }}
                          ></div>
                        </Collapse.Panel>
                      </Collapse>
                    </div>
                    {/* <div className={styles.title}>{item?.title}</div>
                    {!item?.isReaded && <div className={styles.redbox}></div>}
                    <div className={styles.time}>{item?.createTime}</div>
                    <div className={styles.content}>
                      <Ellipsis
                        direction='end'
                        content={item?.content.replace(/<[^>]+>/g, '')}
                        expandText='展开'
                        collapseText='收起'
                        rows={3}
                        onContentClick={changecontent}
                      /> */}
                  </li>
                ))}
                <InfiniteScroll loadMore={loadMore2} hasMore={hasMore2}>
                  {hasMore2 ? (
                    <DotLoading />
                  ) : (
                    <span>{t('activity.more')}</span>
                  )}
                </InfiniteScroll>
              </ul>
              <div className={styles.rightbox}>
                <div className={styles.title}>{userLettermore?.title}</div>
                <div className={styles.time2}>{userLettermore?.createTime}</div>
                <div
                  className={styles.contentbox} // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: userLettermore?.content }}
                ></div>
              </div>
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
};
export default Information;
