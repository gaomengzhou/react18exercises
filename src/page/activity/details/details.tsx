import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '@/page/security/header/Header';
import { RootState } from '@/redux/store';
import { useSelector } from '@/redux/hook';
import icon from '@/assets/images/security/icon-优惠活动-选中@2x.png';
import styles from './details.module.scss';

const ActivityDetail: FC = () => {
  const currentLanguage = useSelector(
    (s: RootState) => s.indexData.currentLanguage
  );
  const [activityDetail, setActivityDetail] = useState({
    activityName: '',
    description: '',
    createTime: '',
  });
  const { id }: any = useParams();
  const { t } = useTranslation();
  useEffect(() => {
    $fetch
      .post('/config-api/activity/getActivityDetail', {
        id,
      })
      .then((res) => {
        setActivityDetail(res.data);
      });
  }, [id, currentLanguage]);
  return (
    <div className={styles.activitydetail}>
      <Header title={t('activity.detail')} rightTitle={t('activity.service')} />
      <div className={styles.tab}>
        <img src={icon} alt='' />
        <div>{t('activity.detail')}</div>
      </div>
      <div className={styles.detailsbox}>
        <div className={styles.title}>
          {activityDetail.activityName}
          <p>{activityDetail.createTime}</p>
        </div>
        <div
          className={styles.maindetail}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: activityDetail.description }}
        ></div>
      </div>
    </div>
  );
};
export default ActivityDetail;
