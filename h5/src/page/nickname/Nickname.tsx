import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from './Nickname.module.scss';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

const Nickname: FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const onSubmit = async () => {
    toast.loading();
    const res = await $fetch.post('/lottery-api/user/editNickName', {
      nickName: nickname,
    });
    if (!res.success) return toast.fail(res);
    await getUserDetail();
    navigate(-1);
    toast.success('修改成功!');
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  return (
    <div className={styles.nicknameContainer}>
      <Header title='修改昵称' left right />
      <div className={styles.nicknameMain}>
        <h3>昵称</h3>
        <input
          type='text'
          value={nickname}
          onChange={handleChange}
          placeholder='请输入新的昵称'
        />
        <div>
          <button onClick={onSubmit}>确认修改</button>
        </div>
      </div>
    </div>
  );
};
export default Nickname;
