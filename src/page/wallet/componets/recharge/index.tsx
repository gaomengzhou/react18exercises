import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  fetchCurrencyListAction,
  // fetchUserRechargeActivityDetailAction,
} from '@/redux/wallet';
import { AppDispatch } from '@/redux/store';
import { useSelector } from '@/redux/hook';
import { isObjectEmpty } from '@/page/wallet/utils';

import RechargeLeft from '../recharge-left';
import RechargeRight from '../recharge-right';
import styled from './style.module.scss';

const Recharge: React.FC = memo(() => {
  const { t } = useTranslation();
  const { rechangeCurrencyList, rechangeCurrencyDetail, isShowRechargeMusk } =
    useSelector((state) => ({
      rechangeCurrencyList: state.wallet.rechangeCurrencyList,
      rechangeCurrencyDetail: state.wallet.rechangeCurrencyDetail,
      isShowRechargeMusk: state.wallet.isShowRechargeMusk,
    }));

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrencyListAction());
  }, [dispatch]);
  const span = (
    <>
      {t('wallet.currency')}
      {/* 暂时不要，二期 */}
      {/* <span className={styled.span}>人民币购买数字货币教程</span> */}
    </>
  );

  return (
    <>
      <div className={styled.wrapper}>
        {isObjectEmpty(rechangeCurrencyDetail) && (
          <RechargeLeft
            topTitle={t('wallet.digitalCurrency')}
            desc={{
              title: t('wallet.DigitalCurrency'),
              desc: span,
            }}
            list={rechangeCurrencyList}
            detail={rechangeCurrencyDetail}
          />
        )}
        <RechargeRight />
      </div>
      {isShowRechargeMusk && <div className={styled.musk}></div>}
    </>
  );
});

export default Recharge;
