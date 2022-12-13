import { FC, useEffect, useState } from 'react';
import { Input, Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import copyicon from '@/assets/images/security/icon-安全中心-copy@2x.png';
import success from '@/assets/images/security/icon-谷歌验证-成功@3x.png';
import styles from './google.module.scss';

let count = 0;
let smsTimer = null as any;
const Authenticator: FC = () => {
  const dispatch = useAppDispatch();
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const { t } = useTranslation();
  // 渲染所选值
  const initsmsText = t('login.Code');
  const Regetcode = t('login.Regetcode');
  const [smsText, setSmsText] = useState(initsmsText);
  const [smsCode, setSmsCode] = useState('');
  const [googleCode, setGoogleCode] = useState('');
  const [status, setStatus] = useState(0);
  const [verifyType2, setVerifyType2] = useState(1);
  const [userGoogleSecretKey, setUserGoogleSecretKey] = useState({
    googleSecret: '',
    googleSecretQrCodeBase64: '',
  });
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const [isSendRequest, setisSendRequest] = useState(false);
  const onCopy = (values: string) => {
    if (copy(values)) {
      Toast.show({ content: t('wallet.copysuccess') });
    } else {
      Toast.show('复制失败');
    }
  };
  const gotoOnlineService = (e: any) => {
    e.stopPropagation();
    if (!platformConfig.customerServiceUrl) return;
    window.open(platformConfig.customerServiceUrl);
  };
  const smsCountDown = () => {
    let prevCountdownTime = Date.now();
    setisSendRequest(true);
    count = 60;
    smsTimer = setInterval(() => {
      if (+count <= 0) {
        clearInterval(smsTimer);
        count = 0;
        setSmsText(Regetcode);
        setisSendRequest(false);
      } else {
        count -= Math.max(
          1,
          Math.floor((Date.now() - prevCountdownTime) / 1000)
        );
        prevCountdownTime = Date.now();
        // const dom: any = document.querySelector(`.${styles.verfCode}`);
        // if (count === 0) {
        //   dom.innerHTML = t('login.Regetcode');
        // } else if (dom) {
        //   dom.innerHTML = `${count}S`;
        // }
        setSmsText(`${count}S`);
      }
    }, 1000);
  };
  // 查询钱包
  const createUserGoogleSecretKey = async () => {
    const res = await $fetch.post(
      '/lottery-login-api/user/createUserGoogleSecretKey',
      {
        username: userinfo.userName,
      }
    );
    if (!res.success) return Toast.show(res.message);

    setUserGoogleSecretKey(res.data);
  };
  useEffect(() => {
    if (userinfo?.isBindGoogle) {
      setStatus(3);
    } else {
      if (userinfo?.isBindMobile) {
        setStatus(5);
        return;
      }
      if (!userinfo?.isBindMobile && userinfo?.isBindEmail) {
        setStatus(1);
        return;
      }
      if (!userinfo?.isBindMobile && !userinfo?.isBindEmail) {
        setStatus(6);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (userinfo?.isBindGoogle) {
      setStatus(3);
    } else {
      if (userinfo?.isBindMobile) {
        setStatus(5);
        return;
      }
      if (!userinfo?.isBindMobile && userinfo?.isBindEmail) {
        setStatus(1);
        return;
      }
      if (!userinfo?.isBindMobile && !userinfo?.isBindEmail) {
        setStatus(6);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userinfo?.isBindMobile, userinfo?.isBindEmail, userinfo?.isBindMobile]);
  const changeSmsCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setSmsCode(realVal);
  };
  const next = async () => {
    if (!smsCode) return Toast.show(t('login.yourCode'));
    await createUserGoogleSecretKey();
    let verifyType = 0;
    // 邮箱
    if (status === 1) {
      verifyType = 4;
      setVerifyType2(2);
      // 手机
    } else if (status === 5) {
      verifyType = 3;
      setVerifyType2(1);
    }
    const res = await $fetch.post(
      '/lottery-login-api/user/checkUserVerifyCode',
      {
        verificationAccount: '',
        verifyCode: smsCode,
        username: userinfo.userName,
        verifyType,
      }
    );
    if (!res.success) return Toast.show(res.message);
    setStatus(2);
  };
  const sendSmsCode = async (id: number) => {
    if (isSendRequest) return;
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });

    if (id === 1) {
      const result = await $fetch.post(
        '/lottery-login-api/user/getUserEmailVerifyCode',
        {
          sendType: 2,
        }
      );
      Toast.show({
        content: result.message,
      });
      if (result.code === 1) {
        smsCountDown();
      }
    } else if (id === 0) {
      const result = await $fetch.post(
        '/lottery-login-api/user/getUserSmsVerifyCode'
      );
      Toast.show({
        content: result.message,
      });
      if (result.code === 1) {
        smsCountDown();
      }
    }
  };
  useEffect(() => {
    return () => {
      clearInterval(smsTimer);
    };
  }, []);

  const submit = async () => {
    if (!googleCode) return Toast.show(t('login.yourCode'));
    const res = await $fetch.post(
      '/lottery-login-api/user/accountBindGoogleVerifier',
      {
        googleCode,
        googleSecret: userGoogleSecretKey.googleSecret,
        username: userinfo.userName,
        verifyType: verifyType2,
      }
    );
    Toast.show(res.message);
    if (res.code === 1) {
      setStatus(3);
      const detailRes = await $fetch.post('/lottery-api/user/getUserDetail', {
        auxiliaryCode,
        appVersion: $env.REACT_APP_API_VERSION,
        deviceCode: 'H5',
      });
      if (detailRes.code === 1) {
        dispatch(indexData.actions.setUserinfo(detailRes.data));
      }
    }
  };
  const gotoEmail = () => {
    console.log('userinfo?.isBindEmail', userinfo?.isBindEmail);
    if (userinfo?.isBindEmail) {
      clearInterval(smsTimer);
      setSmsCode('');
      setStatus(1);
    } else {
      Toast.show('请先绑定邮箱验证');
    }
  };
  const gotoPhone = () => {
    console.log('userinfo?.isBindMobile', userinfo?.isBindMobile);
    if (userinfo?.isBindMobile) {
      clearInterval(smsTimer);
      setSmsCode('');
      setStatus(5);
    } else {
      Toast.show('请先绑定手机验证');
    }
  };
  return (
    <div className={styles.securitybox}>
      {/* <div className={styles.toptitle}>谷歌身份验证器绑定</div> */}
      {/* 未绑定邮箱和验证码 */}
      {status === 6 && (
        <>
          <div className={styles.headtitle}>{t('activity.tip3')}</div>
          <div className={styles.headtip}>{t('activity.tip4')}</div>
          <div className={styles.nomore}>{t('activity.tip5')}</div>
        </>
      )}
      {/* 手机 */}
      {status === 5 && (
        <>
          <div className={styles.headtitle}>{t('activity.tip3')}</div>
          <div className={styles.headtip}>{t('activity.tip4')}</div>
          <div className={styles.headtitle2}>{t('activity.tip6')}</div>
          <div className={styles.tips}>
            {t('activity.tip7')}:{userinfo?.loginMobile}
          </div>
          <div className={styles['dumi-default-search']}>
            <input
              className={styles['dumi-default-search-input']}
              onChange={changeSmsCode}
              value={smsCode}
              placeholder={t('activity.verificationcode')}
              maxLength={6}
            />
            <span className={styles.verfCode} onClick={() => sendSmsCode(0)}>
              {smsText}
            </span>
          </div>
          {userinfo?.isBindMobile && userinfo?.isBindEmail ? (
            <div className={styles.bottomtips}>
              {t('activity.tip8')}
              <span onClick={gotoEmail}>{t('activity.tip9')}</span>
            </div>
          ) : (
            ''
          )}
        </>
      )}
      {/* 邮箱 */}
      {status === 1 && (
        <>
          <div className={styles.headtitle}>{t('activity.tip3')}</div>
          <div className={styles.headtip}>{t('activity.tip4')}</div>
          <div className={styles.headtitle2}>{t('activity.tip9')}</div>
          <div className={styles.tips}>
            {t('activity.tip10')}:{userinfo.loginEmail}
          </div>
          <div className={styles['dumi-default-search']}>
            <input
              className={styles['dumi-default-search-input']}
              onChange={changeSmsCode}
              value={smsCode}
              placeholder={t('activity.verificationcode')}
              maxLength={6}
            />
            <span className={styles.verfCode} onClick={() => sendSmsCode(1)}>
              {smsText}
            </span>
          </div>
          {userinfo?.isBindMobile && userinfo?.isBindEmail ? (
            <div className={styles.bottomtips}>
              {t('activity.tip11')}
              <span onClick={gotoPhone}>{t('activity.tip6')}</span>
            </div>
          ) : (
            ''
          )}
        </>
      )}
      {/* google认证 */}
      {status === 2 && (
        <>
          <div className={styles.toptitle1}>{t('activity.tip100')}</div>
          <div className={styles.toptitle2}>{t('activity.tip101')}</div>
          <div className={styles.toptitle}>{t('activity.tip12')}</div>
          <div className={styles.download}>
            <div
              onClick={() =>
                window.open(
                  'https://apps.apple.com/cn/app/google-authenticator/id388497605'
                )
              }
            >
              {t('activity.tip13')}
            </div>
            <div
              onClick={() =>
                window.open(
                  'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
                )
              }
            >
              {t('activity.tip14')}
            </div>
          </div>

          <div className={styles.toptitle}>
            {t('activity.tip15')}
            <br></br>
            {t('activity.tip155')}
          </div>

          <div className={styles.QRcode}>
            <img
              src={`data:image/png;base64,${userGoogleSecretKey.googleSecretQrCodeBase64}`}
              alt='icon'
              className={styles.QRcodeleft}
            />
            <div className={styles.QRcoderight}>
              <div
                onClick={() => onCopy(userGoogleSecretKey.googleSecret)}
                className={styles.topcoy}
              >
                {userGoogleSecretKey.googleSecret}
                <img src={copyicon} alt='copyicon' className={styles.copy} />
              </div>
              <div className={styles.copytip}>{t('activity.tip16')}</div>
            </div>
          </div>
          <div className={styles.toptitle}>{t('activity.tip17')}</div>
          <div className={styles.inputbox}>
            <Input
              clearable
              placeholder={t('activity.tip18')}
              value={googleCode}
              onChange={(val) => {
                setGoogleCode(val);
              }}
              maxLength={6}
            />
          </div>
        </>
      )}
      {/* 已绑定 */}
      {status === 3 && (
        <>
          <div className={styles.toptitle1}>{t('activity.tip3')}</div>
          <div className={styles.toptitle2}>{t('activity.tip101')}</div>
          <img className={styles.successbox} src={success} alt='success' />
          <div className={styles.bind}>{t('activity.bound')}</div>
        </>
      )}
      {(status === 1 || status === 5) && (
        <div className={styles.submitBtn} onClick={next}>
          {t('activity.nextstep')}
        </div>
      )}
      {status === 2 && (
        <div className={styles.submitBtn} onClick={submit}>
          {t('activity.tip19')}
        </div>
      )}
      {status === 3 && (
        <div className={styles.submitBtn} onClick={gotoOnlineService}>
          {t('activity.tip20')}
        </div>
      )}
    </div>
  );
};
export default Authenticator;
