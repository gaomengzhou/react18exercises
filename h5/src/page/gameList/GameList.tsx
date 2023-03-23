import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import checked from '@/page/gamesLobby/components/home/images/Home_category_indicatorImage.png';
import favIcon from '@/page/gamesLobby/components/home/images/collect_default1.33e46374.png';
import seaIcon from '@/page/gamesLobby/components/home/images/icon-sousuo.png';
import empty from '@/assets/images/homePage/icon_empty~iphone@2x.png';
import styles from './GameList.module.scss';
import Header from '@/components/header/Header';
import { GameCell } from '../gamesLobby/components/home/Home';
import indexData from '@/redux/index/slice';
import { useAppDispatch } from '@/redux/hook';
// import { toast } from '@/utils/tools/toast';

const GameList: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, code } = useParams();
  const [gameCells, setGameCells] = useState<GameCell[]>([]);
  const [gameCellss, setGameCellss] = useState<GameCell[]>([]);
  const arrs = [
    {
      thirdGameCode: 'isFav',
      thirdGameName: '收藏',
    },
    {
      thirdGameCode: 'isAll',
      thirdGameName: '全部',
    },
    {
      thirdGameCode: 'isHot',
      thirdGameName: '火热',
    },
  ];
  const [tabsActive, setTabsActive] = useState('isHot');
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
    // 保存首页滚动条位置
    dispatch(indexData.actions.setSaveScrollPosition(true));
    getGames();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (tabsActive === 'isHot') {
      setGameCells(gameCellss.filter((item: GameCell) => item.isHot));
    } else if (tabsActive === 'isFav') {
      setGameCells(gameCellss.filter((item: GameCell) => item.isFavorite));
    } else {
      setGameCells(gameCellss);
    }
    // eslint-disable-next-line
  }, [tabsActive]);
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
              navigate(`/gameSearch/${id}/${code}`);
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
              gameCells.map((itemGame) => {
                return (
                  <li key={itemGame.id}>
                    <img src={itemGame.gameLogoUrl} alt='logo' />
                    <span>{itemGame.gameName}</span>
                    <i className={styles.XyeyB}>
                      <img
                        alt='收藏'
                        src={itemGame.isFavorite ? '' : favIcon}
                      />
                    </i>
                  </li>
                );
              })
            ) : (
              <img src={empty} alt='无数据' />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default GameList;
