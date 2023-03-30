// 快闪列表
import { toast } from '@/utils/tools/toast';

export const queryFastCurrencyList = async () => {
  toast.loading();
  const res = await $fetch.post('/lottery-api/recharge/queryFastCurrencyList');
  toast.clear();
  if (!res.success) return toast.fail(res);
  return res;
};
