import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toast } from 'antd-mobile';
import { AkErrorType, ObjType } from '@/types/Common';
import { IndexState } from './types';

const auxiliaryCode = [1, 2, 3]
  .map(() => Math.random().toString(16).slice(2))
  .join('')
  .slice(0, 50);
const platformConfig = navigator.language;
const defaultLanguage = () => {
  if (platformConfig === 'zh-CN' || platformConfig === 'zh-SG') {
    return 'zh';
  }
  if (platformConfig === 'zh-TW' || platformConfig === 'zh-HK') {
    return 'zh_TW';
  }
  return 'en';
};
const initialState: IndexState = {
  // VIP等级
  level: {
    // 当前等级
    currentVipLevel: 0,
    // 下一等级
    nextVipLevel: 1,
    // vip活动说明
    vipActivityDescription: null,
    // 当前vip等级有效投注
    vipCurrentBetAmount: '0.00',
    // 当前vip等级充值积分
    vipCurrentRechargeScore: null,
    // 到达下一级所需要的充值积分
    vipRechargeScore: null,
    // VIP类型|0:有效投注VIP|1:充值积分VIP
    vipType: 0,
    // 到达下一级所需要的有效投注
    vipValidBetAmount: '1000.00',
    // 经验条
    levelLine: 0,
  },
  // 点击虚拟币"?"的弹框
  showCoinQuestionPopup: false,
  // pc底部投注列表
  betListForPCBottomList: {
    highMultipleList: [],
    highProfitList: [],
    liveBettingList: [],
  },
  // 显示隐藏全屏广告
  showFullScreenAd: false,
  // 显示隐藏世界杯广告
  showWorldCup: false,
  // 是否在游戏中
  inGame: false,
  // 当前钱包
  currWallet: { logo: '', balance: '0.00' },
  // 钱包集合
  walletList: { loading: false, list: [] },
  // 优惠活动列表
  promotionsList: [],
  // 未读消息总数
  unreadMessageCount: 0,
  recommendIsEnabled: 0,
  currentLanguage: defaultLanguage(),
  // 侧边栏快捷选项
  leftSidebarShortcutOptions: 1,
  leftSidebarTopTabs: 0,
  loginShow: 0, // 展示login 0 不展示  1 展示登录 2展示忘记密码 3 展示注册
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
  loginTabActive: 1,
  cryptoConfig: {},
  mqttBroadcast: {},
  switchs: {},
  loginAdList: [],
  registerAdList: [],
};
// 查询用户余额
export const refreshUser = createAsyncThunk('index/refreshUser', async () => {
  const res = await $fetch.post('/lottery-api/user/getUserDetail', {
    auxiliaryCode,
    appVersion: $env.REACT_APP_API_VERSION,
    deviceCode: 'H5',
  });
  if (!res.success) return Toast.show(res.message);
  return res;
});
// 查询钱包
export const queryUserAllVirtualWallet = createAsyncThunk<
  { data: ObjType[] },
  undefined,
  { rejectValue: AkErrorType }
>('index/queryUserAllVirtualWallet', async (_, { rejectWithValue }) => {
  const res = await $fetch.post(
    '/lottery-api/virtualWallet/queryUserAllVirtualWallet'
  );
  if (!res.success) return rejectWithValue(res);
  return res;
});
/**
 * 优惠活动
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
export const queryAllActivityType = createAsyncThunk<
  ObjType,
  {
    activityTypeId?: string;
    pageNo: number;
    pageSize: number;
  },
  {
    rejectValue: AkErrorType;
  }
>(
  'index/queryAllActivityType',
  async (
    params: {
      activityTypeId?: string;
      pageNo: number;
      pageSize: number;
    },
    { rejectWithValue }
  ) => {
    const { activityTypeId, pageNo, pageSize } = params;
    const res = await $fetch.post('/config-api/activity/queryPageActivity', {
      activityTypeId: activityTypeId || '',
      pageNo: pageNo || 1,
      pageSize: pageSize || 3,
    });
    if (!res.success) return rejectWithValue(res);
    return res;
  }
);
// 获取未读消息
export const getUnreadMessageCount = createAsyncThunk<
  ObjType,
  undefined,
  {
    rejectValue: AkErrorType;
  }
>('index/getUnreadMessageCount', async (_, { rejectWithValue }) => {
  const res = await $fetch.post(
    '/lottery-api/platformMessage/getUnreadMessageCount'
  );
  if (!res.success) return rejectWithValue(res);
  return res;
});
// 好友推荐开关配置查询
export const getGlobalSwitchConfigInfo = createAsyncThunk(
  'index/getGlobalSwitchConfigInfo',
  async () => {
    const res = await $fetch.post(
      '/config-api/homePage/getGlobalSwitchConfigInfo'
    );
    if (!res.success) {
      Toast.show(res.message);
      return;
    }
    return res;
  }
);

// 世界杯广告
export const worldCupAd = createAsyncThunk<
  ObjType,
  number | string | undefined,
  {
    rejectValue: AkErrorType;
  }
>(
  'index/worldCupAd',
  async (shutDownSwith: number | string | undefined, { rejectWithValue }) => {
    // 因为被eslint和ts限制住用不了es6默认参数,所以这里特殊处理.
    if (!shutDownSwith && shutDownSwith !== 0) shutDownSwith = '';
    const res = await $fetch.post(
      '/lottery-api/screenAdvertising/getIsFullSreenAdversting',
      { shutDownSwith }
    );
    if (!res.success)
      return rejectWithValue(
        res as {
          code: number;
          data: any;
          message: string;
          success: boolean;
        }
      );
    return res;
  }
);

// 获取用户 Vip 信息
export const getUserVipInfo = createAsyncThunk<
  ObjType,
  undefined,
  { rejectValue: AkErrorType }
>('index/getUserVipInfo', async (_, { rejectWithValue }) => {
  const res = await $fetch.post('/lottery-api/vipInfo/getUserVipInfo');
  if (!res.success) return rejectWithValue(res);
  return res;
});
export const indexData = createSlice({
  name: 'index',
  initialState,
  reducers: {
    setShowCoinQuestionPopup: (state, action) => {
      state.showCoinQuestionPopup = action.payload;
    },
    setBetListForPCBottomList: (state, action) => {
      state.betListForPCBottomList = action.payload;
    },
    clearWorldCupAllAd: (state, action) => {
      state.showWorldCup = action.payload;
      state.showFullScreenAd = action.payload;
    },
    setShowFullScreenAd: (state, action) => {
      state.showFullScreenAd = action.payload;
    },
    changeLanguageAction: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem('currentLanguage', state.currentLanguage);
    },
    setLeftSidebarShortcutOptions: (state, action) => {
      state.leftSidebarShortcutOptions = action.payload;
    },
    setLeftSidebarTopTabs: (state, { payload }) => {
      state.leftSidebarTopTabs = payload;
    },
    setUserinfo: (state, action) => {
      state.userinfo = { ...state.userinfo, ...action.payload };
    },
    clearUserinfo: (state) => {
      state.userinfo = {};
    },
    setLoginShow: (state, { payload }) => {
      state.loginShow = payload;
    },
    setUnreadMessageCount: (state, { payload }) => {
      state.unreadMessageCount = payload;
    },
    setRecommendIsEnabled: (state, { payload }) => {
      state.recommendIsEnabled = payload;
    },
    setPlatformConfig: (state, { payload }) => {
      state.platformConfig = payload;
    },
    setLoginTabActive: (state, { payload }) => {
      state.loginTabActive = payload;
    },
    // 选择头部钱包
    selectWallet: (state, action) => {
      state.currWallet = action.payload;
    },
    // 设置是否游戏中的状态
    setGameStatus: (state, action) => {
      state.inGame = action.payload;
    },
    setCryptoConfig: (state, action) => {
      state.cryptoConfig = action.payload;
    },
    setMqttBroadcast: (state, action) => {
      state.mqttBroadcast[action.payload.key] = action.payload.res;
    },
    setLoginAdList: (state, action) => {
      state.loginAdList = action.payload;
    },
    setRegisterAdList: (state, action) => {
      state.registerAdList = action.payload;
    },
  },
  extraReducers(build) {
    // 查询所有优惠活动
    build
      .addCase(queryAllActivityType.fulfilled, (state: IndexState, action) => {
        if (!action.payload.data.records) return;
        state.promotionsList = action.payload.data.records;
      })
      .addCase(queryAllActivityType.rejected, (state, action) => {
        Toast.show(action.payload?.message);
      });
    // 获取所有未读消息
    build
      .addCase(getUnreadMessageCount.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.unreadMessageCount =
          action.payload.data.announcementCount +
          action.payload.data.letterCount;
      })
      .addCase(getUnreadMessageCount.rejected, (state, action) => {
        Toast.show(action.payload?.message);
      });
    // 获取所有虚拟钱包数据
    build
      .addCase(queryUserAllVirtualWallet.pending, (state) => {
        state.walletList.loading = true;
      })
      .addCase(queryUserAllVirtualWallet.fulfilled, (state, action) => {
        state.walletList.loading = false;
        if (!action.payload.data) return;
        const isCurrentWallet = action.payload.data.filter(
          (item) => item.isCurrent === 1
        );
        const [currentWallet] = isCurrentWallet;
        state.currWallet = currentWallet;
        state.walletList.list = action.payload.data;
      })
      .addCase(queryUserAllVirtualWallet.rejected, (state, action) => {
        state.walletList.loading = false;
        Toast.show(action.payload?.message);
      });
    // 好友推荐开关配置查询
    build
      .addCase(
        getGlobalSwitchConfigInfo.fulfilled,
        (state, action: PayloadAction<{ data: ObjType }>) => {
          state.switchs = action.payload.data;
          state.recommendIsEnabled = action.payload.data.recommendIsEnabled;
        }
      )
      .addCase(getGlobalSwitchConfigInfo.rejected, (state, action) => {
        Toast.show(action.error.message as string);
      });
    // 世界杯广告
    build
      .addCase(worldCupAd.fulfilled, (state, action) => {
        state.showFullScreenAd =
          action.payload?.data.isFullSreenAdversing === 1;
        state.showWorldCup =
          action.payload?.data.isShowFullSreenAdversingSwitch === 1;
      })
      .addCase(worldCupAd.rejected, (state, action) => {
        Toast.show(action.payload?.message);
      });
    build.addCase(refreshUser.fulfilled, (state, action) => {
      state.userinfo = { ...state.userinfo, ...action.payload.data };
    });
    // 获取用户 Vip 信息
    build
      .addCase(getUserVipInfo.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.level = data;
        // VIP类型|0:有效投注VIP|1:充值积分VIP
        if (+data.vipType === 0) {
          // 百分比
          state.level.levelLine =
            (+data.vipCurrentBetAmount / +data.vipValidBetAmount) * 100;
        } else {
          // 百分比;
          state.level.levelLine =
            (+data.vipCurrentRechargeScore / +data.vipRechargeScore) * 100;
        }
      })
      .addCase(getUserVipInfo.rejected, (state, action) => {
        Toast.show(action.payload?.message);
      });
  },
});
export const { changeLanguageAction, setUserinfo } = indexData.actions;
export default indexData;
