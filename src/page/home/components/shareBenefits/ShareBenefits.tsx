import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './ShareBenefits.module.scss';
import introduction from '../../images/icon-侧边栏-U8BB介绍@3x.png';
import dividend from '../../images/icon-侧边栏-分红@3x.png';
import cashBack from '../../images/icon-侧边栏-洗码返还@3x.png';
import business from '../../images/icon-侧边栏-买卖@3x.png';
import recommendedFriends from '../../images/icon-侧边栏-推荐@3x.png';
import { LeftSidebarProps } from '../../leftSidebar/LeftSidebar';
import CustomImg from '@/components/customImg/CustomImg';

const ShareBenefits: FC<LeftSidebarProps> = ({ setShowLeftSidebar }) => {
  const { t } = useTranslation();
  const recommendIsEnabled = useSelector((s) => s.indexData.recommendIsEnabled);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const list = [
    {
      id: 1,
      name: `${t('main.Introduction')}`,
      logo: introduction,
      show: 1,
      path: '',
    },
    { id: 2, name: `${t('main.Dividend')}`, logo: dividend, show: 1, path: '' },
    { id: 3, name: t('main.cashback'), logo: cashBack, show: 1, path: '' },
    { id: 4, name: `${t('main.trade')}`, logo: business, show: 1, path: '' },
    {
      id: 5,
      name: t('main.Affiliate'),
      logo: recommendedFriends,
      show: recommendIsEnabled,
      path: 'promote',
    },
    {
      id: 6,
      name: t('promote.promote63'),
      logo: require('@/assets/images/icon-VIP.png'),
      path: 'vip',
      show: 1,
    },
  ] as const;
  const handleClick = (data: any) => {
    setShowLeftSidebar(false);
    if (!data.path) return Toast.show(t('common.noOpen'));
    if (data.path === 'promote') {
      navigate('/promote', { state: '3' });
      return;
    }
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(-1));
    navigate(data.path);
  };
  return (
    <div className={styles['box-list']}>
      {list.map((item) => (
        <div key={item.id}>
          {item.show === 1 ? (
            <div className={styles.list} onClick={() => handleClick(item)}>
              <CustomImg src={item.logo} />
              <p className={styles[`color${item.id}`]}>{item.name}</p>
            </div>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
};
export default ShareBenefits;
