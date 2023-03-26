import { FC, useEffect, useState } from 'react';
import md5 from 'js-md5';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import showIcon from '@/assets/images/Login_PW_Show~iphone@2x.png';
import hiddenIcon from '@/assets/images/Login_PW_Hidden~iphone@2x.png';
import styles from './MainRegister.module.scss';
// import rightArrow from '@/assets/images/home_quick_go~iphone@2x.png';
import { store } from '@/redux/store';
import { toast } from '@/utils/tools/toast';

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
const MainRegister: FC = () => {
  const navigate = useNavigate();
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
  const [codeImg, setCodeImg] = useState('');
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
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
    } else if (!/^[\u4e00-\u9fa5]+$/i.test(values.realName)) {
      toast.show({ content: '真实姓名只能为纯汉字' });
    } else {
      const params = { ...values };
      params.password = md5(params.password);
      params.confirmPassword = md5(params.confirmPassword);
      params.code = params.code.toLowerCase();
      // setIsLoading(true);
      const res = await $fetch.post(
        '/lottery-login-api/user/agentRegister',
        params
      );
      console.log(res);
      if (res.code === 1) {
        toast.show({ content: '恭喜您注册成功' });
        navigate(-1);
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
    <div className={styles['add-bank-cards-container']}>
      <Header title='直接开户' left right />
      <div className={styles['main-box']}>
        <div className={styles.main}>
          <div className={styles.list}>
            <h3>账户名</h3>
            <input
              type='text'
              onChange={handleInput('userName')}
              value={values.userName}
              maxLength={15}
              placeholder='请输入6-15位的数字字母组合'
            />
          </div>
          <div className={styles.list}>
            <h3>密码</h3>
            <div className={styles.listitem}>
              <input
                maxLength={16}
                value={values.password}
                onChange={handleInput('password')}
                type={visible ? 'text' : 'password'}
                placeholder='*请输入密码8-16个字母数字,包含大小写'
              />
              <img
                onClick={() => {
                  setVisible(!visible);
                }}
                src={visible ? showIcon : hiddenIcon}
                alt='眼睛'
              />
            </div>
          </div>
          <div className={styles.list}>
            <h3>确认密码</h3>
            <div className={styles.listitem}>
              <input
                type={visible1 ? 'text' : 'password'}
                maxLength={16}
                onChange={handleInput('confirmPassword')}
                value={values.confirmPassword}
                placeholder='请确认密码'
              />
              <img
                onClick={() => {
                  setVisible1(!visible1);
                }}
                src={visible1 ? showIcon : hiddenIcon}
                alt='眼睛'
              />
            </div>
          </div>
          {visibleO ? (
            <div className={styles.list}>
              <h3>真实姓名</h3>
              <input
                type='text'
                value={values.realName}
                maxLength={16}
                onChange={handleInput('realName')}
                placeholder='请输入您的真实姓名'
              />
            </div>
          ) : (
            ''
          )}

          <div className={styles.list}>
            <h3>验证码</h3>
            <div className={styles.codebox}>
              <input
                type='text'
                value={values.code}
                onChange={handleInput('code')}
                placeholder='请填写右侧验证码'
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
              立即开户
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainRegister;
