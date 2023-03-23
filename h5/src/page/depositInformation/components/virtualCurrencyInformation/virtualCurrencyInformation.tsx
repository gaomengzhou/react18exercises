import { FC } from 'react';
import copy from 'copy-to-clipboard';
import { ObjType } from '@/types/Common';
import styles from './virtualCurrencyInformation.module.scss';
import { toast } from '@/utils/tools/toast';

// eslint-disable-next-line no-unused-vars
const VirtualCurrencyInformation: FC<{ state: ObjType }> = ({ state }) => {
  return (
    <div className={styles.qrcodeInfo}>
      <p>
        <span>*</span> 请扫码支付
      </p>
      <img src='' alt='QRCODE' />
      <span>长按图片将保存在您的手机</span>
      <div>
        <span>TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6i</span>
        <i
          className='iconfont icon-other_icon-copy'
          onClick={() => {
            copy('123');
            toast.success('复制成功!');
          }}
        />
      </div>
    </div>
  );
};
export default VirtualCurrencyInformation;
