import { FC, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { indexData, queryUserAllVirtualWallet } from '@/redux/index/slice';
import styles from './ExternalGame.module.scss';

const ExternalGame: FC = () => {
  const dispatch = useAppDispatch();
  const path = window.sessionStorage.getItem('thirdSrc') || '';

  useEffect(() => {
    dispatch(indexData.actions.setGameStatus(true));
    // 回收第三方游戏余额功能
    const leftThirdGame = async () => {
      await $fetch.post(
        '/lottery-thirdgame-api/thirdGame/recycleAllGameBalance'
      );
      dispatch(queryUserAllVirtualWallet());
    };
    return () => {
      leftThirdGame();
      dispatch(indexData.actions.setGameStatus(false));
      window.sessionStorage.removeItem('thirdSrc');
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <iframe id='third-game' title='this is a third games' src={path} />
    </div>
  );
};
export default ExternalGame;
