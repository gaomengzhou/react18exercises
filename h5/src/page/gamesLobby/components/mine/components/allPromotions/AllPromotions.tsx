import { FC, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllPromotions.module.scss';
import AllPromotionsImg from '@/assets/images/mine/Person_active@2x.png';
import { showNotLoggedInPopup } from '@/utils/tools/method';
import { ObjType } from '@/types/Common';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { getAdvertisingByPage } from '@/redux/mine/slice';

const AllPromotions: FC = () => {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const token = useSelector((s) => s.indexData.userinfo.token);
  const mineAdList = useSelector((s) => s.mine.mineAdList);
  // 轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((val) => {
        if (val < mineAdList.length - 1) {
          return val + 1;
        }
        return 0;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [mineAdList.length]);
  /**
   * 查看活动详情
   * @description data.advertisingType 0:跳转活动|1:跳转公告|2:跳转链接|3:不跳转
   */
  const viewDetail = (data: ObjType) => {
    if (data.advertisingType === 0) {
      navigate(`/discount/discount/${data.redirectId}`);
    }
    if (data.advertisingType === 1) {
      if (!token) return showNotLoggedInPopup();
      navigate(`/messages/details/bulletin/${data.redirectId}`);
    }
  };
  // componentDidMount
  useEffect(() => {
    dispatch(getAdvertisingByPage(3));
  }, [dispatch]);
  return (
    <div className={`${styles['all-promotions']}`}>
      {mineAdList.length > 0 && (
        <div className={`${styles['all-promotions-content']}`}>
          <img
            className={styles['promotions-img']}
            src={AllPromotionsImg}
            alt='text'
          />
          {mineAdList.map((item, i) => (
            <img
              key={item.id}
              className={`${styles.banner} ${active === i && styles.show}`}
              src={item.imageUrl}
              onClick={() => viewDetail(item)}
              alt='banner'
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default memo(AllPromotions);
