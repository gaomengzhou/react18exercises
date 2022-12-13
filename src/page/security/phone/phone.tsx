import { FC, useEffect, useState } from 'react';
// import { Input } from 'antd-mobile';
import { Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import ChooseAreaCode from '@/page/home/components/login/ChooseAreaCode';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './phone.module.scss';

let count = 0;
let smsTimer = null as any;
const Phone: FC = () => {
  const dispatch = useAppDispatch();
  const userinfo = useSelector((state) => state.indexData.userinfo);
  const { t } = useTranslation();
  const initsmsText = t('login.Code');
  const Regetcode = t('login.Regetcode');
  const [smsText, setSmsText] = useState(initsmsText);
  const [smsCode, setSmsCode] = useState('');
  const [status, setStatus] = useState(1);
  const [phone, setPhone] = useState('');
  const [isShowArea, setIsShowArea] = useState(false);
  const [isSendRequest, setisSendRequest] = useState(false);
  const switchs = useSelector((state) => state.indexData.switchs);
  const area = JSON.parse(switchs.areaCodeType);
  const areaStr = area.length > 0 ? area[0].areaCodekey : '86';
  const [currentAreaCode, setCurrentAreaCode] = useState(areaStr);
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const changeIsShowArea = () => {
    setIsShowArea(!isShowArea);
  };
  const changePhone = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setPhone(realVal);
  };
  const clearPhone = () => {
    setPhone('');
  };
  const changeSmsCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setSmsCode(realVal);
  };

  const chooseArea = (code: any) => {
    setCurrentAreaCode(code);
    setIsShowArea(false);
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
        // console.log('dom', dom);
        // dom.innerHTML = `${count}S`;
        setSmsText(`${count}S`);
      }
    }, 1000);
  };
  const sendSmsCode = async () => {
    if (isSendRequest) return;
    const reg = /^[0-9]{6,11}/;
    if (!reg.test(phone)) return Toast.show(t('login.checkyourphone'));
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });
    const result = await $fetch.post(
      '/lottery-login-api/user/getSmsVerifyCode',
      {
        loginMobile: phone,
        mobileAreaCode: currentAreaCode,
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
    if (userinfo?.isBindMobile) {
      setStatus(0);
    }
    return () => {
      clearInterval(smsTimer);
    };
  }, [userinfo?.isBindMobile]);

  const bindMobile = async () => {
    if (!phone) return Toast.show(t('login.yourphone'));
    if (!smsCode) return Toast.show(t('login.yourCode'));
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 1500,
    });
    const result = await $fetch.post(
      '/lottery-login-api/user/accountBindMobile',
      {
        auxiliaryCode,
        deviceCode: 'H5',
        mobile: phone,
        mobileAreaCode: currentAreaCode,
        smsVerifyCode: smsCode,
      }
    );
    Toast.show({
      content: result.message,
    });
    if (result.code === 1) {
      setStatus(0);
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
  return (
    <div>
      <div className={styles['middle-part']}>
        <div className={styles['middle-content']}>
          <div className={styles.titlename}>{t('activity.binding')}</div>
          {status === 1 && (
            <>
              <div className={styles['dumi-default-search']}>
                <div className={styles['outline-input-before']}>
                  <div
                    className={styles['user-action-login-phoneCode']}
                    onClick={changeIsShowArea}
                  >
                    <span className={styles['phoneCode-number']}>
                      +{currentAreaCode}
                    </span>
                    <i
                      className={`${styles['phoneCode-img']} ${
                        isShowArea ? styles.upTransfrom : ''
                      }`}
                    />
                  </div>
                </div>
                <input
                  className={`${styles['dumi-default-search-input']} ${styles['mobile-input']}`}
                  onChange={changePhone}
                  value={phone}
                  placeholder={t('activity.phonenumber')}
                  maxLength={11}
                />
                {phone.length > 0 ? (
                  <i onClick={clearPhone} className={styles.rightIcon1} />
                ) : (
                  ''
                )}
                {isShowArea ? (
                  <ChooseAreaCode area={area} chooseArea={chooseArea} />
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
                onClick={bindMobile}
              >
                {t('activity.sure')}
              </div>
            </>
          )}
          {status === 0 && (
            <div className={styles.binde}>
              <span>
                +{userinfo.mobileAreaCode}&nbsp;&nbsp;
                {userinfo.loginMobile}
              </span>
              <span>{t('activity.bound')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Phone;
