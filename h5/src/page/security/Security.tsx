import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import styles from './Security.module.scss';
import Header from '@/components/header/Header';
import mineLogo from '@/assets/images/security/wnsr_security_icon1.c4b55ba6.png';
import phoneLogo from '@/assets/images/security/wnsr_security_icon2.286f5eda.png';
import emailLogo from '@/assets/images/security/wnsr_security_icon3.0062d8ba.png';
import coinAddressLogo from '@/assets/images/security/wnsr_security_icon4.afe0cd1e.png';
import bankCardLogo from '@/assets/images/security/wnsr_security_icon5.f6b03cc1.png';
import addressLogo from '@/assets/images/security/wnsr_security_icon6.a1f160ad.png';
import changePassWorldLogo from '@/assets/images/security/wnsr_security_icon7.d73f9e92.png';
import myIdLogo from '@/assets/images/security/wnsr_security_icon8.9586bc1f.png';
import { ObjType } from '@/types/Common';
import { store } from '@/redux/store';
import { toast } from '@/utils/tools/toast';

const Security: FC = () => {
  const navigate = useNavigate();
  const list = [
    {
      id: 1,
      logo: mineLogo,
      title: '个人资料',
      des: '修改完善个人信息',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'userinfo',
    },
    {
      id: 2,
      logo: phoneLogo,
      title: '手机号验证',
      des: '绑定手机号，短信验证接收更便捷',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: true,
      bind: store.getState().indexData.userinfo.isBindMobile,
      path: 'bind-phone-or-email/phone',
    },
    {
      id: 3,
      logo: emailLogo,
      title: '邮箱验证',
      des: '绑定邮箱，接收相关彩金赠送等信息',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: true,
      bind: store.getState().indexData.userinfo.isBindEmail,
      path: 'bind-phone-or-email/email',
    },
    {
      id: 4,
      logo: coinAddressLogo,
      title: '我的提币地址',
      des: '提币地址管理',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'manage-payment-methods/virtual-currency',
    },
    {
      id: 5,
      logo: bankCardLogo,
      title: '提现银行卡',
      des: '提现银行卡管理',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'manage-payment-methods/bank-cards',
    },
    {
      id: 6,
      logo: addressLogo,
      title: '我的收货地址',
      des: '优惠福利免费寄到家',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
    },
    {
      id: 7,
      logo: changePassWorldLogo,
      title: '修改登录密码',
      des: '定期修改有利于账号安全',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'change-password',
    },
    {
      id: 8,
      logo: myIdLogo,
      title: '64144266',
      des: '我的ID',
      right: '复制',
      isRightText: true,
      isBind: false,
      copy: true,
    },
  ];
  const handleClick = (data: ObjType) => {
    if (data.bind === 1) return;
    if (data.title === '我的收货地址') {
      return toast.show({ content: '即将开放,敬请期待!' });
    }
    if (data.copy) {
      copy(data.title);
      toast.success('复制成功!');
    }
    if (data.path) navigate(data.path);
  };
  return (
    <div className={`${styles['security-container']}`}>
      <Header title='安全中心' right left backgroundColor='transparent' />
      <div className={`${styles['security-main']}`}>
        {list.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className={styles['security-items']}
          >
            <div className={styles['security-left']}>
              <img src={item.logo} alt='logo' />
              <div>
                <p>{item.title}</p>
                <span>{item.des}</span>
              </div>
            </div>
            {item.isRightText ? (
              <p className={styles['security-copy']}>{item.right}</p>
            ) : item.isBind ? (
              <div className={styles['security-right']}>
                <p className={`${item.bind && styles.bind}`}>
                  {item.bind ? '已绑定' : '未绑定'}
                </p>
                <i className={`iconfont ${item.right}`} />
              </div>
            ) : (
              <div className={styles['security-right']}>
                <i className={`iconfont ${item.right}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Security;
