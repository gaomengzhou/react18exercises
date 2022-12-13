import { FC, useCallback, useEffect, useState } from 'react';
import { Empty, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import styles from './PickUpRecord.module.scss';
import PageNation from '@/components/page-nation';
import { ObjType } from '@/types/Common';
import { useThrottleFn } from '@/utils/tools/method';
import customizeLoading from '@/assets/images/loading.png';

const PickUpRecord: FC = () => {
  const { t } = useTranslation();
  // 节流
  const throttleFn = useThrottleFn();
  // 数据源
  const [state, setState] = useState<ObjType>({});
  const [loading, setLoading] = useState(false);
  // 查询gift领取记录
  const queryPageGiftWalletLog = useCallback(
    async (pageNo = 1, pageSize = 10) => {
      setLoading(true);
      const res = await $fetch.post(
        '/lottery-api/virtualWallet/queryPageGiftWalletLog',
        { pageNo, pageSize }
      );
      if (!res.success) {
        setLoading(false);
        return Toast.show(res.message);
      }
      setLoading(false);
      setState(res.data);
    },
    []
  );
  // componentDidMount
  useEffect(() => {
    queryPageGiftWalletLog();
  }, [queryPageGiftWalletLog]);
  // 分页查询
  const onChangePage = (num: number) => {
    queryPageGiftWalletLog(num);
  };
  return (
    <div>
      <div className={styles.table}>
        {loading && (
          <div className={styles.icon}>
            <img src={customizeLoading} alt='loading' />
          </div>
        )}
        <div className={styles.title}>
          <p>{t('giftPopup.date')}</p>
          <p>{t('giftPopup.from')}</p>
          <p>{t('giftPopup.type')}</p>
          <p>{t('giftPopup.amount')}</p>
        </div>
        {state.records && state.records.length > 0 ? (
          <div className={`${styles.content} ${loading && styles.blur}`}>
            {state.records.map((item: ObjType) => {
              return (
                <div key={item.id}>
                  <p>{item.createTime}</p>
                  <p>{item.businessName3}</p>
                  <p>{item.businessName2}</p>
                  <p>{item.transactionVirtualAmount}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${styles.empty} ${loading && styles.blur}`}>
            <Empty description={t('common.empty')} />
          </div>
        )}
      </div>
      <div className={styles.pager}>
        {/*
         defaultPageSize:每页展示多少条数据
         current:当前页数高亮,
         totalPage:总共多少条数据
        */}
        <PageNation
          current={state.pageNo}
          totalPage={state.totalCount}
          defaultPageSize={state.pageSize}
          onChangePage={(num) => throttleFn(() => onChangePage(num), 600)}
        />
      </div>
    </div>
  );
};
export default PickUpRecord;
