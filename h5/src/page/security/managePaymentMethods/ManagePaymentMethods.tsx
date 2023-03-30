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
  const [allUserWithdrawType, setAllUserWithdrawType] = useState<{
    realName: string;
    bankCards: ObjType[];
    virtualCurrency: ObjType[];
  }>({
    realName: '',
    bankCards: [],
    virtualCurrency: [],
  });

  // 获取用户提现信息(卡片,钱包等)
  const getUserWithdrawInfo = async () => {
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/userBankCard/queryAllUserWithdrawType'
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    if (res.data.userWithdrawTypeList.length > 0) {
      const bankCards = res.data.userWithdrawTypeList.filter(
        (item: ObjType) => item.withdrawWay === 1
      );
      const virtualCurrency = res.data.userWithdrawTypeList.filter(
        (item: ObjType) => item.withdrawWay !== 1
      );
      setAllUserWithdrawType((val) => {
        return { ...val, bankCards, virtualCurrency };
      });
    }
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
    if (allUserWithdrawType.bankCards.length > 0 && type === 'bank-cards') {
      return allUserWithdrawType.bankCards.map((item: ObjType) => (
        <div className={styles.items} key={item.id}>
          {item.logoUrl && (
            <div className={styles.itemsLeft}>
              <img src={item.logoUrl} alt='logo' />
            </div>
          )}

          <div className={styles.itemsRight}>
            <p>{item.withdrawName}</p>
            <div>
              {dotList.map((dot) => (
                <b key={dot} className={`${dot % 4 === 0 && styles.marginB}`} />
              ))}
              <p>{cardNumberFormat(item.withdrawAccount)}</p>
            </div>
          </div>
        </div>
      ));
    }
    if (
      allUserWithdrawType.virtualCurrency.length > 0 &&
      type !== 'bank-cards'
    ) {
      return allUserWithdrawType.virtualCurrency.map((item: ObjType) => (
        <div
          className={`${styles.items} ${
            type !== 'bank-cards' && styles.virtualItems
          }`}
          key={item.id}
        >
          {item.logoUrl && (
            <div className={styles.itemsLeft}>
              <img src={item.logoUrl} alt='logo' />
            </div>
          )}
          <div className={styles.itemsRight}>
            <p>{item.withdrawName}</p>
            <div>
              {dotList.map((dot) => (
                <b key={dot} className={`${dot % 4 === 0 && styles.marginB}`} />
              ))}
              <p>{cardNumberFormat(item.withdrawAccount)}</p>
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
