export interface IInitialState {
  isShowWallet: boolean;
  isShowHistory: boolean;
  isShowPopUpActivity: boolean;
  isShowGame: boolean;
  tabCurrentIndex: number;
  rechargeCurrent: number;
  isShowRechargeMusk: boolean;

  // 充币
  rechangeCurrencyList: any[];
  rechangeCurrencyDetail: { [key: string]: any };
  coinAddress: string;
  coinTypeName: string;
  coinChainName: string;

  // 提币
  walletWithdrawInfo: { [key: string]: any };
  withDrawCoinType: string;
  withDrawCoinInfo: { [key: string]: any };
  withDrawCoinTypeName: string;
  withDrawCoinChainName: string;
  withDrawCoinCode: number;
  withdrawRecordCode: number;
  // 兑换
  exchangeInfo: { [key: string]: any };
  exchangeCode: number;
  userRechargeActivityDetailData: { [key: string]: any };
}
