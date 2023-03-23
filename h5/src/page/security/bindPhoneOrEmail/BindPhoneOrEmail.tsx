import { ChangeEvent, FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './BindPhoneOrEmail.module.scss';
import { getUserDetail } from '@/utils/tools/method';
import { useSelector } from '@/redux/hook';
import { toast } from '@/utils/tools/toast';

let timer: NodeJS.Timer;
const BindPhoneOrEmail: FC = () => {
  const { type } = useParams();
  const [countdown, setCountdown] = useState(60);
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const auxiliaryCode = useSelector((s) => s.indexData.auxiliaryCode);
  const navigate = useNavigate();
  const countdownFn = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      setCountdown((val) => {
        if (val - 1 <= 0) {
          setCountdown(60);
          clearInterval(timer);
        }
        window.sessionStorage.setItem(
          'countdownForBindEmailAndPhone',
          String(val - 1)
        );
        return val - 1;
      });
    }, 1000);
  };

  // 获取邮箱验证码
  const getEmailVerifyCode = async () => {
    const pattern =
      /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/;
    if (!pattern.test(value)) {
      return toast.show({ content: '请输入正确的邮箱格式!' });
    }
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/lottery-login-api/user/getEmailVerifyCode',
      {
        bindEmail: value,
      }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    toast.show({ content: '已发送至邮箱，请检查您的收件箱或垃圾箱或稍后重试' });
    countdownFn();
  };

  // 获取手机号验证码
  const getSmsVerifyCode = async () => {
    const pattern =
      /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!pattern.test(value)) {
      return toast.show({ content: '手机号格式错误!' });
    }
    const res = await $fetch.post('/lottery-login-api/user/getSmsVerifyCode', {
      loginMobile: value,
      mobileAreaCode: '+86',
    });
    if (!res.success) return toast.fail(res);
    countdownFn();
  };
  const sendVerifyCode = () => {
    if (countdown < 60) return;
    if (type === 'phone') {
      if (!value) return toast.show({ content: '手机号不能为空!' });
      getSmsVerifyCode();
    } else {
      if (!value) return toast.show({ content: '邮箱不能为空!' });
      getEmailVerifyCode();
    }
  };
  const changeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const changeCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  // 去绑定
  const onBind = async () => {
    const pattern =
      /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/;
    if (!code) return toast.show({ content: '请输入验证码!' });
    if (type === 'phone') {
      toast.loading();
      const res = await $fetch.post(
        '/lottery-login-api/user/accountBindMobile',
        {
          deviceCode: 'H5',
          auxiliaryCode,
          mobile: value,
          mobileAreaCode: '+86',
          smsVerifyCode: code,
        }
      );
      if (!res.success) return toast.fail(res);
      await getUserDetail();
      toast.success('绑定成功!');
      navigate(-1);
    } else {
      if (!pattern.test(value)) {
        return toast.show({ content: '请输入正确的邮箱格式!' });
      }
      toast.loading();
      const res = await $fetch.post(
        '/lottery-login-api/user/accountBindEmail',
        {
          email: value,
          emailVerifyCode: code,
        }
      );
      if (!res.success) return toast.fail(res);
      await getUserDetail();
      toast.success('绑定成功');
      navigate(-1);
    }
  };
  return (
    <div className={styles.bindPhoneContainer}>
      <Header title={type === 'email' ? '绑定邮箱' : '绑定手机号'} left right />
      <div className={styles.bindPhoneContainerMain}>
        <div className={styles.bindPhoneTip}>
          <i className='iconfont icon-a-5_8_1_Bind_tipIcon2' />
          <p>
            为了保护您的账号和资金安全，请绑定
            {type === 'email' ? '邮箱' : '手机号'}
          </p>
        </div>
        <div className={styles.phoneNumber}>
          <input
            value={value}
            onChange={changeValue}
            type='text'
            placeholder={`请输入${type === 'email' ? '邮箱地址' : '手机号'}`}
          />
        </div>
        <div className={styles.code}>
          <p
            onClick={sendVerifyCode}
            style={{ opacity: countdown < 60 ? 0.4 : 1 }}
          >
            {countdown < 60 ? countdown : '获取验证码'}
          </p>
          <input
            type='text'
            value={code}
            onChange={changeCode}
            placeholder='请输入验证码'
          />
        </div>
        <div
          className={`${styles.bindPhoneBtn} ${
            (!value || !code) && styles.disable
          }`}
        >
          <button onClick={onBind}>确认</button>
        </div>
      </div>
    </div>
  );
};
export default BindPhoneOrEmail;
