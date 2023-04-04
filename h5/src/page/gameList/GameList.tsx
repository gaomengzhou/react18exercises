import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import checked from '@/page/gamesLobby/components/home/images/Home_category_indicatorImage.png';
import favIcon from '@/page/gamesLobby/components/home/images/collect_default1.33e46374.png';
import fav from '@/page/gamesLobby/components/home/images/collect821663e.png';
import defPic from '@/page/gamesLobby/components/home/images/icon-默认@x3.png';
import seaIcon from '@/page/gamesLobby/components/home/images/icon-sousuo.png';
import empty from '@/assets/images/homePage/icon_empty~iphone@2x.png';
import styles from './GameList.module.scss';
import Header from '@/components/header/Header';
import { GameCell } from '../gamesLobby/components/home/Home';
import { useAppDispatch } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import { isLogin } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';
// import { toast } from '@/utils/tools/toast';

const GameList: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();
  const [gameCells, setGameCells] = useState<GameCell[]>([]);
  const [gameCellss, setGameCellss] = useState<GameCell[]>([]);
  const arrs = [
    {
      thirdGameCode: 'isHot',
      thirdGameName: '热门',
    },
    {
      thirdGameCode: 'isAll',
      thirdGameName: '全部',
    },
    {
      thirdGameCode: 'isFav',
      thirdGameName: '收藏',
    },
  ];
  const [tabsActive, setTabsActive] = useState('isHot');
  const openWin = async (objs: GameCell) => {
    let win: any;
    if (objs.thirdGameCode === 'BBINZR') {
      win = window.open('waiting', '_blank');
    }
    toast.loading({ mask: false });
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
    toast.clear();
    if (!res.success) return Toast.show(res.message);
    if (objs.thirdGameCode === 'BBINZR') {
      win.location = res.data.thirdGameLoginUrl;
    } else {
      window.sessionStorage.setItem('thirdSrc', res.data.thirdGameLoginUrl);
      navigate(`/externalGame?noSport`, { state: objs.gameName });
    }
    // 跳转真人游戏后改变侧边栏的高亮
  };
  const toGame = async (obj: GameCell) => {
    if (!isLogin()) {
      dispatch(indexData.actions.setNotLoggedIn(1));
      return;
    }
    // thirdGameTypeId=4 电子游戏
    if (obj.thirdGameTypeId !== 2) {
      toast.loading({ mask: false });
      const res = await $fetch.post(
        '/lottery-thirdgame-api/thirdGame/loginGame',
        {
          gameCode: obj.gameCode,
          thirdGameCode: obj.thirdGameCode,
        }
      );
      toast.clear();
      if (!res.success) return Toast.show(res.message);
      // 跳转电子游戏后改变侧边栏的高亮
      window.sessionStorage.setItem('thirdSrc', res.data.thirdGameLoginUrl);
      navigate(`/externalGame?noSport`, { state: obj.gameName });
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
  const addFav = async (isFav: number, ids: number, i: number) => {
    if (!isLogin()) {
      Toast.show('登录以后再收藏');
      return;
    }
    const url = !isFav
      ? '/lottery-api/thirdSubGameFavorite/addThirdSubGameFavorite'
      : '/lottery-api/thirdSubGameFavorite/removeThirdSubGameFavorite';
    const res = await $fetch.post(url, {
      id: ids,
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
  const getGames = async () => {
    const res = await $fetch.post(
      '/config-api/platformThirdSubGameConfig/pageQueryPlatformThirdSubGameConfig',
      {
        thirdGameCode: code,
        platformId: $env.REACT_APP_PLATFORM_ID,
        pageNo: 1,
        pageSize: 999,
      }
    );
    if (!res.success) return;
    setGameCellss(res.data.records);

    // if (id === 'isHot') {
    //   setGameCells(res.data.records.filter((item: GameCell) => item.isHot));
    // } else if (id === 'isFav') {
    //   setGameCells(
    //     res.data.records.filter((item: GameCell) => item.isFavorite)
    //   );
    // } else {
    //   setGameCells(res.data.records);
    // }
  };
  useEffect(() => {
    getGames();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    console.log(tabsActive);
    if (!gameCellss.length) return;
    if (tabsActive === 'isHot') {
      setGameCells(gameCellss.filter((item: GameCell) => item.isHot));
    } else if (tabsActive === 'isFav') {
      setGameCells(gameCellss.filter((item: GameCell) => item.isFavorite));
    } else {
      setGameCells(gameCellss);
    }
    // eslint-disable-next-line
  }, [tabsActive, gameCellss.length]);
  // const { id } = useParams();
  // const getActivityDetail = useCallback(async () => {
  //   const res = await $fetch.post('/config-api/activity/getActivityDetail', {
  //     id,
  //   });
  //   if (!res.success) return toast.fail(res);
  //   setState(res.data);
  // }, [id]);

  // useEffect(() => {
  //   getActivityDetail();
  // }, [getActivityDetail]);
  return (
    <div className={styles['gamelist-container']}>
      <Header title={`${location.state}`} left />
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.left}>
            {arrs.map((item) => (
              <div key={item.thirdGameCode}>
                <button
                  className={`${
                    tabsActive === item.thirdGameCode && styles['active-button']
                  }`}
                  onClick={() => {
                    setTabsActive(item.thirdGameCode);
                    // setThirdGameTypeId(item.thirdGameTypeId);
                  }}
                >
                  <span>{item.thirdGameName}</span>

                  <img
                    style={{
                      width: '0.9rem',
                      visibility:
                        tabsActive === item.thirdGameCode
                          ? 'visible'
                          : 'hidden',
                    }}
                    src={checked}
                    alt='checked'
                  />
                </button>
              </div>
            ))}
          </div>
          <div
            className={styles.right}
            onClick={() => {
              /* 1. Navigate to the Details route with params */
              navigate(`/gameSearch/a/a`);
            }}
          >
            <img src={seaIcon} alt='搜索' />
            <span>输入游戏名</span>
            <div>搜索</div>
          </div>
        </div>
        <div className={styles.bot}>
          <ul className={styles.gameBox}>
            {gameCells.length ? (
              gameCells.map((itemGame, i) => {
                return (
                  <li
                    key={itemGame.id}
                    onClick={() => {
                      toGame(itemGame);
                    }}
                  >
                    <img
                      className={
                        itemGame.gameName.indexOf('真人') === -1 &&
                        itemGame.gameName.indexOf('OB视讯') === -1
                          ? styles.imgf
                          : styles.imgs
                      }
                      src={itemGame.gameLogoUrl || defPic}
                      alt='logo'
                    />
                    {itemGame.gameName.indexOf('真人') === -1 &&
                    itemGame.gameName.indexOf('OB视讯') === -1 ? (
                      <span>{itemGame.gameName}</span>
                    ) : (
                      ''
                    )}
                    <i
                      className={styles.XyeyB}
                      onClick={(e) => {
                        e.stopPropagation();
                        addFav(itemGame.isFavorite, itemGame.gameId, i);
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
        </div>
      </div>
    </div>
  );
};
export default GameList;
