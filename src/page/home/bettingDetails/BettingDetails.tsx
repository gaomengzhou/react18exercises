import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';
import { ObjType } from '@/types/Common';
import { useAppDispatch, useSelector } from '@/redux/hook';
import styles from './BettingDetails.module.scss';
import { isLogin } from '@/utils/tools/method';
import indexData from '@/redux/index/slice';

interface GameCategoryProps {
  title: string;
  src: string;
}

const BettingDetails: FC<GameCategoryProps> = ({ title, src }) => {
  const { currentLanguage, betListForPCBottomList: dataSource } = useSelector(
    (s) => s.indexData
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(1);
  const tabTitle = [
    { id: 1, name: t('main.All'), active: true },
    { id: 2, name: t('main.Highwins'), active: false },
    { id: 3, name: t('main.luckywins'), active: false },
    { id: 4, name: t('main.mywagers'), active: false },
  ];
  const [myOrder, setMyOrder] = useState<ObjType>({});
  const myOrderList = async () => {
    const res = await $fetch.post(
      'lottery-api/homePage/querySelfThirdOrderList'
    );
    if (!res.success) return Toast.show(res.message);
    setMyOrder(res.data);
  };
  const queryThirdOrderList = useCallback(async () => {
    const res = await $fetch.post('lottery-api/homePage/queryThirdOrderList');
    if (!res.success) return Toast.show(res.message);
    dispatch(indexData.actions.setBetListForPCBottomList(res.data));
  }, [dispatch]);
  useEffect(() => {
    queryThirdOrderList();
  }, [queryThirdOrderList, currentLanguage]);

  const clickTabs = (id: number) => {
    if (!isLogin() && id === 4) {
      dispatch(indexData.actions.setLoginShow(1));
      return;
    }
    if (id === 4) {
      myOrderList();
    }
    setActive(id);
  };
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.left}>
          <img src={src} alt='' />
          <h2>{title}</h2>
        </div>
        <div className={styles.right}>
          {tabTitle.map((item) => (
            <p
              onClick={() => clickTabs(item.id)}
              className={`${active === item.id && styles['background-p']}`}
              key={item.id}
            >
              <span>{item.name}</span>
            </p>
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <header>
          <div>
            <h3>{t('main.game')}</h3>
            <h3>{t('main.user')}</h3>
            <h3>{t('main.time')}</h3>
            <h3>{t('main.wager')}</h3>
            <h3>{t('main.mult')}</h3>
            <h3>{t('main.payout')}</h3>
          </div>
        </header>
        <main>
          <div className={styles.box}>
            {/* 实时投注列表 */}
            {active === 1 &&
              dataSource.liveBettingList.map((item: ObjType, i) => (
                <div key={i} className={styles.content}>
                  <p>
                    {currentLanguage === 'en'
                      ? item.thirdGameNameEn
                      : item.thirdGameName}
                  </p>
                  <p>{item.playerName}</p>
                  <p>{item.betTime}</p>
                  <p>{item.betAmount}</p>
                  <p>{item.winningMultiple}</p>
                  <p>{item.payout}</p>
                </div>
              ))}
            {/* 高额盈利列表 */}
            {active === 2 &&
              dataSource.highProfitList.map((item: ObjType, i) => (
                <div key={i} className={styles.content}>
                  <p>
                    {currentLanguage === 'en'
                      ? item.thirdGameNameEn
                      : item.thirdGameName}
                  </p>
                  <p>{item.playerName}</p>
                  <p>{item.betTime}</p>
                  <p>{item.betAmount}</p>
                  <p>{item.winningMultiple}</p>
                  <p>{item.payout}</p>
                </div>
              ))}
            {/* 高倍盈利列表 */}
            {active === 3 &&
              dataSource.highMultipleList.map((item: ObjType, i) => (
                <div key={i} className={styles.content}>
                  <p>
                    {currentLanguage === 'en'
                      ? item.thirdGameNameEn
                      : item.thirdGameName}
                  </p>
                  <p>{item.playerName}</p>
                  <p>{item.betTime}</p>
                  <p>{item.betAmount}</p>
                  <p>{item.winningMultiple}</p>
                  <p>{item.payout}</p>
                </div>
              ))}
            {/* 我的投注 */}
            {active === 4 &&
              myOrder.length > 0 &&
              myOrder.map((item: ObjType, i: number) => (
                <div key={i} className={styles.content}>
                  <p>{item.thirdGameName}</p>
                  <p>{item.playerName}</p>
                  <p>{item.betTime}</p>
                  <p>{item.betAmount}</p>
                  <p>{item.winningMultiple}</p>
                  <p>{item.payout}</p>
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};
export default BettingDetails;
