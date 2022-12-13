import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import Information from '@/page/information/index';
import { AppDispatch } from '@/redux/store';
import { changeMessageStatus } from '@/redux/security';
import { getUnreadMessageCount } from '@/redux/index/slice';
import styles from './index.module.scss';

const Message: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const close = () => {
    dispatch(getUnreadMessageCount());
    dispatch(changeMessageStatus(0));
  };
  return (
    <div className={styles.ReactModalPortal}>
      <div className={styles.ReactModal__Overlay}>
        <div className={styles.ReactModal__Content}>
          <div className={styles.heardtitle}>
            <div>{t('header.MessageCenter')}</div>
            <div className={styles['hx-modal-title']} onClick={close}></div>
          </div>
          <div className={styles.bobybox}>
            <Information />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Message;
