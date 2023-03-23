import { Dispatch, FC, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HeaderRecharge.module.scss';
import record from '../../images/icon-记录.png';
import { ObjType } from '@/types/Common';

interface HeaderProps {
  headerTitleActive: number;
  setHeaderTitleActive: Dispatch<SetStateAction<number>>;
}
const HeaderRecharge: FC<HeaderProps> = ({
  headerTitleActive,
  setHeaderTitleActive,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const title = [
    { id: 1, text: '充值' },
    { id: 2, text: '提现' },
  ];
  const onClickTabs = (data: ObjType) => {
    if (data.id === 2) {
      navigate(`/recharge`, { state: { type: data.id, payment: 1 } });
    } else {
      navigate(`/recharge`, { state: { type: data.id } });
    }
    setHeaderTitleActive(data.id);
  };

  const viewMore = () => {
    // 1:充值 | 2:提现
    if ((location.state as any).type === 1) {
      navigate('/funding-details');
    } else {
      navigate('/flow-audit');
    }
  };
  return (
    <div className={styles['header-container']}>
      <div className={styles.title}>
        {title.map((item) => (
          <p
            className={`${headerTitleActive === item.id && styles['active-p']}`}
            key={item.id}
            onClick={() => onClickTabs(item)}
          >
            {item.text}
          </p>
        ))}
      </div>
      <img src={record} alt='record' onClick={viewMore} />
    </div>
  );
};
export default HeaderRecharge;
