import { FC } from 'react';
import loading from '@/assets/images/107@2.gif';
import styles from './HomeInitLoading.module.scss';

const HomeInitLoading: FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.loading} src={loading} alt='loading...' />
    </div>
  );
};
export default HomeInitLoading;
