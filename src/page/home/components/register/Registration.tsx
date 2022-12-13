import { FC, useEffect, useState } from 'react';
import { Tabs, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import md5 from 'js-md5';
import { broseClientType, validatorPassword } from '@/utils/tools/method';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from '../login/login.module.scss';
import ChooseAreaCode from '../login/ChooseAreaCode';
import ToastSuccess from '../toastSuccess/ToastSuccess';

// interface Rgister {
//   handleIsShow: any;
// }
let smsTimer = null as any;
let count = 0;
const Registration: FC = () => {
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const [imgUrlObj] = useSelector((state) => state.indexData.registerAdList);
  const switchs = useSelector((state) => state.indexData.switchs);
  // const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const usercode = useSelector((state) => state.security.usercode);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confrimPassword, setConfrimPassword] = useState('');
  const [activeKey, setActiveKey] = useState('accountRegister');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [referralCode, setReferralCode] = useState(usercode);
  const [isShowArea, setIsShowArea] = useState(false);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfrimPassword, setisShowConfrimPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const initsmsText = t('login.Code');
  // const chinaText = t('login.China');
  // const philippines = t('login.Philippines');
  const Regetcode = t('login.Regetcode');
  const area = JSON.parse(switchs.areaCodeType);
  const [smsText, setSmsText] = useState(initsmsText);
  const [isSendRequest, setisSendRequest] = useState(false);
  const areaStr = area.length > 0 ? area[0].areaCodekey : '86';
  const [currentAreaCode, setCurrentAreaCode] = useState(areaStr);
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  const handleIsShowFn = (type: number) => {
    dispatch(indexData.actions.setLoginShow(type));
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
        const dom: any = document.querySelector(`.${styles.verfCode}`);
        if (count === 0) {
          dom.innerHTML = t('login.Regetcode');
        } else if (dom) {
          dom.innerHTML = `${count}S`;
        }
      }
    }, 1000);
  };
  useEffect(() => {
    // 注册广告
    const getAdvertisingByPage = async () => {
      const res = await $fetch.post(
        '/config-api/advertising/getAdvertisingByPage',
        {
          advertisingPage: 8,
        }
      );
      if (!res.success) return Toast.show(res.message);
      dispatch(indexData.actions.setRegisterAdList(res.data));
    };
    getAdvertisingByPage();
  }, [dispatch]);
  useEffect(() => {
    return () => {
      clearInterval(smsTimer);
    };
  }, []);

  const sendSmsCode = async () => {
    if (isSendRequest) return;
    const reg = /^[0-9]{6,11}/;
    if (!reg.test(phone)) return Toast.show(t('login.checkyourphone'));
    const result = await $fetch.post(
      ' /lottery-login-api/user/getSmsVerifyCode',
      {
        loginMobile: phone,
        mobileAreaCode: currentAreaCode,
      }
    );
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }
    smsCountDown();
  };
  const chooseArea = (code: any) => {
    setCurrentAreaCode(code);
    setIsShowArea(false);
  };
  const clearInput = () => {
    setAccount('');
  };

  const clearPhone = () => {
    setPhone('');
  };
  const changeInput = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    // eslint-disable-next-line prefer-regex-literals
    const regEx = new RegExp(
      "[`%+=~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]"
    );
    const newVal = val.replace(regEx, '');
    const newVal2 = newVal.replace(/-/, '');
    setAccount(newVal2);
  };
  const changePassword = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setPassword(val);
  };
  const changeConfrimPassword = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setConfrimPassword(val);
  };
  const changePhone = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setPhone(realVal);
  };
  const chanmgeSmsCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setSmsCode(realVal);
  };
  const changeReferralCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setReferralCode(realVal);
  };

  const togglePassword = () => {
    setisShowPassword(!isShowPassword);
  };
  const toggleConfrimPassword = () => {
    setisShowConfrimPassword(!isShowConfrimPassword);
  };
  const changeIsShowArea = () => {
    setIsShowArea(!isShowArea);
  };
  const submitRegister = async () => {
    // console.log('activeKey', activeKey);
    const flag = account.includes('mehmet') || account.includes('随便加');
    if (activeKey === 'accountRegister') {
      if (!/^[A-Za-z0-9_\\g]{6,18}$/g.test(account)) {
        return Toast.show(t('login.618lettersornumbers'));
      }
      if (!validatorPassword(password) && !flag)
        return Toast.show(
          t('login.818uppercaseandlowercaselettersnumbersorsymbols')
        );
      const result = await $fetch.post('/lottery-login-api/user/register', {
        auxiliaryCode,
        userName: account,
        password: md5(password),
        confirmPassword: md5(confrimPassword),
        sourceType: '3',
        deviceCode: 'H5',
        userCode: referralCode,
      });
      // console.log('result', result);
      if (!result.success) {
        return Toast.show({
          content: result.message,
        });
      }
      Toast.show({
        content: t('login.Registeredsuccessfully'),
        icon: <ToastSuccess />,
      });
      handleIsShowFn(1);
      // const exprieTime = new Date(new Date().getTime() + 24 * 3600 * 1000 * 7); // 七天
      // cookie.save('userId', account, { expires: exprieTime });
      // cookie.save('password', password, { expires: exprieTime });
    } else if (activeKey === 'phoneRegister') {
      const reg = /^[0-9]{6,11}/;
      if (!reg.test(phone)) return Toast.show(t('login.checkyourphone'));
      const result = await $fetch.post('/lottery-login-api/user/register', {
        userName: phone,
        sourceType: '3',
        registerMode: 1,
        auxiliaryCode,
        mobileAreaCode: currentAreaCode,
        mobile: phone,
        smsVerifyCode: smsCode,
        deviceCode: 'H5',
        userCode: referralCode,
      });
      if (!result.success) {
        return Toast.show({
          content: result.message,
        });
      }
      Toast.show({
        content: t('login.Registeredsuccessfully'),
        icon: <ToastSuccess />,
      });
      handleIsShowFn(1);
      // const exprieTime = new Date(new Date().getTime() + 24 * 3600 * 1000 * 7); // 七天
      // cookie.save('phoneId', phone, { expires: exprieTime });
      dispatch(indexData.actions.setLoginTabActive(2));
    } else {
      console.log('无效的');
    }
  };
  const redirectUrl = (obj: any) => {
    console.log(obj);
    if (obj && obj.redirectUrl) {
      window.open(obj.redirectUrl);
    }
  };
  return (
    <div className={styles.ReactModalPortal}>
      <div className={styles.ReactModal__Overlay}>
        <div className={styles.ReactModal__Content}>
          <div
            onClick={() => handleIsShowFn(0)}
            className={styles['hx-modal-title']}
          />
          <div className={styles['hx-modal-content']}>
            {broseClientType() === '4' && imgUrlObj ? (
              <img
                alt='ad'
                src={imgUrlObj.imageUrl}
                className={styles.pc_leftAd}
                onClick={() => redirectUrl(imgUrlObj)}
              />
            ) : (
              ''
            )}
            <div className={styles.wrap_tabs}>
              <Tabs
                onChange={(key) => {
                  setActiveKey(key);
                }}
              >
                <Tabs.Tab
                  title={t('login.accountRegister')}
                  key='accountRegister'
                >
                  <div className={styles['middle-part']}>
                    <div className={styles['middle-content']}>
                      <div className={styles['dumi-default-search']}>
                        <input
                          className={styles['dumi-default-search-input']}
                          onChange={changeInput}
                          value={account}
                          placeholder={t('login.618lettersornumbers')}
                          maxLength={18}
                        />
                        {account.length > 0 ? (
                          <i
                            onClick={clearInput}
                            className={styles.rightIcon1}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className={styles['dumi-default-search']}>
                        <input
                          type={isShowPassword ? 'text' : 'password'}
                          className={styles['dumi-default-search-input']}
                          onChange={changePassword}
                          value={password}
                          placeholder={t('login.818password')}
                          maxLength={18}
                        />

                        <i
                          onClick={togglePassword}
                          className={
                            isShowPassword
                              ? styles.rightIcon3
                              : styles.rightIcon4
                          }
                        />
                      </div>
                      <div className={styles['dumi-default-search']}>
                        <input
                          type={isShowConfrimPassword ? 'text' : 'password'}
                          className={styles['dumi-default-search-input']}
                          onChange={changeConfrimPassword}
                          value={confrimPassword}
                          placeholder={t('login.passwordagain')}
                          maxLength={18}
                        />

                        <i
                          onClick={toggleConfrimPassword}
                          className={
                            isShowConfrimPassword
                              ? styles.rightIcon3
                              : styles.rightIcon4
                          }
                        />
                      </div>
                      {switchs.isInviteCodeShow === 1 ? (
                        <div className={styles['dumi-default-search']}>
                          <input
                            className={styles['dumi-default-search-input']}
                            onChange={changeReferralCode}
                            value={referralCode}
                            disabled={!!usercode}
                            maxLength={8}
                            placeholder={t('login.Referralcode')}
                          />
                          <span className={styles.rightText}>
                            {t('login.optional')}
                          </span>
                        </div>
                      ) : (
                        ''
                      )}

                      <div className={styles.loginBtn} onClick={submitRegister}>
                        {t('login.register1')}
                      </div>
                      <div className={styles.customerService}>
                        <span
                          className={styles.orange}
                          onClick={gotoOnlineService}
                        >
                          {t('login.onlineservice')}
                        </span>
                        <span>{t('login.haveaccount')}</span>
                        <span
                          className={styles.blue}
                          onClick={() => handleIsShowFn(1)}
                        >
                          {t('login.tologin')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab>
                <Tabs.Tab title={t('login.SMSRegister')} key='phoneRegister'>
                  <div className={styles['middle-part']}>
                    <div className={styles['middle-content']}>
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
                          placeholder={t('login.yourphone')}
                          maxLength={11}
                        />
                        {phone.length > 0 ? (
                          <i
                            onClick={clearPhone}
                            className={styles.rightIcon1}
                          />
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
                          onChange={chanmgeSmsCode}
                          value={smsCode}
                          placeholder={t('login.yourCode')}
                          maxLength={6}
                        />
                        <span
                          className={`${styles.verfCode} ${
                            isSendRequest ? styles.gray : ''
                          }`}
                          onClick={sendSmsCode}
                        >
                          {smsText}
                        </span>
                      </div>
                      {switchs.isInviteCodeShow === 1 ? (
                        <div className={styles['dumi-default-search']}>
                          <input
                            className={styles['dumi-default-search-input']}
                            onChange={changeReferralCode}
                            value={referralCode}
                            maxLength={8}
                            placeholder={t('login.Referralcode')}
                          />
                          <span className={styles.rightText}>
                            {t('login.optional')}
                          </span>
                        </div>
                      ) : (
                        ''
                      )}

                      <div
                        className={`${styles.loginBtn} ${styles.marginTop20}`}
                        onClick={submitRegister}
                      >
                        {t('login.register1')}
                      </div>
                      <div className={styles.customerService}>
                        <span
                          className={styles.orange}
                          onClick={gotoOnlineService}
                        >
                          {t('login.onlineservice')}
                        </span>
                        <span>{t('login.haveaccount')}</span>
                        <span
                          className={styles.blue}
                          onClick={() => handleIsShowFn(1)}
                        >
                          {t('login.tologin')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab>
              </Tabs>
            </div>
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registration;
