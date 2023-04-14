import { FC, useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './NewDetails.module.scss';
import Header from '@/components/header/Header';
import { ObjType } from '@/types/Common';
import { toast } from '@/utils/tools/toast';

const NewDetails: FC = () => {
  const location = useLocation();
  const [state, setState] = useState<ObjType>({});
  const { id } = useParams();
  const getActivityDetail = useCallback(async () => {
    const res = await $fetch.post('/config-api/faq/getFaq', {
      id,
    });
    if (!res.success) return toast.fail(res);
    setState(res.data);
  }, [id]);
  useEffect(() => {
    getActivityDetail();
  }, [getActivityDetail]);
  return (
    <div className={styles['new-details-container']}>
      <Header title={`${location.state}`} right left />
      <div
        className={styles.main}
        dangerouslySetInnerHTML={{ __html: state.content }}
      ></div>
    </div>
  );
};
export default NewDetails;
