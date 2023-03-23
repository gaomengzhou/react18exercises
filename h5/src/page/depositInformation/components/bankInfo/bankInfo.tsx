import { FC } from 'react';
import copy from 'copy-to-clipboard';
import styles from '@/page/depositInformation/DepositInformation.module.scss';
import { toast } from '@/utils/tools/toast';

interface BankInfoProps {
  params: any;
  amount: string;
}
const BankInfo: FC<BankInfoProps> = ({ params, amount }) => {
  // copy
  const handleCopy = (text: string) => {
    copy(text);
    toast.success('复制成功!');
  };

  return (
    <>
      <div className={styles.mainTitle}>
        <p>官方收款账户</p>
        <span>请存入以下方账户，完成支付</span>
      </div>
      <div className={styles.mainItems}>
        <div className={styles.mainItemsTop}>
          <div className={styles.bankLogo}>
            <img src={params.bankCardLogoUrl || ''} alt='logo' />
          </div>
          <p>{params.variableInfoList[1].value || ''}</p>
        </div>
        <div>
          <p>
            姓名: <span>{params.variableInfoList[0].value || ''}</span>
          </p>
          <button
            onClick={() => handleCopy(params.variableInfoList[0].value || '')}
          >
            复制
          </button>
        </div>
      </div>
      <div className={styles.mainItems}>
        <div>
          <p>
            账号: <span>{params.variableInfoList[2].value}</span>
          </p>
          <button onClick={() => handleCopy(params.variableInfoList[2].value)}>
            复制
          </button>
        </div>
      </div>
      <div className={styles.mainItems}>
        <div>
          <div className={styles.amountLine}>
            <p>
              金额: <span>{amount}</span>
            </p>
            <span className={styles.tip}>转账信息必须与订单金额一致</span>
          </div>
          <button onClick={() => handleCopy(amount)}>复制</button>
        </div>
      </div>
      {params.variableInfoList[3].value && (
        <div className={styles.mainItems}>
          <div>
            <p>
              地址: <span>{params.variableInfoList[3].value}</span>
            </p>
            <button
              onClick={() => handleCopy(params.variableInfoList[3].value)}
            >
              复制
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default BankInfo;
