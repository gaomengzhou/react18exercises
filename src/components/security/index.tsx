import { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tabs } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import Phone from '@/page/security/phone/phone';
import Email from '@/page/security/email/email';
import Google from '@/page/security/google/google';
import Password from '@/page/security/password/password';
import { AppDispatch } from '@/redux/store';
import { changeSecurityStatus } from '@/redux/security';
import { useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import icon from '@/assets/images/security/icon-安全中心-进入.png';
import styles from './index.module.scss';

const SecurityInf: FC = () => {
  const { t } = useTranslation();
  const [tabs] = useState([
    { title: t('activity.binding'), key: '1' },
    { title: t('activity.emailbinding'), key: '2' },
    { title: t('activity.googlebinding'), key: '3' },
    { title: t('activity.password'), key: '4' },
  ]);
  const dispatch = useDispatch<AppDispatch>();
  const [activeKey, setActiveKey] = useState('1');
  const [grade, setGrade] = useState('');
  const [num, setNum] = useState('');
  const close = () => {
    dispatch(changeSecurityStatus(0));
  };
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const userinfo = useSelector((state) => state.indexData.userinfo);
  useEffect(() => {
    if (!userinfo?.isBindMobile && !userinfo?.isBindEmail) {
      setGrade(t('activity.low'));
      setNum('1');
    }
    if (userinfo?.isBindMobile || userinfo?.isBindEmail) {
      setGrade(t('activity.middle'));
      setNum('2');
    }
    if (
      userinfo?.isBindMobile &&
      userinfo?.isBindEmail &&
      userinfo?.isBindGoogle
    ) {
      setGrade(t('activity.high'));
      setNum('3');
    }
  }, [
    userinfo?.isBindMobile,
    userinfo?.isBindEmail,
    userinfo?.isBindGoogle,
    t,
  ]);
  useEffect(() => {
    if (!userinfo?.isBindMobile && !userinfo?.isBindEmail) {
      setGrade(t('activity.low'));
      setNum('1');
    }
    if (userinfo?.isBindMobile || userinfo?.isBindEmail) {
      setGrade(t('activity.middle'));
      setNum('2');
    }
    if (
      userinfo?.isBindMobile &&
      userinfo?.isBindEmail &&
      userinfo?.isBindGoogle
    ) {
      setGrade(t('activity.high'));
      setNum('3');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const changeTab = async (id: any) => {
    setActiveKey(id);
    const detailRes = await $fetch.post('/lottery-api/user/getUserDetail', {
      auxiliaryCode,
      appVersion: $env.REACT_APP_API_VERSION,
      deviceCode: 'H5',
    });
    if (detailRes.code === 1) {
      dispatch(indexData.actions.setUserinfo(detailRes.data));
    }
  };
  return (
    <div className={styles.ReactModalPortal}>
      <div className={styles.ReactModal__Overlay}>
        <div className={styles.ReactModal__Content}>
          <div className={styles.heardtitle}>
            <div>{t('activity.security')}</div>
            <div className={styles['hx-modal-title']} onClick={close}></div>
          </div>
          <div className={styles.bobybox}>
            <div className={styles.grade}>
              {t('activity.securitygrad')}:
              <span
                className={
                  num === '1'
                    ? styles.status1
                    : num === '2'
                    ? styles.status2
                    : styles.status3
                }
              >
                {grade}
              </span>
            </div>
            <div className={styles.container}>
              <div className={styles.side}>
                {tabs.map((item) => (
                  <div
                    className={`
                  ${styles.leftitem}
                  ${activeKey === item.key && styles.actived}
                  `}
                    onClick={() => changeTab(item.key)}
                    key={item.key}
                  >
                    <div>{item.title}</div>
                    <div>
                      {item.key === '4' ? (
                        <span>{t('activity.edit')}</span>
                      ) : (
                        ''
                      )}
                      {item.key === '1' &&
                        (userinfo?.isBindMobile ? (
                          <span>{t('activity.bound')}</span>
                        ) : (
                          <span>{t('activity.bindnow')}</span>
                        ))}
                      {item.key === '2' &&
                        (userinfo?.isBindEmail ? (
                          <span>{t('activity.bound')}</span>
                        ) : (
                          <span>{t('activity.bindnow')}</span>
                        ))}
                      {item.key === '3' &&
                        (userinfo?.isBindGoogle ? (
                          <span>{t('activity.bound')}</span>
                        ) : (
                          <span>{t('activity.bindnow')}</span>
                        ))}
                      <img src={icon} alt='' />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.main}>
                <div
                  className={`
                    ${styles.content}
                    ${activeKey === '1' && styles.active}
                    `}
                >
                  <Phone />
                </div>
                <div
                  className={`
                  ${styles.content}
                  ${activeKey === '2' && styles.active}
                  `}
                >
                  <Email></Email>
                </div>
                <div
                  className={`
                  ${styles.content}
                  ${activeKey === '3' && styles.active}
                  `}
                >
                  <Google></Google>
                </div>
                <div>
                  <Password></Password>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.h5container}>
            <Tabs
              activeLineMode='fixed'
              style={{
                '--fixed-active-line-width': '8vw',
                '--title-font-size': '4vw',
                '--active-title-color': '#ffffff',
                '--active-line-height': '1vw',
                '--active-line-color': '#1583d6',
                '--active-line-border-radius': '3px',
              }}
            >
              <Tabs.Tab title={t('activity.binding')} key='1'>
                <div className={styles.grade}>
                  {t('activity.securitygrad')}：
                  <span
                    className={
                      num === '1'
                        ? styles.status1
                        : num === '2'
                        ? styles.status2
                        : styles.status3
                    }
                  >
                    {grade}
                  </span>
                </div>
                <Phone></Phone>
              </Tabs.Tab>
              <Tabs.Tab title={t('activity.emailbinding')} key='2'>
                <div className={styles.grade}>
                  {t('activity.securitygrad')}：
                  <span
                    className={
                      num === '1'
                        ? styles.status1
                        : num === '2'
                        ? styles.status2
                        : styles.status3
                    }
                  >
                    {grade}
                  </span>
                </div>
                <Email></Email>
              </Tabs.Tab>
              <Tabs.Tab title={t('activity.googlebinding')} key='3'>
                <div className={styles.grade}>
                  {t('activity.securitygrad')}：
                  <span
                    className={
                      num === '1'
                        ? styles.status1
                        : num === '2'
                        ? styles.status2
                        : styles.status3
                    }
                  >
                    {grade}
                  </span>
                </div>
                <Google></Google>
              </Tabs.Tab>
              <Tabs.Tab title={t('activity.password')} key='4'>
                <div className={styles.grade}>
                  {t('activity.securitygrad')}：
                  <span
                    className={
                      num === '1'
                        ? styles.status1
                        : num === '2'
                        ? styles.status2
                        : styles.status3
                    }
                  >
                    {grade}
                  </span>
                </div>
                <Password></Password>
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecurityInf;
