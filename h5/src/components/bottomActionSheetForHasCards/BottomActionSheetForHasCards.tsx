import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Mask } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './BottomActionSheetForHasCards.module.scss';
import { ObjType } from '@/types/Common';
import { cardNumberFormat } from '@/utils/tools/method';

interface BottomActionSheetForHasCardsProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  tabsActive: number;
  dataSource: ObjType[];
  onClick?: (data: ObjType) => typeof data | void;
}
const dotList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
const BottomActionSheetForHasCards: FC<BottomActionSheetForHasCardsProps> = ({
  visible,
  setVisible,
  dataSource,
  title,
  onClick,
  tabsActive,
}) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const selection = (data: ObjType, i: number) => {
    setActive(i);
    onClick?.(data);
  };

  const onsubmit = () => {
    setVisible(false);
    if (tabsActive === 1) {
      navigate('/security/manage-payment-methods/bank-cards');
    } else {
      navigate('/security/manage-payment-methods/virtual-currency');
    }
  };

  useEffect(() => {
    setActive(0);
  }, [tabsActive]);
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
            管理
          </div>
        </div>
        {tabsActive === 1 ? (
          <div className={styles.content}>
            {dataSource.map((item, i) => (
              <div
                className={styles.items}
                key={item.id}
                onClick={() => selection(item, i)}
              >
                <div className={styles.itemsLeft}>
                  {item.logoUrl && (
                    <div className={styles.imgBg}>
                      <img src={item.logoUrl} alt='logoUrl' />
                    </div>
                  )}
                  <div className={styles.itemsLeftInfo}>
                    <p>{item.withdrawName}</p>
                    <div>
                      {dotList.map((dot) => (
                        <b
                          key={dot}
                          className={`${dot % 4 === 0 && styles.marginB}`}
                        />
                      ))}
                      <p>{cardNumberFormat(item.withdrawAccount)}</p>
                    </div>
                  </div>
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
                className={`${styles.items} ${
                  tabsActive === 2 && styles.virtualItems
                }`}
                key={item.id}
                onClick={() => selection(item, i)}
              >
                <div className={styles.itemsLeft}>
                  {item.logoUrl && (
                    <div className={styles.imgBg}>
                      <img src={item.logoUrl} alt='logoUrl' />
                    </div>
                  )}
                  <div className={styles.itemsLeftInfo}>
                    <p>{item.withdrawName}</p>
                    <div>
                      {dotList.map((dot) => (
                        <b
                          key={dot}
                          className={`${dot % 4 === 0 && styles.marginB}`}
                        />
                      ))}
                      <p>{cardNumberFormat(item.withdrawAccount)}</p>
                    </div>
                  </div>
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
export default BottomActionSheetForHasCards;
