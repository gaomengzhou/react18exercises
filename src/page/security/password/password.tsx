/* eslint-disable no-redeclare */
import { FC, useState } from 'react';
import { Input, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import md5 from 'js-md5';
import { validatorPassword } from '@/utils/tools/method';
import { useSelector, useAppDispatch } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import { changeSecurityStatus } from '@/redux/security';
import styles from './password.module.scss';

const Google: FC = () => {
  const { t } = useTranslation();
  // 渲染所选值
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const dispatch = useAppDispatch();
  const auxiliaryCode = useSelector((state) => state.indexData.auxiliaryCode);
  const submit = async () => {
    if (!oldPassword) return Toast.show(t('login.yourpassword'));
    if (!newPassword) return Toast.show(t('login.yourpassword'));
    if (!confirmNewPassword) return Toast.show(t('login.yourpassword'));
    if (!validatorPassword(oldPassword))
      return Toast.show(
        t('login.818uppercaseandlowercaselettersnumbersorsymbols')
      );
    if (!validatorPassword(newPassword))
      return Toast.show(
        t('login.818uppercaseandlowercaselettersnumbersorsymbols')
      );
    if (!validatorPassword(confirmNewPassword))
      return Toast.show(
        t('login.818uppercaseandlowercaselettersnumbersorsymbols')
      );
    if (newPassword !== confirmNewPassword)
      return Toast.show(t('activity.passwordtip'));
    Toast.show({
      icon: 'loading',
      content: t('activity.submit'),
      duration: 1500,
    });
    const result = await $fetch.post('/lottery-api/user/editPassword', {
      auxiliaryCode,
      confirmNewPassword: md5(confirmNewPassword),
      deviceCode: 'H5',
      newPassword: md5(newPassword),
      oldPassword: md5(oldPassword),
    });
    Toast.show({
      content: result.message,
    });
    dispatch(changeSecurityStatus(0));
    $fetch.post('/lottery-login-api/user/logout', {}).then(() => {
      Toast.show({
        content: result.message,
      });
      dispatch(indexData.actions.clearUserinfo());
      localStorage.removeItem('userInfo');
      Toast.clear();
    });
  };
  const changePassword = (e: any) => {
    const val = e.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setOldPassword(val);
  };
  const changePassword2 = (e: any) => {
    const val = e.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setNewPassword(val);
  };
  const changePassword3 = (e: any) => {
    const val = e.replace(/[\s\u4e00-\u9fa5]/gi, '');
    setConfirmNewPassword(val);
  };
  const togglePassword = () => {
    setVisible(!visible);
  };
  const togglePassword1 = () => {
    setVisible1(!visible1);
  };
  const togglePassword2 = () => {
    setVisible2(!visible2);
  };
  return (
    <div>
      <div className={styles.name}>{t('activity.oldPassword')}</div>
      <div className={styles.inputbox}>
        <Input
          clearable
          placeholder={t('activity.originalpassword')}
          value={oldPassword}
          onChange={(val) => {
            changePassword(val);
          }}
          maxLength={18}
          type={visible2 ? 'text' : 'password'}
        />
        <i
          onClick={togglePassword2}
          className={visible2 ? styles.rightIcon3 : styles.rightIcon4}
        />
      </div>
      <div className={styles.name}>{t('activity.newpassword')}</div>
      <div className={styles.inputbox}>
        <Input
          clearable
          placeholder={t('activity.newpassword2')}
          value={newPassword}
          onChange={(val) => {
            changePassword2(val);
          }}
          maxLength={18}
          type={visible1 ? 'text' : 'password'}
        />
        <i
          onClick={togglePassword1}
          className={visible1 ? styles.rightIcon3 : styles.rightIcon4}
        />
      </div>
      <div className={styles.name}>{t('activity.repeatpassword')}</div>
      <div className={styles.inputbox}>
        <Input
          clearable
          placeholder={t('activity.reenter')}
          value={confirmNewPassword}
          onChange={(val) => {
            changePassword3(val);
          }}
          maxLength={18}
          type={visible ? 'text' : 'password'}
        />
        <i
          onClick={togglePassword}
          className={visible ? styles.rightIcon3 : styles.rightIcon4}
        />
      </div>
      <div className={styles.submitBtnpassword} onClick={submit}>
        {t('activity.sure')}
      </div>
    </div>
  );
};
export default Google;
