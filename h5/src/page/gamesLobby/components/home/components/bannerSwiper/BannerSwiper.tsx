import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import styles from './BannerSwiper.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { BannerItem } from '../../Home';

interface BannerProps {
  banner: BannerItem[];
}
const BannerSwiper: FC<BannerProps> = ({ banner }) => {
  return (
    <div className={styles['swiper-container']}>
      <Swiper
        pagination
        onSlideChange={() => console.log('onSlideChange')}
        modules={[Pagination]}
      >
        {banner.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={item.h5ImageUrl} alt='CardLogo' />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export default BannerSwiper;
