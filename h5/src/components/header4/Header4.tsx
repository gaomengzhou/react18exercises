import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header4.module.scss';

interface HeaderPops {
  title: string;
  left?: boolean;
  rightText?: string;
}
const Header4: FC<HeaderPops> = ({
  title,
  left = false,
  rightText = false,
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (!left) return;
    navigate(-1);
  };

  const rightClick = () => {
    if (!rightText) return;
    navigate('record');
  };
  return (
    <div className={styles['header-container']}>
      <div className={`${styles.left} ${!left && styles.hidden}`}>
        <i className='iconfont icon-other_with_back_arrow' onClick={goBack} />
      </div>
      <div className={styles.title}>
        <p>{title}</p>
      </div>
      <div
        className={`${styles.right} ${!rightText && styles.hidden}`}
        onClick={rightClick}
      >
        <p>{rightText}</p>
      </div>
    </div>
  );
};
export default Header4;
