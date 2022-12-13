import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch } from 'react-redux';
import UlList from '@/components/ul-list';
import PopUpMusk from '@/components/popup-musk';
import { useSelector } from '@/redux/hook';
import { AppDispatch } from '@/redux/store';
import { changeRechargeCurrentAction } from '@/redux/wallet';
import Recharge from './componets/recharge';
import WithDrwa from './componets/withdraw';
import Exchange from './componets/exchange';

const Wallet: React.FC = memo(() => {
  const { t } = useTranslation();
  const btnArr = [
    t('wallet.deposit'),
    t('wallet.Withdraw'),
    t('wallet.exchange'),
  ];
  const rechargeCurrent = useSelector((state) => state.wallet.rechargeCurrent);

  const dispatch = useDispatch<AppDispatch>();

  /** 切换选项卡 */
  const itemClickHandle = (index: number) => {
    dispatch(changeRechargeCurrentAction(index));
  };

  const ulList = (
    <UlList infoList={btnArr} itemClick={(index) => itemClickHandle(index)} />
  );

  let listContet = null;
  if (rechargeCurrent === 0) {
    listContet = <Recharge />;
  } else if (rechargeCurrent === 1) {
    listContet = <WithDrwa />;
  } else {
    listContet = <Exchange />;
  }

  return (
    <PopUpMusk
      title={`${t('wallet.deposit')}&${t('wallet.Withdraw')}`}
      topList={ulList}
      listContet={listContet}
    />
  );
});

export default Wallet;
