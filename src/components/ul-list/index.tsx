/* eslint-disable no-unused-vars */
import React, { memo, useState, useEffect } from 'react';
import { useSelector } from '@/redux/hook';

import styled from './style.module.scss';

interface IProps {
  infoList: string[];
  itemClick: (num: number) => void;
}

const UlList: React.FC<IProps> = memo((props) => {
  const { infoList, itemClick } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isShowHistory, tabCurrentIndex } = useSelector(
    (state) => state.wallet
  );

  const activeClick = (index: number) => {
    setCurrentIndex(index);
    itemClick(index);
  };
  useEffect(() => {
    setCurrentIndex(tabCurrentIndex);
  }, [tabCurrentIndex]);

  return (
    <div
      className={`${styled.listWrapper} ${
        isShowHistory ? styled.historyWrapper : ''
      }`}
    >
      {infoList.map((item, index) => {
        return (
          <div
            key={item}
            className={`${styled.box} ${
              currentIndex === index ? `${styled.active}` : ''
            }`}
            onClick={() => activeClick(index)}
          >
            <span
              className={`${currentIndex === index ? `${styled.active}` : ''}`}
            >
              {item}
            </span>
          </div>
        );
      })}
    </div>
  );
});

export default UlList;
