import { FC } from 'react';
import styles from './Home.module.scss';
import img from './images/pc-开发中.jpg';

const Home: FC = () => {
  return (
    <div className={styles.container}>
      <img src={img} alt='img' />
    </div>
  );
};
export default Home;
