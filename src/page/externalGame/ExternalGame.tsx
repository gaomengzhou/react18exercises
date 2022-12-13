import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ObjType } from '@/types/Common';
import { useAppDispatch } from '@/redux/hook';
import { indexData, queryUserAllVirtualWallet } from '@/redux/index/slice';
import styles from './ExternalGame.module.scss';

const ExternalGame: FC = () => {
  const dispatch = useAppDispatch();
  const params = useLocation();
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
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe src={(params.state as ObjType).url} />
    </div>
  );
};
export default ExternalGame;
