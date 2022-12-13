import { createSlice } from '@reduxjs/toolkit';
import { IInitialState } from './types';

const initialState: IInitialState = {
  isShowWallet: false,
  isShowPopUpActivity: false, // 特殊活动展示
  isShowHistory: false,
  isShowGame: false, // 弹框状态
  tabCurrentIndex: 0, // 历史记录索引
  rechargeCurrent: 0, // 充值提现索引
  isShowRechargeMusk: false, // 充值遮罩

  rechangeCurrencyList: [], // 充值币种列表
  rechangeCurrencyDetail: {}, // 充值币种详情
  coinAddress: '', // 币种地址
  coinTypeName: '', // 币种
  coinChainName: '', // 链名

  walletWithdrawInfo: {},
  withDrawCoinType: '',
  withDrawCoinInfo: {
    balance: '',
    chainTypes: [],
    currencyType: '',
    currencyTypeName: '',
    currencyTypeUnit: '',
    exchangeRate: '',
    lockAmount: '',
    maxAmount: '',
    minAmount: '',
    withdrawableAmount: '',
  },
  withDrawCoinTypeName: '', // 提现币种
  withDrawCoinChainName: '', // 提现链名
  withDrawCoinCode: 0, // 提现成功后
  withdrawRecordCode: 0, // 提现是否成功
  exchangeInfo: {}, // 兑换信息
  exchangeCode: 0, // 是否兑换成功
  userRechargeActivityDetailData: [], // 首存配置
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    changeIsShowWalletAction(state, { payload }) {
      state.isShowWallet = payload;
    },
    changeIsShowPopUpActivityAction(state, { payload }) {
      state.isShowPopUpActivity = payload;
    },
    changeIsShowHistoryAction(state, { payload }) {
      state.isShowHistory = payload;
    },
    changeIsShowGameAction(state, { payload }) {
      state.isShowGame = payload;
    },
    changeTabCurrentIndexAction(state, { payload }) {
      state.tabCurrentIndex = payload;
    },
    changeisShowRechargeMuskAction(state, { payload }) {
      state.isShowRechargeMusk = payload;
    },
    changeRechargeCurrentAction(state, { payload }) {
      state.rechargeCurrent = payload;
    },
    changeRechangeCurrencyListAction(state, { payload }) {
      state.rechangeCurrencyList = payload;
    },
    changeRechangeCurrencyDetailAction(state, { payload }) {
      state.rechangeCurrencyDetail = payload;
    },
    changeCoinAddressAction(state, { payload }) {
      state.coinAddress = payload;
    },
    changeCoinTypeNameAction(state, { payload }) {
      state.coinTypeName = payload;
    },
    changeCoinChainNameAction(state, { payload }) {
      state.coinChainName = payload;
    },
    changeWalletWithdrawInfoAction(state, { payload }) {
      state.walletWithdrawInfo = payload;
    },
    changewithDrawCoinInfoAction(state, { payload }) {
      state.withDrawCoinInfo = { ...state.withDrawCoinInfo, ...payload };
    },
    changeWithDrawCoinTypeNameAction(state, { payload }) {
      state.withDrawCoinTypeName = payload;
    },
    changeWithDrawCoinChainNameAction(state, { payload }) {
      state.withDrawCoinChainName = payload;
    },
    changeWithDrawCoinCodeAction(state, { payload }) {
      state.withDrawCoinCode = payload;
    },
    changeWithdrawRecordCodeAction(state, { payload }) {
      state.withdrawRecordCode = payload;
    },
    changeExchangeInfoAction(state, { payload }) {
      state.exchangeInfo = payload;
    },
    changeExchangeCodeAction(state, { payload }) {
      state.exchangeCode = payload;
    },
    changeUserRechargeActivityDetailAction(state, { payload }) {
      state.userRechargeActivityDetailData = payload;
    },
  },
});

export const {
  changeIsShowWalletAction,
  changeIsShowPopUpActivityAction,
  changeIsShowHistoryAction,
  changeIsShowGameAction,
  changeTabCurrentIndexAction,
  changeisShowRechargeMuskAction,
  changeRechargeCurrentAction,
  changeRechangeCurrencyListAction,
  changeRechangeCurrencyDetailAction,
  changeCoinAddressAction,
  changeCoinTypeNameAction,
  changeCoinChainNameAction,
  changeWalletWithdrawInfoAction,
  changewithDrawCoinInfoAction,
  changeWithDrawCoinTypeNameAction,
  changeWithDrawCoinChainNameAction,
  changeWithDrawCoinCodeAction,
  changeWithdrawRecordCodeAction,
  changeExchangeInfoAction,
  changeExchangeCodeAction,
  changeUserRechargeActivityDetailAction,
} = walletSlice.actions;
export default walletSlice.reducer;
