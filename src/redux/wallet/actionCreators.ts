import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from 'antd-mobile';
import { RootState, store } from '../store';

import {
  changeCoinAddressAction,
  changeisShowRechargeMuskAction,
  changeRechangeCurrencyDetailAction,
  changeRechangeCurrencyListAction,
  changeWalletWithdrawInfoAction,
  changeWithDrawCoinCodeAction,
  changeWithdrawRecordCodeAction,
  changeExchangeInfoAction,
  changeExchangeCodeAction,
  changeUserRechargeActivityDetailAction,
} from './slice';

// 获取用户充值活动详情
export const fetchUserRechargeActivityDetailAction = createAsyncThunk(
  'fetch/userRechargeActivityDetail',
  async (payload: any, { dispatch }) => {
    const res = await $fetch.post(
      'lottery-api/rechargeActivity/getUserRechargeActivityDetail',
      payload
    );
    if (!res.success) Toast.show({ content: res.message });
    // console.log('res.data3', res.data);
    dispatch(changeUserRechargeActivityDetailAction(res.data));
  }
);

/** 钱包币种列表 */
export const fetchCurrencyDetailAction = createAsyncThunk(
  'fetch/queryQbCurrencyDetail',
  async (_payload, { dispatch }) => {
    const res = await $fetch.post(
      '/lottery-api/recharge/queryQbCurrencyDetail'
    );

    if (!res.success) return Toast.show({ content: res.message });
    dispatch(changeRechangeCurrencyDetailAction(res.data));
    const data2 = store.getState().wallet.rechangeCurrencyDetail;

    const { chainName } = data2.list[0];
    const { currencyTypeName } = data2;

    const currencyType =
      currencyTypeName === 'TRX' ? 3 : currencyTypeName === 'ETH' ? 2 : 1;
    dispatch(
      fetchUserRechargeActivityDetailAction({ currencyType, chainName })
    );
  }
);

/** 钱包币种列表 */
export const fetchCurrencyListAction = createAsyncThunk(
  'fetch/queryQbCurrencyList',
  async (_payload, { dispatch }) => {
    const res = await $fetch.post('/lottery-api/recharge/queryQbCurrencyList');
    if (!res.success) return Toast.show({ content: res.message });
    dispatch(changeRechangeCurrencyListAction(res.data));
    dispatch(fetchCurrencyDetailAction());
  }
);

/** 获取充值教程 */
export const fetchPaymentAction = createAsyncThunk(
  'fetch/getPaymentTutorialById',
  async (payload: number) => {
    const res = await $fetch.post(
      '/config-api/paymentTutorial/getPaymentTutorialById',
      {
        id: payload,
      }
    );
    if (!res.success) return Toast.show({ content: res.message });
  }
);

/** 创建钱包地址 */
export const fetchWalletAddressAction = createAsyncThunk(
  'fetch/addQbWalletAddress',
  async (payload: { [key: string]: any }, { dispatch }) => {
    dispatch(changeisShowRechargeMuskAction(true));
    try {
      const res = await $fetch.post(
        '/lottery-api/recharge/addQbWalletAddress',
        {
          chainName: payload.chainName,
          currencyType: payload.currencyType,
        }
      );
      if (!res.success) return Toast.show({ content: res.message });
      dispatch(changeisShowRechargeMuskAction(false));
      dispatch(changeCoinAddressAction(res.data.address));
    } catch (err) {
      dispatch(changeisShowRechargeMuskAction(false));
    }
  }
);

/** 提现信息 */
export const fetchWalletWithdrawInfoAction = createAsyncThunk(
  'fetch/getUserWalletWithdrawInfo',
  async (_payload, { dispatch }) => {
    const res = await $fetch.post(
      '/lottery-api/withdraw/getUserWalletWithdrawInfo'
    );
    if (!res.success) return Toast.show({ content: res.message });
    dispatch(changeWalletWithdrawInfoAction(res.data));
  }
);

/** 提交提现信息 */
export const fetchWalletWithdrawRecordAction = createAsyncThunk(
  'fetch/addWalletWithdrawRecord',
  async (payload: { [key: string]: any }, { dispatch, getState }) => {
    const res = await $fetch.post(
      '/lottery-api/withdraw/addWalletWithdrawRecord',
      payload
    );
    if (!res.success) return Toast.show({ content: res.message });
    Toast.show({ content: res.message });
    dispatch(changeWithdrawRecordCodeAction(res.code));
    if (res.code === 1) {
      dispatch(
        changeWithDrawCoinCodeAction(
          (getState() as RootState).wallet.withDrawCoinCode + 1
        )
      );
    }
  }
);
// 兑换信息
export const fetchExchangeInfoAction = createAsyncThunk(
  'fetch/ExchangeInfo',
  async (_payload, { dispatch }) => {
    const res = await $fetch.post(
      '/lottery-api/exchange/queryUserExchangeWalletDetail'
    );
    if (!res.success) Toast.show({ content: res.message });
    dispatch(changeExchangeInfoAction(res.data));
  }
);
// Gift币种兑换为USDT
export const fetchExchangeCurrencyAction = createAsyncThunk(
  'fetch/ExchangeCurrency',
  async (_payload: { [key: string]: any }, { dispatch, getState }) => {
    const res = await $fetch.post(
      '/lottery-api/exchange/exchangeGift',
      _payload
    );
    if (res.success) {
      dispatch(fetchExchangeInfoAction());
      dispatch(
        changeExchangeCodeAction(
          (getState() as RootState).wallet.exchangeCode + 1
        )
      );
      Toast.show({ content: res.message });
    } else {
      Toast.show({ content: res.message });
    }
  }
);
