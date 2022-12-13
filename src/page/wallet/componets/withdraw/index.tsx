import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isObjectEmpty, toFixedStr } from '@/page/wallet/utils';
import { useSelector } from '@/redux/hook';
import {
  changeIsShowWalletAction,
  changeRechargeCurrentAction,
  fetchWalletWithdrawInfoAction,
} from '@/redux/wallet';
import { changeSecurityStatus } from '@/redux/security';
import { AppDispatch } from '@/redux/store';

import RechargeLeft from '../recharge-left';
import WithDrawRight from '../withdraw-right';
import styled from './style.module.scss';

const WithDrwa: React.FC = memo(() => {
  const { t } = useTranslation();
  const { walletWithdrawInfo, withDrawCoinTypeName, withDrawCoinInfo } =
    useSelector((state) => ({
      walletWithdrawInfo: state.wallet.walletWithdrawInfo,
      withDrawCoinTypeName: state.wallet.withDrawCoinTypeName,
      withDrawCoinInfo: state.wallet.withDrawCoinInfo,
    }));

  // eslint-disable-next-line no-unsafe-optional-chaining
  const rmb = withDrawCoinInfo?.minAmount * withDrawCoinInfo?.exchangeRate;

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchWalletWithdrawInfoAction());
  }, [dispatch]);

  const goSecurityCenter = () => {
    dispatch(changeIsShowWalletAction(false));
    dispatch(changeSecurityStatus(1));
    dispatch(changeRechargeCurrentAction(0));
  };

  const span = (
    <>
      {t('wallet.secureassets')}
      <span className={styled.text} onClick={goSecurityCenter}>
        {t('wallet.Security')}
      </span>
      {t('wallet.Securityminimum')}
      {isObjectEmpty(withDrawCoinInfo) && (
        <div className={styled.leftText}>
          {t('wallet.minwithdraw')}
          {withDrawCoinInfo?.minAmount &&
            `${withDrawCoinInfo?.minAmount} ${withDrawCoinTypeName}`}
          {withDrawCoinInfo?.minAmount && `(≈$${toFixedStr(rmb, 2, false)}),`}
          {t('wallet.sameabove')}
        </div>
      )}
    </>
  );

  return (
    <div className={styled.withDrwaWrapper}>
      {isObjectEmpty(walletWithdrawInfo) && (
        <RechargeLeft
          topTitle={t('wallet.WithdrawCurrency')}
          desc={{
            title: t('wallet.noticess'),
            desc: span,
          }}
          list={walletWithdrawInfo?.walletWithdrawDetailsVOList}
        />
      )}
      <WithDrawRight />
    </div>
  );
});

export default WithDrwa;
