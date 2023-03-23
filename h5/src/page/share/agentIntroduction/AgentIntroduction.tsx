import { FC, useEffect, useState } from 'react';
import { Tabs } from 'antd-mobile';
import Header from '@/components/header/Header';
import styles from './AgentIntroduction.module.scss';
import AgentIntroductionTabsContent from '@/page/share/components/agentIntroductionTabsContent/AgentIntroductionTabsContent';
import { toast } from '@/utils/tools/toast';
import { ObjType } from '@/types/Common';
import AgentIntroductionActionSheet from '@/components/agentIntroductionActionSheet/AgentIntroductionActionSheet';

const AgentIntroduction: FC = () => {
  const [actionSheetSource, setActionSheetSource] = useState<ObjType>({
    thirdPlatformList: [],
  });
  const [content, setContent] = useState<ObjType[]>([]);
  const [sheetBtnActive, setSheetBtnActive] = useState(0);
  const [active, setActive] = useState('1');
  const [visible, setVisible] = useState(false);
  const [tabs, setTabs] = useState<
    { categoryName: string; id: number; thirdPlatformList: ObjType[] }[]
  >([]);
  const onChange = (key: string) => {
    setActive(key);
  };
  // 获取tabs
  const queryThirdGameCategory = async () => {
    const res = await $fetch.post(
      '/config-api/lotteryHall/queryThirdGameCategory'
    );
    if (!res.success) return toast.fail(res);
    setTabs(res.data);
    setActionSheetSource(res.data[0]);
  };
  // 点击tabs title
  const clickTabsTitle = (item: ObjType, i: number) => {
    setVisible(true);
    if ((i + 1).toString() === active) return;
    setActionSheetSource(item);
    setSheetBtnActive(0);
  };

  // 渲染tabs title
  const renderTabTitle = (item: ObjType, i: number) => {
    return (
      <div onClick={() => clickTabsTitle(item, i)}>{item.categoryName}</div>
    );
  };
  // 查询内容
  const queryPageThirdCommissionInfo = async (thirdGameCode: string) => {
    toast.loading({ mask: false });
    const res = await $fetch.post(
      '/config-api/thirdCommission/queryPageThirdCommissionInfo',
      { pageNo: 1, pageSize: 999, thirdGameCode }
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    setContent(res.data.records);
  };
  // 确定分类
  const submit = (data: any) => {
    queryPageThirdCommissionInfo(data.thirdGameCode);
  };

  useEffect(() => {
    if (tabs.length > 0) {
      queryPageThirdCommissionInfo(tabs[0].thirdPlatformList[0].thirdGameCode);
    }
  }, [tabs]);
  useEffect(() => {
    queryThirdGameCategory();
  }, []);

  return (
    <div className={styles.container}>
      <Header title='代理介绍' left />
      <div className={styles.nothing}></div>
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey={active}
          className='agentIntroductionTabsContent'
          onChange={onChange}
        >
          {tabs.map((item, i) => (
            <Tabs.Tab
              className={`${styles.tabsItems} ${
                item.id.toString() === active &&
                'agentIntroductionActiveTabsItems'
              }`}
              title={renderTabTitle(item, i)}
              key={item.id}
            />
          ))}
          <p>12</p>
        </Tabs>
      </div>
      <AgentIntroductionActionSheet
        visible={visible}
        setVisible={setVisible}
        state={actionSheetSource}
        onClick={submit}
        active={sheetBtnActive}
        setActive={setSheetBtnActive}
      />
      <div className={styles.main}>
        <AgentIntroductionTabsContent state={content} />
      </div>
    </div>
  );
};
export default AgentIntroduction;
