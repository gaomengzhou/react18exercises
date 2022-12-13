import { FC, MouseEvent, useState } from 'react';
import { ObjType } from '@/types/Common';
import loading from '@/assets/images/107@2.gif';
// import styles from './CustomImg.module.scss';

interface CustomImgProps {
  src: string | undefined;
  waitingForLoading?: boolean;
  lazy?: boolean;
  style?: ObjType;
  alt?: string;
  className?: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onClick?: ((event: MouseEvent<HTMLImageElement, Event>) => void) | undefined;
}
const CustomImg: FC<CustomImgProps> = ({
  waitingForLoading = false,
  src,
  alt,
  style,
  lazy,
  className,
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
      className={className}
      src={!load ? loading : src}
      alt={alt || 'logo'}
      style={style}
      loading={lazy ? 'lazy' : undefined}
      onLoad={onLoad}
      onClick={onClick}
    />
  );
};
export default CustomImg;
