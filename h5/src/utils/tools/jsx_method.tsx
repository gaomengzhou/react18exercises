import { ReactNode, Suspense } from 'react';
import ReactLazyLoading from '@/components/reactLazyLoading/ReactLazyLoading';
import { store } from '@/redux/store';
import Login from '@/page/login/Login';

// 懒加载组件
export const renderLazyElement = (node: ReactNode): ReactNode => {
  return <Suspense fallback={<ReactLazyLoading />}>{node}</Suspense>;
};
// 路由权限
export const renderElement = (element: ReactNode): ReactNode => {
  const token =
    store.getState().indexData.userinfo.token ||
    window.localStorage.getItem('token');
  if (!token) return <Login />;
  return element;
};
