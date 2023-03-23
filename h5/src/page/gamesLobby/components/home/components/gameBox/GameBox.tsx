import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper';
import { useNavigate } from 'react-router-dom';
import styles from './GameBox.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import qipai from '../../images/home_platformIcon_5.png';

// import PrePicA from '../../images/pre-a.png';
// import NextPic from '../../images/next.png';
// import NextPicA from '../../images/next-a.png';
import { GammeItem } from '../../Home';
import { useAppDispatch } from '@/redux/hook';

interface GameProps {
  keys: number;
  game: GammeItem;
}

const GameBox: FC<GameProps> = ({ keys, game }) => {
  const navigate = useNavigate();
  useAppDispatch();
  return (
    <div className={styles['swiper-container']}>
      <div className={styles['game-swiper-top']}>
        <div className={styles['game-swiper-top-title']}>
          <img src={qipai} alt='棋牌Icon' />
          <span>{game.categoryName}</span>
        </div>
        <div className={styles['game-swiper-controls']}>
          <button className={`button-round-left${keys}`}>
            <span>左</span>
          </button>
          <button className={`button-round-right${keys}`}>
            <span>右</span>
          </button>
        </div>
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
        onSwiper={(swiper) => console.log('paymentSwiper:', swiper)}
        modules={[Grid, Navigation]}
      >
        {game.thirdPlatformList.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <img
                onClick={() => {
                  /* 1. Navigate to the Details route with params */
                  navigate(
                    `/gameList/${item.thirdGameTypeId}/${item.thirdGameCode}`,
                    { state: item.thirdGameName }
                  );
                }}
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
