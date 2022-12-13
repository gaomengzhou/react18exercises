import { FC } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';
import { useAppDispatch, useSelector } from '@/redux/hook';
import CustomImg from '@/components/customImg/CustomImg';
import { toSportGame } from '../../HomeMethod';
import indexData from '@/redux/index/slice';
import menuLogo from '@/assets/images/index/icon-菜单@3x.png';
import styles from './MenuForPC.module.scss';
import homeLogo from '../../images/icon-侧边栏-首页-未选中@3x.png';
import ballLogo from '../../images/icon-侧边栏-体育-未选中@3x.png';
import blackALogo from '../../images/icon-侧边栏-真人-未选中@3x.png';
import eGame from '../../images/icon-侧边栏-电子-未选中@3x.png';
import activeHomeLogo from '../../images/icon-侧边栏-首页-选中@3x.png';
import activeBallLogo from '../../images/icon-体育-选中@3x.png';
import activeBlackALogo from '../../images/icon-侧边栏-真人-选中@3x.png';
import activeEGameLogo from '../../images/icon-侧边栏-电子-选中@3x.png';
import { LeftSidebarProps } from '../../leftSidebar/LeftSidebar';

const MenuForPC: FC<LeftSidebarProps> = ({ setShowLeftSidebar }) => {
  const leftSidebarShortcutOptions = useSelector(
    (s) => s.indexData.leftSidebarShortcutOptions
  );
  const recommendIsEnabled = useSelector((s) => s.indexData.recommendIsEnabled);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showWorldCup = useSelector((s) => s.indexData.showWorldCup);
  const location = useLocation();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  // 选项卡列表
  const tabList = [
    {
      id: 1,
      name: '首页',
      logo: homeLogo,
      activeLogo: activeHomeLogo,
      path: '/',
      show: 1,
    },
    {
      id: 2,
      name: '体育投注',
      logo: ballLogo,
      activeLogo: activeBallLogo,
      path: 'bbin',
      show: 1,
    },
    {
      id: 3,
      name: '真人视讯',
      logo: blackALogo,
      activeLogo: activeBlackALogo,
      path: 'gameCategory',
      show: 1,
    },
    {
      id: 4,
      name: '电子游艺',
      logo: eGame,
      activeLogo: activeEGameLogo,
      path: 'gameCategory',
      show: 1,
    },
    {
      id: 5,
      name: '优惠活动',
      logo: require('@/assets/images/icon-优惠活动.png'),
      activeLogo: require('@/assets/images/icon-优惠活动.png'),
      path: 'activity',
      show: 1,
    },
    {
      id: 6,
      name: 'VIP俱乐部',
      logo: require('@/assets/images/icon-VIP.png'),
      activeLogo: require('@/assets/images/icon-VIP.png'),
      path: 'vip',
      show: 1,
    },
    {
      id: 7,
      name: '好友推荐',
      logo: require('@/assets/images/icon-好友推荐.png'),
      activeLogo: require('@/assets/images/icon-好友推荐.png'),
      path: 'promote',
      show: recommendIsEnabled,
    },
  ];

  // 点击选项卡
  const handleClick = (data: {
    id: number;
    name: string;
    logo: string;
    activeLogo: string;
    path: string;
  }) => {
    const { type } = Object.fromEntries(searchParams);
    if (+type === data.id) return;
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(data.id));
    if (!data.path) return Toast.show(t('login.Notyetopenstaytuned'));
    if (data.path === 'promote') {
      navigate('/promote', { state: '2' });
      return;
    }
    if (data.path === 'gameCategory') {
      navigate(`${data.path}?name=${data.name}&type=${data.id}`);
    } else if (data.path === 'bbin') {
      toSportGame(navigate);
    } else {
      navigate(data.path);
    }
  };
  return (
    <menu
      className={`${styles['pc-menu']} ${
        location.pathname === '/' && showWorldCup && styles['world-cup-class']
      }`}
    >
      <div className={styles.top}>
        <CustomImg onClick={() => setShowLeftSidebar(true)} src={menuLogo} />
      </div>
      <div className={styles.middle}>
        {tabList.map((item) => (
          <CustomImg
            style={{
              display: item.show === 1 ? 'block' : 'none',
            }}
            onClick={() => handleClick(item)}
            src={
              leftSidebarShortcutOptions === item.id
                ? item.activeLogo
                : item.logo
            }
            alt={item.name}
            key={item.id}
          />
        ))}
      </div>
    </menu>
  );
};
export default MenuForPC;
