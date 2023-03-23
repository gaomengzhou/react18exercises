import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from './404.module.scss';

const Not404: FC = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const linkHome = () => {
    navigate('/');
  };
  useEffect(() => {
    if (count) {
      setTimeout(() => {
        setCount((d) => d - 1);
      }, 1000);
    } else {
      linkHome();
    }
    // eslint-disable-next-line
  }, [count]);
  return (
    <div className={styled.not404}>
      <img src={require('@/assets/images/404.png')} alt='' />
      <p>
        Ooops... <br />
        page not found
      </p>
      <div className={styled.time}>
        Return to <span onClick={linkHome}>home</span> page after {count}S
      </div>
    </div>
  );
};
export default Not404;
