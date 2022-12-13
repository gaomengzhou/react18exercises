import { useState, useEffect } from 'react';

/** 获取当前视口的具体宽度 */
export default function useWindowResize() {
  const w = window.localStorage.getItem('winWidth');
  const [width, setWidth] = useState(w ?? 0);

  const sizeHandel = () => {
    const winWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    window.localStorage.setItem('winWidth', JSON.stringify(winWidth));

    setWidth(winWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', sizeHandel, true);

    return () => {
      window.removeEventListener('resize', sizeHandel, true);
    };
  });

  return { width };
}
