import { createSlice } from '@reduxjs/toolkit';

import { IInitialState } from './types';

const initialState: IInitialState = {
  rechargeLogRecods: [],
  rechangeWithdrawalSummary: {},
  gameInfo: {},
  betRecods: {},
  exchangeRecods: {},
  gameCode: '',
  chooseTime: {
    startTime: '',
    endTime: '',
  },
};

const recodsSlice = createSlice({
  name: 'recods',
  initialState,
  reducers: {
    changeRechargeLogRecodsAction(state, { payload }) {
      state.rechargeLogRecods = payload;
    },
    changerechangeWithdrawalSummaryAction(state, { payload }) {
      state.rechangeWithdrawalSummary = payload;
    },
    changeGameInfoAction(state, { payload }) {
      state.gameInfo = payload;
    },
    changeBetRecodsAction(state, { payload }) {
      state.betRecods = payload;
    },
    changeExchangeRecodsAction(state, { payload }) {
      state.exchangeRecods = payload;
    },
    changeGameCodeAction(state, { payload }) {
      state.gameCode = payload;
    },
    changeChooseTimeAction(state, { payload }) {
      state.chooseTime = { ...state.chooseTime, ...payload };
    },
  },
});

export const {
  changeRechargeLogRecodsAction,
  changerechangeWithdrawalSummaryAction,
  changeGameInfoAction,
  changeBetRecodsAction,
  changeExchangeRecodsAction,
  changeGameCodeAction,
  changeChooseTimeAction,
} = recodsSlice.actions;
export default recodsSlice.reducer;
