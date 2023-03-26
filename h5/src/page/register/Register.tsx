import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import md5 from 'js-md5';
import { useAppDispatch } from '@/redux/hook';
import styles from './Register.module.scss';
// import rightArrow from '@/assets/images/home_quick_go~iphone@2x.png';
import Header3 from '@/components/header3/Header3';
import userIcon from '@/assets/images/Login_UserName~iphone@2x.png';
import passWordIcon from '@/assets/images/Login_PassWord~iphone@2x.png';
import showIcon from '@/assets/images/Login_PW_Show~iphone@2x.png';
import hiddenIcon from '@/assets/images/Login_PW_Hidden~iphone@2x.png';
import playIcon from '@/assets/images/Login_Play~iphone@2x.png';
import seviceIcon from '@/assets/images/Login_Kf~iphone@2x.png';
import peopleIcon from '@/assets/images/Login_Name~iphone@2x.png';
import codeIcon from '@/assets/images/Login_YZM~iphone@2x.png';
import { store } from '@/redux/store';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';
import indexData from '@/redux/index/slice';

interface State {
  userName: string;
  deviceCode: string;
  auxiliaryCode: string;
  registerMode: number;
  realName: string;
  mobileAreaCode: string;
  appVersion: string;
  sourceType: string;
  password: string;
  code: string;
  verifyCodeKey: string;
  confirmPassword: string;
}
const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<State>({
    userName: '',
    realName: '',
    deviceCode: 'H5',
    auxiliaryCode: store.getState().indexData.auxiliaryCode,
    registerMode: 0,
    mobileAreaCode: '86',
    appVersion: 'RLS_20230213T1621_22122201',
    sourceType: '3',
    password: '',
    code: '',
    verifyCodeKey: '',
    confirmPassword: '',
  });
  const [isError, setIsError] = useState({
    userName: false,
    realName: false,
    password: false,
    confirmPassword: false,
  });
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [codeImg, setCodeImg] = useState('');
  const [visibleR, setVisibleR] = useState(false);
  const [visibleO, setVisibleO] = useState(false);

  /** 获取图形验证码 */
  const getVerifyCode = async () => {
    const res = await $fetch.post(
      '/lottery-login-api/user/getImageVerifyCode',
      { t: Date.now }
    );
    if (!res.success) return;
    setCodeImg(`data:image/png;base64,${res.data.base64}`);
    setValues({ ...values, verifyCodeKey: res.data.verifyCodeKey });
    // this.inputObj.yzm = '';
  };
  /** 获取配置 */
  const getConfig = async () => {
    const res = await $fetch.post(
      '/config-api/homePage/getGlobalSwitchConfigInfo',
      { t: Date.now }
    );
    if (!res.success) return;
    setVisibleR(res.data.realNameRequired);
    setVisibleO(res.data.realNameSwitch);
    // this.inputObj.yzm = '';
  };
  const toLogin = async () => {
    const params = {
      userName: values.userName,
      deviceCode: 'H5',
      auxiliaryCode: store.getState().indexData.auxiliaryCode,
      registerMode: 0,
      mobileAreaCode: '86',
      appVersion: 'RLS_20230213T1621_22122201',
      sourceType: '3',
      password: md5(values.password),
    };
    // setIsLoading(true);
    toast.loading();
    const res = await $fetch.post('/lottery-login-api/user/login', params);
    if (!res.success) {
      toast.clear();
      return toast.fail(res);
    }
    const { token } = res.header;
    localStorage.setItem('token', token);
    const data = { ...res.data, token };
    dispatch(indexData.actions.setUserinfo(data));
    await getUserDetail();
    toast.clear();
    // 注册后自动登录,所以这里显示 "恭喜您注册成功"
    toast.success('恭喜您注册成功');
    navigate('/');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isMissingForm = Object.values(isError).some(Boolean);
    // const isEmptyValue = Object.values(values).includes('');
    if (isMissingForm) {
      toast.show({ content: '两次密码输入不一致，请重新输入' });
    } else if (
      !/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,15}$/.test(values.userName)
    ) {
      toast.show({ content: '请输入6-15位的数字字母组合的用户名' });
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(
        values.password
      ) ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(
        values.confirmPassword
      )
    ) {
      toast.show({ content: '请输入8-16位的数字字母组合的密码,包含大小写' });
    } else if (
      !/^[\u4e00-\u9fa5]+$/i.test(values.realName) &&
      visibleR &&
      visibleO
    ) {
      toast.show({ content: '真实姓名只能为纯汉字' });
    } else {
      const params = { ...values };
      params.password = md5(params.password);
      params.confirmPassword = md5(params.confirmPassword);
      params.code = params.code.toLowerCase();
      // setIsLoading(true);
      toast.loading();
      const res = await $fetch.post('/lottery-login-api/user/register', params);
      toast.clear();
      if (!res.success) return toast.fail(res);
      if (res.code === 1) {
        toLogin();
      } else {
        toast.show({ content: res.message });
        getVerifyCode();
      }
    }
    // setIsLoading(false);F
  };
  const handleInput =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });

      // if (prop === 'code') {
      //   if (Number.isNaN(+event.target.value)) {
      //     event.target.value = event.target.value.replace(/[^\d]/g, '');
      //   }
      //   setValues({ ...values, [prop]: event.target.value });
      // }
      if (prop === 'confirmPassword') {
        if (
          event.target.value === '' ||
          event.target.value !== values.password
        ) {
          setIsError({ ...isError, confirmPassword: true });
        } else {
          setIsError({ ...isError, confirmPassword: false });
        }
      }
    };

  useEffect(() => {
    if (!codeImg) getVerifyCode();
    // eslint-disable-next-line
  }, [codeImg]);
  useEffect(() => {
    getConfig();
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles['register-container']}>
      <div className={styles['main-box']}>
        <Header3 left />

        <div className={styles.main}>
          <div className={styles.mainTop}>
            <h2>用户名注册</h2>
            <div className={styles.amount}>
              <img src={userIcon} alt='用户名' />
              <input
                type='text'
                // onFocus={() => setPwdBlur(true)}
                // onBlur={() => setPwdBlur(false)}
                onChange={handleInput('userName')}
                value={values.userName}
                maxLength={15}
                placeholder='请输入用户名'
              />
            </div>
            <div className={styles.amount}>
              <img src={passWordIcon} alt='密码' />
              <input
                value={values.password}
                maxLength={16}
                onChange={handleInput('password')}
                type={visible ? 'text' : 'password'}
                placeholder='请输入密码'
              />
              <img
                onClick={() => {
                  setVisible(!visible);
                }}
                src={visible ? showIcon : hiddenIcon}
                alt='眼睛'
              />
            </div>
            <div className={styles.amount}>
              <img src={passWordIcon} alt='密码' />
              <input
                maxLength={16}
                onChange={handleInput('confirmPassword')}
                value={values.confirmPassword}
                type={visible1 ? 'text' : 'password'}
                placeholder='确认密码'
              />
              <img
                onClick={() => {
                  setVisible1(!visible1);
                }}
                src={visible1 ? showIcon : hiddenIcon}
                alt='眼睛'
              />
            </div>
            {visibleO ? (
              <div className={styles.amount}>
                <img src={peopleIcon} alt='真实姓名' />
                <input
                  type='text'
                  maxLength={16}
                  value={values.realName}
                  onChange={handleInput('realName')}
                  placeholder='请输入真实姓名'
                />
              </div>
            ) : (
              ''
            )}

            <div className={styles.amount}>
              <img src={codeIcon} alt='验证码' />
              <input
                type='text'
                value={values.code}
                onChange={handleInput('code')}
                placeholder='请输入验证码'
              />
              <img
                onClick={() => {
                  getVerifyCode();
                }}
                src={codeImg}
                className={styles.codeImg}
                alt='验证码'
              />
            </div>
            <div className={styles.submit}>
              <button
                disabled={
                  !values.password ||
                  !values.confirmPassword ||
                  !values.userName ||
                  !values.code ||
                  (visibleO && visibleR && !values.realName)
                }
                onClick={handleSubmit}
              >
                注册
              </button>
            </div>
          </div>
          <div className={styles.mainMiddle}>
            <p>
              已有账号，
              <span
                onClick={() => {
                  navigate('/login');
                }}
              >
                去登录
              </span>
            </p>
          </div>
          <div className={styles.mainBottom}>
            <p>
              <img src={playIcon} alt='' />
              <span>随便玩玩</span>
            </p>
            <p>
              <img src={seviceIcon} alt='' />
              <span
                onClick={() => {
                  navigate('/customer-service');
                }}
              >
                联系客服
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
