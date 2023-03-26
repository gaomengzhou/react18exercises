import { FC } from 'react';
import { List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './About.module.scss';
import homeLogo from '@/assets/images/homePage/logo-by.png';
import Header from '@/components/header/Header';

const About: FC = () => {
  const navigate = useNavigate();
  const infoList = [
    {
      name: '关于我们',
      path: '/aboutMe',
    },
    {
      name: '企业事务',
      path: '/enterpriseAffairs',
    },
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
        <List>
          {infoList.map((item, i) => (
            <List.Item
              key={i}
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
