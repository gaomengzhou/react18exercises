import { NavigateFunction } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { appIsAndroidOrIOS, isLogin } from '@/utils/tools/method';
import indexData from '@/redux/index/slice';
import { store } from '@/redux/store';

// 兼容IOS使用window.open()
const newWin = async (nav: NavigateFunction, code: string) => {
  let win: any;
  if (appIsAndroidOrIOS() === 'ios' && code === 'BBINTY') {
    win = window.open('url', '_blank');
  }
  const res = await $fetch.post('/lottery-thirdgame-api/thirdGame/loginGame', {
    thirdGameCode: code,
  });
  if (!res.success) return Toast.show(res.message);
  // 跳转体育游戏后改变侧边栏的高亮
  store.dispatch(indexData.actions.setLeftSidebarShortcutOptions(2));
  if (appIsAndroidOrIOS() === 'ios' && code === 'BBINTY') {
    win.location = res.data.thirdGameLoginUrl;
  } else {
    nav('externalGame', { state: { url: res.data.thirdGameLoginUrl } });
    store.dispatch(indexData.actions.setGameStatus(true));
  }
};
/**
 * @param navigator 传个navigate hook提供跳转
 * @param thirdGameCode 游戏码,默认bbin
 */
export const toSportGame = async (
  navigator: NavigateFunction,
  thirdGameCode = 'BBINTY'
) => {
  if (!isLogin()) {
    store.dispatch(indexData.actions.setLoginShow(1));
    return;
  }
  await newWin(navigator, thirdGameCode);
};
