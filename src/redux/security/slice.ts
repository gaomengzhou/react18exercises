import { createSlice } from '@reduxjs/toolkit';
import { IInitialState } from './types';

const initialState: IInitialState = {
  securityStatus: 0,
  serveStatus: 0,
  serveName: '关于我们',
  messageStatus: 0,
  commissionStatus: 0,
  commissionKey: 'realperson',
  usercode: '',
};

const recodsSlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    changeSecurityStatus(state, { payload }) {
      state.securityStatus = payload;
    },
    changeServeStatus(state, { payload }) {
      state.serveStatus = payload;
    },
    changeServeName(state, { payload }) {
      state.serveName = payload;
    },
    changeMessageStatus(state, { payload }) {
      state.messageStatus = payload;
    },
    changeCommissionStatus(state, { payload }) {
      state.commissionStatus = payload;
    },
    changeCommissionKey(state, { payload }) {
      state.commissionKey = payload;
    },
    changeUsercode(state, { payload }) {
      state.usercode = payload;
    },
  },
});

export const {
  changeSecurityStatus,
  changeServeStatus,
  changeServeName,
  changeMessageStatus,
  changeCommissionStatus,
  changeCommissionKey,
  changeUsercode,
} = recodsSlice.actions;
export default recodsSlice.reducer;
