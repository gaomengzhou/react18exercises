import { Dispatch, FC, SetStateAction } from 'react';
import copy from 'copy-to-clipboard';
import { ObjType } from '@/types/Common';
import styles from './virtualCurrencyInformation.module.scss';
import { toast } from '@/utils/tools/toast';

const VirtualCurrencyInformation: FC<{
  state: ObjType;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}> = ({ state, value, setValue }) => {
  return (
    <div className={styles.qrcodeInfo}>
      <p>
        <span>* </span>
        {+state.params.paymentType !== 5 ? '请扫码支付' : '存币地址'}
      </p>
      <img
        src={state.params.vcPaymentUrlInfo.receiveAddressQrcodeUrl}
        alt='QRCODE'
      />
      <span>长按图片将保存在您的手机</span>
      <div>
        <span>{state.params.vcPaymentUrlInfo.receiveAddress}</span>
        <i
          className='iconfont icon-other_icon-copy'
          onClick={() => {
            copy('123');
            toast.success('复制成功!');
          }}
        />
      </div>
      {/* 交易Id */}
      <div className={styles.last5NumberForTransactionId}>
        <p>交易ID后5位:</p>
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={5}
        />
      </div>
    </div>
  );
};
export default VirtualCurrencyInformation;
