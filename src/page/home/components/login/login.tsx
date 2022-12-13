import { FC, useEffect, useState } from 'react';
import { Tabs, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import md5 from 'js-md5';
import { broseClientType, validatorPassword } from '@/utils/tools/method';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData, {
  getUnreadMessageCount,
  getUserVipInfo,
} from '@/redux/index/slice';
import styles from './login.module.scss';
import ChooseAreaCode from './ChooseAreaCode';
import DividerPart from '../dividerPart/DividerPart';
import CustomerService from './components/CustomerService';
import ToastSuccess from '../toastSuccess/ToastSuccess';

// interface login {
//   handleIsShow: any;
// }
let smsTimer = null as any;
let count = 0;
const Login: FC = () => {
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const loginTabActive = useSelector((state) => state.indexData.loginTabActive);
  const [imgUrlObj] = useSelector((state) => state.indexData.loginAdList);
  const keyName = loginTabActive === 1 ? 'username' : 'phone';
  const dispatch = useAppDispatch();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isShowArea, setIsShowArea] = useState(false);
  const [isShowPassword, setisShowPassword] = useState(false);
  // const [isRemindPassword, setIsRemindPassword] = useState(false);
  const [activeKey, setActiveKey] = useState(keyName);
  const { t } = useTranslation();
  const initsmsText = t('login.Code');
  const Regetcode = t('login.Regetcode');
  const switchs = useSelector((state) => state.indexData.switchs);
  const area = JSON.parse(switchs.areaCodeType);
  const [smsText, setSmsText] = useState(initsmsText);
  const [isSendRequest, setisSendRequest] = useState(false);
  const areaStr = area.length > 0 ? area[0].areaCodekey : '86';
  const [currentAreaCode, setCurrentAreaCode] = useState(areaStr);
  useEffect(() => {
    // 登录广告
    const getAdvertisingByPage = async () => {
      const res = await $fetch.post(
        '/config-api/advertising/getAdvertisingByPage',
        {
          advertisingPage: 3,
        }
      );
      if (!res.success) return Toast.show(res.message);
      dispatch(indexData.actions.setLoginAdList(res.data));
    };
    getAdvertisingByPage();
  }, [dispatch]);
  const handleIsShowFn = (type: number) => {
    dispatch(indexData.actions.setLoginShow(type));
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
    // if (cookie.load('userId')) {
    //   setAccount(cookie.load('userId'));
    //   setIsRemindPassword(true);
    // }
    // if (cookie.load('password')) setPassword(cookie.load('password'));
    // if (cookie.load('phoneId')) setPhone(cookie.load('phoneId'));
    return () => {
      // console.log('销毁了');
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
    // if (!/^[A-Za-z0-9_\\g]{6,18}$/g.test(account)) setAccount(val);
  };
  const changePassword = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setPassword(val);
  };
  const changePhone = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setPhone(realVal);
  };
  const changeSmsCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setSmsCode(realVal);
  };
  const changeIsShowArea = () => {
    setIsShowArea(!isShowArea);
  };
  // const changeChecked = () => {
  //   setIsRemindPassword(!isRemindPassword);
  // };
  const togglePassword = () => {
    setisShowPassword(!isShowPassword);
  };

  const setActiveKeyFn = (key: string) => {
    const value = key === 'username' ? 1 : 2;
    dispatch(indexData.actions.setLoginTabActive(value));
    setActiveKey(key);
  };

  const toLogin = async () => {
    let params = {};
    const flag = account.includes('mehmet') || account.includes('随便加');
    if (activeKey === 'username') {
      if (!/^[A-Za-z0-9_\\g]{6,18}$/g.test(account))
        return Toast.show(t('login.618lettersornumbers'));
      if (!validatorPassword(password) && !flag)
        return Toast.show(
          t('login.818uppercaseandlowercaselettersnumbersorsymbols')
        );
      params = {
        appVersion: $env.REACT_APP_API_VERSION,
        auxiliaryCode,
        userName: account,
        password: md5(password),
        sourceType: '3',
        deviceCode: 'H5',
      };
    } else {
      const reg = /^[0-9]{6,11}/;
      if (!reg.test(phone)) return Toast.show(t('login.checkyourphone'));
      if (!smsCode) return Toast.show(t('login.yourCode'));
      params = {
        appVersion: $env.REACT_APP_API_VERSION,
        auxiliaryCode,
        userName: phone,
        mobileAreaCode: currentAreaCode,
        smsVerifyCode: smsCode,
        sourceType: '3',
        deviceCode: 'H5',
      };
    }
    Toast.show({
      icon: 'loading',
      content: t('main.loading'),
      duration: 30000,
    });
    // 运营监控
    // (window as any).gtag('event', 'login', params);
    const result = await $fetch.post('/lottery-login-api/user/login', params);
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }

    const { token } = result.header;
    const data = { ...result.data, token };
    dispatch(indexData.actions.setUserinfo(data));
    // Toast.show({
    //   content: result.message,
    //   icon: <toastSuccess />,
    // });

    const detailRes = await $fetch.post('/lottery-api/user/getUserDetail', {
      auxiliaryCode,
      appVersion: $env.REACT_APP_API_VERSION,
      deviceCode: 'H5',
    });
    if (!detailRes.success) {
      return Toast.show({
        content: result.message,
      });
    }

    // 获取用户 Vip 信息
    dispatch(getUserVipInfo());

    dispatch(indexData.actions.setUserinfo(detailRes.data));
    dispatch(getUnreadMessageCount());
    Toast.clear();

    // if (isRemindPassword) {
    //   const exprieTime = new Date(new Date().getTime() + 24 * 3600 * 1000 * 7); // 七天
    //   cookie.save('userId', account, { expires: exprieTime });
    //   cookie.save('password', password, { expires: exprieTime });
    // }
    Toast.show({
      content: result.message,
      icon: <ToastSuccess />,
    });
    const dataobj = { ...data, ...detailRes.data };
    handleIsShowFn(0);
    localStorage.setItem('userInfo', JSON.stringify(dataobj));
    setTimeout(() => {
      $mqtt.restart();
    }, 30);
  };

  const pressKeyFn = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      toLogin();
    }
  };
  const redirectUrl = (obj: any) => {
    if (obj && obj.redirectUrl) {
      window.open(obj.redirectUrl);
    }
  };

  return (
    <div className={styles.ReactModalPortal} onKeyDown={(e) => pressKeyFn(e)}>
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
                  setActiveKeyFn(key);
                }}
                defaultActiveKey={keyName}
              >
                <Tabs.Tab title={t('login.AccountLogin')} key='username'>
                  <div className={styles['middle-part']}>
                    <div className={styles['middle-content']}>
                      <div className={styles['dumi-default-search']}>
                        {/* <i className={styles.leftIcon1} /> */}
                        <input
                          className={styles['dumi-default-search-input']}
                          onChange={changeInput}
                          value={account}
                          placeholder={t('login.youraccount')}
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
                        {/* <i className={styles.leftIcon2} /> */}
                        <input
                          type={isShowPassword ? 'text' : 'password'}
                          className={styles['dumi-default-search-input']}
                          onChange={changePassword}
                          value={password}
                          placeholder={t('login.yourpassword')}
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
                      <div className={styles.checkBox}>
                        {/* <Checkbox
                          style={{
                            '--icon-size': '16px',
                            '--font-size': '13px',
                            '--gap': '6px',
                          }}
                          checked={isRemindPassword}
                          onChange={changeChecked}
                        >
                          {t('login.savepassword')}
                        </Checkbox> */}
                        <span
                          className={styles.Forgotpassword}
                          onClick={() => handleIsShowFn(2)}
                        >
                          {t('login.Forgotpassword')}
                        </span>
                      </div>
                      <div className={styles.loginBtn} onClick={toLogin}>
                        {t('header.login')}
                      </div>
                      <CustomerService />
                      <DividerPart text={t('login.Logininotherways')} />
                    </div>
                  </div>
                </Tabs.Tab>
                <Tabs.Tab title={t('login.Mobilelogin')} key='phone'>
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
                        {/* <i className={styles.leftIcon3} /> */}
                        <input
                          className={styles['dumi-default-search-input']}
                          onChange={changeSmsCode}
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
                      <div
                        className={`${styles.loginBtn} ${styles.marginTop20}`}
                        onClick={toLogin}
                      >
                        {t('header.login')}
                      </div>
                      <CustomerService />
                      <DividerPart text={t('login.Logininotherways')} />
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
export default Login;
