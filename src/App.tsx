import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import { Dialog, Toast } from 'antd-mobile';
import { useLocation } from 'react-router-dom';
import indexData, {
  changeLanguageAction,
  getGlobalSwitchConfigInfo,
  queryUserAllVirtualWallet,
  getUserVipInfo,
} from '@/redux/index/slice';
import { useAppDispatch, useSelector } from '@/redux/hook';
import MQTTConstant from './utils/mqtt/MQTTConstant';
import RouteIndex from './router';
// import GiftPopup from '@/page/home/components/giftPopup/GiftPopup';
import { qsJson } from './utils/tools/method';
import { changeIsShowPopUpActivityAction } from './redux/wallet';
import ReactLazyLoading from '@/components/reactLazyLoading/ReactLazyLoading';
import FixCustomerService from './components/fixCustomerService/FixCustomerService';
import useWatch from '@/utils/tools/useWatch';

const GiftPopup = lazy(
  () => import('@/page/home/components/giftPopup/GiftPopup')
);
let flag = false;
const App: FC = (): ReactElement => {
  const {
    switchs,
    userinfo: { token },
  } = useSelector((state) => state.indexData);
  const { t } = useTranslation();
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const showCoinQuestionPopup = useSelector(
    (s) => s.indexData.showCoinQuestionPopup
  );
  const location = useLocation();
  // 国际化
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const initLanguage = useCallback(() => {
    dispatch(changeLanguageAction(i18n.language));
  }, [dispatch, i18n.language]);

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
    initLanguage();
    initMqtt();
  }, [initLanguage]);
  useEffect(() => {
    const toConvertMQTTBroadcast = async () => {
      const platformId = $env.REACT_APP_PLATFORM_ID;
      //  const clientType = $env.REACT_APP_CLIENT_TYPE;
      const { userId } = userinfo;

      //  未登录情况订阅 投注消息(全局)
      $mqtt.subscribe(
        `${MQTTConstant.MQTT_BETTING_NEWS}/${platformId}/`,
        (res: any) => {
          dispatch(indexData.actions.setBetListForPCBottomList(res.body.data));
        }
      );
      // 配置推送(全局)
      $mqtt.subscribe(
        `${MQTTConstant.MQTT_EDITCONFIG}/${platformId}/`,
        (res: any) => {
          if (res.body.data.type === 2) {
            dispatch(getGlobalSwitchConfigInfo());
          }
        }
      );

      if (!token) return;
      // 已经登陆 订阅下线主题(个人)
      $mqtt.subscribe(
        `${MQTTConstant.MQTT_OFFLINE}/${platformId}/${token}/`,
        (res: any) => {
          dispatch(
            indexData.actions.setMqttBroadcast({
              key: MQTTConstant.MQTT_OFFLINE,
              res,
            })
          );
          Toast.show({ content: res.body.data.message });
          dispatch(indexData.actions.clearUserinfo());
          localStorage.removeItem('userInfo');
          setTimeout(() => {
            $mqtt.restart();
          }, 30);
        }
      );
      // 订阅通知主题(个人)
      $mqtt.subscribe(
        `${MQTTConstant.MQTT_NOTICE}/${platformId}/${userId}/`,
        async (res: any) => {
          const notice = res.body.data;
          if (+notice.noticeType === 5) {
            dispatch(queryUserAllVirtualWallet());
            await Dialog.alert({
              title: notice.data.title,
              bodyClassName: 'common_alert_body',
              content: `${notice.data.content
                .replace('amount', notice.data.amount)
                .replace('giveAmount', notice.data.giveAmount)}`,
              confirmText: t('activity.sure'),
            });
          }
        }
      );
    };
    toConvertMQTTBroadcast();
  }, [dispatch, t, userinfo, token]);
  useEffect(() => {
    let sendHeartbeatTimerId = null as any;

    const storageUserInfo = JSON.parse(
      localStorage.getItem('userInfo') || '{}'
    );
    const onWatchTokenToSendHeartbeat = () => {
      if (sendHeartbeatTimerId || flag) return;
      flag = true;
      sendHeartbeatTimerId = setInterval(() => {
        $fetch.post('/lottery-login-api/user/sendHeartbeat');
      }, 1000 * 60);
    };
    if (storageUserInfo.token) {
      onWatchTokenToSendHeartbeat();
      dispatch(indexData.actions.setUserinfo(storageUserInfo));
    } else if (sendHeartbeatTimerId) clearInterval(sendHeartbeatTimerId);
  }, [dispatch, userinfo.token]);
  useEffect(() => {
    dispatch(getGlobalSwitchConfigInfo());
    if (qsJson(location.search).path === 'PopUpActivity') {
      dispatch(changeIsShowPopUpActivityAction(true));
    }
  }, [location, dispatch]);
  // 监听vipType类型
  useWatch(
    switchs.vipType,
    () => {
      if (!token) return;
      // 获取用户 Vip 信息
      dispatch(getUserVipInfo());
    },
    { immediate: false }
  );
  return (
    <div>
      {/* 主路由 */}
      <RouteIndex />
      {
        /* Gift全局弹框,因为第三方游戏内也得弹 */
        showCoinQuestionPopup && (
          <Suspense fallback={<ReactLazyLoading />}>
            <GiftPopup />
          </Suspense>
        )
      }
      <FixCustomerService />
    </div>
  );
};

export default App;
