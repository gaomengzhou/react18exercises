import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MessagesDetails.module.scss';
import logo from '@/assets/images/messages/Message_TongZhi_Icon@2x.png';
import { ObjType } from '@/types/Common';
import Header from '@/components/header/Header';
import { toast } from '@/utils/tools/toast';

const MessagesDetails: FC = () => {
  const { classes, id } = useParams();
  const [msgData, setMsgData] = useState<ObjType>({});
  // 获取通知详情
  const messages = (): ObjType => {
    const msg = window.localStorage.getItem('msg');
    if (msg) {
      return JSON.parse(msg);
    }
    return {};
  };
  // 获取公告详情
  const getAnnouncementDetail = useCallback(async () => {
    if (classes === 'bulletin') {
      toast.loading();
      const res = await $fetch.post(
        '/config-api/announcement/getAnnouncementDetail',
        { id }
      );
      if (!res.success) return toast.fail(res);
      toast.clear();
      setMsgData(res.data);
    }
  }, [classes, id]);

  useEffect(() => {
    getAnnouncementDetail();
  }, [getAnnouncementDetail]);

  return (
    <div className={styles['message-details-container']}>
      <Header
        title={classes === 'bulletin' ? '公告详情' : '通知详情'}
        left
        right
      />
      <div className={styles['message-details-body']}>
        <div className={styles['message-details-main']}>
          <div className={styles['message-details-title']}>
            <img src={logo} alt='logo' />
            <p>{classes === 'bulletin' ? msgData.title : messages().title}</p>
            <span>02-13 18:09:39</span>
          </div>
          <div className={styles['message-details-content']}>
            <p>
              {classes === 'bulletin'
                ? msgData.rollContent
                : messages().content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessagesDetails;
