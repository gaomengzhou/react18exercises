import { useEffect, useRef } from 'react';

// eslint-disable-next-line no-unused-vars
type Callback<T> = (prevData: T | undefined) => void;
interface Config {
  immediate: boolean;
}

/**
 * 监听目标变化,仿VUE Watch
 * @param dep 需要监听的目标
 * @param callback 当监听目标发生变化后的回调
 * @param config {immediate:true} 立即监听,默认false
 */
const useWatch = <T>(
  dep: T,
  callback: Callback<T>,
  config: Config = { immediate: false }
) => {
  const { immediate } = config;
  const prev = useRef<T>();
  const initial = useRef(false);
  const stop = useRef(false);
  useEffect(() => {
    const execute = () => callback(prev.current);
    if (!stop.current) {
      if (!initial.current) {
        initial.current = true;
        if (immediate) {
          execute();
        }
      } else {
        execute();
      }
      prev.current = dep;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);

  return () => {
    stop.current = true;
  };
};
export default useWatch;
