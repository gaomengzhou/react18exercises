import { useLocation, useRoutes } from 'react-router-dom';
import KeepAlive from 'react-activation';
import GamesLobby from '@/page/gamesLobby/GamesLobby';
import AddBankCards from '@/page/addBankCards/AddBankCards';
import Register from '@/page/register/Register';
import Login from '@/page/login/Login';
import About from '@/page/about/About';
import AboutMe from '@/page/aboutMe/AboutMe';
import EnterpriseAffairs from '@/page/enterpriseAffairs/EnterpriseAffairs';
import HelpCenter from '@/page/helpCenter/HelpCenter';
import NewbieTutorial from '@/page/newbieTutorial/NewbieTutorial';
import NewDetails from '@/page/newbieTutorial/newDetails/NewDetails';
import AlipayPay from '@/page/alipayPay/AlipayPay';
import WechatPay from '@/page/wechatPay/WechatPay';
import BankPay from '@/page/bankPay/BankPay';
import UsdtPay from '@/page/usdtPay/UsdtPay';
import SportBet from '@/page/sportBet/SportBet';
import LotteryBet from '@/page/lotteryBet/LotteryBet';
import VirtualCurrencyWithdrawal from '@/page/virtualCurrencyWithdrawal/VirtualCurrencyWithdrawal';
import BankWithdraw from '@/page/bankWithdraw/BankWithdraw';
import Rules from '@/page/rules/Rules';
import AddVirtualWallet from '@/page/addVirtualWallet/AddVirtualWallet';
import BettingDetails from '@/page/bettingDetails/BettingDetails';
import FundingDetails from '@/page/fundingDetails/FundingDetails';
import FlowAudit from '@/page/flowAudit/FlowAudit';
import MessagesIndex from '@/page/messages';
import Messages from '@/page/messages/message/Messages';
import MessagesDetails from '@/page/messages/messagesDetails/MessagesDetails';
import RebateIndex from '@/page/rebate';
import Rebate from '@/page/rebate/Rebate';
import RebateRecord from '@/page/rebate/rebateRecord/RebateRecord';
import Nickname from '@/page/nickname/Nickname';
import SecurityIndex from '@/page/security';
import Security from '@/page/security/Security';
import Userinfo from '@/page/security/userinfo/Userinfo';
import BindPhoneOrEmail from '@/page/security/bindPhoneOrEmail/BindPhoneOrEmail';
import ManagePaymentMethods from '@/page/security/managePaymentMethods/ManagePaymentMethods';
import ChangePassword from '@/page/security/changePassword/ChangePassword';
import OfficialIndex from '@/page/official';
import Official from '@/page/official/Official';
import OfficialDetails from '@/page/official/officialDetails/OfficialDetails';
import MainRegister from '@/page/mainregister/MainRegister';
import ShareIndex from '@/page/share';
import Share from '@/page/share/Share';
import TeamManagement from '@/page/share/teamManagement/TeamManagement';
import PerformanceInquiry from '@/page/share/performanceInquiry/PerformanceInquiry';
import AgentReport from '@/page/share/agentReport/AgentReport';
import AgentIntroduction from '@/page/share/agentIntroduction/AgentIntroduction';
import CustomerService from '@/page/customerService/CustomerService';
import Not404 from '@/page/404/404';
import GameList from '@/page/gameList/GameList';
import { renderElement, renderLazyElement } from '@/utils/tools/jsx_method';
import { Mine, Recharge } from '@/router/lazy_components';
import Vip from '@/page/vip/Vip';
import Discount from '@/page/gamesLobby/components/discount/Discount';
import DiscountDetails from '@/page/gamesLobby/components/discount/discountDetails/DiscountDetails';
import DepositInformation from '@/page/depositInformation/DepositInformation';
import GameSearch from '@/page/gameSearch/GameSearch';
import ExternalGame from '@/page/externalGame/ExternalGame';
import BetSlip from '@/page/gamesLobby/components/betSlip/BetSlip';
import { routerCache } from '@/utils/tools/method';
import Ask from '@/page/ask/Ask';
import VirtualCurrencyProtocol from '@/page/virtualCurrencyProtocol/VirtualCurrencyProtocol';
import Home from '@/page/gamesLobby/components/home/Home';
import Waiting from '@/page/waiting/Waiting';

import { useSelector } from '@/redux/hook';

/**
 * @function renderElement 路由权限
 * @function renderLazyElement 懒加载组件
 */
const useInitializeRouting = () => {
  const location = useLocation();
  const saveScrollPositions = useSelector(
    (s) => s.indexData.saveScrollPosition
  );
  return useRoutes([
    {
      path: '/',
      element: <GamesLobby />,
      children: [
        {
          index: true,
          element: renderLazyElement(
            <KeepAlive
              name='homeKPNAME'
              // 是否保存滚动条位置
              saveScrollPosition={saveScrollPositions}
              // when={() => routerCache(location.pathname)}
            >
              <Home />
            </KeepAlive>
          ),
        },
        { path: 'waiting', element: <Waiting /> },
        { path: 'mine', element: renderLazyElement(<Mine />) },
        {
          path: 'discount',
          element: renderLazyElement(
            <KeepAlive
              name='discountKPNAME'
              when={() => routerCache(location.pathname)}
            >
              <Discount />
            </KeepAlive>
          ),
        },
        {
          path: 'recharge',
          element: renderElement(renderLazyElement(<Recharge />)),
        },
        {
          path: 'betSlip',
          element: renderElement(
            renderLazyElement(
              <KeepAlive
                name='betSlipKPNAME'
                when={() => routerCache(location.pathname)}
              >
                <BetSlip />
              </KeepAlive>
            )
          ),
        },
      ],
    },
    {
      path: 'gameList/:id/:code',
      element: renderLazyElement(<GameList />),
    },
    {
      path: 'newDetails/:id',
      element: renderLazyElement(<NewDetails />),
    },
    {
      path: 'gameSearch/:id/:code',
      element: renderLazyElement(<GameSearch />),
    },

    { path: '/discount-details/:id', element: <DiscountDetails /> },
    {
      path: '/deposit-information/:payment/:id',
      element: renderElement(<DepositInformation />),
    },
    { path: '/add-bank-cards', element: renderElement(<AddBankCards />) },
    { path: '/register', element: <Register /> },
    { path: '/externalGame', element: <ExternalGame /> },
    { path: '/login', element: <Login /> },
    { path: '/about', element: <About /> },
    { path: '/aboutMe', element: <AboutMe /> },
    { path: '/enterpriseAffairs', element: <EnterpriseAffairs /> },
    { path: '/helpCenter', element: <HelpCenter /> },
    { path: '/newbieTutorial', element: <NewbieTutorial /> },
    { path: '/alipayPay', element: <AlipayPay /> },
    { path: '/ask', element: <Ask /> },
    { path: '/virtualCurrencyProtocol', element: <VirtualCurrencyProtocol /> },
    { path: '/wechatPay', element: <WechatPay /> },
    { path: '/bankPay', element: <BankPay /> },
    { path: '/vip', element: renderElement(<Vip />) },
    { path: '/usdtPay', element: <UsdtPay /> },
    { path: '/sportBet', element: <SportBet /> },
    { path: '/lotteryBet', element: <LotteryBet /> },
    {
      path: '/virtualCurrencyWithdrawal',
      element: <VirtualCurrencyWithdrawal />,
    },
    { path: '/bankWithdraw', element: <BankWithdraw /> },
    { path: '/rules', element: <Rules /> },
    {
      path: '/add-virtual-wallet',
      element: renderElement(<AddVirtualWallet />),
    },
    {
      path: '/betting-details/:title/:gameCode/:timeId',
      element: renderElement(<BettingDetails />),
    },
    {
      path: '/funding-details',
      element: renderElement(<FundingDetails />),
    },
    { path: '/flow-audit', element: renderElement(<FlowAudit />) },
    {
      path: '/messages',
      element: renderElement(<MessagesIndex />),
      children: [
        {
          index: true,
          element: (
            <KeepAlive name='messagesKPNAME'>
              <Messages />
            </KeepAlive>
          ),
        },
        { path: 'details/:classes/:id', element: <MessagesDetails /> },
      ],
    },
    {
      path: '/rebate',
      element: renderElement(<RebateIndex />),
      children: [
        {
          index: true,
          element: <Rebate />,
        },
        {
          path: 'record',
          element: <RebateRecord />,
        },
      ],
    },
    { path: '/nickname', element: renderElement(<Nickname />) },
    {
      path: '/security',
      element: renderElement(<SecurityIndex />),
      children: [
        { index: true, element: <Security /> },
        { path: 'userinfo', element: <Userinfo /> },
        { path: 'bind-phone-or-email/:type', element: <BindPhoneOrEmail /> },
        {
          path: 'manage-payment-methods/:type',
          element: <ManagePaymentMethods />,
        },
        { path: 'change-password', element: <ChangePassword /> },
      ],
    },
    {
      path: '/official',
      element: <OfficialIndex />,
      children: [
        {
          index: true,
          element: (
            <KeepAlive name='officialKPNAME'>
              <Official />
            </KeepAlive>
          ),
        },
        { path: 'detail/:id', element: <OfficialDetails /> },
      ],
    },
    { path: '/open-an-account', element: <MainRegister /> },
    {
      path: '/share',
      element: renderElement(<ShareIndex />),
      children: [
        {
          index: true,
          element: (
            <KeepAlive name='shareKPNAME'>
              <Share />
            </KeepAlive>
          ),
        },
        { path: 'team-management', element: <TeamManagement /> },
        { path: 'performance-inquiry', element: <PerformanceInquiry /> },
        { path: 'agent-report', element: <AgentReport /> },
        { path: 'agent-introduction', element: <AgentIntroduction /> },
      ],
    },
    { path: '/customer-service', element: <CustomerService /> },
    { path: '*', element: <Not404 /> },
  ]);
};
export default useInitializeRouting;
