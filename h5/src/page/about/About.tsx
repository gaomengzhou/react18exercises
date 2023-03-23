import { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import styles from './About.module.scss';
// import rightArrow from '@/assets/images/home_quick_go~iphone@2x.png';
import homeLogo from '@/assets/images/homePage/logo-by.png';

import Header from '@/components/header/Header';

// import checked from '../../images/icon-选中.png';
// import checked from '../../images/icon-选中.png';
// import checked from '../../images/icon-选中.png';

const About: FC = () => {
  const navigate = useNavigate();
  // const [visible, setVisible] = useState(false);
  // const [select, setSelect] = useState(false);
  // const onSubmit = () => {
  //   navigate(-1);
  // };
  const infoList = [
    {
      name: '关于我们',
      path: '/aboutMe',
    },
    {
      name: '企业事务',
      path: '/enterpriseAffairs',
    },
    // {
    //   name: '帮助中心',
    //   path: '/helpCenter',
    // },
    // {
    //   name: '游戏规则',
    //   path: '/rules',
    // },
    {
      name: '联系我们',
      path: '/customer-service',
    },
  ];
  return (
    <div className={styles['about-container']}>
      <div className={styles['main-box']}>
        <Header title='关于我们' left right />
        <div className={styles.main}>
          <img src={homeLogo} alt='logo' />
        </div>
        <List className={styles.list}>
          {infoList.map((item, i) => (
            <List.Item
              key={i}
              className={`${styles['list-items']}`}
              onClick={() => {
                navigate(item.path);
                console.log(item);
              }}
            >
              {item.name}
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};
export default About;
