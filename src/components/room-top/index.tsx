import React, { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch } from 'react-redux';
import {
  dateTime,
  startTime,
  sevenDayAgo,
  amonthAgo,
} from '@/page/wallet/utils';
import { useSelector } from '@/redux/hook';
import { AppDispatch } from '@/redux/store';

import {
  fetchSummaryAction,
  fetchPageRechargeLogAction,
  changeGameCodeAction,
  changeChooseTimeAction,
  fetchGameReportAction,
} from '@/redux/recods';

import iconClose from '@/assets/images/wallet/icon-侧边栏-体育-收起.png';
import iconOpen from '@/assets/images/wallet/icon-侧边栏-体育-展开.png';
import styled from './style.module.scss';

interface IDateMap {
  [key: string]: number;
}

interface IStartTimeMap {
  [key: number]: any;
}

const RoomTop: React.FC = memo(() => {
  const { t } = useTranslation();

  /** 获取当前选项卡 */
  const {
    tabCurrentIndex,
    rechangeWithdrawalSummary,
    gameInfo,
    gameCode,
    betRecods,
  } = useSelector((state) => ({
    tabCurrentIndex: state.wallet.tabCurrentIndex,
    rechangeWithdrawalSummary: state.recods.rechangeWithdrawalSummary,
    gameInfo: state.recods.gameInfo,
    gameCode: state.recods.gameCode,
    betRecods: state.recods.betRecods,
  }));

  const sportArr = gameInfo?.gameReportList;
  const gameName = sportArr?.[0]?.gameName;
  const dateArr = [
    t('recods.Withinday', { day: 1 }),
    t('recods.Withindays', { day: 7 }),
    t('recods.Withindays', { day: 30 }),
  ];

  const [isShowPanel, setIsShowPanel] = useState(false);
  const [isShowSportPanel, setIsShowSportPanel] = useState(false);
  const [date, setDate] = useState(dateArr[0]);
  const [sport, setSport] = useState(gameName);
  const [dateCurrent, setDateCurrent] = useState(0);
  const [gameCurrent, setGameCurrent] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  /** 日期天数 */
  const dateMap: IDateMap = { 0: 1, 1: 7, 2: 30 };
  const dateTotal = dateMap[dateCurrent];

  /** 总计金额 */
  const totalAmount = () => {
    const total: IStartTimeMap = {
      0: rechangeWithdrawalSummary?.totalRechargeAmount,
      1: rechangeWithdrawalSummary?.totalWithdrawAmount,
      2:
        betRecods?.profitAmount > 0
          ? `+${betRecods?.profitAmount}`
          : betRecods?.profitAmount,
    };

    return total[tabCurrentIndex];
  };

  useEffect(() => {
    setIsShowSportPanel(false);
    setIsShowPanel(false);
    setDate(t('recods.Withinday', { day: 1 }));
    setDateCurrent(0);
    setGameCurrent(0);

    /** 游戏记录 */
    if (tabCurrentIndex === 2) {
      setSport(gameName);
    }
  }, [tabCurrentIndex, gameName, dispatch, t]);

  /** 显示面板 */
  const rotateHandle = () => {
    setIsShowSportPanel(false);
    setIsShowPanel(!isShowPanel);
  };

  /** 游戏面板 */
  const showSportHandel = () => {
    setIsShowPanel(false);
    setIsShowSportPanel(!isShowSportPanel);
  };

  /** 选中日期 */
  const itemClickHandel = (item: string, index: number) => {
    const dateStartTime: IStartTimeMap = {
      0: dateTime(startTime() as any),
      1: dateTime(sevenDayAgo()),
      2: dateTime(amonthAgo()),
    };
    setIsShowPanel(false);
    setDate(item);
    setDateCurrent(index);
    /** 选中的时间 */
    dispatch(
      changeChooseTimeAction({
        startTime: dateStartTime[index],
        endTime: dateTime(new Date().getTime()),
      })
    );

    /** 充提记录 */
    if (tabCurrentIndex !== 2) {
      dispatch(
        fetchSummaryAction({
          rechargeType: tabCurrentIndex === 0 ? 1 : 2,
          startTime: dateStartTime[index],
          endTime: dateTime(new Date().getTime()),
        })
      );
      dispatch(
        fetchPageRechargeLogAction({
          type: tabCurrentIndex === 0 ? 1 : 2,
          startTime: dateStartTime[index],
          endTime: dateTime(new Date().getTime()),
        })
      );
    } else {
      /** 投注记录 */
      dispatch(
        fetchGameReportAction({
          startTime: dateStartTime[index],
          endTime: dateTime(new Date().getTime()),
          thirdGameCode: gameCode,
        })
      );
    }
  };

  /** 选择游戏 */
  const chooseSporHandel = (item: { [key: string]: any }, index: number) => {
    setIsShowSportPanel(!isShowSportPanel);
    setSport(item.gameName);
    setGameCurrent(index);
    setDateCurrent(0);
    setDate(t('recods.Withinday', { day: 1 }));
    dispatch(changeGameCodeAction(item.gameCode));
    if (tabCurrentIndex === 2) {
      dispatch(fetchGameReportAction({ thirdGameCode: item.gameCode }));
    }
  };

  return (
    <div>
      {tabCurrentIndex !== 3 && (
        <div className={styled.roomTopWrapper}>
          <div className={styled.left}>
            {totalAmount() && (
              <span>
                {dateTotal > 1
                  ? t('recods.Totaldays', { day: dateTotal })
                  : t('recods.Totalday', { day: dateTotal })}
                ($)：
                <span className={styled.num}>{totalAmount()}</span>
              </span>
            )}
          </div>

          <div
            className={`${styled.rightBox} ${
              tabCurrentIndex === 2 ? styled.flex : ''
            }`}
          >
            {tabCurrentIndex === 2 && (
              <div className={`${styled.right}`} onClick={showSportHandel}>
                <span>{sport}</span>
                <img src={isShowSportPanel ? iconClose : iconOpen} alt='' />
              </div>
            )}

            <div className={styled.right} onClick={rotateHandle}>
              <span>{date}</span>
              <img src={isShowPanel ? iconClose : iconOpen} alt='' />
            </div>
          </div>
        </div>
      )}

      {isShowPanel && (
        <div className={`${styled.panel}`}>
          {dateArr.map((item, index) => {
            return (
              <div
                key={item}
                className={`${styled.item} ${
                  dateCurrent === index ? styled.active : ''
                }`}
                onClick={() => itemClickHandel(item, index)}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
      {isShowSportPanel && (
        <div className={`${styled.panel} ${styled.gamePanel}`}>
          {sportArr.map((item: any, index: number) => {
            return (
              <div
                key={item.gameCode}
                className={`${styled.item} ${
                  gameCurrent === index ? styled.active : ''
                }`}
                onClick={() => chooseSporHandel(item, index)}
              >
                {item.gameName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default RoomTop;
