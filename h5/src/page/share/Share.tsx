import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import styles from './Share.module.scss';
import Header from '@/components/header/Header';
import link from '@/assets/images/share/Share_Link~iphone@2x.png';
import qrCode from '@/assets/images/share/Share_QR~iphone@2x.png';
import register from '@/assets/images/share/Share_Reg~iphone@2x.png';
import weChat from '@/assets/images/share/Share_WX~iphone@2x.png';
import tuanDui from '@/assets/images/share/list_icon1.83e923be.png';
import yeJi from '@/assets/images/share/list_icon2.8b538fa3.png';
import daiLi from '@/assets/images/share/list_icon3.443b9186.png';
import introduction from '@/assets/images/share/list_icon4.947ce5c7.png';
import SharePopup from '@/page/share/components/sharePopup/SharePopup';
import { ObjType } from '@/types/Common';
import success from '@/assets/images/share/success.png';
import CommissionBulletBox from '@/page/share/components/commissionBulletBox/CommissionBulletBox';
import { useSelector } from '@/redux/hook';
import { toast } from '@/utils/tools/toast';

const Share: FC = () => {
  const { userinfo } = useSelector((s) => s.indexData);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  // 我的团队数据
  const [myTeam, setMyTeam] = useState({
    betAmount: '0',
    firstRechargeUserCount: 0,
    loginUserCount: 0,
    newDirectUserCount: 0,
    newUserCount: 0,
    rechargeAmount: '0',
    rechargeUserCount: 0,
    totalUserCount: 0,
  });
  const [sharePopupProps, setSharePopupProps] = useState({
    title: '',
    des: '',
    des2: '',
    logo: '',
    isQrCode: false,
  });
  // 领取佣金的弹框
  const [bulletVisible, setBulletVisible] = useState(false);
  const [commissionBulletBoxProps, setCommissionBulletBoxProps] = useState({
    success: true,
  });
  // 分享链接/qrcode
  const [shareLink, setShareLink] = useState<ObjType>({});
  // 代理信息
  const [agentCenterCommission, setAgentCenterCommission] = useState<ObjType>(
    {}
  );
  const shareList = [
    {
      id: 1,
      src: link,
      title: '链接复制成功',
      des: '可以粘贴分享',
      des2: '开启财富大门',
      logo: success,
      isQrCode: false,
    },
    {
      id: 2,
      src: qrCode,
      title: '我的专属二维码',
      des: '直接面对面扫码',
      des2: '或保存二维码分享',
      logo: shareLink.shareRegisterUrl,
      isQrCode: true,
    },
    { id: 3, src: register, path: '/open-an-account' },
    {
      id: 4,
      src: weChat,
      title: '微信分享',
      des: '专属链接已复制成功 ',
      des2: '可直接粘贴至对话框分享',
      logo: success,
      isQrCode: false,
    },
  ];
  const managementList = [
    { id: 1, src: tuanDui, text: '团队管理', path: 'team-management' },
    { id: 2, src: yeJi, text: '业绩查询', path: 'performance-inquiry' },
    { id: 3, src: daiLi, text: '代理报表', path: 'agent-report' },
    { id: 4, src: introduction, text: '代理介绍', path: 'agent-introduction' },
  ];
  // 查询用户代理中心第三委托
  const shareRegister = async () => {
    const res = await $fetch.post('/lottery-login-api/user/shareRegister');
    if (!res.success) return toast.fail(res);
    setShareLink(res.data);
  };
  // 查询今日/昨日/本周/可领取佣金
  const queryUserAgentCenterCommission = async () => {
    const res = await $fetch.post(
      '/lottery-api/commission/queryUserAgentCenterCommission'
    );
    if (!res.success) return toast.fail(res);
    setAgentCenterCommission(res.data);
  };

  const toShare = (data: ObjType) => {
    if (data.title) {
      setSharePopupProps({
        title: data.title,
        des: data.des,
        des2: data.des2,
        logo: data.logo,
        isQrCode: data.isQrCode,
      });
      setVisible(true);
    }
    if (data.path) {
      navigate(data.path);
    }
    if (data.id === 1 || data.id === 4) {
      copy(shareLink.shareRegisterUrl);
    }
  };

  // 领取佣金
  const receiveCommission = async () => {
    toast.loading();
    const res = await $fetch.post('lottery-api/commission/receiveCommission');
    toast.clear();
    if (!res) return toast.fail(res);
    if (res.code === 0) {
      setCommissionBulletBoxProps({ success: false });
      setBulletVisible(true);
      return;
    }
    setCommissionBulletBoxProps({ success: true });
    setBulletVisible(true);
  };
  // 我的团队
  const queryTodayDataReport = async () => {
    const res = await $fetch.post(
      '/lottery-api/teamDataReport/queryTodayDataReport',
      { statisticsWay: 3, userId: '' }
    );
    if (!res.success) return toast.fail(res);
    setMyTeam(res.data);
  };

  // componentDidMount
  useEffect(() => {
    toast.loading();
    Promise.all([
      queryUserAgentCenterCommission(),
      shareRegister(),
      queryTodayDataReport(),
    ]).finally(() => {
      toast.clear();
    });
  }, []);
  return (
    <div className={styles['share-container']}>
      <Header title='分享赚钱' right left />
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.share}>
            {shareList.map((item) => (
              <img
                onClick={() => toShare(item)}
                key={item.id}
                src={item.src}
                alt='log'
              />
            ))}
          </div>
          <div className={styles.myCode}>
            <p>
              我的专属邀请码：<span>{userinfo.userCode}</span>
            </p>
            <span
              className={styles.copy}
              onClick={() => {
                copy(userinfo.userCode);
                toast.success('复制成功!');
              }}
            >
              复制
            </span>
          </div>
        </div>
        <div className={styles.commission}>
          <div className={styles.commissionTop}>
            <div>
              <p>{agentCenterCommission.todayCommission}</p>
              <span>今日预估佣金</span>
            </div>
            <div>
              <p>{agentCenterCommission.yesterdayReceivedCommission}</p>
              <span>昨日预估佣金</span>
            </div>
            <div>
              <p>{agentCenterCommission.thisWeekReceivedCommission}</p>
              <span>本周预估佣金</span>
            </div>
          </div>
          <div className={styles.commissionBottom}>
            <div>
              <i className='iconfont icon-a-5_1_1_mine_wnsr_commission_icon' />
              <p>
                可领取佣金：
                <span>{agentCenterCommission.receivableCommission}</span>
              </p>
            </div>
            <button onClick={receiveCommission}>领取</button>
          </div>
        </div>
        <div className={styles.management}>
          <div className={styles.managementItems}>
            {managementList.map((item) => (
              <div key={item.id} onClick={() => navigate(item.path)}>
                <img src={item.src} alt='logo' />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.team}>
          <div className={styles.teamTop}>
            <div className={styles.teamTopLeft}>
              <i className='iconfont icon-a-5_1_1_mine_wnsr_commission_icon' />
              <p>我的团队</p>
            </div>
            <div className={styles.teamTopRight}>
              <p onClick={() => navigate('team-management')}>查看更多</p>
              <i
                className={`iconfont icon-a-5_8_1_Cards_Arrow ${styles.rightArrow}`}
              />
            </div>
          </div>
          <div className={styles.teamBottom}>
            <div className={styles.teamBottomTop}>
              <div>
                <p>{myTeam.newUserCount}</p>
                <span>新增用户</span>
              </div>
              <div>
                <p>{myTeam.newDirectUserCount}</p>
                <span>新增直属</span>
              </div>
              <div>
                <p>{myTeam.rechargeUserCount}</p>
                <span>充值人数</span>
              </div>
              <div>
                <p>{myTeam.totalUserCount}</p>
                <span>团队总人数</span>
              </div>
            </div>
            <div className={styles.teamBottomBottom}>
              <div>
                <p>有效充值</p>
                <span>{myTeam.rechargeAmount}</span>
              </div>
              <div>
                <p>有效投注</p>
                <span>{myTeam.betAmount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tip}>
          <span className={styles.symbol}>*</span>
          <p>好友注册时</p>
          <span>一定要填写</span>
          <p>您的</p>
          <span>专属邀请码才有效哦!</span>
        </div>
      </div>
      <SharePopup
        title={sharePopupProps.title}
        des={sharePopupProps.des}
        des2={sharePopupProps.des2}
        logo={sharePopupProps.logo}
        isQrCode={sharePopupProps.isQrCode}
        visible={visible}
        setVisible={setVisible}
      />
      <CommissionBulletBox
        visible={bulletVisible}
        setVisible={setBulletVisible}
        isSuccess={commissionBulletBoxProps.success}
      />
    </div>
  );
};
export default Share;
