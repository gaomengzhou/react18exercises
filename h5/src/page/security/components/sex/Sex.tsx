import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Mask } from 'antd-mobile';
import styles from './Sex.module.scss';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

interface SexProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
}
const sexList = [
  { id: 1, sex: '男性' },
  { id: 2, sex: '女性' },
];
const Sex: FC<SexProps> = ({ visible, setVisible, title }) => {
  const [active, setActive] = useState(0);
  const submit = async () => {
    setVisible(false);
    toast.loading();
    // 性别 gender|0:保密|1:男|2:女
    const res = await $fetch.post('/lottery-api/user/editGender', {
      gender: active,
    });
    if (!res.success) return toast.fail(res);
    await getUserDetail();
    toast.success('设置成功!');
  };
  return (
    <div
      className={`${styles['sex-container']} ${
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
          <div className={styles.right} onClick={submit}>
            确定
          </div>
        </div>
        <div className={styles.content}>
          {sexList.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActive(item.id);
              }}
            >
              <p>{item.sex}</p>
              <i className={`${active === item.id && styles.active}`} />
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
export default Sex;
