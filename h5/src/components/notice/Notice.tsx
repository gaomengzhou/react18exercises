import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mask } from 'antd-mobile';
import styles from './Notice.module.scss';
import { useSelector } from '@/redux/hook';
import { setLoginStatus } from '@/utils/tools/method';

const Notice: FC = () => {
  const navigate = useNavigate();
  const showVisible = useSelector((state) => state.indexData.showVisible);
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={`${styles['login-action-sheet-container']} ${
        showVisible && styles['show-container']
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
            <div className={styles.H9LiU} onClick={() => setLoginStatus(false)}>
              取消
            </div>
            <div
              className={styles.H9LiUHMvwk}
              onClick={() => {
                setLoginStatus(false);
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
        visible={showVisible}
        onMaskClick={() => setLoginStatus(false)}
        getContainer={() => {
          return document.getElementById('root') as HTMLElement;
        }}
      />
    </div>
  );
};
export default Notice;
