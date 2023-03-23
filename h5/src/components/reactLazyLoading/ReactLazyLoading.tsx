import { FC, useEffect } from 'react';
import { toast } from '@/utils/tools/toast';

const ReactLazyLoading: FC = () => {
  useEffect(() => {
    toast.loading({ mask: false });
    return () => {
      toast.clear();
    };
  }, []);
  return <div />;
};
export default ReactLazyLoading;
