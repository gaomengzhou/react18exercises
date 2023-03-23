import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AkErrorType, ObjType } from '@/types/Common';
import { IndexState } from './types';

const auxiliaryCode = [1, 2, 3]
  .map(() => Math.random().toString(16).slice(2))
  .join('')
  .slice(0, 50);

const initialState: IndexState = {
  auxiliaryCode,
  userinfo: {
    token: '',
    platformId: '',
    parentId: '',
    userId: '',
    userName: '',
    ickName: '',
    headUrl: '',
    vipLevel: '',
    userCode: '',
    userType: '',
    status: '',
    balance: '',
    usdtBalance: '',
    unsettledAmount: '',
    unreceivedFirstRechargeCashgift: '',
    isChatEnabled: '',
    isBetEnabled: '',
    isLoginEnabled: '',
    isRechargeEnabled: '',
    isWithdrawEnabled: '',
    isLoanEnabled: '',
    isSendRedEnvelopeEnabled: '',
    isSnatchRedEnvelopeEnabled: '',
    isGiveGiftEnabled: '',
    isReturnCommissionEnabled: '',
    isRebateEnabled: '',
    isOpenChatRoomEnabled: '',
    isThirdGameEnabled: '',
    isPayPasswordSet: '',
    deviceLockStatus: '',
    isBoundBankCard: '',
    isBoundAlipayAccount: '',
    isBoundUsdtAccount: '',
    rechargeNeedBindCardSwitch: '',
    isHbChatEnabled: '',
    isHbGameEnabled: '',
    thirdUserType: '',
    isBindMobile: '',
    mobileAreaCode: '',
    loginMobile: '',
    isSignEnabled: '',
    isUserTeamDataShow: '',
    isUserDataReportShow: '',
    isUserDirectShow: '',
    isUserGameRecordShow: '',
    isUserWalletLogShow: '',
    userDataReportDataLevelCurrUser: '',
    userDataReportDataLevelDirect: '',
    userDataReportDataLevelAgent: '',
    isUploadRankBackgroundImageEnabled: '',
    isUpdateNickNameEnabled: '',
    isC2CEnabled: '',
    c2cWithdrawFreezeAmount: '',
    isUserCodeShowed: '',
  },
  platformConfig: {},
  cryptoConfig: {},
  mqttBroadcast: {},
};

/**
 * 获取最近120期开奖记录
 * createAsyncThunk 泛型
 * 第一个参数是定义请求成功后返回的类型
 * 第二个参数是定义回调函数的第一个参数(就是下面函数的params,没有就定义undefined)
 * 第三个参数是手动定义请求失败rejectValue的类型:
 * type AsyncThunkConfig = {
 *   state?: unknown
 *   dispatch?: Dispatch
 *   extra?: unknown
 *   rejectValue?: unknown
 *   serializedErrorType?: unknown
 *   pendingMeta?: unknown
 *   fulfilledMeta?: unknown
 *   rejectedMeta?: unknown
 * }
 * 完成设置后extraReducers(build){
 *     build.addCase(xxx.fulfilled/xxx.rejected,(state,action)=>{
 *        现在action.payload能够实现类型推断
 *     })
 * }
 */
export const query120IssueOpenNumber = createAsyncThunk<
  ObjType,
  {
    id: number;
    lotteryId: number;
    getTheLatestEightLotteryRecords?: boolean;
  },
  {
    rejectValue: AkErrorType;
  }
>(
  'index/query120IssueOpenNumber',
  async (
    params: {
      id: number;
      lotteryId: number;
      getTheLatestEightLotteryRecords?: boolean;
    },
    { rejectWithValue }
  ) => {
    const { id, lotteryId, getTheLatestEightLotteryRecords = false } = params;
    const res = await $fetch.post(
      '/config-issue-api/openNumber/query120IssueOpenNumber',
      {
        id,
        lotteryId,
      }
    );
    if (!res.success) return rejectWithValue(res);
    if (getTheLatestEightLotteryRecords) {
      let newIndex = 8;
      const index = 8;
      const result = res.data;
      const data = result.slice(0, index);
      // 循环排除无开奖号码的数据
      const loopToExcludeDataWithNoWinningNumbers = (): void => {
        for (let i = 0; i < 8; i += 1) {
          if (!data[i].openNumber) {
            data.splice(i, 1);
            newIndex += 1;
            data.push(result[newIndex]);
            return loopToExcludeDataWithNoWinningNumbers();
          }
        }
      };
      loopToExcludeDataWithNoWinningNumbers();
      return {
        isLatestEightLotteryRecords: true,
        data,
      };
    }
    return res;
  }
);

export const getCurrentAndPreviousIssueInfo = createAsyncThunk<
  ObjType,
  {
    id: number;
    lotteryId: number;
  },
  {
    rejectValue: AkErrorType;
  }
>(
  'index/getCurrentAndPreviousIssueInfo',
  async (
    params: {
      id: number;
      lotteryId: number;
    },
    { rejectWithValue }
  ) => {
    const { id, lotteryId } = params;
    const res = await $fetch.post(
      '/config-issue-api/openNumber/getCurrentAndPreviousIssueInfo',
      {
        id,
        lotteryId,
      }
    );
    if (!res.success) return rejectWithValue(res);
    return res;
  }
);

export const indexData = createSlice({
  name: 'index',
  initialState,
  reducers: {
    setUserinfo: (state, action) => {
      state.userinfo = { ...state.userinfo, ...action.payload };
    },
    setCryptoConfig: (state, action) => {
      state.cryptoConfig = action.payload;
    },
    setMqttBroadcast: (state, action) => {
      state.mqttBroadcast[action.payload.key] = action.payload.res;
    },

    clearUserinfo: (state) => {
      state.userinfo = {};
    },
  },
  // extraReducers(build) {},
});
export default indexData;
