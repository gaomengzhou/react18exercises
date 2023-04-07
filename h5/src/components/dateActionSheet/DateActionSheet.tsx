import { Dispatch, FC, SetStateAction } from 'react';
import { Mask } from 'antd-mobile';
import styles from './DateActionSheet.module.scss';
import { ObjType } from '@/types/Common';

interface DateActionSheetProps {
  showDate: boolean;
  setShowDate: Dispatch<SetStateAction<boolean>>;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  times: ObjType[];
  onClick?: (data: any) => typeof data | void;
  className?: string;
  top?: number | string;
}
const DateActionSheet: FC<DateActionSheetProps> = ({
  showDate,
  setShowDate,
  active,
  setActive,
  times,
  onClick,
  className,
  top,
}) => {
  const settingTimes = (data: ObjType, index: number) => {
    setActive(index);
  };

  const reSetTimes = () => {
    setActive(1);
  };

  const onSubmit = () => {
    onClick?.(active);
    setShowDate(false);
  };
  return (
    <div
      style={{ top: showDate && top ? top : undefined }}
      className={`${styles['date-action-sheet-container']} ${
        showDate && styles['show-container']
      }`}
    >
      <Mask
        className={`date-action-sheet-my-mask ${className}`}
        visible={showDate}
        onMaskClick={() => setShowDate(false)}
        getContainer={() => {
          return document.getElementById('root') as HTMLElement;
        }}
      />
      <div className={styles.main}>
        <h5>时间</h5>
        <div className={styles.times}>
          {times.map((item) => (
            <div
              className={styles.btn}
              key={item.id}
              onClick={() => settingTimes(item, item.id)}
            >
              <button
                className={`${item.id === active && styles['active-btn']}`}
              >
                {item.time}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.control}>
          <button onClick={reSetTimes}>重置</button>
          <button onClick={onSubmit}>确定</button>
        </div>
      </div>
    </div>
  );
};
export default DateActionSheet;
