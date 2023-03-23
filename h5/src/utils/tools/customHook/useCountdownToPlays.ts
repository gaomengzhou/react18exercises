import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

/**
 * 金额累加动画
 * @param playName 对象名称
 * @param preAmount 上一期金额
 * @param currAmount 本期金额
 * @param setPlays setState Hook
 * @param loadingAmount 用来开始和停止计时
 * @param setLoadingAmount 设置loadingAmount的状态
 */
const useCountdownToPlays = (
  playName: string,
  preAmount: number,
  currAmount: number,
  setPlays: Dispatch<SetStateAction<any>>,
  loadingAmount: boolean,
  setLoadingAmount: Dispatch<SetStateAction<any>>
) => {
  // 金额累加动画
  const amountAnimation = useCallback(() => {
    let addAmount = 11.11;
    if (currAmount - preAmount <= 2) {
      addAmount = 0.01;
    } else if (currAmount - preAmount < 15) {
      addAmount = 0.11;
    }
    if (preAmount >= currAmount) {
      setLoadingAmount(false);
      setPlays((value: any) => {
        const val = { ...value };
        val[playName] = currAmount;
        return val;
      });
      return;
    }
    setPlays((value: any) => {
      const val = { ...value };
      val[playName] = Number(value[playName]) + addAmount;
      return val;
    });
  }, [currAmount, playName, preAmount, setLoadingAmount, setPlays]);
  useEffect(() => {
    let timer: any;
    if (loadingAmount) {
      timer = setInterval(() => {
        if (!loadingAmount) {
          console.log('here');
          clearInterval(timer);
        }
        amountAnimation();
      }, 10);
    }

    return () => {
      clearInterval(timer);
    };
  }, [amountAnimation, currAmount, loadingAmount, preAmount]);
};
export default useCountdownToPlays;
