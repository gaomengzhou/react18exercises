import { FC, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Empty } from 'antd-mobile';
import { ObjType } from '@/types/Common';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { indexData, queryAllActivityType } from '@/redux/index/slice';
import styles from './KindTab.module.scss';
import home from '../../images/icon-侧边栏-首页-未选中@3x.png';
import homeActive from '../../images/icon-侧边栏-首页-选中@3x.png';
import ball from '../../images/icon-侧边栏-体育-未选中@3x.png';
import ballActive from '../../images/icon-体育-选中@3x.png';
import liveVideo from '../../images/icon-侧边栏-真人-未选中@3x.png';
import liveVideoActive from '../../images/icon-侧边栏-真人-选中@3x.png';
import eGame from '../../images/icon-侧边栏-电子-未选中@3x.png';
import eGameActive from '../../images/icon-侧边栏-电子-选中@3x.png';
import { toSportGame } from '../../HomeMethod';
import { LeftSidebarProps } from '../../leftSidebar/LeftSidebar';
import CustomImg from '@/components/customImg/CustomImg';

const KindTab: FC<LeftSidebarProps> = ({ setShowLeftSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const promotionsList = useSelector((s) => s.indexData.promotionsList);
  const { currentLanguage, leftSidebarShortcutOptions } = useSelector(
    (state) => state.indexData
  );
  useEffect(() => {
    dispatch(
      queryAllActivityType({ activityTypeId: '', pageNo: 1, pageSize: 3 })
    );
  }, [dispatch, currentLanguage]);
  const goActivity = () => {
    navigate('activity');
    setShowLeftSidebar(false);
  };

  // const homeText = t('main.home');
  const title = [
    {
      id: 1,
      name: t('main.home'),
      logo: home,
      activeLogo: homeActive,
      path: '/',
    },

    {
      id: 2,
      name: t('main.Sports1'),
      logo: ball,
      activeLogo: ballActive,
      path: 'bbin',
    },
    {
      id: 3,
      name: t('main.live'),
      logo: liveVideo,
      activeLogo: liveVideoActive,
      path: 'gameCategory',
    },
    {
      id: 4,
      name: t('main.Slots'),
      logo: eGame,
      activeLogo: eGameActive,
      path: 'gameCategory',
    },
  ];

  const handleClick = (data: {
    id: number;
    name: string;
    logo: string;
    activeLogo: string;
    path: string;
  }) => {
    const { type } = Object.fromEntries(searchParams);
    if (+type === data.id) return setShowLeftSidebar(false);
    // if (leftSidebarShortcutOptions === data.id) {
    //   setShowLeftSidebar(false);
    //   return;
    // }
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(data.id));
    if (data.path === 'gameCategory') {
      navigate(`${data.path}?name=${data.name}&type=${data.id}`);
    } else if (data.path === 'bbin') {
      toSportGame(navigate);
    } else {
      navigate(data.path);
    }
    setShowLeftSidebar(false);
  };

  const viewDetails = (item: ObjType): void => {
    navigate(`/activity/details/${item.id}`);
    setShowLeftSidebar(false);
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(0));
  };
  return (
    <div className={styles.main}>
      <div className={styles.kindTabBox}>
        {title.map((item) => (
          <div
            onClick={() => handleClick(item)}
            className={`${styles.item} ${
              leftSidebarShortcutOptions === item.id &&
              styles['active-background-color']
            }`}
            key={item.id}
          >
            <CustomImg
              src={
                leftSidebarShortcutOptions === item.id
                  ? item.activeLogo
                  : item.logo
              }
              lazy
            />
            <p
              className={`${
                leftSidebarShortcutOptions === item.id && styles['p-color']
              }`}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
      {/* 优惠活动 */}
      <div style={{ padding: '1rem' }}>
        <div className={styles.promotions}>
          <div className={styles.viewAll} onClick={goActivity}>
            <p>{t('main.Promotions')}</p>
            <div>
              <span>{t('main.all')}</span>
              <i />
            </div>
          </div>
          {promotionsList.length > 0 ? (
            promotionsList.map((item: ObjType) => (
              <div
                key={item.id}
                className={styles.viewList}
                onClick={() => viewDetails(item)}
              >
                <p className={styles['need-ellipsis']}>{item.activityName}</p>
                <i />
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <Empty
                description={t('empty.nodata')}
                imageStyle={{ width: 50 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default KindTab;
