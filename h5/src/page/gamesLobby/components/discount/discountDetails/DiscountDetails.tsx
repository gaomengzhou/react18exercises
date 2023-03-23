import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DiscountDetails.module.scss';
import Header from '@/components/header/Header';
import { ObjType } from '@/types/Common';
import { toast } from '@/utils/tools/toast';

const DiscountDetails: FC = () => {
  const [state, setState] = useState<ObjType>({});
  const { id } = useParams();
  const getActivityDetail = useCallback(async () => {
    const res = await $fetch.post('/config-api/activity/getActivityDetail', {
      id,
    });
    if (!res.success) return toast.fail(res);
    setState(res.data);
  }, [id]);
  useEffect(() => {
    getActivityDetail();
  }, [getActivityDetail]);
  return (
    <div className={styles['discount-details-container']}>
      <Header title='活动详情' right left />
      <div
        className={styles.main}
        dangerouslySetInnerHTML={{ __html: state.description }}
      ></div>
    </div>
  );
};
export default DiscountDetails;
