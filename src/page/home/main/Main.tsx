import { Skeleton, Swiper, Toast } from 'antd-mobile';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { broseClientType, isLogin } from '@/utils/tools/method';
import indexData, { getUnreadMessageCount } from '@/redux/index/slice';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { ObjType } from '@/types/Common';
import electronicChessAndCards from '@/assets/images/index/icon-标签-电子棋牌@3x.png';
import liveVideo from '@/assets/images/index/icon-标签-真人@3x.png';
import styles from './Main.module.scss';
import GameCategory from '@/page/home/components/gameCategory/GameCategory';
import { toSportGame } from '@/page/home/HomeMethod';
import BettingDetails from '@/page/home/bettingDetails/BettingDetails';
import Footer from '@/page/home/footer/Footer';
import CustomImg from '@/components/customImg/CustomImg';

const Main: FC = () => {
  const {
    auxiliaryCode,
    currentLanguage,
    showWorldCup,
    userinfo: { token },
  } = useSelector((state) => state.indexData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // 第三方游戏
  const [thirdGame, setThirdGame] = useState<{
    liveGame: ObjType[];
    sportGame: ObjType[];
    eGame: ObjType[];
  }>({
    liveGame: [],
    sportGame: [],
    eGame: [],
  });
  // 首页信息
  const [homeInfo, setHomeInfo] = useState<ObjType>({
    bannerList: [],
  });
  // 首页的两个广告
  const [homeAd, setHomeAd] = useState<ObjType[]>([]);
  const dispatch = useAppDispatch();
  // 首页信息轮播图等
  const getHomePageInfo = async () => {
    const res = await $fetch.post('/config-api/homePage/queryHomePageInfo/v2');
    if (!res.success) return Toast.show(res.success);
    setHomeInfo(res.data);
  };
  // 第三方游戏
  const queryThirdGameCategory = async () => {
    const res = await $fetch.post(
      '/config-api/platformThirdSubGameConfig/pageQueryPlatformThirdSubGameConfig',
      {
        pageNo: 1,
        pageSize: 2000,
        thirdGameIdList: [],
        platformId: $env.REACT_APP_PLATFORM_ID,
      }
    );
    if (!res.success) return Toast.show(res.message);
    const obj: {
      liveGame: ObjType[];
      sportGame: ObjType[];
      eGame: ObjType[];
    } = {
      liveGame: [],
      sportGame: [],
      eGame: [],
    };
    if (!res.data.records) return;
    res.data.records.forEach((item: ObjType) => {
      // thirdGameTypeId: 2:真人|4:电子
      if (item.thirdGameTypeId === 2) {
        obj.liveGame.push(item);
      }
      if (item.thirdGameTypeId === 4) {
        obj.eGame.push(item);
      }
    });
    setThirdGame(obj);
  };
  // 首页广告
  const getAdvertisingByPage = async () => {
    const res = await $fetch.post(
      '/config-api/advertising/getAdvertisingByPage',
      {
        advertisingPage: 6,
      }
    );
    if (!res.success) return Toast.show(res.message);
    setHomeAd(res.data);
  };
  // 所有配置信息

  const getPlatformConfigInfo = async () => {
    const res = await $fetch.post('/config-api/platform/getPlatformConfigInfo');
    if (!res.success) return Toast.show(res.message);
    dispatch(indexData.actions.setPlatformConfig(res.data));
    // setHomeAd(res.data);
  };

  // 所有开关信息
  const getUserDetail = async () => {
    if (!token) return;
    const detailRes = await $fetch.post('/lottery-api/user/getUserDetail', {
      auxiliaryCode,
      appVersion: $env.REACT_APP_API_VERSION,
      deviceCode: 'H5',
    });
    if (detailRes.code === 1) {
      dispatch(indexData.actions.setUserinfo(detailRes.data));
    }
  };

  // componentDidMount
  useEffect(() => {
    if (isLogin()) dispatch(getUnreadMessageCount());
    Promise.all([
      getHomePageInfo(),
      queryThirdGameCategory(),
      getAdvertisingByPage(),
      getPlatformConfigInfo(),
      getUserDetail(),
    ]).finally(() => {
      setLoading(false);
    });
    // dispatch(getGlobalSwitchConfigInfo());
    const div = document.documentElement || document.body;
    div.scrollTop = 0;
    // 到首页设置首页图标高亮
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(1));

    // 只做初始化使用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);
  const { t } = useTranslation();
  // 轮播图类型|0:活动|1:公告|2:不跳转|3:连接
  const handleClick = (data: ObjType, type: string) => {
    console.log('data.routingUrl', data.routingUrl);
    if (data.activityShowType === 2) {
      return navigate(data.routingUrl);
      // return window.location.replace(data.routingUrl);
    }
    switch (+data.type) {
      case 0:
        navigate(`/activity/details/${data.targetId}`);
        break;
      case 1:
        return;
      // if (!isLogin()) {
      //   return dispatch(indexData.actions.setLoginShow(1));
      // }
      case 2:
        return;
      default:
        if (type === '3') {
          window.open(data.h5Url);
        } else {
          window.open(data.pcUrl);
        }
    }
  };

  // 广告类型|0:活动|1:公告|2:链接|3:不跳转
  const handlePickAd = (data: ObjType) => {
    switch (+data.advertisingType) {
      case 0:
        navigate(`/activity/details/${data.redirectId}`);
        break;
      case 1:
        return;
      case 2:
        window.open(data.redirectUrl);
        break;
      default:
        return false;
    }
  };
  const items = homeInfo.bannerList.map((item: ObjType) => (
    <Swiper.Item
      key={item.id}
      onClick={() => handleClick(item, broseClientType())}
    >
      <div
        className={styles.content}
        style={{
          backgroundImage: `url("${
            broseClientType() === '3' ? item.h5ImageUrl : item.pcImageUrl
          }")`,
          backgroundSize: '100% 100%',
        }}
      />
    </Swiper.Item>
  ));

  const balls = [
    {
      name: t('main.soccer'),
      id: 1,
      img: require('@/assets/images/index/icon-金刚-足球-未选中-2@3x.png'),
    },
    {
      name: t('main.basketball'),
      id: 2,
      img: require('@/assets/images/index/icon-金刚-篮球-未选中@3x.png'),
    },
    {
      name: t('main.tennis'),
      id: 3,
      img: require('@/assets/images/index/icon-金刚-网球-未选中@3x.png'),
    },
    {
      name: t('main.eSports'),
      id: 4,
      img: require('@/assets/images/index/icon-金刚-电子体育-未选中@3x.png'),
    },
    {
      name: t('main.badminton'),
      id: 5,
      img: require('@/assets/images/index/icon-金刚-羽毛球-未选中@3x.png'),
    },
    {
      name: t('main.rugby'),
      id: 6,
      img: require('@/assets/images/index/icon-金刚-橄榄球-未选中@3x.png'),
    },
    {
      name: t('main.pingpong'),
      id: 7,
      img: require('@/assets/images/index/icon-金刚-乒乓球-未选中@3x.png'),
    },
    {
      name: t('main.volleyball'),
      id: 8,
      img: require('@/assets/images/index/icon-金刚-排球-未选中@3x.png'),
    },
    {
      name: t('main.snooker'),
      id: 9,
      img: require('@/assets/images/index/icon-金刚-斯诺克-未选中@3x.png'),
    },
    {
      name: t('main.More'),
      id: 10,
      img: require('@/assets/images/index/icon-金刚-更多-未选中@3x.png'),
    },
  ] as const;

  return (
    <div
      className={`${styles.main} ${showWorldCup && styles['world-cup-height']}`}
    >
      <div className={styles.home_top}>
        <div className={styles.top_entry}>
          {loading ? (
            <Skeleton animated className={styles.customSkeleton} />
          ) : (
            <Swiper
              className={styles.swiper_wrapper}
              style={{ borderRadius: '1rem' }}
              autoplay
              loop
            >
              {items}
            </Swiper>
          )}

          {loading ? (
            <div className={styles.loadingAd}>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
            </div>
          ) : (
            <div className={styles.ad}>
              {homeAd.map((item: any) => (
                <div key={item.id} onClick={() => handlePickAd(item)}>
                  <CustomImg src={item.imageUrl} lazy waitingForLoading />
                </div>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <div className={styles.loadingTabs}>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={5} animated />
          </div>
        ) : (
          <div className={styles.tabsBox}>
            <div className={styles.tabs}>
              <div className={styles.div0}>
                {balls.map((item) => {
                  return (
                    <div
                      className={styles.div1}
                      key={item.id}
                      onClick={() => toSportGame(navigate)}
                    >
                      <div className={styles.background}>
                        <div
                          className={`${styles.img} ${
                            styles[`img_${item.id}`]
                          }`}
                          style={{ backgroundImage: `url('${item.img}')` }}
                        />
                      </div>
                      <p>{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* 真人 thirdGameTypeId = 2 */}
        <GameCategory
          title={t('main.live')}
          more={t('main.More')}
          src={liveVideo}
          dataSource={thirdGame.liveGame}
          loading={loading}
          thirdGameTypeId={2}
        />
        {/* 电子 thirdGameTypeId = 4 */}
        <GameCategory
          title={t('main.Slots')}
          more={t('main.More')}
          src={electronicChessAndCards}
          dataSource={thirdGame.eGame}
          loading={loading}
          thirdGameTypeId={4}
        />
        <BettingDetails title={t('main.BetDetails')} src={liveVideo} />
        <Footer />
      </div>
    </div>
  );
};
export default Main;
