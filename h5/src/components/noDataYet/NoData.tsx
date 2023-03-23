import { FC } from 'react';
import noData from '@/assets/images/icon-暂无数据.png';
import styles from './NoData.module.scss';

const NoData: FC = () => {
  return (
    <div className={styles['no-data-container']}>
      <img src={noData} alt='暂无数据' />
      <p>暂无数据</p>
    </div>
  );
};
export default NoData;
