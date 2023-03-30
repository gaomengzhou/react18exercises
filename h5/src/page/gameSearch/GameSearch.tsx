import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import fav from '@/page/gamesLobby/components/home/images/collect.2821663e.png';
import favIcon from '@/page/gamesLobby/components/home/images/collect_default1.33e46374.png';
import seaIcon from '@/page/gamesLobby/components/home/images/icon-sousuo.png';
import delIcon from '@/page/gamesLobby/components/home/images/icon-删除.png';
import empty from '@/assets/images/homePage/icon_empty~iphone@2x.png';

import { useAppDispatch } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './GameSearch.module.scss';
import Header from '@/components/header/Header';
import { GameCell } from '../gamesLobby/components/home/Home';
import { isLogin } from '@/utils/tools/method';
// import { toast } from '@/utils/tools/toast';

const GameSearch: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { code } = useParams();
  const [gameCellss, setGameCellss] = useState<GameCell[]>([]);
  const [gameNames, setGameNames] = useState(
    JSON.parse(localStorage.getItem('gameNames') || '[]')
  );
  const [gameName, setGameName] = useState('');
  const [igameName, setIgameName] = useState('');
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
    const newA = [...gameCellss];
    newA[i].isFavorite = newA[i].isFavorite ? 0 : 1;
    setGameCellss(newA);
    if (!res.success) return Toast.show(res.message);
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
  const getGames = async (name: string) => {
    const res = await $fetch.post(
      '/config-api/platformThirdSubGameConfig/pageQueryPlatformThirdSubGameConfig',
      {
        gameName: name,
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
  const handleInput = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);

    // if (prop === 'code') {
    //   if (Number.isNaN(+event.target.value)) {
    //     event.target.value = event.target.value.replace(/[^\d]/g, '');
    //   }
    //   setValues({ ...values, [prop]: event.target.value });
    // }
  };
  useEffect(() => {
    if (!igameName) return;
    getGames(igameName);
    // eslint-disable-next-line
  }, [igameName]);

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
    <div className={styles['gameSearch-container']}>
      <Header title='游戏搜索' left />
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.right}>
            <img src={seaIcon} alt='搜索' />
            <input
              value={gameName}
              onChange={handleInput()}
              type='text'
              placeholder='请输入您要查找的游戏名称'
            />
            <div
              onClick={() => {
                /* 1. Navigate to the Details route with params */
                setIgameName(gameName);
                if (gameName) {
                  const newarr = gameNames;
                  if (gameNames.includes(gameName)) return;
                  newarr.push(gameName);
                  setGameNames(newarr);
                  localStorage.setItem('gameNames', JSON.stringify(newarr));
                }

                // localStorage.setItem(gameNames.push(gameNames));
              }}
            >
              搜索
            </div>
          </div>
        </div>
        <div className={styles.bot}>
          {igameName ? (
            <ul className={styles.gameBox}>
              {gameCellss.length ? (
                gameCellss.map((itemGame, i) => {
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
                <img src={empty} alt='无数据' />
              )}
            </ul>
          ) : (
            <div>
              <div className={styles.subTop}>
                <span>历史记录</span>
                <img
                  onClick={() => {
                    /* 1. Navigate to the Details route with params */
                    setGameNames([]);
                    localStorage.setItem('gameNames', '[]');
                  }}
                  src={delIcon}
                  alt='删除'
                />
              </div>
              <div className={styles.subBot}>
                {gameNames.map((item: string) => {
                  return (
                    <div
                      onClick={() => {
                        /* 1. Navigate to the Details route with params */
                        setIgameName(item);
                        setGameName(item);
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GameSearch;
