import { Dispatch, FC, SetStateAction } from 'react';
import { Mask } from 'antd-mobile';
import styles from './LogoutActionSheet.module.scss';

interface LogoutActionSheetProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
}
const LogoutActionSheet: FC<LogoutActionSheetProps> = ({
  visible,
  setVisible,
  onClick,
}) => {
  return (
    <div
      className={`${styles['login-action-sheet-container']} ${
        visible && styles['show-container']
      }`}
    >
      <div className={styles.touchBar}></div>
      <div className={styles.mk66M}>
        <div className={styles.C8Z4S}>
          <div className={styles.JKA59}>
            <div className={styles.pbodc}></div>
            <div>
              <p className={styles.fGYD7}>确定退出当前账号？</p>
            </div>
          </div>
          <div className={styles.envK7}>
            <div
              className={styles.H9LiU}
              onClick={() => {
                setVisible(false);
              }}
            >
              取消
            </div>
            <div className={styles.H9LiUHMvwk} onClick={onClick}>
              确定
            </div>
          </div>
        </div>
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
export default LogoutActionSheet;
