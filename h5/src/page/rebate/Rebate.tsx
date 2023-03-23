import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header4 from '@/components/header4/Header4';
import styles from './Rebate.module.scss';
import coinLogo from '@/assets/images/rebate/WashCode_money@2x.png';
import logo from '@/assets/images/rebate/WashCode_Bg@2x.png';
import { sleep } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

const Rebate: FC = () => {
  const navigate = useNavigate();
  const [rebate, setRebate] = useState('--');
  // 查询返水金额
  const queryReceivableWashBetAmount = async () => {
    const res = await $fetch.post(
      '/lottery-api/thirdWashBetRecord/queryReceivableWashBetAmount'
    );
    if (!res.success) return toast.fail(res);
    setRebate(res.data.totalReceivableWashBetAmount);
  };

  // 领取返水
  const receiveThirdWashBet = async () => {
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/thirdWashBetRecord/receiveThirdWashBet'
    );
    if (!res.success) return toast.fail(res);
    toast.success('领取成功!');
  };

  const handleClick = async () => {
    if (!Number.isNaN(rebate)) {
      if (+rebate > 0) {
        await receiveThirdWashBet();
        await queryReceivableWashBetAmount();
      } else {
        navigate(-1);
        await sleep(280);
        navigate('/');
      }
    }
  };
  // componentDidMount
  useEffect(() => {
    queryReceivableWashBetAmount();
  }, []);
  return (
    <div className={styles['rebate-container']}>
      <Header4 title='我的返水' left rightText='返水记录' />
      <div className={styles['rebate-body']}>
        <div className={styles['rebate-main']}>
          <div className={styles['rebate-content']}>
            <div className={styles.logo}>
              <img src={logo} alt='logo' />
            </div>
            <div className={styles.amount}>
              <div>
                <img src={coinLogo} alt='coinLogo' />
                <p>{rebate}</p>
              </div>
              <h4>{+rebate > 0 ? '我的返水金额' : '您暂无洗码，请先游戏'}</h4>
            </div>
            <div className={styles.btn}>
              <button onClick={handleClick}>
                {+rebate > 0 ? '领取返水' : '前往游戏'}
              </button>
            </div>
            <p className={styles.tip}>由于注单延迟 下注后15分钟左右再领取</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Rebate;
