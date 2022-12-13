import { FC, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Input, TextArea, Toast } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import PromotePop from '@/components/promote-pop';
import PageNation from '@/components/page-nation';
import { copy } from '@/page/wallet/utils';
import Footer from '@/page/home/footer/Footer';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { changeCommissionKey, changeCommissionStatus } from '@/redux/security';
import styles from './promote.module.scss';
import { isLogin } from '@/utils/tools/method';

const Promote: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const commissionStatus = useSelector(
    (state) => state.security.commissionStatus
  );
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const [activeKey, setActiveKey] = useState('1');
  const [activeDate, setActiveDate] = useState('1');
  const [showPage, setshowPage] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageNum, setpageNum] = useState('10');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactAccount, setContactAccount] = useState('');
  const [promoteType, setPromoteType] = useState('');
  const [contactType, setContactType] = useState(1);
  const [ratioForGameType, setRatioForGameType] = useState<any>({
    dzCommissionRate: '',
    tyCommissionRate: '',
    zrCommissionRate: '',
  });

  const [platformTotalCommission, setPlatformTotalCommission] = useState('');
  const [showWay, setshowWay] = useState(false);
  const [way, setWay] = useState('WhatsApp');
  const [showWaystat, setshowWaystat] = useState(false);
  const [recordData, setRecordData] = useState({
    records: [],
  });
  const [totalPage, setTotalPage] = useState(0);
  const [commissionData, setcommissionData] = useState({
    todayCommission: '',
    totalCommission: '',
    thisWeekReceivedCommission: '',
    yesterdayReceivedCommission: '',
    teamNum: '',
    receivableCommission: '',
    thisMonthReceivedCommission: 0,
  });
  const [contactList] = useState([
    { id: 1, text: 'WhatsApp' },
    { id: 2, text: 'Telegram' },
    { id: 3, text: 'Skype' },
    { id: 4, text: 'Email' },
  ]);

  const queryPageUserByAgentAllSummary = async () => {
    if (!isLogin()) return;
    const result = await $fetch.post(
      '/lottery-api/thirdCommission/queryPageUserByAgentAllSummary',
      {
        pageNo: current,
        pageSize: pageNum,
        endDate,
        startDate,
      }
    );
    if (result.code === 1) {
      setRecordData(result.data);
      setTotalPage(result.data.totalCount);
    }
  };
  const getMaxCommissionRatioForGameType = async () => {
    const result = await $fetch.post(
      '/config-api/promotionPageContro/getMaxCommissionRatioForGameType'
    );
    if (!result.code) return Toast.show(result.message);
    if (result.code === 1) {
      setRatioForGameType(result.data);
    }
  };
  const getPlatformTotalCommission = async () => {
    const result = await $fetch.post(
      '/lottery-api/promotionPageContro/getPlatformTotalCommission'
    );
    if (!result.code) return Toast.show(result.message);
    if (result.code === 1) {
      setPlatformTotalCommission(result.data.platformTotalCommission);
    }
  };

  const timeForMat = (count: any) => {
    // 拼接时间
    const time1 = new Date();
    const time2 = new Date();
    if (count === 1) {
      time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
    } else if (count >= 0) {
      time1.setTime(time1.getTime());
    } else if (count === -2) {
      time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000 * 2);
    } else {
      time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000);
    }

    const Y1 = time1.getFullYear();
    const M1 =
      time1.getMonth() + 1 > 9
        ? time1.getMonth() + 1
        : `0${time1.getMonth() + 1}`;
    const D1 = time1.getDate() > 9 ? time1.getDate() : `0${time1.getDate()}`;
    // eslint-disable-next-line no-useless-concat
    const timer1 = `${Y1}-${M1}-${D1} ` + `23:59:59`; // 当前时间

    time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
    const Y2 = time2.getFullYear();
    const M2 =
      time2.getMonth() + 1 > 9
        ? time2.getMonth() + 1
        : `0${time2.getMonth() + 1}`;
    const D2 = time2.getDate() > 9 ? time2.getDate() : `0${time2.getDate()}`;
    // eslint-disable-next-line no-useless-concat
    const timer2 = `${Y2}-${M2}-${D2} ` + `00:00:00`; // 之前的7天或者30天
    return [timer2, timer1];
  };

  // 获取最近7天
  const sevenDays = () => {
    // 获取最近7天
    return timeForMat(7);
  };

  const yesterday = () => {
    // 校验是不是选择的昨天
    return timeForMat(1);
  };

  const today = () => {
    return timeForMat(0);
  };
  const changeDate = (id: any) => {
    setCurrent(1);
    if (id === '1') {
      setActiveDate('1');
      setStartDate(today()[0]);
      setEndDate(today()[1]);
    } else if (id === '2') {
      setActiveDate('2');
      setStartDate(yesterday()[0]);
      setEndDate(yesterday()[1]);
    } else if (id === '3') {
      setActiveDate('3');
      setStartDate(sevenDays()[0]);
      setEndDate(sevenDays()[1]);
    }
  };

  const changePage = (num: string) => {
    setCurrent(1);
    setpageNum(num);
    setshowPage(false);
  };
  const changeway = (num: any) => {
    setWay(num.text);
    setContactType(num.id);
    setshowWay(false);
  };
  const applyUserAgent = async () => {
    if (!contactAccount)
      return Toast.show({ content: t('promote.contactnumber') });
    if (!promoteType)
      return Toast.show({ content: t('promote.promotionmethod') });
    console.log('contactType', contactType);
    const result = await $fetch.post(
      '/lottery-api/promotionPageContro/applyUserAgent',
      {
        contactAccount,
        contactType,
        promoteType,
      }
    );
    if (!result.code) return Toast.show(result.message);
    if (result.code === 1) {
      Toast.show({ content: t('promote.promote64') });
      setshowWaystat(false);
      setContactAccount('');
      setPromoteType('');
    }
  };

  /** 复制 */
  const copyText = (item: string) => {
    Toast.show({ content: t('wallet.copysuccess') });
    copy(item);
  };
  const dispatch = useAppDispatch();
  const opencom = (name: string) => {
    dispatch(changeCommissionKey(name));
    dispatch(changeCommissionStatus(1));
  };
  const location = useLocation();
  const queryUserAgentCenterThirdCommission = async () => {
    if (!isLogin()) return;
    const result = await $fetch.post(
      '/lottery-api/thirdCommission/queryUserAgentCenterThirdCommission'
    );
    if (result.code === 1) {
      setcommissionData(result.data);
    }
  };

  const changeTab = (id: any) => {
    setStartDate(today()[0]);
    setEndDate(today()[1]);
    setActiveKey(id);
    if (id === '1') {
      getMaxCommissionRatioForGameType();
      getPlatformTotalCommission();
    } else if (id === '2') {
      queryUserAgentCenterThirdCommission();
      // queryPageUserByAgentAllSummary();
    }
  };
  useEffect(() => {
    getMaxCommissionRatioForGameType();
    getPlatformTotalCommission();
  }, []);
  useEffect(() => {
    if (!userinfo.token && location.state === '1') {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userinfo.token]);
  useEffect(() => {
    if (startDate && endDate) {
      queryPageUserByAgentAllSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, pageNum]);
  const onChangePage = async (page: number) => {
    setCurrent(page);
    if (!isLogin()) return;
    const result = await $fetch.post(
      '/lottery-api/thirdCommission/queryPageUserByAgentAllSummary',
      {
        pageNo: page,
        pageSize: pageNum,
        endDate,
        startDate,
      }
    );
    if (result.code === 1) {
      setRecordData(result.data);
      setTotalPage(result.data.totalCount);
    }
  };
  const receiveCommission = async () => {
    const result = await $fetch.post(
      '/lottery-api/thirdCommission/receiveThirdCommission'
    );
    if (!result.code) return Toast.show(result.message);
    if (result.code === 1) {
      await queryUserAgentCenterThirdCommission();
      Toast.show({
        content: result.message,
      });
    }
  };
  useEffect(() => {
    console.log('wserwfrw', location.state);
    if (location.state === '2' || location.state === '3') {
      setActiveKey('1');
    }
  }, [location.state]);
  return (
    <div>
      <div className={styles.promote}>
        {location.state === '1' && (
          <div className={styles.tabbox}>
            <div
              className={`${styles.first} ${
                activeKey === '1' && styles.actived
              }`}
              onClick={() => changeTab('1')}
            >
              {t('promote.promote62')}
            </div>
            <div
              className={`${styles.sencode} ${
                activeKey === '2' && styles.actived
              }`}
              onClick={() => changeTab('2')}
            >
              {t('promote.promote61')}
            </div>
          </div>
        )}
        {activeKey === '1' && (
          <>
            {/* 代理 */}
            {location.state === '1' ? (
              <div className={styles.imgbox}>
                <div className={styles.top}>
                  {t('promote.promote1')}
                  <span>{t('promote.promote2')}</span>
                  {t('promote.promote3')}
                </div>
                <div className={styles.two}>{t('promote.promote4')}</div>
                <div className={styles.tip}>
                  <span>
                    {t('promote.promote5')}:{userinfo.userCode}
                  </span>{' '}
                  <img
                    src={require('@/assets/images/promote/icon-复制.png')}
                    alt=''
                    onClick={() => copyText(userinfo.userCode)}
                  />
                </div>
                <div className={styles.tip2}>
                  <span>
                    {t('promote.promote6')}:
                    {`${window.location.host}?inviteCode=${userinfo.userCode}&type=3`}
                  </span>
                  <img
                    src={require('@/assets/images/promote/icon-复制.png')}
                    alt=''
                    onClick={() =>
                      copyText(
                        `${window.location.host}?inviteCode=${userinfo.userCode}&type=3`
                      )
                    }
                  />
                </div>
              </div>
            ) : (
              <div className={`${styles.imgbox} ${styles.imgbox2}`}>
                <div className={`${styles.top} ${styles.text}`}>
                  {t('promote.promote1')}
                  <span>{t('promote.promote2')}</span>
                  {t('promote.promote3')}
                </div>
                <div className={`${styles.two} ${styles.text}`}>
                  {t('promote.promote4')}
                  <br />
                  {t('promote.promote7')}
                </div>
                <div
                  className={`${styles.buybtn} ${styles.margintop}`}
                  onClick={() => setshowWaystat(true)}
                >
                  {t('promote.promote8')} $1000
                </div>
              </div>
            )}
            {/* 会员 */}

            <div className={styles.tabbox}>
              <div className={styles.three}>{t('promote.promote9')}</div>
            </div>
            <div className={styles.fastbox}>
              <div className={styles.toptip}>
                {t('promote.promote10')}
                <span>{t('promote.promote2')}</span> —{t('promote.promote11')}
              </div>
              <div className={styles.bottombox}>
                <div className={styles.left}>
                  <div className={styles.title}>{t('promote.promote12')}</div>
                  <div className={styles.tip}>
                    {t('promote.promote13')}
                    <span>{t('promote.promote2')}</span>
                    {t('promote.promote14')}
                  </div>
                  <div className={styles.tip1}>
                    <span>{t('promote.promote2')}</span>
                    {t('promote.promote15')}
                  </div>
                  <div className={styles.tip}>
                    {t('promote.promote16')}
                    <span>{t('promote.promote2')}</span> ，
                    {t('promote.promote17')}
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.title}>{t('promote.promote18')}</div>
                  <div className={styles.tip}>{t('promote.promote19')}</div>
                  <div className={styles.tip1}>{t('promote.promote20')}</div>
                  <div className={styles.tip1}>{t('promote.promote21')}</div>
                  <div className={styles.tip}>
                    {t('promote.promote22')}
                    <span>Service@bet123.io</span>
                    {t('promote.promote23')}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tabbox}>
              <div className={styles.three}>{t('promote.promote24')}</div>
            </div>
            <div className={styles.bigbox}>
              <div className={styles.toptitle}>
                <span>{t('promote.promote2')}</span>
                {t('promote.promote25')}
              </div>
              <div className={styles.fourbox}>
                <div className={styles.item}>
                  <div className={styles.num}>
                    {`${(
                      (parseFloat(ratioForGameType?.zrCommissionRate) * 10000) /
                      100.0
                    ).toFixed(2)}%`}
                  </div>
                  <div className={styles.name}>
                    {t('promote.promote26')}
                    <br />
                    {t('promote.promote27')}
                  </div>
                  <div
                    className={styles.game}
                    onClick={() => opencom('realperson')}
                  >
                    {t('promote.promote28')}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.num}>
                    {`${(
                      (parseFloat(ratioForGameType?.dzCommissionRate) * 10000) /
                      100.0
                    ).toFixed(2)}%`}
                  </div>
                  <div className={styles.name}>
                    {t('promote.promote26')}
                    <br />
                    {t('promote.promote27')}
                  </div>
                  <div
                    className={styles.game}
                    onClick={() => opencom('electronic')}
                  >
                    {t('promote.promote29')}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.num}>
                    {`${(
                      (parseFloat(ratioForGameType?.tyCommissionRate) * 10000) /
                      100.0
                    ).toFixed(2)}%`}
                  </div>
                  <div className={styles.name}>
                    {t('promote.promote26')}
                    <br />
                    {t('promote.promote27')}
                  </div>
                  <div
                    className={styles.game}
                    onClick={() => opencom('physicaleducation')}
                  >
                    {t('promote.promote30')}
                  </div>
                </div>
                <div className={styles.item2}>
                  <div className={styles.num}>? ? ?</div>
                  <div className={styles.name}>{t('promote.promote31')}</div>
                  <div className={styles.game}>? ? ? ?</div>
                </div>
              </div>
              <div className={styles.moneybox}>
                <div className={styles.tip1}>{t('promote.promote32')}</div>
                <div className={styles.tip2}>$ {platformTotalCommission}</div>
              </div>
            </div>
          </>
        )}
        {activeKey === '2' && (
          <div className={styles.recommend}>
            <div className={styles.recent}>
              <div className={styles.topname}>{t('promote.promote33')}</div>
              <div className={styles.recommend_num}>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>
                    {commissionData?.todayCommission}
                  </div>
                  <div className={styles.name}>{t('promote.promote34')}($)</div>
                </div>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>
                    {commissionData?.yesterdayReceivedCommission}
                  </div>
                  <div className={styles.name}>{t('promote.promote35')}($)</div>
                </div>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>
                    {commissionData?.thisWeekReceivedCommission}
                  </div>
                  <div className={styles.name}>{t('promote.promote36')}($)</div>
                </div>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>
                    {commissionData?.thisMonthReceivedCommission}
                  </div>
                  <div className={styles.name}>{t('promote.promote37')}($)</div>
                </div>
              </div>
            </div>
            <div className={`${styles.recent}`}>
              <div className={styles.topname}>{t('promote.promote38')}</div>
              <div className={styles.recommend_num}>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>{commissionData?.teamNum}</div>
                  <div className={styles.name}>{t('promote.promote39')}</div>
                </div>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>
                    {commissionData?.totalCommission}
                  </div>
                  <div className={styles.name}>{t('promote.promote40')}($)</div>
                </div>
                <div className={styles.recommend_item}>
                  <div className={styles.num}>
                    {commissionData?.receivableCommission}
                  </div>
                  <div className={styles.name}>{t('promote.promote41')}($)</div>
                </div>
                <div className={styles.recommend_item}>
                  <div className={styles.btn} onClick={receiveCommission}>
                    {t('promote.promote38')}
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.recent} ${styles.recent2}`}>
              <div className={styles.topname}>{t('promote.promote42')}</div>
              <div className={styles.head}>
                <div className={styles.headleft}>
                  <span
                    className={`${activeDate === '1' && styles.sed}`}
                    onClick={() => changeDate('1')}
                  >
                    {t('promote.promote43')}
                  </span>
                  <span
                    className={`${activeDate === '2' && styles.sed}`}
                    onClick={() => changeDate('2')}
                  >
                    {t('promote.promote44')}
                  </span>
                  <span
                    className={`${activeDate === '3' && styles.sed}`}
                    onClick={() => changeDate('3')}
                  >
                    {t('promote.promote45')}
                  </span>
                </div>
                <div
                  className={`${styles.headright}  ${
                    showPage ? styles.secked : ''
                  }`}
                  onClick={() => setshowPage(!showPage)}
                >
                  {pageNum}
                  {/* {t('promote.promote46')} */}
                </div>
                {showPage ? (
                  <div className={styles.page}>
                    <div onClick={() => changePage('10')}>10</div>
                    <div onClick={() => changePage('20')}>20</div>
                    <div onClick={() => changePage('30')}>30</div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className={styles.tablebox}>
                <div className={styles.tablehead}>
                  <span>{t('promote.promote47')}</span>
                  <span>{t('promote.promote48')}</span>
                  <span>{t('promote.promote49')}($)</span>
                  <span>{t('promote.promote50')}($)</span>
                  <span>{t('promote.promote51')}($)</span>
                </div>
                {recordData?.records?.length > 0 ? (
                  recordData?.records?.map((item: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`${styles.tableboby} ${styles.tableboby}`}
                      >
                        <span>{item.date}</span>
                        <span>{item.username}</span>
                        <span>{item.balance}</span>
                        <span>{item.selfBetAmount}</span>
                        <span>{item.commission}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.nomore}>
                    <img
                      className={styles.icon}
                      src={require('@/assets/images/promote/icon-暂无数据.png')}
                      alt=''
                    />
                    <div>{t('promote.promote52')}</div>
                  </div>
                )}
                {recordData?.records?.length > 0 && (
                  <PageNation
                    defaultPageSize={Number(pageNum)}
                    current={current}
                    totalPage={totalPage}
                    onChangePage={(page) => onChangePage(page)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        <Footer />
        {showWaystat && (
          <div className={styles.popbox}>
            <div
              className={styles.close}
              onClick={() => setshowWaystat(false)}
            ></div>
            <div className={styles.name}>{t('promote.promote53')}</div>
            <div className={styles.inputbox} onClick={() => setshowWay(true)}>
              {way}
            </div>
            {showWay && (
              <div className={styles.way}>
                {contactList.map((item, index) => {
                  return (
                    <div onClick={() => changeway(item)} key={index}>
                      {item.text}
                    </div>
                  );
                })}
              </div>
            )}
            <div className={styles.inputbox2}>
              <Input
                placeholder={t('promote.promote54')}
                value={contactAccount}
                onChange={(val) => {
                  setContactAccount(val);
                }}
              />
            </div>
            <div className={styles.name}>{t('promote.promote55')}</div>
            <div className={styles.inputbox3}>
              <TextArea
                placeholder={t('promote.promote56')}
                value={promoteType}
                onChange={(val) => {
                  setPromoteType(val);
                }}
              />
            </div>
            <div className={styles.submitbtn} onClick={applyUserAgent}>
              {t('promote.promote57')}
            </div>
          </div>
        )}
        {commissionStatus ? <PromotePop /> : ''}
      </div>
    </div>
  );
};
export default Promote;
