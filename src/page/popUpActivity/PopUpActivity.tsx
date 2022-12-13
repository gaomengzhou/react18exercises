import React, { memo, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { useDispatch } from 'react-redux';

import { Toast } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PopUpMusk from '@/components/popup-musk';
import styled from './style.module.scss';
import { AppDispatch, RootState } from '@/redux/store';
import {
  changeIsShowPopUpActivityAction,
  changeIsShowWalletAction,
} from '@/redux/wallet';

interface ItemList2 {
  activityType: 1 | 2 | 3 | 4 | 5;
  activityLevel: number;
  minRechargeAmountLimit: string;
  maxRechargeAmountLimit: string;
  rechargeGiveRate: string;
}
interface ItemList1 {
  activityType: number;
  showActivityName: string;
  rechargeGiveUpperLimit: string;
  activityDescribe: string;
  activityDescribeEn: string;
  activityFrequencyType: number;
  activityMaximum: number;
  itemList: ItemList2[];
}
interface Datum {
  startTime: string;
  endTime: string;
  list: ItemList1[];
}

const PopUpActivity: React.FC = memo(() => {
  const [datum, setDatum] = useState({} as Datum);
  const { t } = useTranslation();
  const [, setParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((s: RootState) => s.indexData.userinfo.token);

  useEffect(() => {
    const getRechargeActivityConfig = async () => {
      if (!token) return;
      const res = await $fetch.post(
        'config-api/rechargeActivity/getRechargeActivityConfig'
      );
      if (!res.success) return Toast.show(res.message);
      if (res.data.length > 0) {
        setDatum(res.data[0]);
      }
    };
    getRechargeActivityConfig();
  }, [token]);
  const currentLanguage = useSelector(
    (s: RootState) => s.indexData.currentLanguage
  );
  const toDeposit = () => {
    setParams({});
    dispatch(changeIsShowPopUpActivityAction(false));
    dispatch(changeIsShowWalletAction(true));
  };
  const listContet = (
    <div className={styled.activityBox}>
      <div className={styled.time}>
        <p>{t('popUpActivity.Activitytime')}</p>
        <span>
          <span>{datum.startTime}</span>—<span>{datum.endTime}</span>
        </span>
      </div>
      {datum.list &&
        datum.list.length > 0 &&
        datum.list.map((item1: ItemList1) => {
          return (
            <div className={styled.group} key={item1.activityType}>
              <h1>{item1.showActivityName}</h1>
              <p>
                {currentLanguage === 'en'
                  ? item1.activityDescribeEn
                  : item1.activityDescribe}
              </p>
              <div className={styled.content}>
                {item1.itemList.length > 0 &&
                  item1.itemList.map((item2: ItemList2, index) => {
                    return (
                      <div
                        className={`${styled.item} ${
                          styled[`item${item2.activityType}`]
                        }`}
                        key={index}
                      >
                        <p>{item1.showActivityName}</p>
                        <h2>
                          <em>%{+item2.rechargeGiveRate * 100}</em>
                          <i>{t('popUpActivity.bonus')}</i>
                        </h2>
                        <span>${item2.minRechargeAmountLimit}+</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      <button onClick={toDeposit} className={styled.btn}>
        {t('popUpActivity.Deposit')}
      </button>
    </div>
  );

  return (
    <PopUpMusk
      title={t('popUpActivity.DepositBonusRules')}
      listContet={listContet}
    />
  );
});

export default PopUpActivity;
