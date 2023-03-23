import { lazy } from 'react';

export const Home = lazy(
  () => import('@/page/gamesLobby/components/home/Home')
);
export const Mine = lazy(
  () => import('@/page/gamesLobby/components/mine/Mine')
);

export const Recharge = lazy(
  () => import('@/page/gamesLobby/components/recharge/Recharge')
);
