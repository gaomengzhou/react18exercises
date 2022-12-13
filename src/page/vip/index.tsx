/* eslint-disable import/no-dynamic-require */
import { FC, useEffect, useState } from 'react';
import { ProgressBar } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@/redux/hook';
import Footer from '@/page/home/footer/Footer';
import styles from './index.module.scss';
// import { RootState } from '@/redux/store';

const Activity: FC = () => {
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const { level } = useSelector((storeState) => storeState.indexData);
  const { headUrl, nickName } = useSelector((s) => s.indexData.userinfo);
  const { t } = useTranslation();
  const [vipList, setVipList] = useState([]);
  const [vipType, setVipType] = useState();
  //   const currentLanguage = useSelector(
  //     (s: RootState) => s.indexData.currentLanguage
  //   );
  const queryAllVipLevel = async () => {
    const res = await $fetch.post(
      '/lottery-api/vipInfo/queryAllVipLevelConfig'
    );
    if (res.code === 1) {
      setVipList(res.data);
    }
  };
  const getGlobalSwitchConfigInfo = async () => {
    const res = await $fetch.post(
      '/config-api/homePage/getGlobalSwitchConfigInfo'
    );
    if (res.code === 1) {
      setVipType(res.data.vipType);
    }
  };
  useEffect(() => {
    getGlobalSwitchConfigInfo();
    queryAllVipLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.vipbox}>
      <div className={styles.topimg}></div>
      <div className={styles.vipinfo}>
        <div className={styles.vipinfoleft}>
          {userinfo.token && (
            <div className={styles.top}>
              <div className={styles.topinfo}>
                <img src={headUrl} alt='' className={styles.head} />
                <div className={styles.name}>{nickName}</div>
                <img
                  className={styles.vip}
                  src={require(`@/assets/images/vip/VIP${level.currentVipLevel}.png`)}
                  alt=''
                />
              </div>
              <div className={styles.num}>{level.levelLine.toFixed(2)}%</div>
              <ProgressBar
                percent={level.levelLine}
                style={{
                  '--fill-color': '#eb20cb',
                }}
              />
              <div className={styles.tip}>
                <span>VIP{level.currentVipLevel}</span>
                <span>VIP{level.nextVipLevel}</span>
              </div>
            </div>
          )}
          <div className={styles.bottom}>
            <div className={styles.item}>
              <img
                src={require('@/assets/images/vip/VIP-icon-现金返还.png')}
                alt=''
              />
              <div className={styles.text}>
                <div className={styles.toptext}>{t('promote.promote65')}</div>
                <div className={styles.bottomtext}>
                  {t('promote.promote66')}
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <img
                src={require('@/assets/images/vip/VIP-icon-VIP专属优惠.png')}
                alt=''
              />
              <div className={styles.text}>
                <div className={styles.toptext}>{t('promote.promote67')}</div>
                <div className={styles.bottomtext}>
                  {t('promote.promote68')}
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <img
                src={require('@/assets/images/vip/VIP-icon-VIP俱乐部.png')}
                alt=''
              />
              <div className={styles.text}>
                <div className={styles.toptext}>{t('promote.promote63')}</div>
                <div className={styles.bottomtext}>
                  {t('promote.promote63')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.vipinforight}>
          {vipList.map((item: any) => (
            <div className={styles.vipitem} key={item.vipLevel}>
              <img
                src={require(`@/assets/images/vip/bg-VIP${item.vipLevel}.png`)}
                alt=''
              />
              <div className={styles.middle}>
                <div className={styles.textinfo}>
                  {vipType === 0 ? (
                    <span>{t('promote.promote88')}：</span>
                  ) : (
                    <span>{t('promote.promote70')}：</span>
                  )}
                  {vipType === 0 ? (
                    <span>${item.vipAccumulativeBetAmount}</span>
                  ) : (
                    <span>${item.vipAccumulativeRechargeScore}</span>
                  )}
                </div>
                <div className={styles.textinfo}>
                  <span>{t('promote.promote71')}：</span>
                  <span>${item.bonus}</span>
                </div>
                <div className={styles.textinfo}>
                  <span>{t('promote.promote72')}：</span>
                  <span>{item.maxRebate}% (最高)</span>
                </div>
              </div>
              <div
                className={`${styles.bottombox} ${
                  item.vipLevel === level.currentVipLevel && styles.colorstyle
                }`}
              >
                <div>{t('promote.promote73')}</div>
                <div>{t('promote.promote74')}</div>
                <div>{t('promote.promote75')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.gif}>
        <div className={styles.gifitem}>
          <img src={require('@/assets/images/vip/bg-专属VIP客服.png')} alt='' />
          <div className={styles.title}>{t('promote.promote74')}</div>
          <div className={styles.main}>{t('promote.promote76')}</div>
        </div>
        <div className={styles.gifitem}>
          <img src={require('@/assets/images/vip/bg-VIP优惠活动.png')} alt='' />
          <div className={styles.title}>{t('promote.promote77')}</div>
          <div className={styles.main}>{t('promote.promote78')}</div>
        </div>
        <div className={styles.gifitem}>
          <img src={require('@/assets/images/vip/bg-VIP神秘礼物.png')} alt='' />
          <div className={styles.title}>{t('promote.promote79')}</div>
          <div className={styles.main}>{t('promote.promote80')}</div>
        </div>
        <div className={styles.gifitem}>
          <img src={require('@/assets/images/vip/bg-快速提款.png')} alt='' />
          <div className={styles.title}>{t('promote.promote81')}</div>
          <div className={styles.main}>{t('promote.promote82')}</div>
        </div>
        <div className={styles.gifitem}>
          <img
            src={require('@/assets/images/vip/bg-VIP私人定制旅游.png')}
            alt=''
          />
          <div className={styles.title}>{t('promote.promote83')}</div>
          <div className={styles.main}>{t('promote.promote85')}</div>
        </div>
        <div className={styles.gifitem}>
          <img
            src={require('@/assets/images/vip/bg-年度盛典派对.png')}
            alt=''
          />
          <div className={styles.title}>{t('promote.promote86')}</div>
          <div className={styles.main}>{t('promote.promote87')}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Activity;
