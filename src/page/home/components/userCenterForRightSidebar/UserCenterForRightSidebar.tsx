import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { changeSecurityStatus, changeMessageStatus } from '@/redux/security';
import { changeIsShowHistoryAction } from '@/redux/wallet';
import { useAppDispatch, useSelector } from '@/redux/hook';
import styles from './UserCenterForRightSidebar.module.scss';
import { RightSidebarProps } from '../../rightSidebar/RightSidebar';
import indexData from '../../../../redux/index/slice';

const UserCenterForRightSidebar: FC<Partial<RightSidebarProps>> = ({
  setShowRightSidebar,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const unreadMessageCount = useSelector((s) => s.indexData.unreadMessageCount);
  const data = [
    { id: 1, title: t('header.history'), msg: false, path: '/', show: 1 },
    {
      id: 2,
      title: t('header.Security'),
      msg: false,
      path: '/securityCenter',
      show: 1,
    },
    {
      id: 3,
      title: t('header.AgencyCenter'),
      msg: false,
      path: '/promote',
      show: userinfo.isUserCodeShowed,
    },
    {
      id: 4,
      title: t('header.MessageCenter'),
      msg: true,
      path: '/informationCenter',
      show: 1,
    },
  ];

  const dispatch = useAppDispatch();
  const toNavigate = (id: number) => {
    setShowRightSidebar?.(false);
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(-1));
    if (id === 1) {
      dispatch(changeIsShowHistoryAction(true));
    } else if (id === 2) {
      dispatch(changeSecurityStatus(1));
    } else if (id === 3) {
      navigate('/promote', { state: '1' });
    } else if (id === 4) {
      dispatch(changeMessageStatus(1));
    }
  };
  return (
    <div className={styles['usercenter-box']}>
      <div className={styles.usercenter}>
        {data.map((item) => (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <div key={item.id}>
            {item.show === 1 && (
              <div className={styles.info} onClick={() => toNavigate(item.id)}>
                <span>{item.title}</span>
                <div className={styles.message}>
                  <p
                    style={{
                      display:
                        item.msg && unreadMessageCount > 0 ? 'block' : 'none',
                    }}
                  ></p>
                  <i />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default memo(UserCenterForRightSidebar);
