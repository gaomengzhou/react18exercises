import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tabs, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import PageNation from 'components/page-nation';
import { AppDispatch } from '@/redux/store';
import { useSelector } from '@/redux/hook';
import { changeCommissionStatus, changeCommissionKey } from '@/redux/security';
import styles from './index.module.scss';

const Message: FC = () => {
  const commissionKey = useSelector((state) => state.security.commissionKey);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [pageNo] = useState(1);
  // const [setActiveIndex, setSetActiveIndex] = useState('realperson');
  const [current, setCurrent] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataList, setDataList] = useState({
    records: [],
  });
  const close = () => {
    dispatch(changeCommissionStatus(0));
  };
  const changTab = async (key: any) => {
    setCurrent(1);
    await dispatch(changeCommissionKey(key));
  };

  useEffect(() => {
    // setSetActiveIndex(commissionKey);
    const queryPageCommissionLevelByThirdGameType = async () => {
      console.log('commissionKey', commissionKey);
      let type = 2;
      if (commissionKey === 'realperson') {
        type = 2;
      } else if (commissionKey === 'electronic') {
        type = 4;
      } else if (commissionKey === 'physicaleducation') {
        type = 3;
      }
      const result = await $fetch.post(
        '/config-api/promotionPageContro/queryPageCommissionLevelByThirdGameType',
        {
          pageNo,
          pageSize: 10,
          thirdGameType: type,
        }
      );
      if (!result.code) return Toast.show(result.message);
      if (result.code === 1) {
        setDataList(result.data);
        setTotalPage(result.data.totalCount);
      }
    };
    queryPageCommissionLevelByThirdGameType();
  }, [commissionKey, pageNo]);
  const onChangePage = async (page: number) => {
    setCurrent(page);
    let type = 2;
    if (commissionKey === 'realperson') {
      type = 2;
    } else if (commissionKey === 'electronic') {
      type = 4;
    } else if (commissionKey === 'physicaleducation') {
      type = 3;
    }
    const result = await $fetch.post(
      '/config-api/promotionPageContro/queryPageCommissionLevelByThirdGameType',
      {
        pageNo: page,
        pageSize: 10,
        thirdGameType: type,
      }
    );
    if (!result.code) return Toast.show(result.message);
    if (result.code === 1) {
      setDataList(result.data);
      setTotalPage(result.data.totalCount);
    }
  };

  return (
    <div className={styles.ReactModalPortal}>
      <div className={styles.ReactModal__Overlay}>
        <div className={styles.ReactModal__Content}>
          <div className={styles.heardtitle}>
            <div>{t('header.CommissionDetails')}</div>
            <div className={styles['hx-modal-title']} onClick={close}></div>
          </div>
          <div className={styles.bobybox}>
            <Tabs
              activeKey={commissionKey}
              activeLineMode='fixed'
              onChange={(key) => changTab(key)}
              defaultActiveKey={commissionKey}
            >
              <Tabs.Tab title={t('promote.promote28')} key='realperson'>
                <div className={styles.tablebox}>
                  <div className={styles.tablehead}>
                    <span>{t('promote.promote58')}</span>
                    <span>{t('promote.promote59')}</span>
                    <span>{t('promote.promote60')}</span>
                  </div>
                  {dataList?.records?.length > 0 ? (
                    dataList?.records?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`${styles.tableboby} ${styles.tableboby}`}
                        >
                          <span>{item.thirdGameName} </span>
                          <span>{item.betRange}</span>
                          <span>{item.commissionRate}%</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.nomore}>
                      <img
                        className={styles.icon}
                        src={require('@/assets/images/promote/icon-复制.png')}
                        alt=''
                      />
                      <div>{t('promote.promote52')}</div>
                    </div>
                  )}
                  {/* 暂无数据 */}
                  {dataList?.records?.length > 0 && (
                    <PageNation
                      current={current}
                      totalPage={totalPage}
                      onChangePage={(page) => onChangePage(page)}
                    />
                  )}
                </div>
              </Tabs.Tab>
              <Tabs.Tab title={t('promote.promote29')} key='electronic'>
                <div className={styles.tablebox}>
                  <div className={styles.tablehead}>
                    <span>{t('promote.promote58')}</span>
                    <span>{t('promote.promote59')}</span>
                    <span>{t('promote.promote60')}</span>
                  </div>
                  {dataList?.records?.length > 0 ? (
                    dataList?.records?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`${styles.tableboby} ${styles.tableboby}`}
                        >
                          <span>{item.thirdGameName} </span>
                          <span>{item.betRange}</span>
                          <span>{item.commissionRate}%</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.nomore}>
                      <img
                        className={styles.icon}
                        src={require('@/assets/images/promote/icon-复制.png')}
                        alt=''
                      />
                      <div>{t('promote.promote52')}</div>
                    </div>
                  )}
                  {/* 暂无数据 */}
                  {dataList?.records?.length > 0 && (
                    <PageNation
                      current={current}
                      totalPage={totalPage}
                      onChangePage={(page) => onChangePage(page)}
                    />
                  )}
                </div>
              </Tabs.Tab>
              <Tabs.Tab title={t('promote.promote30')} key='physicaleducation'>
                <div className={styles.tablebox}>
                  <div className={styles.tablehead}>
                    <span>{t('promote.promote58')}</span>
                    <span>{t('promote.promote59')}</span>
                    <span>{t('promote.promote60')}</span>
                  </div>
                  {dataList?.records?.length > 0 ? (
                    dataList?.records?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`${styles.tableboby} ${styles.tableboby}`}
                        >
                          <span>{item.thirdGameName} </span>
                          <span>{item.betRange}</span>
                          <span>{item.commissionRate}%</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.nomore}>
                      <img
                        className={styles.icon}
                        src={require('@/assets/images/promote/icon-复制.png')}
                        alt=''
                      />
                      <div>{t('promote.promote52')}</div>
                    </div>
                  )}
                  {/* 暂无数据 */}
                  {dataList?.records?.length > 0 && (
                    <PageNation
                      current={current}
                      totalPage={totalPage}
                      onChangePage={(page) => onChangePage(page)}
                    />
                  )}
                </div>
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Message;
