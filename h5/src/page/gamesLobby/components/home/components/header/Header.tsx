import { Button } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { FC } from 'react';
import styles from './Header.module.scss';
import money from '../../images/home_headerView_gqiphone@2x.png';
import refreshLogo from '../../images/icon-刷新.png';
import { useSelector } from '@/redux/hook';
import { useThrottleFn, getUserDetail } from '@/utils/tools/method';

let timer: NodeJS.Timer;
interface LogoProps {
  logo: string;
}
const Header: FC<LogoProps> = ({ logo }) => {
  const navigate = useNavigate();
  const {
    userinfo: { token, balance },
  } = useSelector((s) => s.indexData);
  const throttleFn = useThrottleFn();

  const location = useLocation();
  // 刷新余额
  const refreshAmount = async () => {
    const btn = document.querySelector('.refreshLogo') as HTMLDivElement;
    clearTimeout(timer);
    btn.classList.add(`${styles['refresh-log']}`);
    timer = setTimeout(() => {
      btn.classList.remove(`${styles['refresh-log']}`);
      clearTimeout(timer);
    }, 500);
    await throttleFn(getUserDetail, 3000);
  };
  const goHome = (): void => {
    if (location.pathname === '/') return;
    navigate('/');
  };

  return (
    <header
      onClick={() => {
        console.log(1111);
      }}
      className={styles['header-container']}
    >
      <div className={styles.headerAuto}>
        <div>
          <div className={`${styles['h5-header-logo']}`} onClick={goHome}>
            <img src={logo} alt='LOGO' />
          </div>
        </div>
        <div>
          {!token ? (
            <div>
              <Button
                className={styles.loginBtn}
                onClick={() => {
                  navigate('/login');
                }}
                type='button'
                color='primary'
                size='small'
              ></Button>
              <Button
                className={styles.regesteBtn}
                onClick={() => {
                  navigate('/register');
                }}
                type='button'
                color='primary'
                size='small'
              ></Button>
            </div>
          ) : (
            <div className={styles.userinfo}>
              <img src={money} alt='' />
              <p>
                {balance.split('.')[0]}.<span>{balance.split('.')[1]}</span>
              </p>
              <img
                className='refreshLogo'
                alt='刷新余额'
                onClick={refreshAmount}
                src={refreshLogo}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
