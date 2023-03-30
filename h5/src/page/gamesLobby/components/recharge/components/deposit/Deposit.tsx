import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import styles from './Deposit.module.scss';
import PaymentSwiper from '@/page/gamesLobby/components/recharge/components/paymentSwiper/PaymentSwiper';
import checked from '@/page/gamesLobby/components/recharge/images/icon-选中.png';
import DepositAmount from '@/page/gamesLobby/components/recharge/components/depositAmount/DepositAmount';
import { ObjType } from '@/types/Common';
import { toast } from '@/utils/tools/toast';
import { queryFastCurrencyList } from '@/page/gamesLobby/components/recharge/components/deposit/DepositApi';

const Deposit: FC = () => {
  const navigate = useNavigate();
  // 是否是快闪/usdt充值
  const [isQb, setIsQb] = useState(0);
  // 选择渠道
  const [active, setActive] = useState(0);
  // 虚拟币汇率信息
  const [buyRateInfo, setBuyRateInfo] = useState({
    buyRate: '0.00',
    coinName: '',
  });
  // 支付方式的active
  const [paymentActive, setPaymentActive] = useState(-1);
  // 真实姓名
  const [realName, setRealName] = useState('');
  // 支付方式
  const [fastPayment, setFastPayment] = useState<ObjType[]>([]);
  // 支付渠道
  const [paymentChannel, setPaymentChannel] = useState<ObjType[]>([]);
  // 快闪/USDT支付渠道
  const [isQbPaymentChannel, setIsQbPaymentChannel] = useState<ObjType[]>([]);
  // 选中的快闪/USDT支付渠道
  const [currIsQbPaymentChannel, setCurrIsQbPaymentChannel] = useState<ObjType>(
    {}
  );
  // 选中支付渠道
  const [currPaymentChannel, setCurrPaymentChannel] = useState<ObjType>({});
  // input框金额
  const [amount, setAmount] = useState('');
  // 快捷金额
  const [fastAmountList, setFastAmountList] = useState<ObjType[]>([]);
  // 是否禁用开关
  const isDisable = () => {
    if (currPaymentChannel.paymentType === 1) {
      return paymentActive === -1 || !amount || !realName;
    }
    return paymentActive === -1 || !amount;
  };

  // 获取虚拟币汇率
  const getVcRateByPaymentId = async (id: number) => {
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/lottery-api/recharge/getVcRateByPaymentId',
      { id }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setBuyRateInfo(res.data);
  };

  // 获取快捷金额列表
  const getFastAmountList = async ({
    paymentId,
    paymentType,
  }: {
    paymentId: number;
    paymentType: number;
  }) => {
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/config-api/fastPayment/queryFastAmountList',
      {
        paymentId,
        paymentType,
      }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setFastAmountList(res.data);
  };
  // 查询全部快捷支付方式
  const queryAllFastPayment = async () => {
    toast.loading();
    const res = await $fetch.post(
      '/config-api/fastPayment/queryAllFastPayment'
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setFastPayment(res.data);
  };
  // 获取支付渠道
  const getPaymentChannel = async (id: number) => {
    setAmount('');
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/config-api/fastPayment/queryPaymentListById',
      { id }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setPaymentChannel(res.data);
    setCurrPaymentChannel(res.data[0]);
    if (res.data[0].isOnlyUseFastAmount === 1) {
      await getFastAmountList({
        paymentId: res.data[0].paymentId,
        paymentType: res.data[0].paymentType,
      });
    }
    if (res.data[0].paymentType === 5) {
      await getVcRateByPaymentId(res.data[0].paymentId);
    }
  };

  // 根据快闪列表查渠道
  const addQbWalletAddress = async (
    chainName: string,
    currencyType: number
  ) => {
    toast.loading({ mask: false });
    const res = await $fetch.post('/lottery-api/recharge/addQbWalletAddress', {
      chainName,
      currencyType,
    });
    toast.clear();
    if (!res.success) return toast.fail(res);
    const data = await queryFastCurrencyList();
    setIsQbPaymentChannel(data.data);
    return res;
  };

  // 点击支付渠道
  const handlePaymentChannel = async (data: ObjType, i: number) => {
    if (i === active) return;
    setAmount('');
    if (data.isOnlyUseFastAmount === 1) {
      await getFastAmountList({
        paymentId: data.paymentId,
        paymentType: data.paymentType,
      });
    }
    if (data.paymentType === 5) {
      await getVcRateByPaymentId(data.paymentId);
    }
    // 快闪/USDT
    if (isQb === 1) {
      if (!data.address) {
        const res = await addQbWalletAddress(data.chainName, data.currencyType);
        const item = { ...data, ...res.data };
        setCurrIsQbPaymentChannel(item);
        return;
      }
      setCurrIsQbPaymentChannel(data);
    }
    setActive(i);
    setCurrPaymentChannel(data);
  };

  // 点击支付
  const clickPayment = async (data: ObjType) => {
    setIsQb(data.isQb);
    setActive(0);
    setRealName('');
    if (data.isQb === 1) {
      const res = await queryFastCurrencyList();
      setIsQbPaymentChannel(res.data);
      if (!res.data[0].address) {
        await addQbWalletAddress(
          res.data[0].chainName,
          res.data[0].currencyType
        );
      }
      return;
    }
    await getPaymentChannel(data.id);
  };
  const onSubmit = async () => {
    if (paymentActive === -1) {
      return toast.show({ content: '请选择支付方式!' });
    }
    if (currPaymentChannel.paymentType === 1 && !realName) {
      return toast.show({ content: '请输入真实姓名!' });
    }
    if (!amount) {
      return toast.show({ content: '请输入金额!' });
    }
    if (currPaymentChannel.paymentType === 5) {
      return toast.show({ content: '虚拟币充值马上开放,敬请期待!' });
    }
    toast.loading();
    const res = await $fetch.post('/lottery-api/recharge/addRechargeRecord', {
      realName,
      paymentId: currPaymentChannel.paymentId,
      paymentType: currPaymentChannel.paymentType,
      amount,
      virtualCurrencyRate:
        currPaymentChannel.paymentType === 5 ? buyRateInfo.buyRate : '',
    });
    toast.clear();
    if (!res.success) return toast.fail(res);
    if (currPaymentChannel.paymentType === 4) {
      window.open(res.data.viewData);
      return;
    }
    navigate(
      `/deposit-information/${currPaymentChannel.paymentType}/${res.data.id}`,
      {
        state: { params: currPaymentChannel, amount, res: res.data },
      }
    );
    setAmount('');
  };

  // componentDidMount
  useEffect(() => {
    queryAllFastPayment();
  }, []);
  return (
    <div className={`${styles.main} deposit-scroll-main`}>
      <div className={`${styles['common-label']} ${styles.payment}`}>
        <div className={styles.label}>
          <span>*</span>
          <p>支付方式</p>
        </div>
        <PaymentSwiper
          onClick={clickPayment}
          dataSource={fastPayment}
          active={paymentActive}
          setActive={setPaymentActive}
        />
      </div>
      {(paymentChannel.length > 0 || isQbPaymentChannel.length > 0) && (
        <div className={`${styles['common-label']}`}>
          <div className={styles.label}>
            <span>*</span>
            <p>选择渠道</p>
          </div>
          <div className={styles.paymentChannel}>
            {isQb === 0
              ? paymentChannel.map((item, index) => (
                  <div
                    className={`${active === index && styles.activeChannel}`}
                    onClick={() => handlePaymentChannel(item, index)}
                    key={item.paymentId}
                  >
                    <h6>{item.paymentName}</h6>
                    <p>
                      单笔金额{item.minAmount}-{item.maxAmount}
                    </p>
                    {index === active && <img src={checked} alt='checked' />}
                  </div>
                ))
              : isQbPaymentChannel.map((item, index) => (
                  <div
                    className={`${active === index && styles.activeChannel}`}
                    onClick={() => handlePaymentChannel(item, index)}
                    key={item.chainName}
                  >
                    <h6>{item.chainShowName}</h6>
                    {index === active && <img src={checked} alt='checked' />}
                  </div>
                ))}
          </div>
        </div>
      )}
      {currPaymentChannel.paymentType === 1 && isQb === 0 && (
        <div className={`${styles['common-label']}`}>
          <div className={styles.label}>
            <span>*</span>
            <p>存款人姓名</p>
            <b>为了您的资金安全，请使用绑定的姓名存款</b>
          </div>
          <input
            type='text'
            placeholder='为了及时到账，请务必输入正确的存款人姓名'
            value={realName}
            onChange={(event) => setRealName(event.target.value)}
          />
        </div>
      )}
      {isQb === 0 && (
        <div className={`${styles['common-label']}`}>
          <div className={styles.label}>
            <span>*</span>
            <p>存款金额</p>
          </div>
          {currPaymentChannel.isOnlyUseFastAmount !== 1 && (
            <div className={styles.inp}>
              <input
                type='number'
                value={amount}
                placeholder='选定金额或者输入金额'
                onChange={(e) => setAmount(e.target.value)}
              />
              <p>¥</p>
            </div>
          )}
          {currPaymentChannel.isOnlyUseFastAmount === 1 && (
            <DepositAmount
              amount={amount}
              setAmount={setAmount}
              dataSource={fastAmountList}
            />
          )}
        </div>
      )}
      {isQb === 0 ? (
        <button
          className={`${styles.submit} ${isDisable() && 'disableBtn'}`}
          onClick={onSubmit}
        >
          立即存款
        </button>
      ) : (
        <div className={`${styles['common-label']}`}>
          <div className={styles.label}>
            <span>*</span>
            <p>存款地址</p>
          </div>
          <div className={styles.qrBox}>
            <QRCode
              className={styles.qrcode}
              value={currIsQbPaymentChannel.address}
              // bgColor='#fff1d1' // 二维码背景颜色
              // fgColor='#c7594a' // 二维码图案颜色
            />
            <p className={styles.savePicture}>图片将保存在您的手机相册</p>
            <div className={styles.address}>
              <p>{currIsQbPaymentChannel.address}</p>
              <i
                className='iconfont icon-other_icon-copy'
                onClick={() => {
                  copy(currIsQbPaymentChannel.address);
                  toast.success('复制成功!');
                }}
              />
            </div>
          </div>
          <div className={styles.usdtTip}>
            <p>说明：</p>
            <p>
              根据商户后台-出入款管理-入款设置-快闪款钱包设置里面的充 值说明配置
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Deposit;
