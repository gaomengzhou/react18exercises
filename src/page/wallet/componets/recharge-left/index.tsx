import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@/redux/hook';

import ContentTop from '../recharge-top';
import styled from './style.module.scss';

interface IProps {
  topTitle: string;
  desc: {
    title: string;
    desc: string | React.ReactElement;
    spanDesc?: string;
  };
  list: any[];
  detail?: { [key: string]: any };
}
interface listData {
  activityLevel: number;
  activityType: number;
  activityTypeDescribe: string;
  minRechargeAmountLimit: string;
  rechargeGiveRate: string;
}
const RechargeLeft: React.FC<IProps> = memo((props) => {
  const { topTitle, list, detail } = props;
  const { t } = useTranslation();
  const [awardShow, setAwardShow] = useState(false);
  const userRechargeActivityDetailDataList = useSelector(
    (state) => state.wallet.userRechargeActivityDetailData
  );
  const otherList = userRechargeActivityDetailDataList.filter(
    (item: any, index: number) => {
      return index !== 0;
    }
  );
  const handleAwardDown = () => {
    setAwardShow(!awardShow);
  };
  return (
    <div className={styled.leftWrapper}>
      <div className={styled.top}>
        <span>{topTitle}</span>
        <ContentTop list={list} detail={detail} />
      </div>
      {/* <div className={styled.text}>
        <div className={styled.title}>{desc.title}</div>
        <div className={styled.desc}>{desc.desc}</div>
      </div> */}
      <div className={styled.awardBox}>
        {userRechargeActivityDetailDataList.length > 0 ? (
          <div className={styled.item} onClick={handleAwardDown}>
            <div className={styled.icon}></div>
            <div className={styled.info}>
              <p>
                {userRechargeActivityDetailDataList[0].activityTypeDescribe}
              </p>
              <span>
                {t('wallet.DepositAmount')} ≥
                <span>
                  {userRechargeActivityDetailDataList[0].minRechargeAmountLimit}
                </span>
                {`+${
                  userRechargeActivityDetailDataList[0].rechargeGiveRate * 100
                }%`}
                <span> {t('wallet.Bonus')}</span>
              </span>
            </div>
            <i className={awardShow ? styled.up : ''}></i>
          </div>
        ) : (
          ''
        )}
        {otherList.length > 0 &&
          awardShow &&
          otherList.map((item: listData) => {
            return (
              <div key={item.activityLevel}>
                <em className={styled.line}></em>
                <div className={styled.item}>
                  <div className={styled.icon}></div>
                  <div className={styled.info}>
                    <p>{item.activityTypeDescribe}</p>
                    <span>
                      {t('wallet.DepositAmount')} ≥ $
                      <span>{item.minRechargeAmountLimit}</span> +
                      {+item.rechargeGiveRate * 100}%{t('wallet.Bonus')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default RechargeLeft;
