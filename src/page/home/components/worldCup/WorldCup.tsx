import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { worldCupAd } from '@/redux/index/slice';
import styles from './WorldCupImg.module.scss';
import topBall from '../../images/worldCupImg/倒计时-顶部-img-球2.png';
import botBall from '../../images/worldCupImg/倒计时-顶部-img-球1.png';
import pcTopLeftBall from '../../images/worldCupImg/倒计时-img-球4.png';
import pcTopRightBall from '../../images/worldCupImg/倒计时-img-球2.png';
import pcBottomLeftBall from '../../images/worldCupImg/倒计时-img-球3.png';
import pcBottomRightBall from '../../images/worldCupImg/倒计时-img-球1.png';
import { useAppDispatch } from '@/redux/hook';
import { WorldCupAdProps } from '../../header/Header';
import CustomImg from '@/components/customImg/CustomImg';
/* eslint-disable @typescript-eslint/ban-ts-comment */

const WorldCup: FC<{ time: WorldCupAdProps }> = ({ time }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <div>
      <div className={styles.home}>
        <div className={styles.title}>
          <CustomImg src={topBall} alt='foot ball' />
          <CustomImg
            className={styles.pcTopLeftBall}
            src={pcTopLeftBall}
            alt='foot ball'
          />
          <p>{t('worldCup.title')}</p>
          <CustomImg
            className={styles.pcTopRightBall}
            src={pcTopRightBall}
            alt='foot ball'
          />
          {/* 全屏广告关闭开关|0-关闭 */}
          <i onClick={() => dispatch(worldCupAd(0))} />
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
          <CustomImg
            className={styles.pcBottomLeftBall}
            src={pcBottomLeftBall}
            alt='foot ball'
          />
          <CustomImg
            className={styles.pcBottomRightBall}
            src={pcBottomRightBall}
            alt='foot ball'
          />
        </div>
        <CustomImg className={styles.ball} src={botBall} alt='foot ball' />
      </div>
    </div>
  );
};

export default WorldCup;
