import { FC, memo, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Security from '@/components/security/index';
import Serve from '@/components/serve/index';
import Message from '@/components/message/index';
import HistoryRecods from '@/page/history-recods';
import Wallet from '@/page/wallet';
import PopUpActivity from '@/page/popUpActivity/PopUpActivity';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { changeUsercode } from '@/redux/security';
import indexData, { worldCupAd } from '@/redux/index/slice';
import Header from './header/Header';
import styles from './index.module.scss';
import Login from './components/login/login';
import ForgetPassword from './components/forgetPassword/ForgetPassword';
import Registration from './components/register/Registration';
import MenuForPC from './components/menuForPC/MenuForPC';
import FullScreenAd from './components/worldCup/FullScreenAd';
import { countdown } from '@/utils/tools/method';
import RightSidebar from './rightSidebar/RightSidebar';
import LeftSidebar from './leftSidebar/LeftSidebar';
// import ReactLazyLoading from '@/components/reactLazyLoading/ReactLazyLoading';

const Home: FC = memo(() => {
  // 0 关闭所有弹框 1 登录 2 展示忘记密码 3注册
  // const [visible, setVisible] = useState(0);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [time, setTime] = useState<any>({
    day: ['9', '9'],
    hour: ['9', '9'],
    min: ['9', '9'],
    s: ['9', '9'],
  });
  // 左侧边栏
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  // 右侧边栏
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const securityStatus = useSelector((state) => state.security.securityStatus);
  const serveStatus = useSelector((state) => state.security.serveStatus);
  const messageStatus = useSelector((state) => state.security.messageStatus);
  const { loginShow, showFullScreenAd, showWorldCup } = useSelector(
    (state) => state.indexData
  );
  const isShowHistory = useSelector((state) => state.wallet.isShowHistory);
  const isShowWallet = useSelector((state) => state.wallet.isShowWallet);
  const isShowPopUpActivity = useSelector(
    (state) => state.wallet.isShowPopUpActivity
  );
  const renderComponents = () => {
    switch (loginShow) {
      case 0:
        return '';
      case 1:
        return <Login />;
      case 2:
        return <ForgetPassword />;
      case 3:
        return <Registration />;
      default:
        return '';
    }
  };
  const getQueryVariable = (variable: any) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      // eslint-disable-next-line eqeqeq
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  };

  useEffect(() => {
    if (getQueryVariable('inviteCode')) {
      const usercode = String(getQueryVariable('inviteCode'));
      dispatch(changeUsercode(usercode));
      dispatch(indexData.actions.setLoginShow(3));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      const arr = Object.values(time).flat();
      for (let i = 0; i < arr.length; i += 1) {
        if (Number(arr[i]) < 0) {
          dispatch(worldCupAd(0));
        }
        if (Number(arr[i]) === 0) {
          count += 1;
        }
      }
      if (count === 8) {
        dispatch(worldCupAd(0));
        clearInterval(timer);
      }
      if (!countdown(1668960000000)) {
        clearInterval(timer);
        dispatch(indexData.actions.clearWorldCupAllAd(false));
        dispatch(worldCupAd(0));
        return;
      }
      const currTime = countdown(1668960000000);
      setTime(currTime);
    }, 1000);
    if (!showWorldCup) clearInterval(timer);
    return () => clearInterval(timer);
  }, [dispatch, showWorldCup, time]);
  useEffect(() => {
    if (countdown(1668960000000)) {
      dispatch(worldCupAd());
    }
  }, [dispatch]);
  return (
    <div className={`${styles.container}`}>
      {location.pathname === '/' && showFullScreenAd && showWorldCup && (
        <FullScreenAd time={time} />
      )}
      <div>
        <MenuForPC setShowLeftSidebar={setShowLeftSidebar} />
        <Header
          setShowLeftSidebar={setShowLeftSidebar}
          setShowRightSidebar={setShowRightSidebar}
          time={time}
        />
        <div className={`${loginShow !== 0 ? styles.blur : ''}`}>
          <Outlet />
        </div>
        {renderComponents()}
        {securityStatus ? <Security /> : ''}
        {serveStatus ? <Serve /> : ''}
        {messageStatus ? <Message /> : ''}
        {isShowHistory && <HistoryRecods />}
        {isShowWallet && <Wallet />}
        {isShowPopUpActivity && <PopUpActivity />}
        <LeftSidebar
          showLeftSidebar={showLeftSidebar}
          setShowLeftSidebar={setShowLeftSidebar}
        />
        <RightSidebar
          showRightSidebar={showRightSidebar}
          setShowRightSidebar={setShowRightSidebar}
        />
      </div>
    </div>
  );
});
export default Home;
