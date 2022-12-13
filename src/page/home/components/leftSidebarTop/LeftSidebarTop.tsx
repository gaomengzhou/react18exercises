import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useSelector } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './LeftSidebarTop.module.scss';
import close from '../../images/icon-侧边栏-关闭@3x.png';
import gameLogo from '../../images/icon-侧边栏-赌场-未选中@3x.png';
import gameLogoActive from '../../images/icon-侧边栏-赌场-选中@3x.png';
import sportLogo from '../../images/icon-侧边栏-体育-未选中@3x.png';
import sportLogoActive from '../../images/icon-侧边栏-体育-选中@3x.png';
import bottom from '../../images/icon-侧边栏-体育-展开@3x.png';
import bottomActive from '../../images/icon-侧边栏-体育-选中-收起@3x.png';
import closeCheckedLogo from '../../images/icon-侧边栏-体育-选中-展开@3x.png';
import { LeftSidebarProps } from '../../leftSidebar/LeftSidebar';
import SportsDropDownBox from '../sportsDropDownBox/SportsDropDownBox';
import CustomImg from '@/components/customImg/CustomImg';

const LeftSidebarTop: FC<LeftSidebarProps> = ({ setShowLeftSidebar }) => {
  const leftSidebarTopTabs = useSelector((s) => s.indexData.leftSidebarTopTabs);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sportText = t('main.Sports');
  // 开启关闭下拉框
  const [dropDown, setDropDown] = useState(false);
  // 修改体育类选项卡名字
  const [changeName, setChangeName] = useState(sportText);
  // 点击选项卡
  const choosesTitle = (type: number) => {
    dispatch(indexData.actions.setLeftSidebarTopTabs(type));
    if (type === 1) setDropDown(!dropDown);
    if (type === 0) {
      navigate('/');
      setShowLeftSidebar(false);
      setDropDown(false);
    }
  };

  // 体育选项卡状态
  const tabStatus = () => {
    if (leftSidebarTopTabs === 0) return bottom;
    if (leftSidebarTopTabs === 1 && !dropDown) return closeCheckedLogo;
    if (leftSidebarTopTabs === 1 && dropDown) return bottomActive;
  };
  return (
    <div className={styles.top}>
      <div className={styles.content}>
        <div
          className={styles['close-btn']}
          onClick={() => setShowLeftSidebar(false)}
        >
          <CustomImg src={close} alt='x' />
        </div>
        <div className={styles.type}>
          <p onClick={() => choosesTitle(0)}>
            <CustomImg
              src={leftSidebarTopTabs === 0 ? gameLogoActive : gameLogo}
            />
            <span
              className={`${leftSidebarTopTabs === 0 && styles.checkedBlue}`}
            >
              {t('main.Casino')}
            </span>
          </p>
          <p onClick={() => choosesTitle(1)}>
            <CustomImg
              src={leftSidebarTopTabs === 1 ? sportLogoActive : sportLogo}
            />
            <span
              className={`${leftSidebarTopTabs === 1 && styles.checkedBlue}`}
            >
              {changeName}
            </span>
            <CustomImg
              style={{ width: '1.2rem', height: '0.6rem' }}
              src={tabStatus()}
              alt=''
            />
          </p>
        </div>
        <SportsDropDownBox
          setChangeName={setChangeName}
          dropDown={dropDown}
          active={leftSidebarTopTabs}
          setDropDown={setDropDown}
          setShowLeftSidebar={setShowLeftSidebar}
        />
      </div>
    </div>
  );
};

export default LeftSidebarTop;
