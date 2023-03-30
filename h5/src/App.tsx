import { FC, ReactElement, useCallback, useEffect } from 'react';
import './App.css';
import './assets/icon_front/iconfont.css';
import './custom-style.css';
import { useAppDispatch } from '@/redux/hook';
import RouteIndex from './router';

import LoginActionSheet from './components/loginActionSheet/LoginActionSheet';
import Messeger from './components/messeger/Messeger';
import indexData from '@/redux/index/slice';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

let flag = false;
const App: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const initMqtt = () => {
    let username: string;
    let password: string;
    let brokerUrl: string;
    if (process.env.NODE_ENV !== 'production') {
      username = $env.REACT_APP_MQTT_USERNAME;
      password = $env.REACT_APP_MQTT_PASSWORD;
      brokerUrl = $env.REACT_APP_MQTT_BROKER_URL;
    } else {
      username = $env.REACT_APP_MQTT_USERNAME;
      password = $env.REACT_APP_MQTT_PASSWORD;
      brokerUrl = $env.REACT_APP_MQTT_BROKER_URL;
    }
    if (!brokerUrl) {
      const url = window.location.href.slice(0, 5);
      if (url === 'https') {
        brokerUrl =
          window.location.port.length > 0
            ? `wss://${window.location.hostname}:${window.location.port}`
            : `wss://${window.location.hostname}`;
      } else {
        brokerUrl =
          window.location.port.length > 0
            ? `ws://${window.location.hostname}:${window.location.port}`
            : `ws://${window.location.hostname}`;
      }
    }
    $mqtt.start({ brokerUrl, username, password });
  };

  // 数据初始化
  const dataInitialization = useCallback(() => {
    let sendHeartbeatTimerId = null as any;
    const getToken = localStorage.getItem('token') || '';
    const onWatchTokenToSendHeartbeat = () => {
      if (sendHeartbeatTimerId || flag) return;
      flag = true;
      sendHeartbeatTimerId = setInterval(() => {
        $fetch.post('/lottery-login-api/user/sendHeartbeat');
      }, 1000 * 60);
    };
    if (getToken) {
      onWatchTokenToSendHeartbeat();
      dispatch(indexData.actions.setUserinfo({ token: getToken }));
    } else if (sendHeartbeatTimerId) clearInterval(sendHeartbeatTimerId);
  }, [dispatch]);

  /** 获取全局开关配置 */
  const getGlobalSwitchConfigInfo = useCallback(async () => {
    const res = await $fetch.post(
      '/config-api/homePage/getGlobalSwitchConfigInfo'
    );
    if (!res.success) return toast.fail(res);
    dispatch(indexData.actions.setSwitchs(res.data));
  }, [dispatch]);

  useEffect(() => {
    Promise.all([
      dataInitialization(),
      getUserDetail(),
      getGlobalSwitchConfigInfo(),
    ]);
    initMqtt();
  }, [dataInitialization, dispatch, getGlobalSwitchConfigInfo]);

  // MQTT订阅
  /*   useEffect(() => {
    const toConvertMQTTBroadcast = async () => {
      const platformId = $env.REACT_APP_PLATFORM_ID;
      // 配置推送(全局)
      $mqtt.subscribe(
        `${MQTTConstant.MQTT_LOTTERYBROADCAST}/${platformId}/`,
        (res: any) => {
          if (
            res.body.data.lotteryId ===
              LotteryConstant.AUSTRALIA_KENO_LOTTERY_ID &&
            res.body.data.openNumber
          ) {
            dispatch(
              getCurrentAndPreviousIssueInfo({
                id: LotteryConstant.AUSTRALIA_KENO_LOTTERY_ID,
                lotteryId: LotteryConstant.AUSTRALIA_KENO_LOTTERY_ID,
              })
            );
          }
        }
      );
    };
    toConvertMQTTBroadcast();
  }, [dispatch, userinfo, token]); */

  return (
    <div className='this-app-router-container'>
      {/* 主路由 */}
      <RouteIndex />
      <div>
        <LoginActionSheet />
        <Messeger />
      </div>
    </div>
  );
};

export default App;
