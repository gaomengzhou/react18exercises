import React, { memo, useEffect, useState, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';
import {
  fetchExchangeInfoAction,
  fetchExchangeCurrencyAction,
  changeIsShowHistoryAction,
  changeIsShowWalletAction,
  changeTabCurrentIndexAction,
} from '@/redux/wallet';
import { AppDispatch } from '@/redux/store';
import { useSelector } from '@/redux/hook';
import { clearInput } from '@/page/wallet/utils';
import styled from './style.module.scss';

const Exchange: React.FC = memo(() => {
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeCurrencyType, setExchangeCurrencyType] = useState(0);
  const [afterExchangeCurrencyType, setAfterExchangeCurrencyType] = useState(1);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { exchangeInfo, exchangeCode } = useSelector((state) => ({
    exchangeInfo: state.wallet.exchangeInfo,
    exchangeCode: state.wallet.exchangeCode,
  }));
  const dispatch = useDispatch<AppDispatch>();

  /** 获取用户钱包兑换信息 */
  useEffect(() => {
    dispatch(fetchExchangeInfoAction());
  }, [dispatch]);

  /** 保存当前兑换的币种 */
  useEffect(() => {
    setExchangeCurrencyType(exchangeInfo.exchangeCurrencyType);
    setAfterExchangeCurrencyType(exchangeInfo.afterExchangeCurrencyType);
  }, [exchangeInfo]);

  /** 是否兑换成功 */
  useEffect(() => {
    if (exchangeCode !== 0) {
      setExchangeAmount('');
    }
  }, [exchangeCode]);

  /** 计算输入后的兑换数量 */
  const exchangeAmountTip = useMemo(() => {
    if (+exchangeAmount > 0) {
      return Math.floor(Number(exchangeAmount) * 100) / 100;
    }
    return '0.00';
  }, [exchangeAmount]);

  /** 校验 */
  const validInput = (name: string, value: string) => {
    if (exchangeInfo) {
      if (+value > +exchangeInfo.giftBalance) {
        return Toast.show({ content: t('recods.withdrawalgreater') });
      }
    }
  };

  /** 输入金额 */
  const changeValue = (e: React.BaseSyntheticEvent) => {
    validInput(e.target.name, e.target.value);
    let val = e.target.value;
    val = val
      .replace(/[^\d/.]/g, '')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    setTimeout(() => {
      flushSync(setExchangeAmount(val) as any);
    });
  };

  /** 立即兑换 */
  const submitHandel = async () => {
    if (loading) return;
    if (+exchangeAmount <= 0)
      return Toast.show({ content: t('wallet.exchangeValid') });
    setLoading(true);
    await dispatch(
      fetchExchangeCurrencyAction({
        afterExchangeCurrencyType,
        exchangeAmount,
        exchangeCurrencyType,
      })
    );
    setLoading(false);
  };

  /** 点击兑换记录 */
  const handelRecord = () => {
    dispatch(changeTabCurrentIndexAction(3));
    dispatch(changeIsShowWalletAction(false));
    dispatch(changeIsShowHistoryAction(true));
  };
  return (
    <div className={styled.exchange}>
      <div className={styled.tipBox}>
        <div className={styled.item}>
          <span>{t('wallet.price')}</span>
          <p>1.00 GIFT = 1.00 USDT</p>
        </div>
        <div className={styled.item}>
          <span>{t('wallet.exchangeQuantity')}</span>
          <p>{exchangeAmountTip} USDT</p>
        </div>
        <em></em>
      </div>
      <div className={styled.formBox}>
        <div className={styled.group}>
          <div className={styled.top}>
            <span>From</span>
            <p>
              {t('wallet.balance')}：{exchangeInfo.giftBalance || '0.00'}
            </p>
          </div>
          <div className={styled.bottom}>
            <i className={styled.iconGift}></i>
            <span>Gift</span>
            <input
              type='text'
              name='gift'
              placeholder='0.00'
              maxLength={8}
              value={exchangeAmount}
              onKeyDown={(e) => clearInput(e, false)}
              onChange={(e) => changeValue(e)}
            />
          </div>
          <em></em>
        </div>
        <div className={styled.icon}></div>
        <div className={styled.group}>
          <div className={styled.top}>
            <span>To</span>
            <p>
              {t('wallet.balance')}：{exchangeInfo.usdtBalance || '0.00'}
            </p>
          </div>
          <div className={styled.bottom}>
            <i className={styled.iconUsdt}></i>
            <span>USDT</span>
            <input
              type='text'
              name='usdt'
              placeholder='0.00'
              maxLength={8}
              value={exchangeAmount}
              onChange={(e) => changeValue(e)}
            />
          </div>
          <em></em>
        </div>
        <button onClick={submitHandel}>{t('wallet.exchange')}</button>
        <div className={styled.link} onClick={handelRecord}>
          {t('wallet.Exchanges')}
        </div>
      </div>
    </div>
  );
});

export default Exchange;
