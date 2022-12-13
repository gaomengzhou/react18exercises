import { Toast } from 'antd-mobile';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ReactLazyLoading: FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    Toast.show({
      icon: 'loading',
      content: t('common.loading'),
      duration: 0,
    });
    return () => {
      Toast.clear();
    };
  }, [t]);
  return <div />;
};
export default ReactLazyLoading;
