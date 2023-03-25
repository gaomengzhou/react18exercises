import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './ManagePaymentMethods.module.scss';
import noData from '@/assets/images/managePaymentMethods/icon_nobank.png';
import { ObjType } from '@/types/Common';
import { cardNumberFormat } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

const dotList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
const ManagePaymentMethods: FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [allUserWithdrawType, setAllUserWithdrawType] = useState<ObjType>({
    bankCardInfo: { cardList: [] },
    virtualAccountInfoList: [],
  });

  // 获取用户提现信息(卡片,钱包等)
  const getUserWithdrawInfo = async () => {
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/userBankCard/queryAllUserWithdrawType'
    );
    toast.clear();
    if (!res.success) return res.message && toast.fail(res);
    setAllUserWithdrawType(res.data);
  };

  // componentDidMount
  useEffect(() => {
    getUserWithdrawInfo();
  }, []);

  const toAddPaymentMethods = () => {
    if (type === 'bank-cards') {
      navigate('/add-bank-cards');
      return;
    }
    navigate('/add-virtual-wallet');
  };

  // 渲染内容
  const renderContent = () => {
    if (
      allUserWithdrawType.bankCardInfo.cardList.length > 0 &&
      type === 'bank-cards'
    ) {
      return allUserWithdrawType.bankCardInfo.cardList.map(
        (item: ObjType, i: number) => (
          <div className={styles.items} key={i}>
            {item.bankLogo && (
              <div className={styles.itemsLeft}>
                <img src={item.bankLogo} alt='logo' />
              </div>
            )}

            <div className={styles.itemsRight}>
              <p>{item.bankName}</p>
              <div>
                {dotList.map((dot) => (
                  <b
                    key={dot}
                    className={`${dot % 4 === 0 && styles.marginB}`}
                  />
                ))}
                <p>{cardNumberFormat(item.bankCardNo)}</p>
              </div>
            </div>
          </div>
        )
      );
    }
    if (
      allUserWithdrawType.virtualAccountInfoList.length > 0 &&
      type !== 'bank-cards'
    ) {
      return allUserWithdrawType.virtualAccountInfoList.map((item: ObjType) => (
        <div
          className={`${styles.items} ${
            type !== 'bank-cards' && styles.virtualItems
          }`}
          key={item.virtualCurrencyAccountId}
        >
          {item.logoUrl && (
            <div className={styles.itemsLeft}>
              <img src={item.logoUrl} alt='logo' />
            </div>
          )}
          <div className={styles.itemsRight}>
            <p>{item.paymentChannelName}</p>
            <div>
              {dotList.map((dot) => (
                <b key={dot} className={`${dot % 4 === 0 && styles.marginB}`} />
              ))}
              <p>{cardNumberFormat(item.virtualAddress)}</p>
            </div>
          </div>
        </div>
      ));
    }
    return <img className={styles.noData} src={noData} alt='logo' />;
  };
  return (
    <div className={styles.managePaymentMethodsContainer}>
      <Header
        title={type === 'bank-cards' ? '提现银行卡管理' : '提现虚拟币钱包管理'}
        right
        left
      />
      <div className={styles.managePaymentMethodsBody}>
        <div className={styles.managePaymentMethodsContent}>
          {renderContent()}
        </div>
        <div className={styles.managePaymentMethodsBtn}>
          <button onClick={toAddPaymentMethods}>
            {type === 'bank-cards' ? '添加银行卡' : '添加虚拟币钱包'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManagePaymentMethods;