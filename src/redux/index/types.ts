import { NumOrStrType, ObjType } from '@/types/Common';

export interface IndexState {
  level: ObjType;
  showCoinQuestionPopup: boolean;
  betListForPCBottomList: { [key: string]: any[] };
  showFullScreenAd: boolean;
  showWorldCup: boolean;
  inGame: boolean;
  walletList: {
    loading: boolean;
    list: ObjType[];
  };
  currWallet: ObjType;
  promotionsList: any;
  unreadMessageCount: NumOrStrType;
  recommendIsEnabled: number;
  currentLanguage: string;
  leftSidebarShortcutOptions: number;
  leftSidebarTopTabs: number;
  loginShow: number;
  auxiliaryCode: string;
  userinfo:
    | { [key: string]: any }
    | {
        token?: string;
        aesSecret: string;
        enableEncrypt: boolean;
        mqttAesSecret: string;
        signSecret: string;
        platformId: number;
        parentId: number;
        userId: number;
        userName: string;
        nickName: string;
        headUrl: string;
        vipLevel: number;
        userCode: string;
        userType: number;
        status: number;
        balance: string;
        usdtBalance: string;
        unsettledAmount: string;
        unreceivedFirstRechargeCashgift: string;
        isChatEnabled: number;
        isBetEnabled: number;
        isLoginEnabled: number;
        isRechargeEnabled: number;
        isWithdrawEnabled: number;
        isLoanEnabled: number;
        isSendRedEnvelopeEnabled: number;
        isSnatchRedEnvelopeEnabled: number;
        isGiveGiftEnabled: number;
        isReturnCommissionEnabled: number;
        isRebateEnabled?: any;
        isOpenChatRoomEnabled: number;
        isThirdGameEnabled: number;
        isPayPasswordSet: number;
        deviceLockStatus: number;
        isBoundBankCard: number;
        isBoundAlipayAccount: number;
        isBoundUsdtAccount: number;
        rechargeNeedBindCardSwitch: number;
        isHbChatEnabled: number;
        isHbGameEnabled: number;
        thirdUserType: number;
        isBindMobile: number;
        mobileAreaCode: string;
        isBindEmail: number;
        isBindGoogle: number;
        loginMobile?: any;
        loginEmail: string;
        isSignEnabled: number;
        isUserTeamDataShow: number;
        isUserDataReportShow: number;
        isUserDirectShow: number;
        isUserGameRecordShow: number;
        isUserWalletLogShow: number;
        userDataReportDataLevelCurrUser: number;
        userDataReportDataLevelDirect: number;
        userDataReportDataLevelAgent: number;
        isUploadRankBackgroundImageEnabled: number;
        isUpdateNickNameEnabled: number;
        isC2CEnabled: number;
        c2cWithdrawFreezeAmount: string;
        isUserCodeShowed: number;
      };
  platformConfig: { [key: string]: any };
  loginTabActive: number;
  cryptoConfig: { [key: string]: any };
  mqttBroadcast: { [key: string]: any };
  switchs: { [key: string]: any };
  loginAdList: ObjType[];
  registerAdList: ObjType[];
}
