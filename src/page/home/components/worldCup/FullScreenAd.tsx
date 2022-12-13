import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hook';
import styles from './FullScreenAd.module.scss';
import { WorldCupAdProps } from '../../header/Header';
import leftTopBall from '../../images/worldCupImg/倒计时-img-球5.png';
import leftMBall from '../../images/worldCupImg/倒计时-img-球4.png';
import leftBottomBall from '../../images/worldCupImg/倒计时-img-球1.png';
import rightTopBall from '../../images/worldCupImg/倒计时-img-球6.png';
import rightMBall from '../../images/worldCupImg/倒计时-img-球3.png';
import rightBottomBall from '../../images/worldCupImg/倒计时-img-球2.png';
import indexData, { worldCupAd } from '../../../../redux/index/slice';
import CustomImg from '@/components/customImg/CustomImg';
/* eslint-disable @typescript-eslint/ban-ts-comment */

const FullScreenAd: FC<{ time: WorldCupAdProps }> = ({ time }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(10);
  const closeAll = (): void => {
    // 全屏广告关闭开关|0-关闭
    dispatch(worldCupAd(0));
  };
  useEffect(() => {
    const countdown = setInterval(() => {
      setCount((number) => number - 1);
    }, 1000);
    if (count <= 5) {
      dispatch(indexData.actions.setShowFullScreenAd(false));
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [count, dispatch]);
  return (
    <div className={styles.full}>
      <div className={styles.ballBox}>
        <div className={`${styles.ball} ${styles.leftT}`}>
          <CustomImg src={leftTopBall} alt='foot ball' />
        </div>
        <div className={`${styles.ball} ${styles.rightT}`}>
          <CustomImg src={rightTopBall} alt='foot ball' />
        </div>
        <div className={`${styles.ball} ${styles.leftM}`}>
          <CustomImg src={leftMBall} alt='foot ball' />
        </div>
        <div className={`${styles.ball} ${styles.rightM}`}>
          <CustomImg src={rightMBall} alt='foot ball' />
        </div>
        <div className={`${styles.ball} ${styles.leftB}`}>
          <CustomImg src={leftBottomBall} alt='foot ball' />
        </div>
        <div className={`${styles.ball} ${styles.rightB}`}>
          <CustomImg src={rightBottomBall} alt='foot ball' />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.title}>
          <p>{t('worldCup.title')}</p>
          <i />
        </div>
        <div className={styles.timesBox}>
          <div className={styles.items}>
            <div className={styles.number}>
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.day[0]}`]}`} />
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.day[1]}`]}`} />
            </div>
            <p>{t('worldCup.d')}</p>
          </div>
          <span className={styles.colon} />
          <div className={styles.items}>
            <div className={styles.number}>
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.hour[0]}`]}`} />
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.hour[1]}`]}`} />
            </div>
            <p>{t('worldCup.h')}</p>
          </div>
          <span className={styles.colon} />
          <div className={styles.items}>
            <div className={styles.number}>
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.min[0]}`]}`} />
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.min[1]}`]}`} />
            </div>
            <p>{t('worldCup.m')}</p>
          </div>
          <span className={styles.colon} />
          <div className={styles.items}>
            <div className={styles.number}>
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.s[0]}`]}`} />
              {/* @ts-ignore */}
              <b className={`${styles[`num${time.s[1]}`]}`} />
            </div>
            <p>{t('worldCup.s')}</p>
          </div>
        </div>
      </div>
      <div className={styles.close}>
        <p>{t('worldCup.auto', { sec: count })}</p>
        <i onClick={closeAll} />
      </div>
    </div>
  );
};
export default FullScreenAd;
