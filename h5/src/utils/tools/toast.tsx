import { Toast } from 'antd-mobile';
import { ToastProps } from 'antd-mobile/es/components/toast/toast';
import loadingGif from '@/assets/images/footBallLoading.gif';

class Toasts {
  $Toast = Toast;

  show = (params: ToastProps) => {
    const {
      afterClose,
      maskStyle,
      maskClassName,
      maskClickable,
      content,
      icon,
      duration,
      position,
      getContainer,
      stopPropagation,
    } = params;
    this.$Toast.show({
      afterClose,
      maskStyle,
      maskClassName,
      maskClickable,
      content,
      icon,
      duration,
      position,
      getContainer,
      stopPropagation,
    });
  };

  loading = (opt: { mask: boolean } = { mask: true }) => {
    const routerContainer = document.querySelector(
      '.this-app-router-container'
    ) as HTMLDivElement;
    routerContainer.classList.add('fuzzy');
    this.$Toast.show({
      icon: <img src={loadingGif} alt='' />,
      duration: 0,
      maskClickable: false,
      maskClassName: opt.mask ? 'custom-toast-mask' : 'custom-toast-no-mask',
      getContainer: () => document.getElementById('root') as HTMLElement,
    });
  };

  success = (content?: string, duration?: number) => {
    const routerContainer = document.querySelector(
      '.this-app-router-container'
    ) as HTMLDivElement;
    routerContainer.classList.remove('fuzzy');
    this.$Toast.clear();
    this.$Toast.show({ icon: 'success', content, duration });
  };

  fail = (result: { code: number; message: string; data?: any }) => {
    const routerContainer = document.querySelector(
      '.this-app-router-container'
    ) as HTMLDivElement;
    routerContainer.classList.remove('fuzzy');
    this.$Toast.clear();
    return (
      result.message &&
      this.$Toast.show({ icon: 'fail', content: result.message })
    );
  };

  clear = () => {
    const routerContainer = document.querySelector(
      '.this-app-router-container'
    ) as HTMLDivElement;
    routerContainer.classList.remove('fuzzy');
    this.$Toast.clear();
  };
}
export const toast = new Toasts();
