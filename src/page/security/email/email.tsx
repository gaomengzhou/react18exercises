import { FC, useEffect, useState } from 'react';
import { Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './email.module.scss';

let count = 0;
let smsTimer = null as any;
const Email: FC = () => {
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const initsmsText = t('login.Code');
  const Regetcode = t('login.Regetcode');
  const [smsText, setSmsText] = useState(initsmsText);
  const [smsCode, setSmsCode] = useState('');
  const [email, setEmail] = useState('');
  const [isSendRequest, setisSendRequest] = useState(false);
  const [status, setStatus] = useState(1);
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const changePhone = (e: any) => {
    // const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    // const realVal = val.replace(/[^0-9]$/gi, '');
    setEmail(e.target.value);
  };
  const clearPhone = () => {
    setEmail('');
  };
  const changeSmsCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setSmsCode(realVal);
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
        // dom.innerHTML = `${count}S`;
        setSmsText(`${count}S`);
      }
    }, 1000);
  };
  const sendSmsCode = async () => {
    if (isSendRequest) return;
    if (!email) return Toast.show(t('login.inputtheemailaddress'));
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });
    const result = await $fetch.post(
      '/lottery-login-api/user/getEmailVerifyCode',
      {
        email,
        sendType: 1,
      }
    );
    Toast.show({
      content: result.message,
    });
    if (result.code === 1) {
      smsCountDown();
    }
  };

  useEffect(() => {
    if (userinfo?.isBindEmail) {
      setStatus(0);
    }
    return () => {
      clearInterval(smsTimer);
    };
  }, [userinfo?.isBindEmail]);
  const submit = async () => {
    if (!email) return Toast.show(t('login.inputtheemailaddress'));
    if (!smsCode) return Toast.show(t('login.yourCode'));
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });
    const res = await $fetch.post('/lottery-login-api/user/checkVerifyCode', {
      verificationAccount: email,
      verifyCode: smsCode,
      username: userinfo.userName,
      verifyType: 5,
    });
    Toast.show({
      content: res.message,
    });
    if (res.code === 1) {
      const result = await $fetch.post(
        '/lottery-login-api/user/accountBindEmail',
        {
          email,
          code: smsCode,
          username: userinfo.userName,
        }
      );
      Toast.show({
        content: result.message,
      });
      if (result.code === 1) {
        const detailRes = await $fetch.post('/lottery-api/user/getUserDetail', {
          auxiliaryCode,
          appVersion: $env.REACT_APP_API_VERSION,
          deviceCode: 'H5',
        });
        if (detailRes.code === 1) {
          dispatch(indexData.actions.setUserinfo(detailRes.data));
        }
      }
    }
  };
  return (
    <div>
      <div className={styles['middle-part']}>
        <div className={styles['middle-content']}>
          <div className={styles.titlename}>{t('activity.emailbinding')}</div>
          {status === 1 && (
            <>
              <div className={styles['dumi-default-search']}>
                <input
                  className={`${styles['dumi-default-search-input']} ${styles['mobile-input']}`}
                  onChange={changePhone}
                  value={email}
                  placeholder={t('activity.tip21')}
                />
                {email.length > 0 ? (
                  <i onClick={clearPhone} className={styles.rightIcon1} />
                ) : (
                  ''
                )}
              </div>
              <div className={styles['dumi-default-search']}>
                <input
                  className={styles['dumi-default-search-input']}
                  onChange={changeSmsCode}
                  value={smsCode}
                  placeholder={t('activity.verificationcode')}
                  maxLength={6}
                />
                <span className={styles.verfCode} onClick={sendSmsCode}>
                  {smsText}
                </span>
              </div>
              <div
                className={`${styles.loginBtn} ${styles.marginTop20}`}
                onClick={submit}
              >
                {t('activity.sure')}
              </div>
            </>
          )}
          {status === 0 && (
            <div className={styles.binde}>
              <span>{userinfo.loginEmail}</span>
              <span>{t('activity.bound')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Email;
