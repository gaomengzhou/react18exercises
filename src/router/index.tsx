import { Navigate, useRoutes } from 'react-router-dom';
import Home from '@/page/home';
import Main from '@/page/home/main/Main';
import Promote from '@/page/promote/promote';
import ActivityIndex from '@/page/activity';
import Activity from '@/page/activity/Activity';
import Details from '@/page/activity/details/details';
import CustomerService from '@/page/customerService';
import Vip from '@/page/vip/index';
import ExternalGame from '@/page/externalGame/ExternalGame';
import GameCategory from '@/page/gameCategory/GameCategory';

const RouteIndex = () => {
  return useRoutes([
    {
      path: '/',
      element: <Home />,
      children: [
        { index: true, element: <Main /> },
        { path: 'promote', element: <Promote /> },
        {
          path: 'externalGame',
          element: <ExternalGame />,
        },
        {
          path: 'gameCategory',
          element: <GameCategory />,
        },
        {
          path: 'activity',
          element: <ActivityIndex />,
          children: [
            { index: true, element: <Activity /> },
            { path: 'details/:id', element: <Details /> },
          ],
        },
        {
          path: 'vip',
          element: <Vip />,
        },
        { path: 'customerService', element: <CustomerService /> },
        { path: '*', element: <Navigate to='/' /> },
      ],
    },
  ]);
};
export default RouteIndex;
