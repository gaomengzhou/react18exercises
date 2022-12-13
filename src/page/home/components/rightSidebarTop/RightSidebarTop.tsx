import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useSelector } from '@/redux/hook';
import styles from './RightSidebarTop.module.scss';
import closeLogo from '../../images/icon-侧边栏-关闭@3x.png';
import { RightSidebarProps } from '../../rightSidebar/RightSidebar';
import CustomImg from '@/components/customImg/CustomImg';
import indexData from '@/redux/index/slice';

const RightSidebarTop: FC<Partial<RightSidebarProps>> = memo(
  ({ setShowRightSidebar }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userinfo, level } = useSelector(
      (storeState) => storeState.indexData
    );
    // 跳转VIP页面
    const toVip = () => {
      navigate('vip');
      dispatch(indexData.actions.setLeftSidebarShortcutOptions(0));
    };
    return (
      <div>
        <div className={styles['avatar-box']}>
          <div
            className={styles.close}
            onClick={() => setShowRightSidebar?.(false)}
          >
            <CustomImg src={closeLogo} alt='' />
          </div>
          <div className={styles.avatar}>
            <div className={styles.top}>
              <CustomImg
                className={styles.avatarLogo}
                src={userinfo.headUrl}
                alt=''
              />
              <div className={styles.user}>
                <p className={styles.username}>{userinfo.nickName}</p>
                <p
                  className={styles.vip}
                  onClick={toVip}
                >{`VIP${level.currentVipLevel}`}</p>
              </div>
            </div>
            <div className={styles.level}>
              <div className={styles['level-line']} onClick={toVip}>
                <p />
                <b style={{ width: `${level.levelLine}%` }} />
              </div>
              <p className={styles['level-number']} onClick={toVip}>
                <span>VIP{level.currentVipLevel}</span>
                <span>VIP{level.nextVipLevel}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
export default RightSidebarTop;
