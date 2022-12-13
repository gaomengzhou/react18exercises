import { FC, lazy, startTransition, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './GiftPopup.module.scss';
import close from '@/page/home/images/icon-侧边栏-关闭@3x.png';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import useWatch from '@/utils/tools/useWatch';
import CustomImg from '@/components/customImg/CustomImg';

const AboutGift = lazy(
  () =>
    import('@/page/home/components/giftPopup/components/aboutGift/AboutGift')
);
const PickUpRecord = lazy(
  () =>
    import(
      '@/page/home/components/giftPopup/components/pickUpRecord/PickUpRecord'
    )
);
const GiftPopup: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  // 开起关闭弹框
  const showCoinQuestionPopup = useSelector(
    (s) => s.indexData.showCoinQuestionPopup
  );
  // tabs高亮
  const [active, setActive] = useState(0);

  // 点击tabs
  const handleTabs = (type: number): void => {
    // startTransition用来避免屏幕闪烁,在准备新 UI 时，展示 “旧” 的 UI 会体验更好,这样做会取消
    // <Suspense fallback={<ReactLazyLoading />}></Suspense>
    // 中的fallback={<ReactLazyLoading />}效果.
    startTransition(() => setActive(type));
  };
  // 监听url,变化了就关闭弹框
  useWatch(location.pathname, () => {
    dispatch(indexData.actions.setShowCoinQuestionPopup(false));
  });

  // 弹框开起禁止低层body滚动
  useEffect(() => {
    if (showCoinQuestionPopup) {
      document.body.style.overflowY = 'hidden';
    }
    return () => {
      setActive(0);
      document.body.style.overflowY = 'visible';
    };
  }, [showCoinQuestionPopup]);
  return (
    <div className={styles.containerBody}>
      <div
        className={styles.fuzzy}
        onClick={() =>
          dispatch(indexData.actions.setShowCoinQuestionPopup(false))
        }
      ></div>
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Gift</p>
          <CustomImg
            lazy
            src={close}
            alt='close'
            onClick={() =>
              dispatch(indexData.actions.setShowCoinQuestionPopup(false))
            }
          />
        </div>
        <div className={styles.content}>
          <div className={styles.tabs}>
            <button
              onClick={() => handleTabs(0)}
              className={`${active === 0 && styles.active}`}
            >
              {t('giftPopup.aboutGift')}
            </button>
            <button
              onClick={() => handleTabs(1)}
              className={`${active === 1 && styles.active}`}
            >
              {t('giftPopup.receivedHistory')}
            </button>
          </div>

          {
            // 关于Gift
            active === 0 && <AboutGift />
          }
          {
            // 领取记录
            active === 1 && <PickUpRecord />
          }
        </div>
      </div>
    </div>
  );
};
export default GiftPopup;
