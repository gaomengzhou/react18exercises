import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './AddVirtualWallet.module.scss';
import rightArrow from '@/assets/images/home_quick_go~iphone@2x.png';
import BottomActionSheet from '@/components/bottomActionSheet/BottomActionSheet';
import { ObjType } from '@/types/Common';
import { toast } from '@/utils/tools/toast';

const AddVirtualWallet: FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<ObjType[]>([]);
  const [walletInfo, setWalletInfo] = useState({
    virtualAddress: '',
    remark: '',
    ogoUrl: '',
    paymentChannelName: '',
    thirdPaymentId: 0,
    virtualCurrencyType: 1,
    chainName: '',
  });

  const bindUserVirtualCurrencyAccount = async () => {
    const {
      virtualAddress,
      remark,
      thirdPaymentId,
      virtualCurrencyType,
      chainName,
    } = walletInfo;
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/userVirtualCurrencyAccount/bindUserVirtualCurrencyAccount',
      { virtualAddress, remark, thirdPaymentId, virtualCurrencyType, chainName }
    );
    if (!res.success) {
      return res.message && toast.fail(res);
    }
    toast.success('绑定成功!');
    navigate(-1);
  };

  const onSubmit = () => {
    if (!walletInfo.paymentChannelName) {
      return toast.show({ content: '请选择收款钱包' });
    }
    if (!walletInfo.virtualAddress) {
      return toast.show({ content: '请填写钱包地址' });
    }
    bindUserVirtualCurrencyAccount();
  };

  const onClick = (data: ObjType) => {
    setWalletInfo((val) => {
      return { ...val, ...data };
    });
  };

  const queryUserUnbindVirtualCurrencyInfoList = async () => {
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/userVirtualCurrencyAccount/queryUserUnbindVirtualCurrencyInfoList'
    );
    toast.clear();
    if (!res.success) return res.message && toast.fail(res);
    setState(res.data);
  };

  const onChangeVirtualAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletInfo((val) => {
      return { ...val, ...{ virtualAddress: e.target.value } };
    });
  };

  const onChangeRemark = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletInfo((val) => {
      return { ...val, ...{ remark: e.target.value } };
    });
  };

  // componentDidMount
  useEffect(() => {
    queryUserUnbindVirtualCurrencyInfoList();
  }, []);
  return (
    <div className={styles['add-virtual-wallet']}>
      <Header title='添加虚拟币钱包' left right />
      <div className={styles['main-box']}>
        <div className={styles.main}>
          <div className={styles.list}>
            <h3>收款钱包</h3>
            <div
              className={styles.virtualCurrency}
              onClick={() => setVisible(true)}
            >
              <p>{walletInfo.paymentChannelName || '请选择钱包类型'}</p>

              <img src={rightArrow} alt='箭头' />
            </div>
          </div>
          <div className={styles.list}>
            <h3>钱包地址</h3>
            <input
              type='text'
              value={walletInfo.virtualAddress}
              onChange={onChangeVirtualAddress}
              placeholder='请输入或者黏贴钱包地址'
            />
          </div>
          <div className={styles.list}>
            <h3>备注信息</h3>
            <input
              type='text'
              placeholder='请填写您的备注信息'
              value={walletInfo.remark}
              onChange={onChangeRemark}
            />
          </div>
          <div
            className={`${styles.submit} ${
              (!walletInfo.virtualAddress || !walletInfo.paymentChannelName) &&
              styles.disable
            }`}
          >
            <button onClick={onSubmit}>确认添加</button>
          </div>
          <div>
            <BottomActionSheet
              dataSource={state}
              title='选择所属币种'
              setVisible={setVisible}
              visible={visible}
              onClick={onClick}
              type={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddVirtualWallet;
