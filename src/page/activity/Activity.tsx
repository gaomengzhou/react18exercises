import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InfiniteScroll, DotLoading } from 'antd-mobile';
import PageNation from '@/components/page-nation';
import Header from '@/page/security/header/Header';
import { useSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import icon from '@/assets/images/security/icon-优惠活动-选中@2x.png';
import styles from './Activity.module.scss';

const Activity: FC = () => {
  const currentLanguage = useSelector(
    (s: RootState) => s.indexData.currentLanguage
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [records, setRecords] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [current, setCurrent] = useState(1);
  const navigate = useNavigate();
  const gotoDetails = (id: number) => {
    navigate(`/activity/details/${id}`);
  };
  const { t } = useTranslation();
  useEffect(() => {
    $fetch
      .post('/config-api/activity/queryPageActivity', {
        activityTypeId: '',
        pageNo: pageNumber,
        pageSize: 6,
      })
      .then((res) => {
        setRecords(res.data.records);
        setTotalPage(res.data.totalCount);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);
  const loadMore = async () => {
    setPageNumber(pageNumber + 1);
    const res = await $fetch.post('/config-api/activity/queryPageActivity', {
      activityTypeId: '',
      pageNo: pageNumber,
      pageSize: 10,
    });
    setRecords([...records, ...res.data.records]);
    setHasMore(res.data.records.length > 0);
  };
  const onChangePage = async (page: number) => {
    setCurrent(page);
    const res = await $fetch.post('/config-api/activity/queryPageActivity', {
      activityTypeId: '',
      pageNo: page,
      pageSize: 6,
    });
    setRecords(res.data.records);
  };
  return (
    <div>
      <div className={styles.activity}>
        <Header
          title={t('activity.title')}
          rightTitle={t('activity.service')}
        />
        <div className={styles.tab}>
          <img src={icon} alt='' />
          <div>{t('activity.title')}</div>
        </div>
        <div className={styles.activitybox1}>
          <ul className={styles.activitybox}>
            {records.map((item: any) => (
              <li onClick={() => gotoDetails(item.id)} key={item.id}>
                <img src={item.pcSmallImgUrl} alt='imgicon' />
                <div className={styles.bottom}>
                  <div className={styles.activityleft}>{item.activityName}</div>
                  <div className={styles.activityright}>{item.startTime}</div>
                </div>
              </li>
            ))}
          </ul>
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMore}
            className={styles.h5page}
          >
            {hasMore ? <DotLoading /> : <span>{t('activity.more')}</span>}
          </InfiniteScroll>
          <div className={styles.page}>
            <PageNation
              current={current}
              defaultPageSize={Number(6)}
              totalPage={totalPage}
              onChangePage={(page) => onChangePage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Activity;
