import { useRoutes } from 'react-router-dom';
import '../router-animate.css';
import Home from '@/page/home/Home';
import Not404 from '@/page/404/404';

const RouteIndex = () => {
  return useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    { path: '*', element: <Not404 /> },
  ]);
};
export default RouteIndex;
