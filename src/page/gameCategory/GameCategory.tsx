import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Empty, Skeleton, Toast } from 'antd-mobile';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import { useTranslation } from 'react-i18next';
import { ObjType } from '@/types/Common';
import { isLogin, sleep } from '@/utils/tools/method';
import Footer from '@/page/home/footer/Footer';
import electronicChessAndCards from '@/assets/images/index/icon-标签-电子棋牌@3x.png';
import liveVideo from '@/assets/images/index/icon-标签-真人@3x.png';
import styles from './GameCategory.module.scss';
import Select from './Components/Select/Select';
import H5Header from './Components/H5Header/H5Header';
import indexData from '@/redux/index/slice';
import { useAppDispatch, useSelector } from '@/redux/hook';
import CustomImg from '@/components/customImg/CustomImg';

export interface SelectMoreProps {
  thirdGmaeName: string;
  thirdGameCode: string;
  thirdGameId: number;
  checked: boolean;
  count: number;
}
const GameCategory: FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  // input 数据
  const [value, setValue] = useState<string>('');
  const [selectActive, setSelectActive] = useState(false);
  const [sortActive, setSortActive] = useState(false);
  // 列表数据
  const [dataSource, setDataSource] = useState<ObjType[]>([]);
  // 用来模糊查询的数据拷贝一份
  const [copyDataSource, setCopyDataSource] = useState<ObjType[]>([]);
  // 下拉框数据
  const [selectMoreProps, setSelectMoreProps] = useState<SelectMoreProps[]>([
    {
      thirdGmaeName: '全部',
      thirdGameCode: 'ALL',
      thirdGameId: -1,
      checked: false,
      count: 0,
    },
  ]);
  // 多选参数
  const [multipleChoice, setMultipleChoice] = useState<number[]>([]);
  const [params] = useSearchParams();
  const searchParams = Object.fromEntries(params);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentLanguage = useSelector((s) => s.indexData.currentLanguage);
  const getData = async (param: number[]): Promise<ToastHandler | void> => {
    setLoading(true);
    let res: ObjType = {};
    if (searchParams.type === '3') {
      res = await $fetch.post(
        '/config-api/platformThirdSubGameConfig/pageQueryPlatformThirdSubGameConfig',
        {
          pageNo: 1,
          pageSize: 2000,
          platformId: $env.REACT_APP_PLATFORM_ID,
          thirdGameTypeId: 2,
          thirdGameIdList: param,
        }
      );
      if (!res.success) return Toast.show(res.message);
      if (Array.isArray(res.data.records)) {
        setDataSource(res.data.records);
        setCopyDataSource(res.data.records);
      }
    }
    if (searchParams.type === '4') {
      res = await $fetch.post(
        '/config-api/platformThirdSubGameConfig/pageQueryPlatformThirdSubGameConfig',
        {
          pageNo: 1,
          pageSize: 2000,
          platformId: $env.REACT_APP_PLATFORM_ID,
          thirdGameTypeId: 4,
          thirdGameIdList: param,
        }
      );
      if (!res.success) return Toast.show(res.message);
      if (Array.isArray(res.data.records)) {
        setDataSource(res.data.records);
        setCopyDataSource(res.data.records);
      }
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
    // eslint-disable-next-line no-unused-vars
    if (!res.success) return Toast.show(res.message);
    // 跳转真人游戏后改变侧边栏的高亮
    dispatch(indexData.actions.setLeftSidebarShortcutOptions(3));
    if (objs.thirdGameCode === 'BBINZR') {
      win.location = res.data.thirdGameLoginUrl;
    } else {
      navigate('/externalGame', {
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
    // searchParams.type=4 电子游戏
    if (searchParams.type === '4') {
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
      navigate('/externalGame', { state: { url: res.data.thirdGameLoginUrl } });
    }
    // searchParams.type=3 真人游戏
    if (searchParams.type === '3') {
      // 兼容safari在异步里使用window.open()的写法
      await openWin(obj);
    }
    if (obj.thirdGameCode !== 'BBINZR') {
      dispatch(indexData.actions.setGameStatus(true));
    }
  };

  // 三方游戏类型
  const queryThirdGameCategoryByGameType = async () => {
    let count = 0;
    let thirdGameTypeId = 2;
    if (searchParams.type === '4') thirdGameTypeId = 4;
    if (searchParams.type === '3') thirdGameTypeId = 2;
    const res = await $fetch.post(
      '/config-api/lotteryHall/queryThirdGameCategoryByGmaeType',
      { thirdGameTypeId, platformId: $env.REACT_APP_PLATFORM_ID }
    );
    if (!res.success) return Toast.show(res.message);
    const arr = res.data.map(
      (item: {
        thirdGameId: number;
        thirdGmaeName: string;
        checked: boolean;
        count: number;
      }) => {
        count += item.count;
        return {
          ...item,
          checked: false,
        };
      }
    );
    arr.unshift({
      thirdGmaeName: t('common.all'),
      thirdGameCode: 'ALL',
      thirdGameId: -1,
      checked: false,
      count,
    });
    setSelectMoreProps(arr);
  };

  useEffect(() => {
    const div = document.documentElement || document.body;
    div.scrollTop = 0;
    Promise.all([
      getData(multipleChoice),
      queryThirdGameCategoryByGameType(),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      const div = document.documentElement || document.body;
      div.scrollTop = 0;
      Promise.all([getData([]), queryThirdGameCategoryByGameType()]).finally(
        () => setLoading(false)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.type, currentLanguage]);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const copyData = [...copyDataSource];
    const arr = copyData.filter((item) =>
      item.gameName.includes(e.target.value)
    );
    await sleep(1000);
    setDataSource(arr);
    if (!e.target.value) setDataSource(copyDataSource);
  };

  const clickSelect = (e: SyntheticEvent) => {
    e.preventDefault();
    setSelectActive(!selectActive);
    if (!sortActive) return;
    setSortActive(false);
  };

  return (
    <div className={styles.card}>
      <H5Header type={searchParams.type} />
      <div className={styles.title}>
        <div className={styles.left}>
          <div>
            {searchParams.type === '3' && (
              <img src={liveVideo} alt='images' loading='lazy' />
            )}
            {searchParams.type === '4' && (
              <img src={electronicChessAndCards} alt='images' loading='lazy' />
            )}
            <h2 className={`${searchParams.type === '3' && styles.yellow}`}>
              {searchParams.type === '3' ? t('main.live') : t('main.Slots')}
            </h2>
          </div>
          <div className={styles.totals}>
            <p>
              {searchParams.type === '3'
                ? t('gameCategory.liveGame', { count: dataSource.length })
                : t('gameCategory.slotGame', { count: dataSource.length })}
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.search}>
            <input
              type='text'
              placeholder={t('gameCategory.search')}
              value={value}
              onChange={onChange}
            />
            <i />
            <b
              className={`${value && styles['show-b']}`}
              onClick={() => {
                setValue('');
                setDataSource(copyDataSource);
              }}
            />
          </div>
          <div
            className={`${styles.filter} ${
              selectActive && styles['first-filter-active']
            }`}
            onClick={clickSelect}
          >
            <div
              className={`${styles.select} ${
                selectActive && styles['select-show']
              }`}
            >
              <Select
                selectActive={selectActive}
                selectMoreProps={selectMoreProps}
                setSelectMoreProps={setSelectMoreProps}
                setSelectActive={setSelectActive}
                setMultipleChoice={setMultipleChoice}
                getData={() => getData(multipleChoice)}
                multipleChoice={multipleChoice}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={15} animated />
          </div>
        ) : dataSource && dataSource.length > 0 ? (
          dataSource.map((item) => (
            <div
              key={item.id}
              className={styles.main}
              onClick={() => toGame(item)}
            >
              <div className={styles.imgBox}>
                <CustomImg
                  src={
                    item.thirdGameLogoUrl ||
                    item.gameLogoUrl ||
                    item.gamePcLogoUrl
                  }
                  lazy
                  alt='logo'
                  waitingForLoading
                />
                <div>
                  <p>{item.gameName}</p>
                </div>
              </div>
              <div className={styles.hover_mask}>
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
                <p>{item.thirdGameName}</p>
              </footer>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <Empty
              description={t('empty.nodata')}
              imageStyle={{ width: 100 }}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default GameCategory;
