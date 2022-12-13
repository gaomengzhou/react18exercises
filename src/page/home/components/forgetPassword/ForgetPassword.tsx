import { FC, useEffect, useState } from 'react';
import { Tabs, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import md5 from 'js-md5';
import { validatorPassword } from '@/utils/tools/method';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from '../login/login.module.scss';
import ChooseAreaCode from '../login/ChooseAreaCode';

// interface TypeForgetPassword {
//   handleIsShow: any;
// }
let smsTimer = null as any;
let count = 0;
const ForgetPassword: FC = () => {
  const [account, setAccount] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confrimPassword, setConfrimPassword] = useState('');
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfrimPassword, setisShowConfrimPassword] = useState(false);
  const [isShowArea, setIsShowArea] = useState(false);
  const [isShowSmsCode, setIsShowSmsCode] = useState(false);
  const [isShowEmail, setIsShowEmail] = useState(false);
  const [isShowChangePassword, setIsShowChangePassword] = useState(false);
  const [activeKey, setActiveKey] = useState('returnphone');
  const { t } = useTranslation();
  const initsmsText = t('login.Code');
  const dispatch = useAppDispatch();
  const switchs = useSelector((state) => state.indexData.switchs);
  const area = JSON.parse(switchs.areaCodeType);
  const [smsText, setSmsText] = useState(initsmsText);
  const [isSendRequest, setisSendRequest] = useState(false);
  const [isClickSmsCode, setIsClickSmsCode] = useState(false);
  const areaStr = area.length > 0 ? area[0].areaCodekey : '86';
  const [currentAreaCode, setCurrentAreaCode] = useState(areaStr);
  const handleIsShowFn = (type: number) => {
    dispatch(indexData.actions.setLoginShow(type));
  };
  const confrimFn = (type: number) => {
    dispatch(indexData.actions.setLoginShow(type));
  };
  const smsCountDown = () => {
    setIsClickSmsCode(true);
    let prevCountdownTime = Date.now();
    setisSendRequest(true);
    count = 60;
    smsTimer = setInterval(() => {
      if (+count <= 0) {
        clearInterval(smsTimer);
        count = 0;
        setSmsText(t('login.Regetcode'));
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

  const initTabs = (key: string) => {
    console.log('change了');
    clearInterval(smsTimer);
    setSmsText(initsmsText);
    const dom: any = document.querySelector(`.${styles.verfCode}`);
    if (dom) dom.innerHTML = initsmsText;
    setAccount('');
    setSmsCode('');
    setPhone('');
    setEmail('');
    setisSendRequest(false);
    setIsClickSmsCode(false);
    clearInterval(smsTimer);
    setIsShowSmsCode(false);
    setIsShowEmail(false);
    setActiveKey(key);
  };

  const toNextStep = async () => {
    const reg = /^[0-9]{6,11}/;
    if (!account) return Toast.show(t('login.youraccount'));
    if (!phone) return Toast.show(t('login.checkyourphone'));
    if (!reg.test(phone)) return Toast.show(t('login.checkyourphone'));
    const result = await $fetch.post(
      '/lottery-login-api/user/getSmsVerifyCode',
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
    setIsShowSmsCode(true);
    smsCountDown();
  };
  const toNextEmailStep = async () => {
    if (!account) return Toast.show(t('login.youraccount'));
    if (!email) return Toast.show(t('login.inputtheemailaddress'));

    const result = await $fetch.post(
      '/lottery-login-api/user/getEmailVerifyCode',
      {
        email,
        sendType: 1,
      }
    );
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }
    setIsShowEmail(true);
    smsCountDown();
  };

  useEffect(() => {
    return () => {
      clearInterval(smsTimer);
    };
  }, []);

  const sendSmsCode = () => {
    if (isSendRequest) return;
    const reg = /^[0-9]{6,11}/;
    if (!reg.test(phone)) return Toast.show(t('login.checkyourphone'));
    smsCountDown();
  };
  const sendEmailCode = () => {
    if (isSendRequest) return;
    const reg =
      // eslint-disable-next-line no-useless-escape
      /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
    if (!reg.test(email)) return Toast.show(t('login.inputtheemailaddress'));
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

  const changeEmailCode = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    const realVal = val.replace(/[^0-9]$/gi, '');
    setEmailCode(realVal);
  };
  const changeIsShowArea = () => {
    setIsShowArea(!isShowArea);
  };
  const changeEmail = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setEmail(val);
  };
  const changePassword = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setPassword(val);
  };
  const changeConfrimPassword = (e: any) => {
    const val = e.target.value.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setConfrimPassword(val);
  };
  const togglePassword = () => {
    setisShowPassword(!isShowPassword);
  };
  const toggleConfrimPassword = () => {
    setisShowConfrimPassword(!isShowConfrimPassword);
  };
  // 邮箱验证未登录情况
  const checkVerifyCode = async (params: object) => {
    const result = await $fetch.post(
      '/lottery-login-api/user/checkVerifyCode',
      params
    );
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }
    setIsShowChangePassword(true);
  };

  const resetUserPassword = async () => {
    const forgetType = activeKey === 'returnphone' ? 1 : 2;
    if (!password) return Toast.show(t('login.yourpassword'));
    if (!validatorPassword(password))
      return Toast.show(
        t('login.818uppercaseandlowercaselettersnumbersorsymbols')
      );
    if (password !== confrimPassword)
      return Toast.show(t('activity.passwordtip'));

    const result = await $fetch.post(
      '/lottery-login-api/user/resetUserPassword',
      {
        username: account,
        password: md5(password),
        verificationAccount: forgetType === 1 ? phone : email,
        forgetType,
      }
    );
    if (!result.success) {
      return Toast.show({
        content: result.message,
      });
    }
    confrimFn(0);
  };
  const render1Step1 = () => {
    return (
      <div className={styles['middle-content']}>
        <div className={styles['dumi-default-search']}>
          {/* <i className={styles.leftIcon1} /> */}
          <input
            className={styles['dumi-default-search-input']}
            onChange={changeInput}
            value={account}
            placeholder={t('login.youraccount')}
          />
          {account.length > 0 ? (
            <i onClick={clearInput} className={styles.rightIcon1} />
          ) : (
            ''
          )}
        </div>
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
        <div className={styles.loginBtn} onClick={toNextStep}>
          {t('login.next')}
        </div>
      </div>
    );
  };
  const render1Step2 = () => {
    return (
      <div className={styles['middle-content']}>
        <div className={styles['dumi-default-search']}>
          {/* <i className={styles.leftIcon3} /> */}
          <input
            className={styles['dumi-default-search-input']}
            onChange={changeSmsCode}
            value={smsCode}
            placeholder={t('login.yourCode')}
            maxLength={6}
          />
          <span className={styles.verfCode} onClick={sendSmsCode}>
            {smsText}
          </span>
        </div>
        {isClickSmsCode ? (
          <div className={styles.smsSendText}>{`${t(
            'login.Thecodehasbeensenttoyourphone'
          )}: ${phone},${t('login.pleasecheck')}`}</div>
        ) : (
          ''
        )}

        <div
          className={`${styles.loginBtn} ${styles.marginTop20}`}
          onClick={() =>
            checkVerifyCode({
              username: account,
              verificationAccount: phone,
              verifyCode: smsCode,
              verifyType: 1,
            })
          }
        >
          {t('login.next')}
        </div>
      </div>
    );
  };
  const render1Step3 = () => {
    return (
      <div className={styles['middle-content']}>
        <div className={styles['dumi-default-search']}>
          {/* <i className={styles.leftIcon2} /> */}
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
            className={isShowPassword ? styles.rightIcon3 : styles.rightIcon4}
          />
        </div>
        <div className={styles['dumi-default-search']}>
          {/* <i className={styles.leftIcon2} /> */}
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
              isShowConfrimPassword ? styles.rightIcon3 : styles.rightIcon4
            }
          />
        </div>
        <div
          className={`${styles.loginBtn} ${styles.marginTop20}`}
          onClick={() => resetUserPassword()}
        >
          {t('login.confirm')}
        </div>
      </div>
    );
  };
  // 邮箱找回
  const render2Step1 = () => {
    return (
      <div className={styles['middle-content']}>
        <div className={styles['dumi-default-search']}>
          {/* <i className={styles.leftIcon1} /> */}
          <input
            className={styles['dumi-default-search-input']}
            onChange={changeInput}
            value={account}
            placeholder={t('login.youraccount')}
          />
          {account.length > 0 ? (
            <i onClick={clearInput} className={styles.rightIcon1} />
          ) : (
            ''
          )}
        </div>
        <div className={styles['dumi-default-search']}>
          {/* <i className={styles.leftIcon4} /> */}
          <input
            className={styles['dumi-default-search-input']}
            onChange={changeEmail}
            value={email}
            placeholder={t('login.inputtheemailaddress')}
          />
        </div>
        <div className={styles.loginBtn} onClick={toNextEmailStep}>
          {t('login.next')}
        </div>
      </div>
    );
  };
  const render2Step2 = () => {
    return (
      <div className={styles['middle-content']}>
        <div className={styles['dumi-default-search']}>
          <i className={styles.leftIcon3} />
          <input
            className={styles['dumi-default-search-input']}
            onChange={changeEmailCode}
            value={emailCode}
            placeholder={t('login.yourCode')}
            maxLength={6}
          />
          <span className={styles.verfCode} onClick={sendEmailCode}>
            {smsText}
          </span>
        </div>
        {isClickSmsCode ? (
          <div className={styles.smsSendText}>
            <p>{t('login.TheCodehasbeensenttoyouremail')}:</p>
            <p>{`${email},${t('login.pleasecheck')}.`}</p>
          </div>
        ) : (
          ''
        )}

        <div
          className={`${styles.loginBtn} ${styles.marginTop20}`}
          onClick={() =>
            checkVerifyCode({
              username: account,
              verificationAccount: email,
              verifyCode: emailCode,
              verifyType: 2,
            })
          }
        >
          {t('login.next')}
        </div>
      </div>
    );
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
            {/* <div className={styles.pc_leftAd}></div> */}
            <div className={styles.wrap_tabs}>
              <Tabs onChange={(key) => initTabs(key)}>
                <Tabs.Tab
                  title={t('login.ResetpasswordbySMS')}
                  key='returnphone'
                >
                  <div className={styles['middle-part']}>
                    {isShowChangePassword
                      ? render1Step3()
                      : isShowSmsCode
                      ? render1Step2()
                      : render1Step1()}
                  </div>
                </Tabs.Tab>
                <Tabs.Tab
                  title={t('login.ResetpasswordbyEmail')}
                  key='returnmail'
                >
                  <div className={styles['middle-part']}>
                    {isShowChangePassword
                      ? render1Step3()
                      : isShowEmail
                      ? render2Step2()
                      : render2Step1()}
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
export default ForgetPassword;
