/* eslint-disable react/no-unstable-nested-components */
import { FC, useState, memo, useEffect } from 'react';
import { TabBar } from 'antd-mobile';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAliveController } from 'react-activation';
import styles from './GamesLobby.module.scss';
import { showNotLoggedInPopup } from '@/utils/tools/method';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { ObjType } from '@/types/Common';
import indexData from '@/redux/index/slice';

const GamesLobby: FC = memo(() => {
  const dispatch = useAppDispatch();
  const { drop, getCachingNodes } = useAliveController();
  const { token } = useSelector((s) => s.indexData.userinfo);
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs] = useState([
    {
      key: '/',
      title: '首页',
      icon: (active: boolean) =>
        active ? (
          <i
            className={`iconfont icon-icon-home-2-shouye ${styles.icon} ${styles.active}`}
          />
        ) : (
          <i className={`iconfont icon-icon-home-1-shouye ${styles.icon}`} />
        ),
    },
    {
      key: '/discount',
      title: '活动',
      icon: (active: boolean) =>
        active ? (
          <i
            className={`iconfont icon-icon-home-2-huodong ${styles.icon} ${styles.active}`}
          />
        ) : (
          <i className={`iconfont icon-icon-home-1-huodong ${styles.icon}`} />
        ),
    },
    {
      key: '/recharge',
      title: '充提',
      icon: (active: boolean) =>
        active ? (
          <i
            className={`iconfont icon-icon-home-2-chongti ${styles.icon} ${styles.active}`}
          />
        ) : (
          <i className={`iconfont icon-icon-home-1-chongti ${styles.icon}`} />
        ),
    },
    {
      key: '/betSlip',
      title: '注单',
      icon: (active: boolean) =>
        active ? (
          <i
            className={`iconfont icon-icon-home-2-zhudan ${styles.icon} ${styles.active}`}
          />
        ) : (
          <i className={`iconfont icon-icon-home-1-zhudan ${styles.icon}`} />
        ),
    },
    {
      key: '/mine',
      title: '我的',
      icon: (active: boolean) =>
        active ? (
          <i
            className={`iconfont icon-icon-home-2-wode ${styles.icon} ${styles.active}`}
          />
        ) : (
          <i className={`iconfont icon-icon-home-1-wode ${styles.icon}`} />
        ),
    },
  ]);

  const onChange = (key: string) => {
    // 不保存首页滚动条位置
    dispatch(indexData.actions.setSaveScrollPosition(false));
    window.sessionStorage.setItem('routerCache', key);
    if ((!token && key === '/recharge') || (!token && key === '/betSlip')) {
      showNotLoggedInPopup();
      return;
    }
    if (key === '/recharge') {
      navigate(key, { state: { type: 1 } });
      return;
    }
    navigate(key);
  };

  // 清除betSlip页面缓存
  useEffect(() => {
    const cacheList = getCachingNodes();
    if (!['/discount', '/betSlip', '/'].includes(location.pathname)) {
      cacheList.forEach((item: ObjType) => {
        if (item.name !== 'homeKPNAME') {
          drop(item.name);
        }
      });
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles.container}>
      <Outlet />
      <TabBar
        className={`${styles.bar}`}
        onChange={onChange}
        activeKey={location.pathname}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} title={item.title} icon={item.icon} />
        ))}
      </TabBar>
    </div>
  );
});
export default GamesLobby;
