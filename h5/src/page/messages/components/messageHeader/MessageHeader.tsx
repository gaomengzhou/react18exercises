import { Dispatch, FC, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MessageHeader.module.scss';

interface MessageHeaderPops {
  title: string;
  setVisible: Dispatch<SetStateAction<boolean>>;
  left?: boolean;
  right?: boolean;
}
const MessageHeader: FC<MessageHeaderPops> = ({
  title,
  left = false,
  right = false,
  setVisible,
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (!left) return;
    navigate(-1);
  };

  const rightClick = () => {
    if (!right) return;
    setVisible(true);
  };
  return (
    <div className={styles['header-container']}>
      <div className={`${styles.left} ${!left && styles.hidden}`}>
        <i className='iconfont icon-other_with_back_arrow' onClick={goBack} />
      </div>
      <div className={styles.title}>
        <p>{title}</p>
      </div>
      <div className={`${styles.right} ${!right && styles.hidden}`}>
        <i className='iconfont icon-icon-gengduo' onClick={rightClick} />
      </div>
    </div>
  );
};
export default MessageHeader;
