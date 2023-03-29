import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Withdraw.module.scss';
import checked from '../../images/icon-选中.png';
import { ObjType } from '@/types/Common';
import BottomActionSheetForHasCards from '@/components/bottomActionSheetForHasCards/BottomActionSheetForHasCards';
import BankCardWithdrawInfo from '@/page/gamesLobby/components/recharge/components/withdraw/bankCardWithdrawInfo/BankCardWithdrawInfo';
import VirtualWalletWithdrawInfo from '@/page/gamesLobby/components/recharge/components/withdraw/virtualWalletWithdrawInfo/VirtualWalletWithdrawInfo';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

const Withdraw: FC = () => {
  const location = useLocation();
  const [tabsActive, setTabsActive] = useState(
    location.state ? (location.state as any).payment : 1
  );
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  // 各种绑卡,钱包的信息集合
  const [allUserWithdrawType, setAllUserWithdrawType] = useState<{
    realName: string;
    bankCards: ObjType[];
    virtualCurrency: ObjType[];
  }>({
    realName: '',
    bankCards: [],
    virtualCurrency: [],
  });
  // 当前银行卡信息
  const [currPayment, setCurrPayment] = useState<ObjType>({});
  // 当前虚拟币钱包信息
  const [currWallet, setCurrWallet] = useState<ObjType>({});
  // 用户提现信息(提现额度等...)
  const [withdrawInfo, setWithdrawInfo] = useState<ObjType>({
    withdrawableAmount: '****',
  });
  // 添加支付方式
  const addPayment = (): void => {
    if (tabsActive === 1) {
      navigate('/add-bank-cards');
    } else {
      navigate('/add-virtual-wallet');
    }
  };
  const tabs = [
    { id: 1, name: '银行卡提现' },
    { id: 2, name: '虚拟币提现' },
  ];

  // 设置当前的支付信息
  const handleOnClick = (data: ObjType) => {
    if (tabsActive === 1) {
      setCurrPayment(data);
    } else {
      setCurrWallet(data);
    }
  };
  const onClickTabs = (data: ObjType) => {
    const state = JSON.parse(JSON.stringify(location.state));
    navigate('/recharge', { state: { ...state, payment: data.id } });
    setTabsActive(data.id);
  };

  // 获取用户提现信息(提现额度等...)
  const getUserWithdrawInfo = async () => {
    const res = await $fetch.post('/lottery-api/withdraw/getUserWithdrawInfo');
    if (!res.success) return res.message && toast.fail(res);
    setWithdrawInfo(res.data);
  };

  // 查询所有提现类型
  const queryAllUserWithdrawType = async () => {
    const res = await $fetch.post(
      '/lottery-api/userBankCard/queryAllUserWithdrawType'
    );
    if (!res.success) return res.message && toast.fail(res);
    if (res.data.userWithdrawTypeList.length > 0) {
      const bankCards = res.data.userWithdrawTypeList.filter(
        (item: ObjType) => item.withdrawType === 1
      );
      setCurrPayment(bankCards[0]);
      const virtualCurrency = res.data.userWithdrawTypeList.filter(
        (item: ObjType) => item.withdrawType !== 1
      );
      setCurrWallet(virtualCurrency[0]);
      setAllUserWithdrawType((val) => {
        return { ...val, bankCards, virtualCurrency };
      });
    }
  };

  /**
   * 立即提现
   * withdrawType  1:银行卡|2:USDT|3:虚拟币
   */
  const handleOnWithdraw = async () => {
    toast.loading();
    const res = await $fetch.post('/lottery-api/withdraw/addWithdrawRecord', {
      withdrawAmount: amount,
      clientType: 3,
      bankCardId: tabsActive === 1 ? currPayment.id : '',
      withdrawWay: tabsActive === 1 ? 1 : currWallet.withdrawType === 3 ? 7 : 4,
      virtualCurrencyAccountId:
        tabsActive === 1
          ? ''
          : currWallet.withdrawType === 3
          ? currWallet.id
          : '',
      usdtAccountId:
        tabsActive === 1
          ? ''
          : currWallet.withdrawType === 3
          ? ''
          : currWallet.id,
      usdtCount:
        tabsActive === 1
          ? ''
          : currWallet.withdrawType === 3
          ? ''
          : +currWallet.exchangeRate * +amount,
    });
    if (!res.success) return toast.fail(res);
    await getUserDetail();
    toast.success('提现成功!');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const isDisable = () => {
    return (
      allUserWithdrawType.bankCards.length < 1 &&
      allUserWithdrawType.virtualCurrency.length < 1
    );
  };

  // componentDidMount
  useEffect(() => {
    toast.loading();
    Promise.all([getUserWithdrawInfo(), queryAllUserWithdrawType()]).finally(
      () => {
        toast.clear();
      }
    );
  }, []);
  return (
    <div className={styles.main}>
      <div className={styles.tabs}>
        {tabs.map((item) => (
          <div key={item.id}>
            <button
              className={`${tabsActive === item.id && styles['active-button']}`}
              onClick={() => onClickTabs(item)}
            >
              {item.name}
            </button>
            {tabsActive === item.id && <img src={checked} alt='checked' />}
          </div>
        ))}
      </div>
      {tabsActive === 1 ? (
        <div className={styles.overage}>
          <p>可提现额度:</p>
          <span>¥{withdrawInfo.withdrawableAmount} 元</span>
          <b>(请添加银行卡)</b>
        </div>
      ) : (
        <div className={styles.overage}>
          <p>可提现额度:</p>
          <span>{withdrawInfo.withdrawableAmount}</span>
          <b>(请添加虚拟币钱包)</b>
        </div>
      )}
      {tabsActive === 1 ? (
        <BankCardWithdrawInfo
          onChange={onChange}
          userWithdrawInfo={allUserWithdrawType.bankCards}
          currPayment={currPayment}
          setVisible={setVisible}
          addPayment={addPayment}
        />
      ) : (
        <VirtualWalletWithdrawInfo
          onChange={onChange}
          userWithdrawInfo={allUserWithdrawType.virtualCurrency}
          currPayment={currWallet}
          setVisible={setVisible}
          addPayment={addPayment}
        />
      )}
      <div className={styles.submit}>
        <button disabled={!amount || isDisable()} onClick={handleOnWithdraw}>
          立即提现
        </button>
      </div>
      <div className={styles['footer-tip']}>
        <p>提现需满足打码要求</p>
      </div>
      <BottomActionSheetForHasCards
        dataSource={
          tabsActive === 1
            ? allUserWithdrawType.bankCards
            : allUserWithdrawType.virtualCurrency
        }
        setVisible={setVisible}
        tabsActive={tabsActive}
        onClick={handleOnClick}
        title={tabsActive === 1 ? '选择银行卡' : '选择虚拟币钱包'}
        visible={visible}
      />
    </div>
  );
};
export default Withdraw;
