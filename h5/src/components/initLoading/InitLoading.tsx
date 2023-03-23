import { FC } from 'react';
import { DotLoading } from 'antd-mobile';
import styles from './InitLoading.module.scss';

const InitLoading: FC = () => {
  return (
    <div className={styles.placeholder}>
      <div className={styles.loadingWrapper}>
        <DotLoading />
      </div>
      正在拼命加载数据
    </div>
  );
};
export default InitLoading;
