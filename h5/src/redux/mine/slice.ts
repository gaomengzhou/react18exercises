import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MineTypes } from '@/redux/mine/types';
import { AkErrorType, ObjType } from '@/types/Common';
import { equals } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

const initialState: MineTypes = {
  mineAdList: [],
  vipInfo: {
    bonus: '',
    bonusReceiveStatus: 0,
    currentVipLevel: 0,
    monthSalary: '',
    monthSalaryReceiveStatus: 0,
    nextVipLevel: 0,
    vipActivityDescription: '',
    vipCurrentBetAmount: '',
    vipCurrentRechargeScore: 0,
    vipRechargeScore: 0,
    vipType: 0,
    vipValidBetAmount: '',
    weekSalary: '',
    weekSalaryReceiveStatus: 0,
    yearRevenue: '',
  },
};
/**
 * Mine页面获取轮播图广告
 * @description advertisingPage 1:PC首页弹窗|2:移动端首页弹窗|3:移动端个人中心轮播|4:关于我们
 */
export const getAdvertisingByPage = createAsyncThunk<
  ObjType,
  number,
  { rejectValue: AkErrorType }
>(
  'mine/getAdvertisingByPage',
  async (advertisingPage: number, { rejectWithValue }) => {
    const res = await $fetch.post(
      '/config-api/advertising/getAdvertisingByPage',
      { advertisingPage }
    );
    if (!res.success) return rejectWithValue(res);
    return res;
  }
);

const mine = createSlice({
  name: 'mine',
  initialState,
  reducers: {
    setVipInfo: (state, action) => {
      state.vipInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdvertisingByPage.fulfilled, (state, action) => {
        if (equals(state.mineAdList, action.payload.data)) return;
        state.mineAdList = action.payload.data;
      })
      .addCase(getAdvertisingByPage.rejected, (state, action) => {
        toast.show({ content: action.payload?.message });
      });
  },
});

export default mine;
