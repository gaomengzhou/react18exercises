import { ChangeEvent, FC, useState } from 'react';
import md5 from 'js-md5';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './ChangePassword.module.scss';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import { toast } from '@/utils/tools/toast';

const ChangePassword: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auxiliaryCode = useSelector((s) => s.indexData.auxiliaryCode);
  const [openEye, setOpenEye] = useState({ newPwd: false, confirmPwd: false });
  // 原密码
  const [oldPwd, setOldPwd] = useState('');
  // 新密码
  const [newPwd, setNewPwd] = useState('');
  // 确认密码
  const [confirmPwd, setConfirmPwd] = useState('');
  const onSubmit = async () => {
    if (!oldPwd) {
      return toast.show({ content: '请输入原密码' });
    }
    if (!newPwd) {
      return toast.show({ content: '请输入新密码' });
    }
    if (!confirmPwd) {
      return toast.show({ content: '请输入确认密码' });
    }
    if (newPwd !== confirmPwd) {
      return toast.show({ content: '新密码与确认密码不一致' });
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(newPwd) ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(confirmPwd)
    ) {
      return toast.show({
        content: '请输入8-16位的数字字母组合的密码,包含大小写',
      });
    }
    toast.loading();
    const res = await $fetch.post('/lottery-api/user/editPassword', {
      oldPassword: md5(oldPwd),
      newPassword: md5(newPwd),
      confirmNewPassword: md5(confirmPwd),
      auxiliaryCode,
      deviceCode: 'H5',
    });
    if (!res.success) return toast.fail(res);
    dispatch(indexData.actions.clearUserinfo);
    toast.success('修改成功!');
    navigate('/login', { replace: true });
  };
  const handleSetOldPwd = (e: ChangeEvent<HTMLInputElement>) => {
    setOldPwd(e.target.value);
  };
  const handleSetNewPwd = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPwd(e.target.value);
  };
  const handleSetConfirmPwd = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPwd(e.target.value);
  };
  return (
    <div className={styles.changePwdContainer}>
      <Header title='修改登录密码' right left />
      <div className={styles.changePwdMain}>
        <div className={styles.items}>
          <p>原密码</p>
          <div className={styles.inp}>
            <input
              value={oldPwd}
              type='text'
              placeholder='输入原登录密码'
              onChange={handleSetOldPwd}
            />
          </div>
        </div>
        <div className={styles.items}>
          <p>新密码</p>
          <div className={styles.inp}>
            <input
              type={openEye.newPwd ? 'text' : 'password'}
              placeholder='输入新密码'
              value={newPwd}
              onChange={handleSetNewPwd}
            />
            <i
              className={`iconfont icon-a-5_3_login_xianshi-guan ${
                openEye.newPwd && 'icon-a-5_3_login_xiianshi-kai'
              }`}
              onClick={() => {
                setOpenEye((val) => {
                  return { ...val, ...{ newPwd: !val.newPwd } };
                });
              }}
            />
          </div>
        </div>
        <div className={styles.items}>
          <p>确认密码</p>
          <div className={styles.inp}>
            <input
              value={confirmPwd}
              type={openEye.confirmPwd ? 'text' : 'password'}
              placeholder='确认新密码'
              onChange={handleSetConfirmPwd}
            />
            <i
              className={`iconfont icon-a-5_3_login_xianshi-guan ${
                openEye.confirmPwd && 'icon-a-5_3_login_xiianshi-kai'
              }`}
              onClick={() => {
                setOpenEye((val) => {
                  return { ...val, ...{ confirmPwd: !val.confirmPwd } };
                });
              }}
            />
          </div>
        </div>
        <div
          className={`${styles.btn} ${
            (!oldPwd || !newPwd || !confirmPwd) && styles.disable
          }`}
        >
          <button onClick={onSubmit}>确认修改</button>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
