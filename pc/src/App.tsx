import { FC, ReactElement, useEffect } from 'react';
import './App.css';
import './assets/icon_font/iconfont.css';
import { useAppDispatch, useSelector } from '@/redux/hook';
import MQTTConstant from './utils/mqtt/MQTTConstant';
import RouteIndex from './router';
import 'animate.css';
import LotteryConstant from '@/constants';
import { getCurrentAndPreviousIssueInfo } from './redux/index/slice';

let flag = false;
const App: FC = (): ReactElement => {
  const {
    userinfo: { token },
    userinfo,
  } = useSelector((state) => state.indexData);

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

  useEffect(() => {
    initMqtt();
  }, [dispatch]);
  useEffect(() => {
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
  }, [dispatch, userinfo, token]);

  useEffect(() => {
    let sendHeartbeatTimerId = null as any;
    const onWatchTokenToSendHeartbeat = () => {
      if (sendHeartbeatTimerId || flag) return;
      flag = true;
      sendHeartbeatTimerId = setInterval(() => {
        $fetch.post('/lottery-login-api/user/sendHeartbeat');
      }, 1000 * 60);
    };
    onWatchTokenToSendHeartbeat();
    if (sendHeartbeatTimerId) clearInterval(sendHeartbeatTimerId);
  }, [dispatch, userinfo.token, userinfo.vipLevel]);

  return (
    <div style={{ height: '100%' }}>
      {/* 主路由 */}
      <RouteIndex />
    </div>
  );
};

export default App;
