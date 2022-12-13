import React, { memo, useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from '@/redux/store';
import {
  changeCoinAddressAction,
  changeCoinChainNameAction,
  changeCoinTypeNameAction,
  fetchCurrencyDetailAction,
  fetchWalletAddressAction,
  changewithDrawCoinInfoAction,
  changeWithDrawCoinTypeNameAction,
  changeWithDrawCoinChainNameAction,
  fetchUserRechargeActivityDetailAction,
} from '@/redux/wallet';
import { useSelector } from '@/redux/hook';
import styled from './style.module.scss';

interface IProps {
  list: any[];
  detail?: { [key: string]: any };
}

const ContentTop: React.FC<IProps> = memo((props) => {
  const { list, detail } = props;

  const { t } = useTranslation();

  /** 币种下拉框 */
  const [isShowPanel, setIsShowPanel] = useState(false);
  /** 链下拉框 */
  const [isRightPanel, setIsRightPanel] = useState(false);

  const { rechargeCurrent, withdrawRecordCode } = useSelector((state) => ({
    rechargeCurrent: state.wallet.rechargeCurrent,
    withdrawRecordCode: state.wallet.withdrawRecordCode,
  }));

  const coinName = list?.[0]?.currencyTypeName;
  /** 币种 */
  const [coin, setCoin] = useState(coinName);
  /** 链名 */
  const [chainName, setChainName] = useState(
    rechargeCurrent === 0 && detail?.list?.[0]?.address === null
      ? t('wallet.Network')
      : detail?.list?.[0]?.chainName || list?.[0]?.chainTypes?.[0]?.chainName
  );

  const dispatch = useDispatch<AppDispatch>();

  /** 初始化币种，链名 */
  useEffect(() => {
    dispatch(changeCoinAddressAction(detail?.list?.[0]?.address));
    // 重置默认提币
    dispatch(changeWithDrawCoinTypeNameAction(list?.[0]?.currencyTypeName));
    dispatch(
      changeWithDrawCoinChainNameAction(list?.[0]?.chainTypes?.[0]?.chainName)
    );
    dispatch(changewithDrawCoinInfoAction({ ...list?.[0] }));
    setCoin(list?.[0]?.currencyTypeName);
    /** 提币的链名选择 */
    if (rechargeCurrent === 1 && withdrawRecordCode !== 0) {
      setChainName(list?.[0]?.chainTypes?.[0]?.chainName);
    }
  }, [list, detail, rechargeCurrent, withdrawRecordCode, dispatch]);

  /** 选择 */
  const panelClickHandle = (isRight = true) => {
    if (isRight) {
      setIsRightPanel(false);
      setIsShowPanel(!isShowPanel);
    } else {
      setIsShowPanel(false);
      setIsRightPanel(!isRightPanel);
    }
  };

  /** 选择的币种 */
  const clickItemHandle = async (
    isRight: boolean,
    item: { [key: string]: any },
    address?: string,
    withDrwa?: 'withDrwa'
  ) => {
    if (isRight) {
      // 选择的币种名字
      setCoin(item.currencyTypeName);
      setIsShowPanel(false);

      if (withDrwa !== undefined && withDrwa === 'withDrwa') {
        // 提现币种信息
        dispatch(changewithDrawCoinInfoAction({ ...item }));
        dispatch(changeWithDrawCoinTypeNameAction(item.currencyTypeName));
      } else {
        // 充值币种名字
        dispatch(changeCoinTypeNameAction(item.currencyTypeName));
      }
      const currencyType =
        item.currencyTypeName === 'TRX'
          ? 3
          : item.currencyTypeName === 'ETH'
          ? 2
          : 1;
      dispatch(
        fetchUserRechargeActivityDetailAction({
          currencyType,
          chainName,
        })
      );
    } else {
      // 链名
      setChainName(item.chainName);
      setIsRightPanel(false);

      if (withDrwa !== undefined && withDrwa === 'withDrwa') {
        dispatch(changeWithDrawCoinChainNameAction(item.chainName));
      } else {
        // 充币  链名
        dispatch(changeCoinChainNameAction(item.chainName));
        // 保存当前选中的二维码地址
        dispatch(changeCoinAddressAction(item.address));
        if (!address) {
          // 充值选择的链名
          await dispatch(
            fetchWalletAddressAction({
              chainName: item.chainName,
              currencyType: detail?.currencyType,
            })
          );
          // 刷新充币页面
          dispatch(fetchCurrencyDetailAction());
        }
      }
      const currencyType = coin === 'TRX' ? 3 : coin === 'ETH' ? 2 : 1;
      dispatch(
        fetchUserRechargeActivityDetailAction({
          currencyType,
          chainName: item.chainName,
        })
      );
    }
  };

  /** 币种下拉列表 */
  const coinTypesNames =
    rechargeCurrent === 0
      ? list?.map((item) => (
          <div
            key={item}
            className={styled.pn}
            onClick={() => clickItemHandle(true, item)}
          >
            <span>{item.currencyTypeName}</span>
          </div>
        ))
      : list?.map((item) => (
          <div
            key={item}
            className={styled.pn}
            onClick={() => clickItemHandle(true, item, undefined, 'withDrwa')}
          >
            <span>{item.currencyTypeName}</span>
          </div>
        ));

  /** 链下拉表显示 */
  const chainNames =
    rechargeCurrent === 0
      ? detail?.list?.map(
          (
            item: any // 充值
          ) => (
            <div
              key={item.chainName}
              className={styled.pn}
              onClick={() => clickItemHandle(false, item, item.address)}
            >
              <span>{item.chainName}</span>
            </div>
          )
        )
      : list?.map((item) => {
          // 提现
          return item.chainTypes?.map((iten: any) => (
            <div
              key={iten.chainName}
              className={styled.pn}
              onClick={() =>
                clickItemHandle(false, iten, undefined, 'withDrwa')
              }
            >
              <span>{iten.chainName}</span>
            </div>
          ));
        });

  return (
    <div className={styled.wrapper}>
      <div className={styled.wrapperBox}>
        <div className={styled.box} onClick={() => panelClickHandle()}>
          <span>{coin}</span>
          {coin && (
            <img
              src={
                !isShowPanel
                  ? require('@/assets/images/wallet/icon-充值提现-展开.png')
                  : require('@/assets/images/wallet/icon-充值提现-收起.png')
              }
              alt=''
            />
          )}
        </div>
        <div
          className={`${styled.box} ${
            rechargeCurrent === 0 && detail?.list?.[0]?.address === null
              ? styled.rechargeBox
              : ''
          }`}
          onClick={() => panelClickHandle(false)}
        >
          {chainName}
          {chainName && (
            <img
              src={
                !isRightPanel
                  ? require('@/assets/images/wallet/icon-充值提现-展开.png')
                  : require('@/assets/images/wallet/icon-充值提现-收起.png')
              }
              alt=''
            />
          )}
        </div>
      </div>
      {isShowPanel && <div className={styled.panel}>{coinTypesNames}</div>}
      {isRightPanel && (
        <div
          className={`${styled.panel} ${
            rechargeCurrent === 1 ? styled.widthDrwaPanel : styled.rightPanel
          }`}
        >
          {chainNames}
        </div>
      )}
    </div>
  );
});

export default ContentTop;
