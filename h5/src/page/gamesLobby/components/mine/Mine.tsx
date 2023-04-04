import { FC, useCallback, useEffect, useState } from 'react';
import { List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './Mine.module.scss';
import MineHeader from '@/page/gamesLobby/components/mine/components/mineHeader/MineHeader';
import vipUnSelected from '@/assets/images/mine/Person_VIP_lijin@2x.png';
import vipSelected from '@/assets/images/mine/Person_VIP_lijin_Selected@2x.png';
import AllPromotions from '@/page/gamesLobby/components/mine/components/allPromotions/AllPromotions';
import refreshLogo from '@/assets/images/mine/icon-刷新.png';
import coinLogo from '@/assets/images/mine/iconCNY.png';
import rechargeButton from '@/assets/images/mine/Person_Recharge@2x.png';
import withdrawButton from '@/assets/images/mine/Person_Withdraw@2x.png';
import logoArrow from '@/assets/images/Person_Arrow@2x.png';
import { useAppDispatch, useSelector } from '@/redux/hook';
import ProgressBar from '@/page/gamesLobby/components/mine/components/progressBar/ProgressBar';
import {
  getUserDetail,
  showNotLoggedInPopup,
  useThrottleFn,
} from '@/utils/tools/method';
import {
  infoList,
  kingKongDistrictList,
} from '@/page/gamesLobby/components/mine/source';
import LogoutActionSheet from '@/page/gamesLobby/components/mine/components/logoutActionSheet/LogoutActionSheet';
import indexData from '@/redux/index/slice';
import { toast } from '@/utils/tools/toast';
import mine from '@/redux/mine/slice';
import { avatarList } from '@/page/security/userinfo/staticResources';

let timer: NodeJS.Timer;
const Mine: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    userinfo,
    userinfo: { token, balance },
  } = useSelector((s) => s.indexData);
  const vipInfo = useSelector((s) => s.mine.vipInfo);
  const throttleFn = useThrottleFn();
  const [vipStatus, setVipStatus] = useState([
    { name: '晋级彩', checked: false },
    { name: '周礼金', checked: false },
    { name: '月礼金', checked: false },
    { name: '年收益', checked: false },
  ]);
  // 登出弹框
  const [visible, setVisible] = useState(false);
  // 获取用户VIP信息
  const getUserVipInfo = useCallback(async () => {
    if (!token) return;
    const res = await $fetch.post('/lottery-api/vipInfo/getUserVipInfo');
    if (!res.success) return toast.fail(res);
    setVipStatus([
      { name: '晋级彩', checked: +res.data.currentVipLevel > 0 },
      { name: '周礼金', checked: +res.data.monthSalary > 0 },
      { name: '月礼金', checked: +res.data.weekSalary > 0 },
      {
        name: '年收益',
        checked: +res.data.monthSalary > 0 || +res.weekSalary > 0,
      },
    ]);
    dispatch(mine.actions.setVipInfo(res.data));
  }, [dispatch, token]);

  // 刷新余额
  const refreshAmount = async () => {
    const btn = document.querySelector('.refreshLogo') as HTMLDivElement;
    clearTimeout(timer);
    btn.classList.add(`${styles['refresh-log']}`);
    timer = setTimeout(() => {
      btn.classList.remove(`${styles['refresh-log']}`);
      clearTimeout(timer);
    }, 500);
    const res = await $fetch.post(
      '/lottery-thirdgame-api/thirdGame/recycleAllGameBalance'
    );
    if (!res.success) toast.fail(res);
    await getUserDetail();
  };
  // 金刚区快捷入口
  const handleClickKingKong = (item: {
    id: number;
    name: string;
    img: string;
    path: string;
  }) => {
    if (item.path) {
      if (!token && item.path !== '/official') return showNotLoggedInPopup();
      if (item.path === '/messages') {
        window.sessionStorage.removeItem('messageActive');
      }
      navigate(item.path);
    }
  };

  const logout = () => {
    dispatch(indexData.actions.clearUserinfo());
    setVisible(false);
  };

  // componentDidMount
  useEffect(() => {
    getUserVipInfo();
  }, [getUserVipInfo]);
  return (
    <div className={`${styles['mine-container']}`}>
      <MineHeader />
      <div className={`${styles['mine-body']}`}>
        <div className={styles.avatar}>
          {token ? (
            <div
              className={styles['is-login']}
              onClick={() => navigate('/security/userinfo')}
            >
              <img src={userinfo.headUrl || avatarList[0]} alt='avatar' />
              <p>{userinfo.userName}</p>
              <img className={styles.arrow} src={logoArrow} alt='箭头' />
            </div>
          ) : (
            <div className={styles['no-login']}>
              <img src={avatarList[0]} alt='avatar' />
              <p
                onClick={() => {
                  navigate('/login');
                }}
              >
                立即登录/注册
              </p>
            </div>
          )}
        </div>
        <div className={styles['vip-ad']}>
          <div className={`${styles['vip-ad-main']}`}>
            {token ? (
              <ProgressBar {...vipInfo} />
            ) : (
              <h4>登录后查看VIP等级 尊享奢华服务&gt;</h4>
            )}
            <div className={`${styles['vip-ad-main-items']}`}>
              {vipStatus.map((item, i) => (
                <div key={i} className={`${styles['vip-ad-main-item']}`}>
                  <img
                    src={item.checked ? vipSelected : vipUnSelected}
                    alt='vip状态'
                  />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 已登录的钱包信息 */}
        {token && (
          <div className={styles['amount-info-content']}>
            <div className={`${styles['amount-info-left']}`}>
              <div>
                <p>我的钱包</p>
                <img
                  className='refreshLogo'
                  src={refreshLogo}
                  alt='刷新余额'
                  onClick={() => throttleFn(refreshAmount, 2000)}
                />
              </div>
              <div>
                <img src={coinLogo} alt='货币logo' />
                <p>{balance}</p>
              </div>
            </div>
            <div className={`${styles['amount-info-right']}`}>
              <img
                src={rechargeButton}
                alt='充值'
                onClick={() => navigate('/recharge', { state: { type: 1 } })}
              />
              <img
                src={withdrawButton}
                alt='提现'
                onClick={() =>
                  navigate('/recharge', { state: { type: 2, payment: 1 } })
                }
              />
            </div>
          </div>
        )}

        {/* 金刚区 */}
        <div className={styles['king-kong-district']}>
          {kingKongDistrictList.map((item) => (
            <div
              key={item.id}
              className={styles['king-kong-district-items']}
              onClick={() => handleClickKingKong(item)}
            >
              <img src={item.img} alt='logo' />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <AllPromotions />
        <List className={styles.list}>
          {infoList.map((item, i) => (
            <List.Item
              key={i}
              className={`${styles['list-items']}`}
              prefix={item.node}
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.name}
            </List.Item>
          ))}
        </List>
        {token && (
          <div className={styles['login-out']}>
            <button
              onClick={() => {
                setVisible(true);
              }}
            >
              退出登录
            </button>
          </div>
        )}
      </div>
      <LogoutActionSheet
        visible={visible}
        setVisible={setVisible}
        onClick={logout}
      />
    </div>
  );
};
export default Mine;
