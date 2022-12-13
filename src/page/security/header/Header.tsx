import React, { memo, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useSelector } from '@/redux/hook';
import back from '@/assets/images/security/icon-返回.png';
import styles from './Headertwo.module.scss';

interface header {
  leftSlot?: ReactElement;
  centerSlot?: ReactElement;
  rightSlot?: ReactElement;
  readonly title?: string;
  rightTitle?: string;
}

const HeaderS: React.FC<header> = memo((props) => {
  const { leftSlot, centerSlot, rightSlot, title, rightTitle } = props;
  const navigate = useNavigate();
  const handle = (e: SyntheticEvent) => {
    e.stopPropagation();
    navigate(-1);
  };
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const gotoOnlineService = (e: any) => {
    e.stopPropagation();
    if (!platformConfig.customerServiceUrl) return;
    window.open(platformConfig.customerServiceUrl);
  };
  return (
    <header className={styles.headersd}>
      {leftSlot ?? (
        <div className={styles.left} onClick={handle}>
          <img src={back} alt='img' />
        </div>
      )}
      {centerSlot ?? <div className={styles.center}>{title}</div>}
      {rightSlot ?? (
        <div className={styles.right} onClick={gotoOnlineService}>
          {rightTitle}
        </div>
      )}
    </header>
  );
});
export default HeaderS;
