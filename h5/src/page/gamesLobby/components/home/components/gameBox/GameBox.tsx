import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import styles from './GameBox.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
// import qipai from '../../images/home_platformIcon_5.png';
import { Cell, GammeItem } from '../../Home';
import { useAppDispatch } from '@/redux/hook';
import { isLogin } from '@/utils/tools/method';
import indexData from '@/redux/index/slice';
import { toast } from '@/utils/tools/toast';

interface GameProps {
  keys: number;
  game: GammeItem;
}

const GameBox: FC<GameProps> = ({ keys, game }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useAppDispatch();
  // 兼容safari在异步里使用window.open()的写法
  const openWin = async (objs: Cell) => {
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
      navigate(`/externalGame?noSport`, { state: objs.thirdGameName });
    }
    // 跳转真人游戏后改变侧边栏的高亮
  };

  const toGame = async (obj: Cell) => {
    if (!isLogin()) {
      dispatch(indexData.actions.setNotLoggedIn(1));
      return;
    }
    // thirdGameTypeId=4 电子游戏
    if (obj.thirdGameTypeId !== 2) {
      toast.loading({ mask: false });
      const res = await $fetch.post(
        'lottery-thirdgame-api/thirdGame/loginGame',
        {
          gameCode: obj.gameCode,
          thirdGameCode: obj.thirdGameCode,
        }
      );
      toast.clear();
      if (!res.success) return Toast.show(res.message);
      // 跳转电子游戏后改变侧边栏的高亮
      window.sessionStorage.setItem('thirdSrc', res.data.thirdGameLoginUrl);
      navigate(`/externalGame?noSport`, { state: obj.thirdGameName });
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

  const handleTouchStart = () => {
    dispatch(indexData.actions.setSaveScrollPosition(true));
  };

  const handleTouchMove = (e: any) => {
    e.stopPropagation();
  };
  return (
    <div className={styles['swiper-container']}>
      <div className={styles['game-swiper-top']}>
        <div className={styles['game-swiper-top-title']}>
          {game.categoryName === '电子游戏' ? (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe688;
            </span>
          ) : game.categoryName === '捕鱼游戏' ? (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe68b;
            </span>
          ) : game.categoryName === '视讯游戏' ? (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe68c;
            </span>
          ) : game.categoryName === '棋牌游戏' ? (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe68a;
            </span>
          ) : game.categoryName === '体育游戏' ? (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe68e;
            </span>
          ) : game.categoryName === '电竞游戏' ? (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe68d;
            </span>
          ) : (
            <span
              style={{
                fontSize: '1.6rem',
              }}
              className='icon iconfont'
            >
              &#xe665;
            </span>
          )}
          <span>{game.categoryName}</span>
        </div>
        {game.thirdPlatformList.length > 6 ? (
          <div className={styles['game-swiper-controls']}>
            <button className={`button-round-left${keys}`}>
              <span>左</span>
            </button>
            <button className={`button-round-right${keys}`}>
              <span>右</span>
            </button>
          </div>
        ) : (
          ''
        )}
      </div>

      <Swiper
        key={keys}
        grid={{
          fill: 'row',
          rows: 2,
        }}
        spaceBetween={14}
        navigation={{
          nextEl: `.button-round-right${keys}`,
          prevEl: `.button-round-left${keys}`,
          disabledClass: 'disable',
        }}
        slidesPerView={3}
        slidesPerGroup={3}
        onSlideChange={() => console.log('onSlideChange')}
        modules={[Grid, Navigation]}
      >
        {game.thirdPlatformList.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <img
                onClick={() => {
                  /* 1. Navigate to the Details route with params */
                  if (
                    game.categoryName === '视讯游戏' ||
                    game.categoryName === '电竞游戏' ||
                    game.categoryName === '体育游戏'
                  ) {
                    toGame(item);
                  } else {
                    navigate(
                      `/gameList/${item.thirdGameTypeId}/${item.thirdGameCode}`,
                      { state: item.thirdGameName }
                    );
                  }
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                src={item.thirdGameLogoUrl}
                alt='CardLogo'
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export default GameBox;
