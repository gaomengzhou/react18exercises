import { FC, useState } from 'react';
import { ImageProps } from 'antd-mobile/es/components/image/image';
import { ObjType } from '@/types/Common';
import loading from '@/assets/images/imglazy.png';
import styles from './CustomImg.module.scss';

interface CustomImgProps extends ImageProps {
  waitingForLoading?: boolean;
  lazy?: boolean;
  style?: ObjType;
  alt?: string;
  className?: string | undefined;
  title?: string;
}
const CustomImg: FC<CustomImgProps> = ({
  waitingForLoading = false,
  src,
  alt,
  style,
  lazy,
  className,
  title,
  onClick,
}) => {
  // 加载完成
  const [load, setLoad] = useState(!waitingForLoading);
  const onLoad = () => {
    if (!load) {
      setLoad(true);
    }
  };

  return (
    <img
      className={`${className} ${styles.cimg}`}
      src={!load ? loading : src}
      alt={alt || 'logo'}
      style={style}
      loading={lazy ? 'lazy' : undefined}
      onLoad={onLoad}
      title={title}
      onClick={onClick}
    />
  );
};
export default CustomImg;
