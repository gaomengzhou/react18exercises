import { FC } from 'react';
import styles from './ToastSuccess.module.scss';
import imgSuccess from '../../../../assets/images/login/icon-注册-成功.png';

const ToastSuccess: FC = () => {
  return (
    <div className={styles.successWrap}>
      <img src={imgSuccess} alt='' />
    </div>
  );
};

export default ToastSuccess;
