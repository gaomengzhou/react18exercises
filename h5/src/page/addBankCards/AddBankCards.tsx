import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './AddBankCards.module.scss';
import rightArrow from '@/assets/images/home_quick_go~iphone@2x.png';
import BottomActionSheet from '@/components/bottomActionSheet/BottomActionSheet';
import { ObjType } from '@/types/Common';
import { toast } from '@/utils/tools/toast';

const AddBankCards: FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<ObjType>({});
  const [realName, setRealName] = useState('');
  const [bankCardInfo, setBankCardInfo] = useState<undefined | ObjType>(
    undefined
  );
  // 银行卡号
  const [cardNum, setCardNum] = useState('');
  // 开户网点
  const [accOpeningLocation, setAccOpeningLocation] = useState('');
  const [bankList, setBankList] = useState<ObjType[]>([]);

  const bindUserBankCard = async () => {
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/userBankCard/bindUserBankCard',
      {
        bankCardNo: cardNum,
        bankId: bankCardInfo?.bankId,
        bankName: bankCardInfo?.bankName,
        realName: realName || info.realName2,
      }
    );
    if (!res.success) return res.message && toast.fail(res);
    toast.success('绑定成功!');
    navigate(-1);
  };
  const onSubmit = async () => {
    if (!info.realName && !realName) {
      return toast.show({ content: '请填写真实姓名' });
    }
    if (!bankCardInfo?.bankName) {
      return toast.show({ content: '请选择开户行' });
    }
    if (!cardNum) {
      return toast.show({ content: '请填写银行卡号' });
    }
    await bindUserBankCard();
  };
  const onClick = (data: ObjType) => {
    setBankCardInfo(data);
  };
  // 支付信息
  const queryAllUserWithdrawType = async () => {
    const res = await $fetch.post(
      '/lottery-api/userBankCard/queryAllUserWithdrawType'
    );
    if (!res.success) return res.message && toast.fail(res);
    setInfo((values) => {
      return { ...values, ...res.data };
    });
  };

  // 不带码的名字
  const getName = async () => {
    const res = await $fetch.post(
      '/lottery-api/userBankCard/queryAllUserBankCardByUserId'
    );
    if (!res.success) return res.message && toast.fail(res);
    setInfo((val) => {
      return { ...val, realName2: res.data.realName };
    });
  };

  // 获取所有银行卡
  const queryAllBank = async () => {
    const res = await $fetch.post('/config-api/bank/queryAllBank');
    if (!res.success) return res.message && toast.fail(res);
    setBankList(res.data);
  };

  // componentDidMount
  useEffect(() => {
    toast.loading();
    Promise.all([
      queryAllBank(),
      queryAllUserWithdrawType(),
      getName(),
    ]).finally(() => {
      toast.clear();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['add-bank-cards-container']}>
      <Header title='添加银行卡' left right />
      <div className={styles['main-box']}>
        <div className={styles.main}>
          <div className={styles.list}>
            <h3>持卡人姓名</h3>
            {info.realName ? (
              <p className={styles.name}>{info.realName}</p>
            ) : (
              <input
                type='text'
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder='请填写真实姓名'
              />
            )}
          </div>
          <div className={styles.list}>
            <h3>选择银行</h3>
            <div className={styles.bank} onClick={() => setVisible(true)}>
              {!bankCardInfo && <p>请选择开户行</p>}
              {bankCardInfo?.bankName && <p>{bankCardInfo.bankName}</p>}
              <img src={rightArrow} alt='箭头' />
            </div>
          </div>
          <div className={styles.list}>
            <h3>银行卡号</h3>
            <input
              type='number'
              value={cardNum}
              onChange={(e) => setCardNum(e.target.value)}
              placeholder='请填写或者黏贴您的银行卡号'
            />
          </div>
          <div className={styles.list}>
            <h3>开户网点</h3>
            <input
              type='text'
              value={accOpeningLocation}
              onChange={(e) => setAccOpeningLocation(e.target.value)}
              placeholder='请填写银行卡所属开户网点'
            />
          </div>
          <div
            className={`${styles.submit} ${
              (!bankCardInfo?.bankName ||
                !cardNum ||
                (!info.realName && !realName)) &&
              styles.disable
            }`}
          >
            <button onClick={onSubmit}>确认添加</button>
          </div>
          <div>
            <BottomActionSheet
              title='选择所属银行'
              setVisible={setVisible}
              visible={visible}
              dataSource={bankList}
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddBankCards;
