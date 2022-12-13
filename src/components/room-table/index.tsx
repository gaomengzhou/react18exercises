import React, {
  memo,
  Fragment,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PageNation from 'components/page-nation';
import { copy } from '@/page/wallet/utils';
import { useSelector } from '@/redux/hook';
import { AppDispatch } from '@/redux/store';
import {
  fetchPageRechargeLogAction,
  fetchGameReportAction,
  fetchExchangeRecordAction,
} from '@/redux/recods';

import iconCopy from '@/assets/images/wallet/icon-谷歌验证-复制.png';
import iconClose from '@/assets/images/wallet/icon-充值提现-展开.png';
import styled from './style.module.scss';

interface IProps {
  theader: string[];
  tbody: { [key: string]: any };
}

interface IObj {
  [key: number]: string;
}
interface record {
  id: number;
  transactionNo: string;
  currencyType: number;
  exchangeCurrencyType: number;
  exchangeCurrencyTypeName: string;
  afterExchangeCurrencyType: number;
  afterExchangeCurrencyTypeName: string;
  exchangeAmount: string;
  getAmount: string;
  status: 0 | 1;
  statusName: string;
  createTime: string;
}

const RoomTable: React.FC<IProps> = memo((props) => {
  const { theader, tbody } = props;
  const { t } = useTranslation();

  const { tabCurrentIndex, gameCode, chooseTime } = useSelector((state) => ({
    tabCurrentIndex: state.wallet.tabCurrentIndex,
    gameCode: state.recods.gameCode,
    chooseTime: state.recods.chooseTime,
  }));
  /** 初始化的表格数据 */
  const tbodyRecods = useMemo(() => {
    return tabCurrentIndex !== 2
      ? [...tbody.records]
      : [...tbody.gameReportList.records];
  }, [tabCurrentIndex, tbody?.gameReportList?.records, tbody?.records]);

  /** tabCurrentIndex：0：充值，1：提现，2：投注记录, 3:兑换记录 */
  const [records, setRecords] = useState(tbodyRecods);
  const totalPage = tbody?.totalCount || tbody?.gameReportList?.totalCount;
  /** 分页页码 */
  const [current, setCurrent] = useState(1);
  const divRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  /** 初始化表格 */
  useEffect(() => {
    setRecords(
      tbodyRecods.map((item: any) => ({
        ...item,
        isShow: false,
      }))
    );
  }, [tbodyRecods]);

  /** 表格表头 */
  useEffect(() => {
    setCurrent(1);
  }, [tabCurrentIndex]);
  /** 面板 */
  const clickItemHandel = (index: number, item: { [key: string]: any }) => {
    const newRecords = [...records];
    newRecords[index].isShow = !newRecords[index].isShow;
    setRecords(newRecords);
    if (item.isShow === false) {
      (divRef.current as HTMLElement).style.borderBottom = `1px solid#3f4348`;
    }
  };

  /** 显示的币种 */
  const currencyType = (currencyTypes: number) => {
    const name: IObj = { 1: 'USDT', 2: 'ETH', 3: 'TRX' };
    return name[currencyTypes];
  };

  /** 复制 */
  const copyText = (item: string) => {
    Toast.show({ content: t('wallet.copysuccess') });
    copy(item);
  };

  /** 分页 */
  const onChangePage = useCallback(
    (page: number) => {
      setCurrent(page);
      switch (tabCurrentIndex) {
        case 0:
        case 1:
          // 充提记录 type：1 = 充值，2 = 提现
          dispatch(
            fetchPageRechargeLogAction({
              pageNo: page,
              type: tabCurrentIndex === 0 ? 1 : 2,
              ...chooseTime,
            })
          );
          break;
        case 2:
          /** 投注记录 */
          dispatch(
            fetchGameReportAction({
              pageNo: page,
              thirdGameCode: gameCode,
              ...chooseTime,
            })
          );
          break;
        case 3:
          /** 兑换记录 */
          dispatch(fetchExchangeRecordAction({ pageNo: page }));
          break;
        default:
          break;
      }
    },
    [tabCurrentIndex, gameCode, chooseTime, dispatch]
  );

  /** 提现状态 */
  const withdrawstadu = (status: number) => {
    const objMap: IObj = {
      10: t('recods.Waiting'),
      11: t('recods.Waiting'),
      12: t('recods.success'),
      13: t('recods.fail'),
      14: t('recods.Waiting'),
    };
    return (
      <span
        className={`${
          status === 12
            ? styled.success
            : status === 13
            ? styled.failed
            : styled.wating
        }`}
      >
        {objMap[status]}
      </span>
    );
  };

  /** 充值提现记录 */
  const rechargePanel = (item: any) => {
    return (
      <>
        <div className={styled.top}>
          <div className={styled.topBox}>
            {item.transactionNo && (
              <div className={`${styled.panelBox}`}>
                <div className={styled.left}>{t('recods.Bill')}</div>
                <div className={styled.right}>
                  <div>{item.transactionNo}</div>
                  <img
                    src={iconCopy}
                    onClick={() => copyText(item.transactionNo)}
                    alt=''
                  />
                </div>
              </div>
            )}
            <div className={`${styled.panelBox}`}>
              <div className={styled.left}>
                {tabCurrentIndex === 0
                  ? t('recods.exchange')
                  : t('recods.Withdrawexchange')}
              </div>
              <div className={styled.right}>
                {item.virtualAmount} {currencyType(+item.currencyType)}/
                {item.exchangeRate}
              </div>
            </div>
          </div>
        </div>
        <div className={styled.stadusBox}>
          {(item.txHash || item.withdrawAddress) && (
            <div className={`${styled.panelBox}`}>
              <div className={styled.left}>
                {tabCurrentIndex === 1
                  ? t('recods.WithdrawAddress')
                  : t('recods.hash')}
              </div>
              <div className={styled.right}>
                <div className={styled.hash}>
                  {item.txHash || item.withdrawAddress}
                </div>
                <img
                  src={iconCopy}
                  onClick={() => copyText(item.txHash || item.withdrawAddress)}
                  alt=''
                />
              </div>
            </div>
          )}
          {tabCurrentIndex === 1 && (
            <div className={`${styled.panelBox} ${styled.stadus}`}>
              <div className={styled.left}>{t('recods.Withdrawstadus')}</div>
              <div className={styled.right}>
                <div className={styled.hash}>{withdrawstadu(+item.status)}</div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  /** 投注记录展开 */
  const betPanel = (item: any) => {
    return (
      <div className={styled.betwrapper}>
        <div className={styled.left}>
          <div className={styled.box}>
            <span className={styled.title}>{t('recods.Bill')}</span>
            <span>{item.orderId}</span>
          </div>
          <div className={styled.box}>
            <span className={styled.title}>{t('recods.Platform')}</span>
            <span>{item.thirdGameCode}</span>
          </div>
        </div>
        <div className={styled.left}>
          <div className={styled.box}>
            <span className={styled.title}>{t('recods.bet')}</span>
            {item.totalBetAmount && <span>$ {item.totalBetAmount}</span>}
          </div>
          <div className={styled.box}>
            <span className={styled.title}>{t('recods.Validbet')}</span>
            {item.orderAmount && <span>$ {item.orderAmount}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styled.tableWrapper}>
      <div className={styled.table}>
        {records.length > 0 && (
          <div
            className={`${styled.theader} ${
              tabCurrentIndex === 3 ? styled.exchange : ''
            }`}
          >
            {theader.map((item, index) => {
              return (
                <span key={index}>
                  {item}
                  {index === 2 && tabCurrentIndex !== 3 && `($)`}
                </span>
              );
            })}
          </div>
        )}
        {records.length > 0 &&
          tabCurrentIndex !== 3 &&
          records?.map((item: any, index: number) => {
            return (
              <Fragment key={item.id || item.orderId}>
                <div className={styled.bodyWrapper} ref={divRef}>
                  <span>{item.createTime || item.gameTime}</span>
                  <span>{currencyType(+item.currencyType)}</span>
                  <span className={styled.num}>
                    <span
                      className={`${
                        tabCurrentIndex === 2 && item.profitAmount >= 0
                          ? styled.green
                          : tabCurrentIndex === 2 && item.profitAmount < 0
                          ? styled.red
                          : ''
                      }`}
                    >
                      {tabCurrentIndex === 2 && item.profitAmount > 0 && '+'}
                      {item.virtualAmount || item.profitAmount}
                    </span>
                    <img
                      onClick={() => clickItemHandel(index, item)}
                      src={iconClose}
                      alt=''
                    />
                  </span>
                </div>
                {/* 对应的面板 */}
                {item.isShow && (
                  <div className={styled.panel}>
                    {tabCurrentIndex === 0 && rechargePanel(item)}
                    {tabCurrentIndex === 1 && rechargePanel(item)}
                    {tabCurrentIndex === 2 && betPanel(item)}
                  </div>
                )}
              </Fragment>
            );
          })}
        {records.length > 0 &&
          tabCurrentIndex === 3 &&
          records?.map((item: record) => {
            console.log('item', item);
            return (
              <div
                className={`${styled.bodyWrapper} ${styled.exchange}`}
                key={item.transactionNo}
              >
                <span>{item.createTime}</span>
                <span>
                  {item.exchangeCurrencyTypeName} / {item.exchangeAmount}
                </span>
                <span>
                  {item.afterExchangeCurrencyTypeName} / {item.getAmount}
                </span>
                <span className={styled[`status${item.status}`]}>
                  {item.statusName}
                </span>
              </div>
            );
          })}
        {records.length === 0 && (
          <div className={styled.empty}>{t('recods.Norecords')}</div>
        )}
      </div>
      {records.length > 0 && (
        <PageNation
          current={current}
          totalPage={totalPage}
          onChangePage={(page) => onChangePage(page)}
        />
      )}
    </div>
  );
});

export default RoomTable;
