import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { isLogin } from '@/utils/tools/method';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './RightSidebar.module.scss';
import RightSidebarTop from '../components/rightSidebarTop/RightSidebarTop';
import UserCenterForRightSidebar from '../components/userCenterForRightSidebar/UserCenterForRightSidebar';

export interface RightSidebarProps {
  showRightSidebar: boolean;
  setShowRightSidebar: Dispatch<SetStateAction<boolean>>;
}
const RightSidebar: FC<RightSidebarProps> = ({
  showRightSidebar,
  setShowRightSidebar,
}) => {
  const dispatch = useAppDispatch();
  const { token } = useSelector((s) => s.indexData.userinfo);
  const { t } = useTranslation();
  // 侧边栏展开后禁止其它页面滚动
  useEffect(() => {
    if (showRightSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [showRightSidebar]);

  // 被踢出后收起侧边栏
  useEffect(() => {
    if (!isLogin()) {
      setShowRightSidebar(false);
    }
  }, [setShowRightSidebar, token]);
  const logout = async () => {
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });
    const result = await $fetch.post('/lottery-login-api/user/logout', {});
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }
    dispatch(indexData.actions.clearUserinfo());
    localStorage.removeItem('userInfo');
    Toast.clear();
    setShowRightSidebar(false);
  };
  return (
    <>
      <div
        onClick={() => setShowRightSidebar(false)}
        className={`${styles.container} ${
          showRightSidebar && styles.showContainer
        }`}
      ></div>

      <div className={`${styles.main} ${showRightSidebar && styles.showMain}`}>
        <RightSidebarTop setShowRightSidebar={setShowRightSidebar} />
        <UserCenterForRightSidebar setShowRightSidebar={setShowRightSidebar} />
        <div className={styles['sign-out']}>
          <button onClick={logout}>{t('rightSidebar.SignOut')}</button>
        </div>
      </div>
    </>
  );
};
export default RightSidebar;
