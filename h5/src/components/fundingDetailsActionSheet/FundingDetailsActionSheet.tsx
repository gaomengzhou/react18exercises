import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Mask } from 'antd-mobile';
import styles from './FundingDetailsActionSheet.module.scss';
import { ObjType } from '@/types/Common';

interface FundingDetailsActionSheetProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  state: ObjType[];
  setBusinessType: Dispatch<SetStateAction<ObjType>>;
  onSubmit: () => void;
  onClick?: (data: any) => typeof data | void;
  className?: string;
  top?: number | string;
}
const FundingDetailsActionSheet: FC<FundingDetailsActionSheetProps> = ({
  visible,
  setVisible,
  state,
  className,
  top,
  onClick,
  setBusinessType,
  onSubmit,
}) => {
  const [active, setActive] = useState(0);
  const tabClick = (data: ObjType, i: number) => {
    setActive(i);
    onClick?.(data);
  };

  const reSetData = () => {
    setBusinessType({
      businessType: '',
      businessTypeName: '全部',
      sortOrder: 1,
    });
    setActive(0);
  };

  const onClickSubmit = () => {
    onSubmit();
    setVisible(false);
  };
  return (
    <div
      style={{ top: visible && top ? top : undefined }}
      className={`${styles['funding-details-action-sheet-container']} ${
        visible && styles['show-container']
      }`}
    >
      <Mask
        className={`date-action-sheet-my-mask ${className}`}
        visible={visible}
        onMaskClick={() => setVisible(false)}
        getContainer={() => {
          return document.getElementById('root') as HTMLElement;
        }}
      />
      <div className={styles.main}>
        <h5>类型</h5>
        <div className={styles.type}>
          {state.map((item, index) => (
            <div
              className={`${styles.btn} ${
                (1 + index) % 3 === 0 && styles.marginRight0
              }`}
              key={item.businessTypeName}
              onClick={() => tabClick(item, index)}
            >
              <button className={`${index === active && styles['active-btn']}`}>
                {item.businessTypeName}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.control}>
          <button onClick={reSetData}>重置</button>
          <button onClick={onClickSubmit}>确定</button>
        </div>
      </div>
    </div>
  );
};
export default FundingDetailsActionSheet;
