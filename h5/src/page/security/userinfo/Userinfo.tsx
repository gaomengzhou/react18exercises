import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import styles from './Userinfo.module.scss';
import Header from '@/components/header/Header';
import ChooseAvatar from '@/page/security/components/chooseAvatar/ChooseAvatar';
import CustomPicker from '@/components/customPicker/CustomPicker';
import Sex from '@/page/security/components/sex/Sex';
import { useSelector } from '@/redux/hook';
import { getUserDetail } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';
import { avatarList } from '@/page/security/userinfo/staticResources';

const Userinfo: FC = () => {
  const navigate = useNavigate();
  const { headUrl, userId, nickName } = useSelector(
    (s) => s.indexData.userinfo
  );
  const [visible, setVisible] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);
  const [showSex, setShowSex] = useState(false);
  const { userinfo } = useSelector((s) => s.indexData);

  // componentDidMont
  useEffect(() => {
    getUserDetail();
  }, []);
  return (
    <div className={styles.userinfoContainer}>
      <Header title='个人资料' left right />
      <div className={styles.userinfoMain}>
        <div className={styles.userinfoMainTop}>
          <div className={styles.userinfoList}>
            <p>用户ID</p>
            <div
              onClick={() => {
                copy(userId);
                toast.success('复制成功!');
              }}
            >
              <span>{userId}</span>
              <i className='iconfont icon-other_icon-copy' />
            </div>
          </div>
          <div className={styles.userinfoList}>
            <p>注册时间</p>
            <span>{userinfo.createTime}</span>
          </div>
        </div>

        <div className={styles.userinfoMainBottom}>
          <div className={styles.userinfoList} onClick={() => setVisible(true)}>
            <p>头像</p>
            <div>
              {headUrl ? (
                <img src={headUrl} alt='avatar' />
              ) : (
                <img src={avatarList[0]} alt='avatar' />
              )}
              <i className='iconfont icon-a-5_1_1_mine_xi_right_arrow' />
            </div>
          </div>
          <div
            className={styles.userinfoList}
            onClick={() => {
              navigate('/nickname');
            }}
          >
            <p>昵称</p>
            <div>
              <span className={styles.nickname}>{nickName}</span>
              <i className='iconfont icon-a-5_1_1_mine_xi_right_arrow' />
            </div>
          </div>
          <div
            className={styles.userinfoList}
            onClick={() => setShowBirthday(true)}
          >
            <p>生日</p>
            <div>
              <span>
                {userinfo.birthday
                  ? userinfo.birthday
                  : '完善生日信息，获取生日专属福利'}
              </span>
              <i className='iconfont icon-a-5_1_1_mine_xi_right_arrow' />
            </div>
          </div>
          <div className={styles.userinfoList} onClick={() => setShowSex(true)}>
            <p>性别</p>
            <div>
              <span>
                {userinfo.gender === 0
                  ? '请选择性别'
                  : userinfo.gender === 1
                  ? '男'
                  : '女'}
              </span>
              <i className='iconfont icon-a-5_1_1_mine_xi_right_arrow' />
            </div>
          </div>
        </div>
      </div>
      <ChooseAvatar
        visible={visible}
        setVisible={setVisible}
        title='头像'
        // onClick={handleClick}
      />
      <CustomPicker visible={showBirthday} setVisible={setShowBirthday} />
      <Sex visible={showSex} setVisible={setShowSex} title='选择性别' />
    </div>
  );
};
export default Userinfo;
