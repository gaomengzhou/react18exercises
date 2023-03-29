import { FC, useEffect } from 'react';
import HomeInitLoading from '@/components/homeInitLoading/HomeInitLoading';
import { setLoadingStatus } from '@/utils/tools/method';

const Waiting: FC = () => {
  useEffect(() => {
    setLoadingStatus(true);
    return () => {
      setLoadingStatus(false);
    };
  }, []);
  return <HomeInitLoading />;
};
export default Waiting;
