import { useParams } from 'react-router-dom';
import { FC, useState } from 'react';
import copy from 'copy-to-clipboard';
import Header2 from '@/components/header2/Header2';
import styles from './BettingDetails.module.scss';
import orderBtn from '@/page/gamesLobby/images/order_icon.png';
import copyIcon from '@/assets/images/icon-copy.png';
import win from '@/assets/images/order_icon_win~iphone.png';
import lost from '@/assets/images/order_icon_lost~iphone.png';
import tie from '@/assets/images/order-icon-ping.png';
import noResult from '@/assets/images/order-icon-未结算-半透明.png';
import { timeInterval } from '@/utils/tools/method';
import MyList from '@/components/myList/MyList';
import { toast } from '@/utils/tools/toast';
import DateActionSheet from '@/components/dateActionSheet/DateActionSheet';
import BettingOrderActionSheet from '@/components/bettingOrderActionSheet/BettingOrderActionSheet';
import InitLoading from '@/components/initLoading/InitLoading';
import { ObjType } from '@/types/Common';

const times = [
  { id: 1, time: '今天' },
  { id: 2, time: '昨天' },
  { id: 3, time: '近7日' },
  { id: 4, time: '近30日' },
];
// 结算查询范围
const settleAccounts = [
  { id: 0, text: '全部' },
  { id: 1, text: '已结算' },
  { id: 2, text: '未结算' },
];
// 输赢查询范围
const lostWinTie = [
  { id: 0, text: '全部' },
  { id: 1, text: '输' },
  { id: 2, text: '赢' },
  { id: 3, text: '平' },
];

export interface ActiveSheetType {
  settlementActive: { id: number; text: string };
  winOrLoseActive: { id: number; text: string };
}

const BettingDetails: FC = () => {
  const params = useParams();
  const { title, gameCode, timeId } = params;
  const [state, setState] = useState<ObjType[]>([]);
  const [active, setActive] = useState(Number(timeId));
  const [hasMore, setHasMore] = useState(true);
  // 分页请求的参数
  const [pageParams, setPageParams] = useState({ pageNo: 1, pageSize: 10 });
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  // 日期弹框
  const [showDate, setShowDate] = useState(false);
  // 显示筛选弹框
  const [visible, setVisible] = useState(false);
  // 下拉弹框的参数
  const [sheetParams, setSheetParams] = useState<ActiveSheetType>({
    settlementActive: { id: 0, text: '全部' },
    winOrLoseActive: { id: 0, text: '全部' },
  });
  // 顶部信息
  const [topInfo, setTopInfo] = useState<ObjType>({});
  // 日期的active
  const [dateActive, setDateActive] = useState(Number(timeId));
  const getCurrDate = (activeId: number) => {
    switch (activeId) {
      case 1:
        return '今天';
      case 2:
        return '昨天';
      case 3:
        return '近7日';
      case 4:
        return '近30日';
      default:
        return '今天';
    }
  };

  const queryGameReportByCode = async (
    pageNo: number,
    pageSize: number,
    thirdGameCode: string | any,
    timer: { [key: string]: string },
    sheetParamsStatus: ActiveSheetType,
    refresh = false
  ) => {
    if (!refresh) setInitLoading(pageNo === 1);
    const res = await $fetch.post(
      '/lottery-api/walletLog/queryGameReportByCode',
      {
        pageNo,
        pageSize,
        thirdGameCode,
        startTime: timer.startTime,
        endTime: timer.endTime,
        sortList: [{ sortField: 'betTime', sortOrder: 'desc' }],
        settleStatus:
          sheetParamsStatus.settlementActive.id === 0
            ? ''
            : sheetParamsStatus.settlementActive.id,
        winStatus:
          sheetParamsStatus.winOrLoseActive.id === 0
            ? ''
            : sheetParamsStatus.winOrLoseActive.id,
      }
    );

    setInitLoading(false);
    if (!res.success) {
      setHasMore(false);
      return toast.fail(res);
    }
    setTopInfo(res.data);
    if (res.data.gameReportList.records.length < 1 && pageParams.pageNo === 1) {
      setHasMore(false);
      setState([]);
      return;
    }
    setPageParams((value) => {
      return { ...value, pageNo: value.pageNo + 1 };
    });
    if (res.data.gameReportList.records.length < pageParams.pageSize) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    setState((val) => {
      if (refresh) return res.data.gameReportList.records;
      return [...val, ...res.data.gameReportList.records];
    });
  };

  const refreshState = async (): Promise<void> => {
    if (state.length >= pageParams.pageSize) {
      setHasMore(true);
      setPageParams({ pageNo: 1, pageSize: 10 });
    }
    await queryGameReportByCode(
      1,
      pageParams.pageSize,
      gameCode,
      timeInterval(dateActive),
      sheetParams,
      true
    );
  };
  // 展示输赢平
  const showWinLoseTie = (status: number) => {
    switch (status) {
      case 1:
        return lost;
      case 2:
        return win;
      case 3:
        return tie;
      default:
        return noResult;
    }
  };
  // 点击日期
  const onClick = (num: number) => {
    setDateActive(() => {
      queryGameReportByCode(
        1,
        pageParams.pageSize,
        gameCode,
        timeInterval(num),
        sheetParams,
        true
      );
      return num;
    });
  };
  // 点击筛选
  const handleClick = (obj: ActiveSheetType) => {
    setSheetParams(obj);
    queryGameReportByCode(
      1,
      pageParams.pageSize,
      gameCode,
      timeInterval(dateActive),
      obj,
      true
    );
  };
  return (
    <div className={styles['betting-details-container']}>
      <Header2
        setClickRight={setShowDate}
        clickRight={showDate}
        rightText={getCurrDate(dateActive)}
        title={title}
      />
      <DateActionSheet
        active={active}
        setActive={setActive}
        showDate={showDate}
        setShowDate={setShowDate}
        onClick={onClick}
        times={times}
        className='from-my-header-mask-top-4rem'
        top='4rem'
      />
      <div className={styles.header}>
        <div className={styles['top-title']}>
          <div>
            <div className={styles['top-title-left']}>
              <p>
                结算: <span>{sheetParams.settlementActive.text}</span>
              </p>
              <p>
                输赢: <span>{sheetParams.winOrLoseActive.text}</span>
              </p>
            </div>
            <div className={styles.filter} onClick={() => setVisible(true)}>
              <p>筛选</p>
              <img src={orderBtn} alt='按钮' />
            </div>
          </div>
        </div>
        <div className={styles['top-des']}>
          <p>
            投注金额:<span>{topInfo.totalBetAmount}</span>CNY
          </p>
          <p>
            输赢:<span>{topInfo.totalProfitAmount}</span>CNY
          </p>
        </div>
      </div>

      <div className={styles.main}>
        {initLoading ? (
          <InitLoading />
        ) : (
          <MyList
            state={state}
            hasMore={hasMore}
            getData={() =>
              queryGameReportByCode(
                pageParams.pageNo,
                pageParams.pageSize,
                gameCode,
                timeInterval(dateActive),
                sheetParams
              )
            }
            refreshState={refreshState}
          >
            <>
              {state.map((item, index) => (
                <div key={index} className={styles.content}>
                  <div className={styles['main-top']}>
                    <div>
                      <p>{title}</p>
                      <span>{item.gameTime}</span>
                    </div>
                    <h3>{title}</h3>
                  </div>
                  <div className={styles['main-bottom']}>
                    <div className={styles.borderInfoTitle}>
                      <p className={styles.betting}>
                        投注: <span>{item.orderAmount}</span>元
                      </p>
                      <div className={styles.profitAmount}>
                        <span
                          className={`${+item.winStatus === 1 && styles.lost} ${
                            (+item.winStatus === 3 ||
                              item.winStatus === null) &&
                            styles.tie
                          }`}
                        >
                          {item.winStatus !== null ? item.profitAmount : '--'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderInfoLeft}>
                        <div
                          className={styles.order}
                          onClick={() => {
                            copy(item.orderId);
                            toast.success('复制成功!');
                          }}
                        >
                          <p>单号: </p>
                          <span>{item.orderId}</span>
                          <img src={copyIcon} alt='copy' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.logo}>
                    <img src={showWinLoseTie(item.winStatus)} alt='win' />
                  </div>
                </div>
              ))}
            </>
          </MyList>
        )}
      </div>
      <BettingOrderActionSheet
        visible={visible}
        setVisible={setVisible}
        settleAccounts={settleAccounts}
        lostWinTie={lostWinTie}
        onClick={handleClick}
        top='11.7rem'
        className='betting-order-action-sheet-mask'
      />
    </div>
  );
};
export default BettingDetails;
