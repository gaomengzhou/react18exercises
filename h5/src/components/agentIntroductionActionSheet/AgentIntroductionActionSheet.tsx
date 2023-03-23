import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Mask } from 'antd-mobile';
import styles from './AgentIntroductionActionSheet.module.scss';
import { ObjType } from '@/types/Common';

interface AgentIntroductionActionSheetProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  state: ObjType;
  onClick?: (data: any) => typeof data | void;
  className?: string;
  top?: number | string;
}
const AgentIntroductionActionSheet: FC<AgentIntroductionActionSheetProps> = ({
  visible,
  setVisible,
  state,
  className,
  top,
  active,
  setActive,
  onClick,
}) => {
  const [callbackData, setCallbackData] = useState<ObjType>({});
  const tabClick = (data: ObjType, i: number) => {
    setCallbackData(data);
    setActive(i);
  };
  const onClickSubmit = () => {
    setVisible(false);
    if (active === 0) {
      onClick?.(state.thirdPlatformList[0]);
    } else {
      onClick?.(callbackData);
    }
  };

  return (
    <div
      style={{ top: visible && top ? top : undefined }}
      className={`${styles['action-sheet-container']} ${
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
        <h5>{state.categoryName}</h5>
        <div className={styles.type}>
          {state.thirdPlatformList.map((item: ObjType, index: number) => (
            <div
              className={`${styles.btn} ${
                (1 + index) % 3 === 0 && styles.marginRight0
              }`}
              key={item.id}
              onClick={() => tabClick(item, index)}
            >
              <button className={`${index === active && styles['active-btn']}`}>
                {item.thirdGameName}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.control}>
          <button onClick={onClickSubmit}>确定</button>
        </div>
      </div>
    </div>
  );
};
export default AgentIntroductionActionSheet;
