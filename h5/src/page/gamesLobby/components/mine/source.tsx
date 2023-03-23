import ziJin from '@/assets/images/mine/icon-资金明细.png';
import betDetails from '@/assets/images/mine/icon-投注明细.png';
import mineMsg from '@/assets/images/mine/icon-我的消息.png';
import vipCenter from '@/assets/images/mine/icon-VIP中心.png';
import flow from '@/assets/images/mine/icon-我的返水.png';
import safeCenter from '@/assets/images/mine/icon-安全中心.png';
import zanZhu from '@/assets/images/mine/icon-官方赞助.png';
import getRich from '@/assets/images/mine/icon-推广赚钱.png';
import styles from '@/page/gamesLobby/components/mine/Mine.module.scss';
import newGuys from '@/assets/images/mine/Person_JiaoCheng.png';
import aboutUs from '@/assets/images/mine/Person_AboutUs.png';
// import version from '@/assets/images/mine/Person_Version@2x.png';

export interface VipInfoType {
  bonus: string;
  bonusReceiveStatus: number;
  currentVipLevel: number;
  monthSalary: string;
  monthSalaryReceiveStatus: number;
  nextVipLevel: number;
  vipActivityDescription: string;
  vipCurrentBetAmount: string;
  vipCurrentRechargeScore: number;
  vipRechargeScore: number;
  vipType: number;
  vipValidBetAmount: string;
  weekSalary: string;
  weekSalaryReceiveStatus: number;
  yearRevenue: string;
}

export const kingKongDistrictList = [
  { id: 1, name: '资金明细', img: ziJin, path: '/funding-details' },
  { id: 2, name: '投注明细', img: betDetails, path: '/betSlip' },
  { id: 3, name: '我的消息', img: mineMsg, path: '/messages' },
  { id: 4, name: 'VIP中心', img: vipCenter, path: '/vip' },
  { id: 5, name: '我的返水', img: flow, path: '/rebate' },
  { id: 6, name: '安全中心', img: safeCenter, path: '/security' },
  { id: 7, name: '官方赞助', img: zanZhu, path: '/official' },
  { id: 8, name: '推广赚钱', img: getRich, path: '/share' },
];
export const infoList = [
  {
    name: '新手教程',
    node: <img className={styles.icon} src={newGuys} alt='logo' />,
    path: '/newbieTutorial',
  },
  {
    name: '关于我们',
    node: <img className={styles.icon} src={aboutUs} alt='logo' />,
    path: '/about',
  },
  // {
  //   name: '版本号',
  //   node: <img className={styles.icon} src={version} alt='logo' />,
  //   path: '/vesion',
  // },
];
