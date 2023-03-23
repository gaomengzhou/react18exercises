import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './DepositInformation.module.scss';
import { countdown, getUserDetail, sleep } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';
import BankInfo from '@/page/depositInformation/components/bankInfo/bankInfo';
import { ObjType } from '@/types/Common';
import QrcodeInfo from '@/page/depositInformation/components/qrcodeInfo/QrcodeInfo';
import VirtualCurrencyInformation from '@/page/depositInformation/components/virtualCurrencyInformation/virtualCurrencyInformation';

let locationState: ObjType;
let count = 900000;
const DepositInformation: FC = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState<any>('15:00');
  const { payment, id } = useParams<{ payment: string; id: string }>();
  // 解决路由动画bug
  if (location.pathname.includes('/deposit-information/')) {
    locationState = { ...location.state };
  }
  const submit = async () => {
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/lottery-api/recharge/getRechargeRecordDetail',
      {
        id,
      }
    );
    if (!res.success) return toast.fail(res);
    await getUserDetail();
    toast.success('已提交充值信息');
    await sleep(2000);
    navigate(-1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      count -= 1000;
      const now = countdown(count);
      setTime(now);
    }, 1000);
    return () => {
      count = 900000;
      clearInterval(timer);
    };
  }, []);
  return (
    <div className={styles.container}>
      <Header title='存款信息' left right />
      <div className={styles.body}>
        <div className={styles.topInfo}>
          <h3>¥{locationState.amount}</h3>
          <p>存入金额</p>
          <p>
            请在<i>{time}</i>内完成
          </p>
          <span>(存入金额请与以上金额一致，或者无法到帐)</span>
        </div>
        <div className={styles.main}>
          {payment && +payment === 1 && (
            <BankInfo
              params={locationState.params}
              amount={locationState.amount}
            />
          )}
          {payment && +payment === 3 && <QrcodeInfo state={locationState} />}
          {payment && +payment === 5 && (
            <VirtualCurrencyInformation state={locationState} />
          )}
        </div>
        <div className={styles.btn}>
          <button onClick={submit}>我已完成转账</button>
        </div>
        {payment && +payment !== 3 && (
          <div className={styles.footer}>
            <h5>*重要提醒</h5>
            <p>1. 转账金额必须与订单金额一致，否则存款无法及时到账。</p>
            <p>2. 每次存款时请获取新的官方收款账号，存入旧账号将无法到账；</p>
            <p>3. 请及时按通道要求存款</p>
            <p>4. 请勿使用支付宝、微信转账至公司账户；</p>
            <p>5. 若存在疑问，请联系在线客服</p>
          </div>
        )}
        {payment && +payment === 3 && (
          <div className={styles.footer}>
            <h5>*重要提醒</h5>
            <p>
              1. 若存在疑问，请联系
              <span
                onClick={() => {
                  navigate('/customer-service');
                }}
              >
                在线客服
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default DepositInformation;
