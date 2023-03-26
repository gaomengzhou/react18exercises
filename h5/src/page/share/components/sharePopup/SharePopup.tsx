import { Dispatch, FC, SetStateAction } from 'react';
import { Mask, Toast } from 'antd-mobile';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import styles from './SharePopup.module.scss';
import { useSelector } from '@/redux/hook';

interface SharePopupProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  des: string;
  des2: string;
  logo: any;
  isQrCode?: boolean;
}
const SharePopup: FC<SharePopupProps> = ({
  visible,
  setVisible,
  title,
  des,
  des2,
  logo,
  isQrCode,
}) => {
  const { userinfo } = useSelector((s) => s.indexData);
  const clickBtn = () => {
    setVisible(false);
  };
  return (
    <>
      <Mask
        visible={visible}
        onMaskClick={() => setVisible(false)}
        getContainer={() => document.getElementById('root') as HTMLElement}
      />
      <div
        className={`${styles.sharePopupBody} ${
          visible && styles.sharePopupBodyEnlarge
        } staticSharePopupBody`}
      >
        <div
          onClick={() => setVisible(false)}
          className={styles.sharePopupClose}
        >
          <i className='iconfont icon-a-5_37_Agent_close' />
        </div>
        <div className={styles.sharePopupMain}>
          <h3>{title}</h3>
          <div className={styles.sharePopupDes}>
            <p>{des}</p>
            <p>{des2}</p>
          </div>
          {!isQrCode && <img src={logo} alt='logo' />}
          {isQrCode && (
            <>
              <QRCode
                className={styles.qrcode}
                value={logo}
                // bgColor='#fff1d1' // 二维码背景颜色
                // fgColor='#c7594a' // 二维码图案颜色
              />
              <p className={styles.savePicture}>
                {isQrCode
                  ? '长按二维码保存到手机相册'
                  : '图片将保存在您的手机相册'}
              </p>
            </>
          )}
          {!isQrCode && <button onClick={clickBtn}>确定</button>}

          <div
            className={styles.sharePopupUserInfo}
            onClick={() => {
              copy(userinfo.userCode);
              Toast.show({
                icon: 'success',
                content: '复制成功!',
                getContainer: () => {
                  return document.querySelector(
                    '.staticSharePopupBody'
                  ) as HTMLElement;
                },
              });
            }}
          >
            <p>我的邀请码: </p>
            <span>{userinfo.userCode}</span>
            <i className='iconfont icon-other_icon-copy' />
          </div>
        </div>
      </div>
    </>
  );
};
export default SharePopup;
