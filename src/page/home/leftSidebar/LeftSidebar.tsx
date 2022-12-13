import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import styles from './LeftSidebar.module.scss';
import LeftSidebarTop from '../components/leftSidebarTop/LeftSidebarTop';
import KindTab from '../components/kindTab/KindTab';
import ShareBenefits from '../components/shareBenefits/ShareBenefits';
import Language from '../components/language/Language';

export interface LeftSidebarProps {
  setShowLeftSidebar: Dispatch<SetStateAction<boolean>>;
  showLeftSidebar?: boolean;
}
const LeftSidebar: FC<LeftSidebarProps> = ({
  setShowLeftSidebar,
  showLeftSidebar,
}) => {
  // 侧边栏展开后禁止其它页面滚动
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLeftSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
      timer = setTimeout(() => {
        const main = document.querySelector(
          `.${styles.scrollBody}`
        ) as HTMLDivElement;
        main.scrollTop = 0;
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [showLeftSidebar]);

  return (
    <>
      <div
        onClick={() => setShowLeftSidebar(false)}
        className={`${styles.container} ${
          showLeftSidebar && styles.showContainer
        }`}
      ></div>
      <div className={`${styles.main} ${showLeftSidebar && styles.showMain}`}>
        <LeftSidebarTop setShowLeftSidebar={setShowLeftSidebar} />
        <div className={styles.scrollBody}>
          <KindTab setShowLeftSidebar={setShowLeftSidebar} />
          <ShareBenefits setShowLeftSidebar={setShowLeftSidebar} />
          <Language />
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
