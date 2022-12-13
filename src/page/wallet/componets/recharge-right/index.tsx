/* eslint-disable array-callback-return */
import React, { memo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

import { useDispatch } from 'react-redux';
import { useSelector } from '@/redux/hook';
import { changeCoinAddressAction } from '@/redux/wallet';
import { AppDispatch } from '@/redux/store';
import { copy } from '../../utils/index';

import styled from './style.module.scss';

interface IObj {
  [key: string]: any;
}

const RechargeRight: React.FC = memo(() => {
  const { t } = useTranslation();

  const { coinAddress, coinTypeName, coinChainName, rechangeCurrencyDetail } =
    useSelector((state) => ({
      coinAddress: state.wallet.coinAddress,
      coinTypeName: state.wallet.coinTypeName,
      coinChainName: state.wallet.coinChainName,
      rechangeCurrencyDetail: state.wallet.rechangeCurrencyDetail,
    }));

  const coinType = coinTypeName || rechangeCurrencyDetail?.currencyTypeName;
  const coinChain =
    coinChainName || rechangeCurrencyDetail?.list?.[0].chainName;

  const dispatch = useDispatch<AppDispatch>();

  const copyAddress = () => {
    copy(coinAddress);
    Toast.show({ content: t('wallet.copysuccess') });
  };

  /** 监听需要修改的地址 */
  useEffect(() => {
    if (coinChainName && rechangeCurrencyDetail?.list?.length > 0) {
      rechangeCurrencyDetail?.list?.map((item: IObj) => {
        if (item.chainName === coinChainName) {
          return dispatch(changeCoinAddressAction(item.address));
        }
      });
    }
  }, [dispatch, coinChainName, rechangeCurrencyDetail]);

  return (
    <div className={styled.rightWrapper}>
      {coinType && (
        <div className={styled.content}>
          <div>
            {t('wallet.DepositAddress', {
              address: `${coinType} ${coinChain}`,
            })}
          </div>
          <div className={styled.bottom}>
            {t('wallet.NOTICE', { address: `"${coinChain}"` })}
          </div>
        </div>
      )}
      <div className={styled.footer}>
        {coinAddress && (
          <div className={styled.qr}>
            <QRCodeSVG value={coinAddress} />
          </div>
        )}
        {rechangeCurrencyDetail?.rechargeMinAmountLimit && (
          <div className={styled.text}>
            {t('wallet.minnum')}
            {`${rechangeCurrencyDetail?.rechargeMinAmountLimit}${rechangeCurrencyDetail?.currencyTypeName}`}
            ,<div>{t('wallet.loss')}</div>
          </div>
        )}
        {coinAddress && (
          <div className={styled.copy}>
            <span>{coinAddress}</span>
            <img
              src={require('@/assets/images/wallet/copy@2x.png')}
              alt=''
              onClick={copyAddress}
            />
          </div>
        )}
      </div>
      {!coinAddress && (
        <div className={styled.musk}>{t('wallet.continue')}</div>
      )}
    </div>
  );
});

export default RechargeRight;
