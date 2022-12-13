export interface IInitialState {
  rechargeLogRecods: any[];
  rechangeWithdrawalSummary: { [key: string]: any };
  gameInfo: { [key: string]: any };
  betRecods: { [key: string]: any };
  exchangeRecods: { [key: string]: any };
  gameCode: string;
  chooseTime: { startTime: string; endTime: string };
}
