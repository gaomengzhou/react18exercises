import React, { memo, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import UlList from '@/components/ul-list';
import PopUpMusk from '@/components/popup-musk';
import RoomTop from '@/components/room-top';
import RoomTable from '@/components/room-table';
import {
  isObjectEmpty,
  dateTime,
  startTime as starT,
} from '@/page/wallet/utils';
import { useSelector } from '@/redux/hook';
import {
  changeChooseTimeAction,
  changeGameCodeAction,
  fetchGameAction,
  fetchGameReportAction,
  fetchPageRechargeLogAction,
  fetchSummaryAction,
  fetchExchangeRecordAction,
} from '@/redux/recods';
import { changeTabCurrentIndexAction } from '@/redux/wallet';
import { AppDispatch } from '@/redux/store';

import styled from './style.module.scss';

const Recods: React.FC = memo(() => {
  const { t } = useTranslation();
  const gameCodeRef = useRef();
  const {
    rechargeLogRecods,
    tabCurrentIndex,
    gameInfo,
    betRecods,
    exchangeRecods,
  } = useSelector((state) => ({
    rechargeLogRecods: state.recods.rechargeLogRecods,
    tabCurrentIndex: state.wallet.tabCurrentIndex,
    gameInfo: state.recods.gameInfo,
    betRecods: state.recods.betRecods,
    exchangeRecods: state.recods.exchangeRecods,
  }));

  const dispatch = useDispatch<AppDispatch>();

  /** 首次进入页面获取游戏code */
  gameCodeRef.current = gameInfo?.gameReportList?.[0]?.gameCode;

  useEffect(() => {
    /** 游戏记录 */
    if (tabCurrentIndex === 0 || tabCurrentIndex === 1) {
      /** 充提记录和金额汇总 */
      dispatch(
        fetchPageRechargeLogAction({ type: tabCurrentIndex === 0 ? 1 : 2 })
      );
      dispatch(
        fetchSummaryAction({ rechargeType: tabCurrentIndex === 0 ? 1 : 2 })
      );
    }
    /* 兑换记录 */
    if (tabCurrentIndex === 3) {
      dispatch(fetchExchangeRecordAction({}));
    }
  }, [tabCurrentIndex, gameInfo, dispatch]);

  /** 获取当前选项卡 */
  const itemClickHandle = useCallback(
    async (index: number) => {
      dispatch(changeTabCurrentIndexAction(index));
      if (index === 2) {
        await dispatch(fetchGameAction({}));
        dispatch(changeGameCodeAction(gameCodeRef.current));
        dispatch(
          changeChooseTimeAction({
            startTime: dateTime(starT() as any),
            endTime: dateTime(new Date().getTime()),
          })
        );
        dispatch(
          fetchGameReportAction({
            thirdGameCode: gameCodeRef.current,
          })
        );
      }
    },
    [dispatch]
  );

  const topList = (
    <div className={styled.top}>
      <UlList
        infoList={[
          t('wallet.Deposits'),
          t('wallet.Withdraws'),
          t('wallet.Betting'),
          t('wallet.Exchanges'),
        ]}
        itemClick={(index) => itemClickHandle(index)}
      />
      <div>
        <RoomTop />
      </div>
    </div>
  );

  const theader1: string[] = [
    t('wallet.Time'),
    t('wallet.Currency'),
    t('wallet.Amount'),
  ];
  const theader2: string[] = [
    t('wallet.Time'),
    t('recods.currencyAmount'),
    t('recods.afterCurrencyAmount'),
    t('recods.status'),
  ];
  let theader: string[] = [];
  let tbody: any = null;
  switch (tabCurrentIndex) {
    case 0:
    case 1:
      tbody = rechargeLogRecods;
      theader = theader1;
      break;
    case 2:
      tbody = betRecods;
      break;
    case 3:
      tbody = exchangeRecods;
      console.log(exchangeRecods);
      theader = theader2;
      break;
    default:
      break;
  }
  /** 表格 */
  const listContent = isObjectEmpty(tbody) ? (
    <RoomTable theader={theader} tbody={tbody} />
  ) : (
    <div className={styled.box} />
  );

  return (
    <div className={styled.recodsWrapper}>
      <PopUpMusk
        title={t('wallet.history')}
        topList={topList}
        listContet={listContent}
      />
    </div>
  );
});

export default Recods;
