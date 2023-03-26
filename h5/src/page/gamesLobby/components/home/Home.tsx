import { FC, useEffect, useState } from 'react';
import { JumboTabs, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import Header from '@/page/gamesLobby/components/home/components/header/Header';
import Banner from '@/page/gamesLobby/components/home/components/bannerSwiper/BannerSwiper';
import GameBox from '@/page/gamesLobby/components/home/components/gameBox/GameBox';
import checked from './images/Home_category_indicatorImage.png';
import { useAppDispatch } from '@/redux/hook';
import hot from './images/hot.7761255e.png';
import empty from '@/assets/images/homePage/icon_empty~iphone@2x.png';
import favIcon from './images/collect_default1.33e46374.png';
import fav from './images/collect.2821663e.png';
import { isLogin } from '@/utils/tools/method';
import indexData from '@/redux/index/slice';
// import caipiaoS from './images/homeCategoryView_cp_s.png';
// import caipiao from './images/homeCategoryView_cp.png';
interface Cell {
  id?: number;
  isEnabled?: number;
  isHot?: number;
  sortOrder?: number;
  thirdGameCode: string;
  thirdGameLogoUrl: string;
  thirdGameName: string;
  thirdGameTypeId?: number;
}

export interface GameCell {
  gameCode: string;
  gameId: number;
  gameLogoUrl: string;
  gameName: string;
  gamePcLogoUrl: string;
  id: number;
  isFavorite: number;
  isHot: number;
  isRecommend: number;
  sortOrder: number;
  thirdGameCode: string;
  thirdGameName: string;
  thirdGameTypeId: number;
}
export interface GammeItem {
  id: number;
  categoryName: string;
  logoUrl?: string;
  shortcutEntryName?: string;
  thirdPlatformList: Cell[];
  thirdGameTypeId: number;
}
export interface BannerItem {
  h5ImageUrl: string;
}
const Home: FC = () => {
  /** 获取首页 */
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [arr, setArr] = useState<GammeItem[]>([]);
  const [arrs, setArrs] = useState<GammeItem[]>([]);
  const [tabs, setTabs] = useState<Cell[]>([]);
  const [gameCells, setGameCells] = useState<GameCell[]>([]);
  const [active, setActive] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // const tabs = [
  //   { id: 1, name: '捕鱼', defaultPic: buyu, selectPic: buyuS },
  //   { id: 2, name: '彩票', defaultPic: caipiao, selectPic: caipiaoS },
  //   { id: 3, name: '彩票', defaultPic: caipiao, selectPic: caipiaoS },
  //   { id: 4, name: '彩票', defaultPic: caipiao, selectPic: caipiaoS },
  //   { id: 5, name: '彩票', defaultPic: caipiao, selectPic: caipiaoS },
  //   { id: 6, name: '彩票', defaultPic: caipiao, selectPic: caipiaoS },
  //   { id: 7, name: '彩票', defaultPic: caipiao, selectPic: caipiaoS },
  //   // { id: 3, name: '老虎机' },
  //   // { id: 4, name: '捕鱼' },
  //   // { id: 5, name: '视讯' },
  // ];
  const [tabsActive, setTabsActive] = useState(-999);
  const [thirdGameTypeId, setThirdGameTypeId] = useState(-999);

  const [bannerArr, setBannerArr] = useState<BannerItem[]>([]);
  const getHomePage = async () => {
    const res = await $fetch.post('/config-api/homePage/queryHomePageInfo', {
      t: Date.now,
    });
    if (!res.success) return;
    setArrs(res.data.shortcutEntryList);
    setLogoUrl(res.data.platformLogoUrl);
    setTabsActive(res.data.shortcutEntryList[0].id);
    setThirdGameTypeId(res.data.shortcutEntryList[0].thirdGameTypeId);
    setBannerArr(res.data.bannerList);
    console.log(res.data);
  };
  const getFun = async (id: number | null) => {
    if (id === -999) return;
    const res = await $fetch.post(
      '/config-api/lotteryHall/queryThirdGameCategory',
      {
        thirdGameTypeId: id || null,
      }
    );
    if (!res.success) return;
    if (id) {
      const hotAndFav = [
        {
          thirdGameCode: 'isFav',
          thirdGameLogoUrl: fav,
          thirdGameName: '收藏',
        },
        {
          thirdGameCode: 'isHot',
          thirdGameLogoUrl: hot,
          thirdGameName: '火热',
        },
      ];
      setTabs(hotAndFav.concat(res.data[0].thirdPlatformList));
      setActive('isHot');
    } else {
      setArr(res.data);
    }
  };
  const getGames = async (id: string) => {
    if (!id) return;
    let params;
    if (id === 'isHot') {
      params = {
        isHot: 1,
        thirdGameTypeId: thirdGameTypeId + 0,
        platformId: $env.REACT_APP_PLATFORM_ID,
        pageNo: 1,
        pageSize: 999,
      };
    } else if (id === 'isFav') {
      params = {
        isCollected: 1,
        thirdGameTypeId: thirdGameTypeId + 0,
        platformId: $env.REACT_APP_PLATFORM_ID,
        pageNo: 1,
        pageSize: 999,
      };
    } else {
      params = {
        thirdGameCode: id,
        platformId: $env.REACT_APP_PLATFORM_ID,
        pageNo: 1,
        pageSize: 999,
      };
    }
    const res = await $fetch.post(
      '/config-api/platformThirdSubGameConfig/pageQueryPlatformThirdSubGameConfig',
      // {
      //   thirdGameCode: id === 'isHot' || id === 'isFav' ? '' : id,
      //   thirdGameTypeId:
      //     id === 'isHot' || id === 'isFav' ? thirdGameTypeId : '',
      //   platformId: $env.REACT_APP_PLATFORM_ID,
      //   pageNo: 1,
      //   pageSize: 999,
      // }
      params
    );
    if (!res.success) return;
    if (id) {
      setGameCells(res.data.records || []);
      // if (id === 'isHot') {
      //   setGameCells(res.data.records.filter((item: GameCell) => item.isHot));
      // } else if (id === 'isFav') {
      //   setGameCells(
      //     res.data.records.filter((item: GameCell) => item.isFavorite)
      //   );
      // } else {
      //   setGameCells(res.data.records);
      // }
    } else {
      // setArr(res.data);
    }
  };
  // 兼容safari在异步里使用window.open()的写法
  const openWin = async (objs: GameCell) => {
    let win: any;
    if (objs.thirdGameCode === 'BBINZR') {
      win = window.open('waiting', '_blank');
    }
    const res = await $fetch.post(
      '/lottery-thirdgame-api/thirdGame/loginGame',
      {
        thirdGameCode: objs.thirdGameCode,
        gameCode:
          objs.thirdGameCode === 'BBINZR' || objs.thirdGameCode === 'AG'
            ? objs.gameCode
            : '',
      }
    );
    if (!res.success) return Toast.show(res.message);
    if (objs.thirdGameCode === 'BBINZR') {
      win.location = res.data.thirdGameLoginUrl;
    } else {
      window.sessionStorage.setItem('thirdSrc', res.data.thirdGameLoginUrl);
      navigate(`/externalGame?noSport`, { state: { data: [] } });
    }
    // 跳转真人游戏后改变侧边栏的高亮
  };

  const addFav = async (isFav: number, id: number, i: number) => {
    if (!isLogin()) {
      Toast.show('登录以后再收藏');
      return;
    }
    const url = !isFav
      ? 'lottery-api/thirdSubGameFavorite/addThirdSubGameFavorite'
      : 'lottery-api/thirdSubGameFavorite/removeThirdSubGameFavorite';
    const res = await $fetch.post(url, {
      id,
    });
    if (!res.success) return Toast.show(res.message);
    const newA = [...gameCells];
    newA[i].isFavorite = newA[i].isFavorite ? 0 : 1;
    setGameCells(newA);
    if (isFav) {
      Toast.show('取消收藏成功');
    } else {
      Toast.show('收藏成功');
    }
  };

  const toGame = async (obj: GameCell) => {
    if (!isLogin()) {
      dispatch(indexData.actions.setNotLoggedIn(1));
      return;
    }
    // thirdGameTypeId=4 电子游戏
    if (obj.thirdGameTypeId !== 2) {
      const res = await $fetch.post(
        'lottery-thirdgame-api/thirdGame/loginGame',
        {
          gameCode: obj.gameCode,
          thirdGameCode: obj.thirdGameCode,
        }
      );
      if (!res.success) return Toast.show(res.message);
      // 跳转电子游戏后改变侧边栏的高亮
      window.sessionStorage.setItem('thirdSrc', res.data.thirdGameLoginUrl);
      navigate(`/externalGame?noSport`, { state: { data: [] } });
    }
    // thirdGameTypeId=2 真人游戏
    if (obj.thirdGameTypeId === 2) {
      // 兼容safari在异步里使用window.open()的写法
      await openWin(obj);
    }
    if (obj.thirdGameCode !== 'BBINZR') {
      dispatch(indexData.actions.setGameStatus(true));
    }
  };
  useEffect(() => {
    getHomePage();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    console.log(active);
    getGames(active);
    // eslint-disable-next-line
  }, [active]);
  useEffect(() => {
    setActive('');
    getFun(thirdGameTypeId);
    // eslint-disable-next-line
  }, [thirdGameTypeId]);
  return (
    <div className={styles['home-container']}>
      <div className={styles['home-containert']}>
        <div className={styles.bgBlack}>
          <Header logo={logoUrl} />
          <div className={styles.headerNavBox}>
            <div className={styles.headerNav}>
              {arrs.map((item) => (
                <div className={styles.headerNavItem} key={item.id}>
                  <button
                    className={`${
                      tabsActive === item.id && styles['active-button']
                    }`}
                    onClick={() => {
                      setTabsActive(item.id);
                      setThirdGameTypeId(item.thirdGameTypeId);
                    }}
                  >
                    <img
                      style={{ opacity: tabsActive === item.id ? 1 : 0.65 }}
                      src={item.logoUrl}
                      alt=''
                    />
                    <span>{item.shortcutEntryName}</span>

                    <img
                      style={{
                        width: '0.9rem',
                        visibility:
                          tabsActive === item.id ? 'visible' : 'hidden',
                      }}
                      src={checked}
                      alt='checked'
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tabsActive === arrs[0]?.id && (
        <div className={styles.contents}>
          <div className={styles.contentsc}>
            {/* <div className={styles.bgBlack}></div> */}
            {bannerArr.length > 0 && <Banner banner={bannerArr} />}
            {arr.map((item, index) => {
              return <GameBox keys={index} key={index} game={item} />;
            })}
          </div>
        </div>
      )}
      {tabsActive !== arrs[0]?.id && (
        <div className={styles.contents}>
          <div className={styles.contentsc}>
            {/* <div className={styles.bgBlack}></div> */}
            <div className={styles.content}>
              <JumboTabs
                defaultActiveKey={active || 'isHot'}
                activeKey={active}
                onChange={(key) => {
                  console.log(key);
                  setActive(key);
                }}
              >
                {tabs.map((item) => {
                  const description = (
                    <div className='navb'>
                      <img src={item.thirdGameLogoUrl} alt='logo' />
                      <span>{item.thirdGameName}</span>
                    </div>
                  );
                  return (
                    <JumboTabs.Tab
                      title=''
                      description={description}
                      key={item.thirdGameCode}
                    >
                      <ul className={styles.gameBox}>
                        {gameCells.length ? (
                          gameCells.map((itemGame, i) => {
                            return (
                              <li
                                onClick={() => {
                                  toGame(itemGame);
                                }}
                              >
                                <img src={itemGame.gameLogoUrl} alt='logo' />
                                <span>{itemGame.gameName}</span>
                                <i
                                  className={styles.XyeyB}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addFav(
                                      itemGame.isFavorite,
                                      itemGame.gameId,
                                      i
                                    );
                                  }}
                                >
                                  <img
                                    alt='收藏'
                                    src={itemGame.isFavorite ? fav : favIcon}
                                  />
                                </i>
                              </li>
                            );
                          })
                        ) : (
                          <div className={styles.empty}>
                            <img src={empty} alt='无数据' />
                          </div>
                        )}
                      </ul>
                    </JumboTabs.Tab>
                  );
                })}
              </JumboTabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
