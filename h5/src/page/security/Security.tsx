import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import styles from './Security.module.scss';
import Header from '@/components/header/Header';
import { ObjType } from '@/types/Common';
import { store } from '@/redux/store';
import { toast } from '@/utils/tools/toast';

const Security: FC = () => {
  const navigate = useNavigate();
  const list = [
    {
      id: 1,
      logo: 'icon-a-5_7_safe_wnsr_security_icon1',
      title: '个人资料',
      des: '修改完善个人信息',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'userinfo',
    },
    {
      id: 2,
      logo: 'icon-a-5_7_safe_wnsr_security_icon2',
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
      logo: 'icon-a-5_7_safe_wnsr_security_icon3',
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
      logo: 'icon-a-5_7_safe_wnsr_security_icon4',
      title: '我的提币地址',
      des: '提币地址管理',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'manage-payment-methods/virtual-currency',
    },
    {
      id: 5,
      logo: 'icon-a-5_7_safe_wnsr_security_icon5',
      title: '提现银行卡',
      des: '提现银行卡管理',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'manage-payment-methods/bank-cards',
    },
    {
      id: 6,
      logo: 'icon-a-5_7_safe_wnsr_security_icon6',
      title: '我的收货地址',
      des: '优惠福利免费寄到家',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
    },
    {
      id: 7,
      logo: 'icon-a-5_7_safe_icon7',
      title: '修改登录密码',
      des: '定期修改有利于账号安全',
      right: 'icon-a-5_1_1_mine_xi_right_arrow',
      isRightText: false,
      isBind: false,
      path: 'change-password',
    },
    {
      id: 8,
      logo: 'icon-a-5_7_safe_wnsr_security_icon8',
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
              <i className={`iconfont ${item.logo}`} />
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
