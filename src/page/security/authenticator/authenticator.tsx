import { FC, useState } from 'react';
import { Input } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import { useSelector } from '@/redux/hook';
import icon from '@/assets/images/security/icon-安全中心-进入.png';
import copyicon from '@/assets/images/security/icon-历史记录-复制.png';
import success from '@/assets/images/security/icon-谷歌验证-成功@3x.png';
import styles from './authenticator.module.scss';
import Header from '../header/Header';

const Authenticator: FC = () => {
  const platformConfig = useSelector((state) => state.indexData.platformConfig);
  // 渲染所选值
  const [value, setValue] = useState('');
  const [status] = useState(false);
  const onCopy = (values: string) => {
    if (copy(values)) {
      console.log('复制成功');
    } else {
      console.log('复制失败');
    }
  };
  const gotoOnlineService = (e: any) => {
    e.stopPropagation();
    if (!platformConfig.customerServiceUrl) return;
    window.open(platformConfig.customerServiceUrl);
  };

  return (
    <div>
      <Header title='谷歌验证器' rightTitle='在线客服' />
      <div className={styles.top}>
        <div className={styles.tip}>
          为了您账号的安全，绑定谷歌验证器之前会发验证码到您的邮箱或手机号，进行身份验证。如未绑定邮箱或手机号，请先绑定邮箱或手机号！
        </div>
        {!status ? (
          <>
            <img className={styles.successbox} src={success} alt='success' />
            <div className={styles.bind}>已绑定</div>
          </>
        ) : (
          ''
        )}
        {status ? (
          <div className={styles.tip}>
            <div>1.下载谷歌验证器</div>
            <div className={styles.download}>
              <div>IOS下载</div>
              <div>安卓下载</div>
            </div>
          </div>
        ) : (
          ''
        )}
        {status ? (
          <div className={styles.tip}>
            <div>
              2.在谷歌验证器中添加密钥并备份，打开谷歌验证器，扫描下方二维码或手动输入下述秘钥添加验证令牌。
            </div>
            <div className={styles.QRcode}>
              <img src={icon} alt='icon' className={styles.QRcodeleft} />
              <div className={styles.QRcoderight}>
                <div
                  onClick={() => onCopy('2FDSGURGAPS6K27')}
                  className={styles.topcoy}
                >
                  2FDSGURGAPS6K27
                  <img src={copyicon} alt='copyicon' className={styles.copy} />
                </div>
                <div className={styles.copytip}>
                  秘钥可用于找回谷歌验证器，请勿透露给他人，需妥善备份保存。
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {status ? (
          <div className={styles.tip}>
            <div>3.输入谷歌验证器中6位数验证码</div>
            <div className={styles.inputbox}>
              <Input
                clearable
                placeholder='请输入6位数验证码'
                value={value}
                onChange={(val) => {
                  setValue(val);
                }}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      {status ? <div className={styles.submitBtn}>提交</div> : ''}
      {!status ? (
        <div className={styles.bottom} onClick={gotoOnlineService}>
          更换谷歌验证器
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
export default Authenticator;
