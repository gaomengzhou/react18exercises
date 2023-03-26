import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import md5 from 'js-md5';
import { useAppDispatch } from '@/redux/hook';
import Header3 from '@/components/header3/Header3';
import styles from './Login.module.scss';
import userIcon from '@/assets/images/Login_UserName~iphone@2x.png';
import passWordIcon from '@/assets/images/Login_PassWord~iphone@2x.png';
import showIcon from '@/assets/images/Login_PW_Show~iphone@2x.png';
import hiddenIcon from '@/assets/images/Login_PW_Hidden~iphone@2x.png';
import noramlIcon from '@/assets/images/Login_Rember_Normal~iphone@2x.png';
import selectIcon from '@/assets/images/Login_Rember_Selected~iphone@2x.png';
import playIcon from '@/assets/images/Login_Play~iphone@2x.png';
import codeIcon from '@/assets/images/Login_YZM~iphone@2x.png';
import seviceIcon from '@/assets/images/Login_Kf~iphone@2x.png';
import { store } from '@/redux/store';
import indexData from '@/redux/index/slice';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

interface State {
  userName: string;
  deviceCode: string;
  auxiliaryCode: string;
  registerMode: number;
  mobileAreaCode: string;
  appVersion: string;
  sourceType: string;
  password: string;
  imageVerifyCode: string;
  imageVerifyCodeKey: string;
}
const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<State>({
    userName: '',
    deviceCode: 'H5',
    auxiliaryCode: store.getState().indexData.auxiliaryCode,
    registerMode: 0,
    mobileAreaCode: '86',
    appVersion: 'RLS_20230213T1621_22122201',
    sourceType: '3',
    password: '',
    imageVerifyCode: '',
    imageVerifyCodeKey: '',
  });
  const [visible, setVisible] = useState(false);
  const [select, setSelect] = useState(false);
  const [codeImg, setCodeImg] = useState('');
  const [visibleR, setVisibleR] = useState(0);
  const [visibleO, setVisibleO] = useState(false);
  const handleInput =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  /** 获取图形验证码 */
  const getVerifyCode = async () => {
    const res = await $fetch.post(
      '/lottery-login-api/user/getImageVerifyCode',
      { t: Date.now }
    );
    if (!res.success) return;
    setCodeImg(`data:image/png;base64,${res.data.base64}`);
    setValues({ ...values, imageVerifyCodeKey: res.data.verifyCodeKey });
    // this.inputObj.yzm = '';
  };
  /** 获取配置 */
  const getConfig = async () => {
    const res = await $fetch.post(
      '/config-api/homePage/getGlobalSwitchConfigInfo',
      { t: Date.now }
    );
    if (!res.success) return;
    setVisibleR(res.data.verificationCodeLoginPwdErrorCount);
    setVisibleO(res.data.h5LoginVerificationCodeSwitch);
    // this.inputObj.yzm = '';
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // devAcc开发账号
    const devAcc = ['mehmet', 'mehmet1'].includes(values.userName);
    // const isMissingForm = Object.values(isError).some(Boolean);
    // const isEmptyValue = Object.values(values).includes('');
    if (
      !/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,15}$/.test(values.userName) &&
      !devAcc
    ) {
      Toast.show('请输入6-15位的数字字母组合的用户名');
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(
        values.password
      ) &&
      !devAcc
    ) {
      Toast.show('请输入8-16位的数字字母组合的密码,包含大小写');
    } else {
      const params = { ...values };
      if (params.imageVerifyCode) {
        params.imageVerifyCode = params.imageVerifyCode.toLowerCase();
      }
      params.password = md5(params.password);
      // setIsLoading(true);
      toast.loading();
      const res = await $fetch.post('/lottery-login-api/user/login', params);
      if (!res.success) {
        if (!visibleR) {
          getVerifyCode();
        }
        if (res.code === 2008) {
          setVisibleR(0);
        }
        return toast.fail(res);
      }
      const { token } = res.header;
      localStorage.setItem('token', token);
      const data = { ...res.data, token };
      dispatch(indexData.actions.setUserinfo(data));
      await getUserDetail();
      toast.success('登录成功!');
      navigate('/');
    }
  };
  useEffect(() => {
    if (!codeImg && visibleO && !visibleR) getVerifyCode();
    // eslint-disable-next-line
  }, [codeImg, visibleO, visibleR]);
  useEffect(() => {
    getConfig();
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles['login-container']}>
      <div className={styles['main-box']}>
        <Header3 left />

        <div className={styles.main}>
          <div className={styles.mainTop}>
            <h2>账号密码登录</h2>
            <div className={styles.amount}>
              <img src={userIcon} alt='用户名' />
              <input
                onChange={handleInput('userName')}
                value={values.userName}
                type='text'
                placeholder='请输入用户名'
              />
            </div>
            <div className={styles.amount}>
              <img src={passWordIcon} alt='密码' />
              <input
                value={values.password}
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
            {visibleO && visibleR === 0 ? (
              <div className={styles.amount}>
                <img src={codeIcon} alt='验证码' />
                <input
                  type='text'
                  value={values.imageVerifyCode}
                  onChange={handleInput('imageVerifyCode')}
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
            ) : (
              ''
            )}

            <div className={styles.remind}>
              <div>
                <img
                  onClick={() => {
                    setSelect(!select);
                  }}
                  src={select ? noramlIcon : selectIcon}
                  alt='记住密码'
                />
                <span>记住密码</span>
              </div>
              <div>忘记密码</div>
            </div>
            <div className={styles.submit}>
              <button
                disabled={
                  !values.password ||
                  !values.userName ||
                  (visibleO && !visibleR && !values.imageVerifyCode)
                }
                onClick={handleSubmit}
              >
                登录
              </button>
              <button
                className={styles.register}
                onClick={() => {
                  navigate('/register');
                }}
              >
                注册
              </button>
            </div>
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
export default Login;
