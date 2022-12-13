import React, { memo } from 'react';

import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import 'antd/lib/pagination/style/index.css';

import styled from './style.module.scss';

interface IProps {
  current: number;
  totalPage?: number;
  defaultPageSize?: number;
  // eslint-disable-next-line no-unused-vars
  onChangePage?: (page: number) => void;
}

const PageNation: React.FC<IProps> = memo((props) => {
  const { current, totalPage, onChangePage, defaultPageSize = 10 } = props;

  const onChange: PaginationProps['onChange'] = (page) => {
    if (onChangePage) onChangePage(page);
  };
  return (
    <div className={styled.pageWrapper}>
      <Pagination
        pageSize={defaultPageSize}
        className={styled.pageNation}
        current={current}
        onChange={onChange}
        total={totalPage}
      />
    </div>
  );
});

export default PageNation;
