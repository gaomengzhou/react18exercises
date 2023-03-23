import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mask } from 'antd-mobile';
import styles from './LoginActionSheet.module.scss';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';

const LoginActionSheet: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notLoggedIn } = useSelector((state) => state.indexData);
  const location = useLocation();
  useEffect(() => {
    // console.log(location.pathname);
  }, [location.pathname]);

  const setNotLoggedIn = (status: boolean) => {
    dispatch(indexData.actions.setNotLoggedIn(status));
  };

  return (
    <div
      className={`${styles['login-action-sheet-container']} ${
        notLoggedIn && styles['show-container']
      }`}
    >
      <div className={styles.touchBar}></div>
      <div className={styles.mk66M}>
        <div className={styles.C8Z4S}>
          <div className={styles.JKA59}>
            <div className={styles.pbodc}></div>
            <div>
              <p className={styles.fGYD7}>未登录</p>
              <p>精彩内容等你来体验，快去登录吧！</p>
            </div>
          </div>
          <div className={styles.envK7}>
            <div className={styles.H9LiU} onClick={() => setNotLoggedIn(false)}>
              取消
            </div>
            <div
              className={styles.H9LiUHMvwk}
              onClick={() => {
                setNotLoggedIn(false);
                navigate('/login');
              }}
            >
              登录
            </div>
          </div>
        </div>
      </div>
      <Mask
        className='bottom-action-sheet-mask'
        visible={notLoggedIn}
        onMaskClick={() => setNotLoggedIn(false)}
        getContainer={() => {
          return document.getElementById('root') as HTMLElement;
        }}
      />
    </div>
  );
};
export default LoginActionSheet;
