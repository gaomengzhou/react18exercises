import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Mask } from 'antd-mobile';
import styles from './BettingOrderActionSheet.module.scss';
import { ObjType } from '@/types/Common';
import { ActiveSheetType } from '@/page/bettingDetails/BettingDetails';

interface BettingOrderActionSheetProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  settleAccounts: ObjType[];
  lostWinTie: ObjType[];
  onClick: (obj: ActiveSheetType) => typeof obj | void;
  className?: string;
  top?: number | string;
}
const BettingOrderActionSheet: FC<BettingOrderActionSheetProps> = ({
  visible,
  setVisible,
  settleAccounts,
  lostWinTie,
  onClick,
  className,
  top,
}) => {
  // 结算的active
  const [settlementActive, setSettlementActive] = useState<{
    id: number;
    text: string;
  }>({
    id: 0,
    text: '全部',
  });
  // 输赢的active
  const [winOrLoseActive, setWinOrLoseActive2] = useState<{
    id: number;
    text: string;
  }>({
    id: 0,
    text: '全部',
  });
  const onSubmit = () => {
    setVisible(false);
    onClick({ settlementActive, winOrLoseActive });
  };
  const reSetData = () => {
    setSettlementActive({
      id: 0,
      text: '全部',
    });
    setWinOrLoseActive2({
      id: 0,
      text: '全部',
    });
  };
  return (
    <div
      style={{ top: visible && top ? top : undefined }}
      className={`${styles['betting-order-action-sheet-container']} ${
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
        <h5>结算</h5>
        <div className={styles.settlement}>
          {settleAccounts.map((item) => (
            <div className={styles.btn} key={item.id}>
              <button
                className={`${
                  item.id === settlementActive.id && styles['active-btn']
                }`}
                onClick={() => {
                  setSettlementActive((val) => {
                    return { ...val, ...item };
                  });
                }}
              >
                {item.text}
              </button>
            </div>
          ))}
        </div>
        <h5>输赢</h5>
        <div className={styles.settlement}>
          {lostWinTie.map((item) => (
            <div className={styles.btn} key={item.id}>
              <button
                className={`${
                  item.id === winOrLoseActive.id && styles['active-btn']
                }`}
                onClick={() => {
                  setWinOrLoseActive2((val) => {
                    return { ...val, ...item };
                  });
                }}
              >
                {item.text}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.control}>
          <button onClick={reSetData}>重置</button>
          <button onClick={onSubmit}>确定</button>
        </div>
      </div>
    </div>
  );
};
export default BettingOrderActionSheet;
