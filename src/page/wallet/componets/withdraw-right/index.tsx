import React, { memo, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';

import { useDispatch } from 'react-redux';
import { paste, clearInput, isMobile } from '@/page/wallet/utils';
import { useSelector } from '@/redux/hook';
import {
  fetchWalletWithdrawInfoAction,
  fetchWalletWithdrawRecordAction,
} from '@/redux/wallet';
import { AppDispatch } from '@/redux/store';
import styled from './style.module.scss';

const WithDrawRight: React.FC = memo(() => {
  const [address, setAddress] = useState('');
  const [money, setMoney] = useState('');
  const [googleCode, setGoogleCode] = useState('');
  const { t } = useTranslation();

  const {
    withDrawCoinTypeName,
    withDrawCoinChainName,
    withDrawCoinInfo,
    withDrawCoinCode,
  } = useSelector((state) => ({
    withDrawCoinTypeName: state.wallet.withDrawCoinTypeName,
    withDrawCoinChainName: state.wallet.withDrawCoinChainName,
    withDrawCoinInfo: state.wallet.withDrawCoinInfo,
    withDrawCoinCode: state.wallet.withDrawCoinCode,
  }));

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (withDrawCoinCode !== 0) {
      setAddress('');
      setMoney('');
      setGoogleCode('');
    }
  }, [withDrawCoinCode]);

  /** 提交 */
  const submitHandel = async () => {
    await dispatch(
      fetchWalletWithdrawRecordAction({
        chainName: withDrawCoinChainName, // 提现链名
        withdrawAddress: address, // 收款地址
        withdrawVirtualAmount: money, // 提币数量
        googleCode, // 谷歌验证码
        withdrawWay: 4, // 提现方式
        currencyType: withDrawCoinInfo?.currencyType, // 币种类型
        clientType: isMobile() ? 3 : 4, // 客户端类型
        exchangeRate: withDrawCoinInfo?.exchangeRate, // 汇率
      })
    );
    /** 刷新提币信息 */
    dispatch(fetchWalletWithdrawInfoAction());
  };

  /** 校验 */
  const validInput = (name: string, value: string) => {
    if (name === 'money') {
      if (withDrawCoinInfo) {
        if (+value > +withDrawCoinInfo.balance) {
          return Toast.show({ content: t('recods.withdrawalgreater') });
        }
      }
    }
  };

  /** 输入金额 */
  const changeValue = (e: React.BaseSyntheticEvent) => {
    validInput(e.target.name, e.target.value);
    if (e.target.name === 'money') {
      let val = e.target.value;
      val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      setTimeout(() => {
        flushSync(setMoney(val) as any);
      });
    }
  };

  /** 限制输入 */
  const changeGoogleValue = (e: React.BaseSyntheticEvent) => {
    if (e.target.name === 'googleCode') {
      if (e.target.value.length > 6) {
        e.target.value = e.target.value.slice(0, 6);
      }
    }
  };

  return (
    <div className={styled.rightWrapper}>
      <div>
        <div className={styled.box}>
          <div className={styled.title}>{t('wallet.WithdrawAddress')}</div>
          <div className={styled.input}>
            <input
              type='text'
              placeholder={t('wallet.EnterAddress')}
              name='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <span onClick={async () => setAddress(await paste())}>
              {t('wallet.paste')}
            </span>
          </div>
        </div>
        <div className={styled.box}>
          {withDrawCoinInfo?.balance && (
            <div className={styled.title}>
              <span>{t('wallet.WithdrawalAmount')}：</span>
              <span className={styled.right}>
                {t('wallet.balance')}：
                {`${withDrawCoinInfo?.balance} ${withDrawCoinTypeName}`}
              </span>
            </div>
          )}
          <div className={styled.input}>
            <input
              type='number'
              placeholder={t('wallet.EnterWithdrawalAmount')}
              name='money'
              value={money}
              onInput={(e) => changeGoogleValue(e)}
              onKeyDown={(e) => clearInput(e, false)}
              onChange={(e) => changeValue(e)}
            />
            <span onClick={() => setMoney(withDrawCoinInfo?.balance)}>
              {t('wallet.all')}
            </span>
          </div>
        </div>
        <div className={styled.box}>
          <div className={styled.title}>{t('wallet.VerificationCode')}</div>
          <div className={styled.input}>
            <input
              placeholder={t('wallet.EnterVerificationCode')}
              type='number'
              name='googleCode'
              value={googleCode}
              onInput={(e) => changeGoogleValue(e)}
              onKeyDown={(e) => clearInput(e)}
              onChange={(e) => setGoogleCode(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styled.btn} onClick={submitHandel}>
        {t('wallet.submit')}
      </div>
    </div>
  );
});

export default WithDrawRight;
