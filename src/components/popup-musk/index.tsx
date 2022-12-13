import React, { ReactElement, memo } from 'react';
import { useDispatch } from 'react-redux';
import { CenterPopup } from 'antd-mobile';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AppDispatch } from '@/redux/store';
import { useSelector } from '@/redux/hook';

import {
  changeIsShowWalletAction,
  changeIsShowGameAction,
  changeIsShowHistoryAction,
  changeTabCurrentIndexAction,
  changeRechangeCurrencyDetailAction,
  changeRechargeCurrentAction,
  changeCoinAddressAction,
  changeCoinChainNameAction,
  changeIsShowPopUpActivityAction,
} from '@/redux/wallet';
import styled from './style.module.scss';
import { qsJson } from '@/utils/tools/method';

interface IProps {
  readonly title: string;
  topList?: ReactElement;
  listContet?: ReactElement | boolean;
}

const PopUpMusk: React.FC<IProps> = memo((props) => {
  const { title, topList, listContet } = props;
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const {
    isShowWallet,
    isShowHistory,
    isShowGame,
    rechangeCurrencyDetail,
    isShowPopUpActivity,
  } = useSelector((state) => ({
    isShowPopUpActivity: state.wallet.isShowPopUpActivity,
    isShowWallet: state.wallet.isShowWallet,
    isShowHistory: state.wallet.isShowHistory,
    isShowGame: state.wallet.isShowGame,
    rechangeCurrencyDetail: state.wallet.rechangeCurrencyDetail,
  }));
  const qs = qsJson(location.search);
  const visible =
    isShowWallet || isShowHistory || isShowGame || isShowPopUpActivity;

  const dispatch = useDispatch<AppDispatch>();
  /** 取消消除的状态 */
  const cancelHandel = () => {
    console.log('params', params);
    dispatch(changeIsShowWalletAction(false));
    dispatch(changeIsShowGameAction(false));
    dispatch(changeIsShowHistoryAction(false));
    dispatch(changeIsShowPopUpActivityAction(false));
    dispatch(changeTabCurrentIndexAction(0));
    dispatch(changeRechangeCurrencyDetailAction(0));
    dispatch(changeRechargeCurrentAction(0));
    if (qs.path && qs.path === 'PopUpActivity') {
      setParams({});
    }

    dispatch(
      changeCoinChainNameAction(rechangeCurrencyDetail?.list?.[0]?.chainName)
    );
    dispatch(
      changeCoinAddressAction(rechangeCurrencyDetail?.list?.[0]?.address)
    );
  };

  return (
    <CenterPopup
      visible={visible}
      onMaskClick={cancelHandel}
      afterClose={cancelHandel}
      destroyOnClose
    >
      <div className={styled.top}>
        <div>{title}</div>
        <div className={styled.right}>
          <img
            onClick={cancelHandel}
            src={require('@/assets/images/wallet/icon-账户登录-关闭.png')}
            alt=''
          />
        </div>
      </div>
      <div className={styled.content}>
        {topList && <div className={styled.topList}>{topList}</div>}
        {listContet && <div className={styled.listContet}>{listContet}</div>}
      </div>
    </CenterPopup>
  );
});

export default PopUpMusk;
