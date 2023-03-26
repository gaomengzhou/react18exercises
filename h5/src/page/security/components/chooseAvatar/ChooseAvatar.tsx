import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Mask } from 'antd-mobile';
import styles from './ChooseAvatar.module.scss';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';
import { avatarList } from '@/page/security/userinfo/staticResources';

interface ChooseAvatarProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  onClick?: (data: any) => typeof data;
}
const ChooseAvatar: FC<ChooseAvatarProps> = ({
  visible,
  setVisible,
  title,
  onClick,
}) => {
  const [active, setActive] = useState(-1);
  const [avatarInfo, setAvatarInfo] = useState('');
  const selection = (src: string, i: number) => {
    setActive(i);
    setAvatarInfo(src);
  };

  const upLoadAvatar = async () => {
    toast.loading();
    const res = await $fetch.post('/lottery-api/user/editHeadUrl', {
      headUrl: avatarInfo,
    });
    await getUserDetail();
    if (!res.success) {
      return res.message && toast.fail(res);
    }

    onClick?.(avatarInfo);
    toast.success('修改成功!');
    setVisible(false);
  };

  return (
    <div
      className={`${styles['choose-avatar-container']} ${
        visible && styles['show-container']
      }`}
    >
      <div className={styles.touchBar}></div>
      <div className={styles.main}>
        <div className={styles.title}>
          <div className={styles.left} onClick={() => setVisible(false)}>
            取消
          </div>
          <div className={styles['title-name']}>{title}</div>
          <div className={styles.right} onClick={upLoadAvatar}>
            确定
          </div>
        </div>
        <div className={styles.content}>
          {avatarList.map((item, i) => (
            <div key={i} className={`${active === i && styles.currAvatar}`}>
              <img
                src={item}
                onClick={() => selection(item, i)}
                key={i}
                alt='avatar'
              />
            </div>
          ))}
        </div>
      </div>
      <Mask
        className='bottom-action-sheet-mask'
        visible={visible}
        onMaskClick={() => setVisible(false)}
        getContainer={() => {
          return document.getElementById('root') as HTMLElement;
        }}
      />
    </div>
  );
};
export default ChooseAvatar;
