import { Dispatch, FC, SetStateAction } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination } from 'swiper';
import styles from './PaymentSwiper.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { ObjType } from '@/types/Common';

interface PaymentSwiperPros {
  dataSource: ObjType[];
  onClick: (data: ObjType) => typeof data | void;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}
const PaymentSwiper: FC<PaymentSwiperPros> = ({
  dataSource,
  onClick,
  active,
  setActive,
}) => {
  // 点击图片
  const handleClick = (data: ObjType, index: number) => {
    setActive(index);
    if (index === active) return;
    onClick(data);
  };
  return (
    <div className={styles['swiper-container']}>
      <Swiper
        pagination
        grid={{
          fill: 'row',
          rows: 2,
        }}
        spaceBetween={10}
        slidesPerView={4}
        slidesPerGroup={4}
        onSlideChange={() => console.log('onSlideChange')}
        onSwiper={(swiper) => console.log('paymentSwiper:', swiper)}
        modules={[Grid, Pagination]}
        onTouchStart={() => {
          const scrollMain = document.querySelector(
            '.deposit-scroll-main'
          ) as HTMLDivElement;
          scrollMain.style.overflow = 'hidden';
        }}
        onTouchEnd={() => {
          const scrollMain = document.querySelector(
            '.deposit-scroll-main'
          ) as HTMLDivElement;
          scrollMain.style.overflow = 'scroll';
        }}
      >
        {dataSource.map((item, index) => {
          return (
            <SwiperSlide
              key={item.id}
              className={`${active === index && styles.activeSwiper}`}
            >
              <div
                className={`${styles.payment}`}
                onClick={() => handleClick(item, index)}
              >
                <img src={item.iconUrl} alt='bankCardLogo' />
                <p>{item.categoryName}</p>
                {+item.isRecommend === 1 && <i />}
                <b />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export default PaymentSwiper;
