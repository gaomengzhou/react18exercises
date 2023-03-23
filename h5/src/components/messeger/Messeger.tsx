import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from 'antd-mobile';
import styles from './Messeger.module.scss';
import { useSelector } from '@/redux/hook';
// import { setLoginStatus } from '@/utils/tools/method';

const Messeger: FC = () => {
  const showVisible = useSelector((state) => state.indexData.showVisible);
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const element = <h1 className={styles['messger-header']}>站内信</h1>;
  const element1 = (
    <div className={styles['messger-content']}>
      <header>
        <h3>站内信标题站内信标题站内信标题</h3>
        <h4>2023/0225 18:30:30</h4>
      </header>
      <section>
        站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容
        站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容
        站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容；站内信内容
      </section>
    </div>
  );
  useEffect(() => {
    // console.log(location.pathname);
  }, [location.pathname]);
  return (
    <div
      className={`${styles['messger-container']} ${
        showVisible && styles['show-container']
      }`}
    >
      {showVisible && (
        <Modal
          showCloseButton
          visible={visible}
          content={element1}
          closeOnAction
          header={element}
          onClose={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};
export default Messeger;
