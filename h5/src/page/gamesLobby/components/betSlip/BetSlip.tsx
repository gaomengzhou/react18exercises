import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BetSlip.module.scss';
import Header from '@/components/header/Header';
import orderBtn from '../../images/order_icon_sj_x~iphone.png';
import rightArrow from '@/assets/images/Message_Arrow~iphone@2x.png';
import { timeInterval } from '@/utils/tools/method';
import { ObjType } from '@/types/Common';
import MyList from '@/components/myList/MyList';
import DateActionSheet from '@/components/dateActionSheet/DateActionSheet';
import InitLoading from '@/components/initLoading/InitLoading';
import { toast } from '@/utils/tools/toast';

const times = [
  { id: 1, time: '今天' },
  { id: 2, time: '昨天' },
  { id: 3, time: '近7日' },
  { id: 4, time: '近30日' },
];
const BetSlip: FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const [dateActive, setDateActive] = useState(1);
  // 第一次进入页面展示的Loading
  const [initLoading, setInitLoading] = useState(false);
  const [state, setState] = useState<ObjType>({ gameReportList: [] });
  // 选择日期范围
  const [showDate, setShowDate] = useState(false);
  const navigate = useNavigate();
  const queryGameReportByCode = async (
    timer: { [key: string]: string },
    refresh = false
  ) => {
    if (!refresh) setInitLoading(true);
    const res = await $fetch.post('/lottery-api/walletLog/queryGameReport', {
      startTime: timer.startTime,
      endTime: timer.endTime,
      sortList: [{ sortField: 'orderAmount', sortOrder: 'desc' }],
    });
    setInitLoading(false);
    if (!res.success) {
      setHasMore(false);
      return toast.fail(res);
    }
    setHasMore(false);
    setState(res.data);
  };
  const onClick = async (num: number) => {
    return queryGameReportByCode(timeInterval(num));
  };
  const viewDetails = (data: ObjType) => {
    navigate(`/betting-details/${data.gameName}/${data.gameCode}`);
  };
  const refreshState = async () => {
    return queryGameReportByCode(timeInterval(dateActive), true);
  };

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

  return (
    <div className={styles['bet-container']}>
      <Header title='游戏注单' right />
      <div className={styles.top}>
        <div className={styles.title}>
          <div className={styles.left}>
            <p>总计 :</p>
            <span>{state.totalBetCount}</span>
          </div>
          <div className={styles.right} onClick={() => setShowDate(true)}>
            <p>{getCurrDate(dateActive)}</p>
            <img src={orderBtn} alt='btn' />
          </div>
        </div>
        <div className={styles.des}>
          <p>
            投注金额 <span>{state.totalBetAmount}CNY;</span>
          </p>
          <p>
            输赢 <span>{state.profitAmount}</span>CNY
          </p>
        </div>
      </div>

      <div className={`${styles.main}`}>
        {initLoading ? (
          <InitLoading />
        ) : (
          <MyList
            state={state.gameReportList}
            hasMore={hasMore}
            getData={() => queryGameReportByCode(timeInterval(dateActive))}
            refreshState={refreshState}
          >
            <>
              {state.gameReportList.map((item: ObjType, i: number) => {
                return (
                  <div
                    key={i}
                    className={styles.items}
                    onClick={() => viewDetails(item)}
                  >
                    <div className={styles.mainTop}>
                      <div className={styles.label}>
                        <img src={orderBtn} alt='logo' />
                        <p>{item.gameName}</p>
                      </div>
                      <p className={styles.orderNum}>{item.orderCount}</p>
                      <span>{item.profitAmount}</span>
                    </div>
                    <div className={styles.mainBottom}>
                      <p>
                        投注金额:<span>{item.orderAmount}</span>
                      </p>
                      <p>注单数</p>
                      <div>
                        <p>输赢</p>
                        <img src={rightArrow} alt='rightArrow' />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          </MyList>
        )}
        <DateActionSheet
          active={dateActive}
          setActive={setDateActive}
          times={times}
          showDate={showDate}
          setShowDate={setShowDate}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
export default BetSlip;
