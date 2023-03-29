import { Dispatch, FC, memo, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header2.module.scss';
import orderBtn from '@/page/gamesLobby/images/order_icon.png';
import orderOpenBtn from '@/page/gamesLobby/images/other_open.png';

interface BettingDetailsHeaderProps {
  setClickRight: Dispatch<SetStateAction<boolean>>;
  clickRight: boolean;
  rightText: string;
  title?: string;
}
const Header2: FC<BettingDetailsHeaderProps> = ({
  setClickRight,
  rightText,
  title,
  clickRight,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles['betting-details-header-container']}>
      <div className={`${styles.left} `}>
        <i
          className='iconfont icon-other_with_back_arrow'
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={styles.title}>
        <p>{title}</p>
      </div>
      <div className={`${styles.right}`} onClick={() => setClickRight(true)}>
        <p>{rightText}</p>
        <img src={clickRight ? orderOpenBtn : orderBtn} alt='筛选' />
      </div>
    </div>
  );
};
export default memo(Header2);
