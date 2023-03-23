import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header3.module.scss';

interface HeaderPops {
  left?: boolean;
}
const Header3: FC<HeaderPops> = ({ left = false }) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (!left) return;
    navigate(-1);
  };

  return (
    <div className={styles['header-container']}>
      <div className={`${styles.left} ${!left && styles.hidden}`}>
        <i className='iconfont icon-other_with_back_arrow' onClick={goBack} />
      </div>
    </div>
  );
};
export default Header3;
