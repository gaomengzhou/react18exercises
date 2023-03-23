import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { DatePicker } from 'antd-mobile';
import dayjs from 'dayjs';
import styles from './CustomPicker.module.scss';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

interface CustomPickerProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}
const now = new Date();
const CustomPicker: FC<CustomPickerProps> = ({ visible, setVisible }) => {
  const labelRenderer = useCallback((type: string, data: number) => {
    switch (type) {
      case 'year':
        return `${data}年`;
      case 'month':
        return `${data}月`;
      case 'day':
        return `${data}日`;
      case 'hour':
        return `${data}时`;
      case 'minute':
        return `${data}分`;
      case 'second':
        return `${data}秒`;
      default:
        return data;
    }
  }, []);

  const submit = async (val: Date) => {
    const birthday = dayjs(val).format('YYYY/MM/DD');
    toast.loading();
    const res = await $fetch.post('/lottery-api/user/editBirthday', {
      birthday,
    });
    if (!res.success) return toast.fail(res);
    await getUserDetail();
    toast.success('修改成功');
  };

  return (
    <DatePicker
      className={styles.myPicker}
      title='生日'
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      defaultValue={now}
      max={now}
      min={new Date(1900, 0, 1)}
      onConfirm={submit}
      renderLabel={labelRenderer}
    />
  );
};
export default CustomPicker;
