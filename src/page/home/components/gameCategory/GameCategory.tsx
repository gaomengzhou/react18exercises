import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty, Skeleton, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { isLogin } from '@/utils/tools/method';
import { ObjType } from '@/types/Common';
import { useAppDispatch } from '@/redux/hook';
import indexData from '@/redux/index/slice';
import styles from './GameCategory.module.scss';
import CustomImg from '@/components/customImg/CustomImg';

interface GameCategoryProps {
  title: string;
  more: string;
  src: string;
  dataSource: ObjType;
  loading: boolean;
  thirdGameTypeId: number;
}
const GameCategory: FC<GameCategoryProps> = ({
  title,
  more,
  src,
  dataSource,
  loading,
  thirdGameTypeId,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const viewMore = (name = ''): void => {
    // thirdGameTypeId: 2:超人|4:电子
    if (thirdGameTypeId === 2) {
      dispatch(indexData.actions.setLeftSidebarShortcutOptions(3));
      navigate(`gameCategory?type=3${name ? `&class=${name}` : ''}`);
    } else {
      dispatch(indexData.actions.setLeftSidebarShortcutOptions(4));
      navigate(`gameCategory?type=4${name ? `&class=${name}` : ''}`);
    }
  };

  // 兼容safari在异步里使用window.open()的写法
  const openWin = async (objs: ObjType) => {
    let win: any;
    if (objs.thirdGameCode === 'BBINZR') {
      win = window.open('url', '_blank');
    }
    const res = await $fetch.post(
      '/lottery-thirdgame-api/thirdGame/loginGame',
      {
        thirdGameCode: objs.thirdGameCode,
        gameCode:
          objs.thirdGameCode === 'BBINZR' || objs.thirdGameCode === 'AG'
            ? objs.gameCode
            : '',
      }
    );
    if (!res.success) return Toast.show(res.message);
    if (objs.thirdGameCode === 'BBINZR') {
      win.location = res.data.thirdGameLoginUrl;
    } else {
      navigate('externalGame', {
        state: { url: res.data.thirdGameLoginUrl },
      });
    }
    // 跳转真人游戏后改变侧边栏的高亮
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(3));
  };
  const toGame = async (obj: ObjType) => {
    if (!isLogin()) {
      dispatch(indexData.actions.setLoginShow(1));
      return;
    }
    // thirdGameTypeId=4 电子游戏
    if (obj.thirdGameTypeId === 4) {
      const res = await $fetch.post(
        'lottery-thirdgame-api/thirdGame/loginGame',
        {
          gameCode: obj.gameCode,
          thirdGameCode: obj.thirdGameCode,
        }
      );
      if (!res.success) return Toast.show(res.message);
      // 跳转电子游戏后改变侧边栏的高亮
      dispatch(indexData.actions.setLeftSidebarShortcutOptions(4));
      navigate('externalGame', { state: { url: res.data.thirdGameLoginUrl } });
    }
    // thirdGameTypeId=2 真人游戏
    if (obj.thirdGameTypeId === 2) {
      // 兼容safari在异步里使用window.open()的写法
      await openWin(obj);
    }
    if (obj.thirdGameCode !== 'BBINZR') {
      dispatch(indexData.actions.setGameStatus(true));
    }
  };
  return loading ? (
    <div className={styles.loading}>
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated />
    </div>
  ) : (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.left}>
          <CustomImg src={src} alt='img' lazy />
          <h2 className={`${thirdGameTypeId === 2 && styles.yellow}`}>
            {title}
          </h2>
        </div>
        <div className={styles.right}>
          <button onClick={() => viewMore()}>{more}</button>
        </div>
      </div>
      {dataSource.length > 0 ? (
        <div className={styles.container}>
          {dataSource.map((item: ObjType) => (
            <div key={item.id} className={styles.main}>
              {/* toGame(item) 这个是PC跳转的 */}
              <div className={styles.imgBox} onClick={() => toGame(item)}>
                <CustomImg
                  lazy
                  src={item.gameLogoUrl || item.gamePcLogoUrl}
                  waitingForLoading
                  alt='logo'
                />
                <div>
                  <p>{item.gameName}</p>
                </div>
              </div>
              {/* toGame(item) 这个是H5跳转的 */}
              <div className={styles.hover_mask} onClick={() => toGame(item)}>
                <div className={styles.house_edge}></div>
                <svg
                  className={styles.play_icon}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 63 63'
                >
                  <defs></defs>
                  <g fill='none' fillRule='evenodd'>
                    <circle
                      cx='31.3'
                      cy='31.3'
                      r='30.3'
                      fill='#000'
                      fillOpacity='.2'
                      stroke='#E5E7EE'
                      strokeWidth='2'
                    ></circle>
                    <path
                      fill='#F5F6F7'
                      d='M39.5 34.3l-11.3 7.5a2 2 0 01-3-1.6v-15a2 2 0 013-1.7L39.5 31a2 2 0 010 3.3z'
                    ></path>
                  </g>
                </svg>
              </div>
              <footer>
                <p onClick={() => viewMore(item.thirdGameName)}>
                  {item.thirdGameName}
                </p>
              </footer>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.container}>
          <div className={`${styles.main} ${styles.empty}`}>
            <Empty
              description={t('empty.nodata')}
              imageStyle={{ width: 100 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default GameCategory;
