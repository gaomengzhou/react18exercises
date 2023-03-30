import { FC, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hook';
import { indexData } from '@/redux/index/slice';
import back from '@/assets/images/homePage/home_game_back.png';
import refresh from '@/assets/images/homePage/home_game_shuaxin.png';
import zoom from '@/assets/images/homePage/home_game_suspend.png';

import styles from './ExternalGame.module.scss';

const ExternalGame: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const path = window.sessionStorage.getItem('thirdSrc') || '';
  const [showHeader, setShowHeader] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    dispatch(indexData.actions.setGameStatus(true));
    // 回收第三方游戏余额功能
    const leftThirdGame = async () => {
      await $fetch.post(
        '/lottery-thirdgame-api/thirdGame/recycleAllGameBalance'
      );
      // dispatch(queryUserAllVirtualWallet());
    };
    return () => {
      leftThirdGame();
      dispatch(indexData.actions.setGameStatus(false));
      window.sessionStorage.removeItem('thirdSrc');
    };
  }, [dispatch]);

  useEffect(() => {
    function handleOrientationChange() {
      setIsLandscape(window.orientation === 90 || window.orientation === -90);
    }

    handleOrientationChange();

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  return (
    <div className={styles.container}>
      {showHeader && !isLandscape ? (
        <header>
          <div className={styles.first}>
            <img
              onClick={() => {
                if (`${location.state}`.includes('体育')) {
                  navigate('/');
                } else {
                  navigate(-1);
                }
              }}
              src={back}
              alt='back'
            />
            <img
              src={refresh}
              onClick={() => {
                window.location.reload();
              }}
              alt='refresh'
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4>{`${location.state}`}</h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{ fontSize: '2.5rem', marginRight: '2rem' }}
              onClick={() => {
                setShowHeader(false);
              }}
              className='icon iconfont'
            >
              &#xe602;
            </span>
          </div>
        </header>
      ) : showHeader && !isLandscape ? (
        <img
          onClick={() => {
            setShowHeader(true);
          }}
          className={styles.zoom}
          src={zoom}
          alt='zoom'
        />
      ) : (
        ''
      )}

      <iframe
        style={{
          height: showHeader && !isLandscape ? 'calc(100% - 5rem)' : '100%',
          top: showHeader && !isLandscape ? '5rem' : '0rem',
        }}
        id='third-game'
        title='this is a third games'
        src={path}
      />
    </div>
  );
};
export default ExternalGame;
