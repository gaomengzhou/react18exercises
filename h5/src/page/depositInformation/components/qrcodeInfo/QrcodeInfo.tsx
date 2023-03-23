import { FC } from 'react';
import copy from 'copy-to-clipboard';
import { ObjType } from '@/types/Common';
import styles from './QrcodeInfo.module.scss';
import { toast } from '@/utils/tools/toast';

const QrcodeInfo: FC<{ state: ObjType }> = ({ state }) => {
  return (
    <div className={styles.qrcodeInfo}>
      <p>请扫码支付</p>
      <img src={state.res.qrcodeUrl} alt='QRCODE' />
      <span>付款时请务必填写附言</span>
      <div>
        <p>附言:</p>
        <span>{state.res.postscript}</span>
        <i
          className='iconfont icon-other_icon-copy'
          onClick={() => {
            copy(state.res.postscript);
            toast.success('复制成功!');
          }}
        />
      </div>
    </div>
  );
};
export default QrcodeInfo;
