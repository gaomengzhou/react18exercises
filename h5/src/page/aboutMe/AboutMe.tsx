import { FC } from 'react';
import styles from './AboutMe.module.scss';
import Header from '@/components/header/Header';

const AboutMe: FC = () => {
  return (
    <div className={styles['aboutme-container']}>
      <Header title='关于我们' left right />
      <div className={styles['aboutme-body']}>
        <div className={styles['aboutme-main']}>
          <div className={styles['aboutme-content']}>
            <p>
              必盈棋牌是规模且成长最快的在线娱乐场之一，提供刺激好玩的真人荷官娱乐城，快乐彩，体育博彩，赌场老虎机，虚拟游戏，和扑克游戏等。
            </p>
            <p>
              必盈棋牌拥有 Cagayan Economic Zone
              Authority体育博彩与赌场公司执照。
            </p>
            <p>
              必盈棋牌作为世界知名的在线博彩公司，提供最广范围并最具竞争力的产品。
            </p>
            <p>我们承诺</p>
            <h4>1、公平诚信</h4>
            <p>
              必盈棋牌作为国际知名的线上博彩营运商，对接入的所有平台均经过严格的筛选，只选用国际知名线上博彩平台。保证让每位玩家在一个公平、公正的环境下进行游戏。
            </p>
            <p>
              同时菲律宾政府First Cagayan leisure and Resort
              Corporation会对必盈棋牌游戏平台的数据进行监控最终确保游戏的公平性和真实性。
            </p>
            <h4>2、“不封顶”原则</h4>
            <p>
              必盈棋牌平台一直秉承着“洗码不封顶、取款不封顶”的原则保证所有玩家能最大限度的享受游戏乐趣。
            </p>
            <h4>3、高效存取款</h4>
            <p>
              必盈棋牌一直注重用户体验，高效快速的存取款业务是用户最实在的体验，所以我们一直致力于开发最新的收支业务和人员培训保证高效的存取款，保证5分钟存提款到账，为你快速享受游戏乐趣提供最大保证。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutMe;
