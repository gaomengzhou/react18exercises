import { useLocation, useNavigationType } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { cloneElement, useEffect } from 'react';
import '../router-animate.css';
import useInitializeRouting from '@/router/routes';

// 路由动画类名
const ANIMATION_MAP = {
  PUSH: 'forward',
  POP: 'back',
  REPLACE: 'replace',
};
let needAnimation = true; // 控制IOS浏览器滑动自带动画冲突
const RouteIndex = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    const delayReset = () => {
      // 延后重置控制参数
      setTimeout(() => {
        needAnimation = true;
      }, 16);
    };
    window.addEventListener('touchstart', () => {
      needAnimation = true;
    });
    window.addEventListener('touchmove', () => {
      needAnimation = false;
    });
    window.addEventListener('touchend', delayReset);
    return () => {
      window.removeEventListener('touchstart', () => {
        needAnimation = true;
      });
      window.removeEventListener('touchmove', () => {
        needAnimation = false;
      });
      window.removeEventListener('touchend', delayReset);
    };
  }, []);
  const routes = useInitializeRouting();
  // 排除不需要动画的路由
  const judgeRoute = () => {
    const excludeRoutes = ['/', '/discount', '/recharge', '/betSlip', '/mine'];
    return !(
      navigationType === 'PUSH' && excludeRoutes.includes(location.pathname)
    );
  };
  // 筛选类名
  const selectedClassName = () => {
    if (judgeRoute()) return ANIMATION_MAP[navigationType];
    return '';
  };
  return (
    <TransitionGroup
      className='my-react-css-animate'
      childFactory={(child) =>
        cloneElement(child, {
          classNames: needAnimation ? selectedClassName() : '',
        })
      }
    >
      <CSSTransition key={location.pathname} timeout={300}>
        {routes}
      </CSSTransition>
    </TransitionGroup>
  );
};
export default RouteIndex;
