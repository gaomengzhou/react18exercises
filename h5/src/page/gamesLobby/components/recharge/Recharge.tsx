import { FC, memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderRecharge from '@/page/gamesLobby/components/recharge/components/header/HeaderRecharge';
import styles from './Recharge.module.scss';
import Deposit from '@/page/gamesLobby/components/recharge/components/deposit/Deposit';
import Withdraw from '@/page/gamesLobby/components/recharge/components/withdraw/Withdraw';

const Recharge: FC = memo(() => {
  const location = useLocation();
  const type = location.state ? (location.state as any).type : 1;
  // headerTitleActive: 1:充值 | 2:提现
  const [headerTitleActive, setHeaderTitleActive] = useState(type);

  const headerProps = {
    headerTitleActive,
    setHeaderTitleActive,
  };

  return (
    <div className={styles['recharge-container']}>
      <HeaderRecharge {...headerProps} />
      {headerTitleActive === 1 ? <Deposit /> : <Withdraw />}
    </div>
  );
});
export default Recharge;
