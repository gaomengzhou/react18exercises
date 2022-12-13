import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from 'antd-mobile';

import { dateTime, startTime as starT } from '@/page/wallet/utils';
import {
  changeBetRecodsAction,
  changeGameInfoAction,
  changerechangeWithdrawalSummaryAction,
  changeRechargeLogRecodsAction,
  changeExchangeRecodsAction,
} from './recodsSlice';

/** 充值提现记录 */
export const fetchPageRechargeLogAction = createAsyncThunk(
  'fetch/PageRechargeLog',
  async (
    {
      type = 1,
      pageNo = 1,
      pageSize = 10,
      sortList = [{ sortField: 'createTime', sortOrder: 'desc' }],
      startTime = dateTime(starT() as any),
      endTime = dateTime(new Date().getTime()),
    }: { [key: string]: any },
    { dispatch }
  ) => {
    const res = await $fetch.post(
      '/lottery-api/payment/queryPageRechargeWithdrawalLog',
      {
        type, // 类型|0-全部|1-充值|2-提现
        pageNo,
        pageSize,
        sortList, // 支持字段createTime, status, amount排序
        startTime,
        endTime,
      }
    );
    if (!res.success) Toast.show({ content: res.message });
    dispatch(changeRechargeLogRecodsAction(res.data));
  }
);

/** 充提汇总 */
export const fetchSummaryAction = createAsyncThunk(
  'fetch/totalSummary',
  async (
    {
      rechargeType = 1,
      startTime = dateTime(starT() as any),
      endTime = dateTime(new Date().getTime()),
    }: { [key: string]: any },
    { dispatch }
  ) => {
    const res = await $fetch.post(
      '/lottery-api/payment/queryRechargeWithdrawalSummary',
      {
        rechargeType, // 类型|0-全部|1-充值|2-提现
        startTime,
        endTime,
      }
    );
    if (!res.success) Toast.show({ content: res.message });
    dispatch(changerechangeWithdrawalSummaryAction(res.data));
  }
);

/** 投注记录游戏列表 */
export const fetchGameAction = createAsyncThunk(
  'fetch/Game',
  async (
    {
      startTime = dateTime(starT() as any),
      endTime = dateTime(new Date().getTime()),
      sortList = [{ sortField: 'orderAmount', sortOrder: 'desc' }],
    }: { [key: string]: any },
    { dispatch }
  ) => {
    /** 游戏 */
    const res = await $fetch.post('/lottery-api/walletLog/queryGameReport', {
      startTime, // 开始时间
      endTime, // 结束时间
      sortList, // 支持字段betTime排序
    });
    if (!res.success) Toast.show({ content: res.message });
    dispatch(changeGameInfoAction(res.data));
  }
);

/** 投注记录游戏表格 */
export const fetchGameReportAction = createAsyncThunk(
  'fetch/GameReport',
  async (
    {
      startTime = dateTime(starT() as any),
      endTime = dateTime(new Date().getTime()),
      sortList = [{ sortField: 'betTime', sortOrder: 'desc' }],
      pageNo = 1,
      pageSize = 10,
      thirdGameCode,
    }: {
      [key: string]: any;
    },
    { dispatch }
  ) => {
    const res = await $fetch.post(
      '/lottery-api/walletLog/queryGameReportByCode',
      {
        startTime, // 开始时间
        endTime, // 结束时间
        pageNo,
        pageSize,
        sortList, // 支持字段betTime排序
        thirdGameCode, // 游戏标识
      }
    );
    if (!res.success) Toast.show({ content: res.message });
    dispatch(changeBetRecodsAction(res.data));
  }
);

/** 兑换记录 */
export const fetchExchangeRecordAction = createAsyncThunk(
  'fetch/ExchangeRecord',
  async (
    { pageNo = 1, pageSize = 10 }: { [key: string]: any },
    { dispatch }
  ) => {
    const res = await $fetch.post(
      '/lottery-api/exchange/queryPageExchangeRecord',
      {
        pageNo,
        pageSize,
      }
    );
    if (!res.success) Toast.show({ content: res.message });
    dispatch(changeExchangeRecodsAction(res.data));
  }
);
