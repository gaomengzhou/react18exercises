import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

interface HeaderPops {
  title: string;
  left?: boolean | (() => void);
  right?: boolean;
  backgroundColor?: string;
}
const Header: FC<HeaderPops> = ({
  title,
  backgroundColor,
  left = false,
  right = false,
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (!left) return;
    if (typeof left === 'function') {
      return left();
    }
    navigate(-1);
  };

  const customerService = () => {
    if (!right) return;
    navigate('/customer-service');
  };
  return (
    <div className={styles['header-container']} style={{ backgroundColor }}>
      <div className={`${styles.left} ${!left && styles.hidden}`}>
        <i className='iconfont icon-other_with_back_arrow' onClick={goBack} />
      </div>
      <div className={styles.title}>
        <p>{title}</p>
      </div>
      <div className={`${styles.right} ${!right && styles.hidden}`}>
        <i className='iconfont icon-other_service' onClick={customerService} />
      </div>
    </div>
  );
};
export default Header;
