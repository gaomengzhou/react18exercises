import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Mask } from 'antd-mobile';
import styles from './BottomActionSheet.module.scss';
import { ObjType } from '@/types/Common';

interface BottomActionSheetProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  dataSource: ObjType[];
  onClick?: (data: any) => typeof data;
  // type 1:银行卡 | 2:虚拟钱包
  type?: number;
}
const BottomActionSheet: FC<BottomActionSheetProps> = ({
  visible,
  setVisible,
  dataSource,
  title,
  onClick,
  type = 1,
}) => {
  const [active, setActive] = useState(-1);
  const [state, setState] = useState({});

  const selection = (data: ObjType, i: number) => {
    setActive(i);
    setState(data);
  };

  const onsubmit = () => {
    onClick?.(state);
    setVisible(false);
  };

  return (
    <div
      className={`${styles['bottom-action-sheet-container']} ${
        visible && styles['show-container']
      }`}
    >
      <div className={styles.touchBar}></div>
      <div className={styles.main}>
        <div className={styles.title}>
          <div className={styles.left} onClick={() => setVisible(false)}>
            取消
          </div>
          <div className={styles['title-name']}>{title}</div>
          <div className={styles.right} onClick={onsubmit}>
            确定
          </div>
        </div>
        {type === 1 ? (
          <div className={styles.content}>
            {dataSource.map((item, i) => (
              <div
                className={styles.items}
                key={item.bankId}
                onClick={() => selection(item, i)}
              >
                <div className={styles.itemsLeft}>
                  {item.logoUrl && <img src={item.logoUrl} alt='logoUrl' />}
                  <p>{item.bankName}</p>
                </div>
                <div className={styles.selection}>
                  <i className={`${i === active && styles['checked-i']}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.content}>
            {dataSource.map((item, i) => (
              <div
                className={styles.items}
                key={item.thirdPaymentId}
                onClick={() => selection(item, i)}
              >
                <div className={styles.itemsLeft}>
                  {item.logoUrl && <img src={item.logoUrl} alt='logoUrl' />}
                  <p>{item.paymentChannelName}</p>
                </div>
                <div className={styles.selection}>
                  <i className={`${i === active && styles['checked-i']}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Mask
        className='bottom-action-sheet-mask'
        visible={visible}
        onMaskClick={() => setVisible(false)}
        getContainer={() => {
          return document.getElementById('root') as HTMLElement;
        }}
      />
    </div>
  );
};
export default BottomActionSheet;
