import { FC, memo, useEffect, useState } from 'react';
import Header from '@/components/header/Header';
import styles from './CustomerService.module.scss';
import { toast } from '@/utils/tools/toast';

const CustomerService: FC = memo(() => {
  const [src, setSrc] = useState('');
  const getPlatformConfigInfo = async () => {
    toast.loading();
    const res = await $fetch.post('/config-api/platform/getPlatformConfigInfo');
    toast.clear();
    if (!res.success) return res.message && toast.fail(res);
    setSrc(res.data.customerServiceUrl);
  };
  useEffect(() => {
    getPlatformConfigInfo();
  }, []);

  return (
    <div className={styles.service}>
      <Header title='客服' left />
      <iframe title='客服' src={src} className={styles.iframe}></iframe>
    </div>
  );
});
export default CustomerService;
