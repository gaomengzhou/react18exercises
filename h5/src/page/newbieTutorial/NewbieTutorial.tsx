import { FC, useEffect, useState } from 'react';
import { JumboTabs, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './NewbieTutorial.module.scss';
import Header from '@/components/header/Header';
// import wechat from '@/assets/images/newbie/充值-微信.png';
// import alipay from '@/assets/images/newbie/充值-支付宝.png';
// import usdt from '@/assets/images/newbie/充值-USDT.png';
// import bank from '@/assets/images/newbie/充值-银行卡.png';
// import lottery from '@/assets/images/newbie/投注-彩票.png';
// import sport from '@/assets/images/newbie/投注-体育.png';

interface TabItem {
  id: number;
  typeName: string;
  sort: number;
  typeCode: number;
}
interface SubItem {
  createTime: string;
  faqTypeId: 1221;
  id: 1397;
  title: '微信支付';
}
const NewbieTutorial: FC = () => {
  // const [active] = useState(1);
  const navigate = useNavigate();

  const [tabs, setTabs] = useState<TabItem[] | null>(null);
  const [tabsActive, setTabsActive] = useState(-999);
  const [subTabs, setSubTabs] = useState<SubItem[] | null>(null);

  const getActTabs = async () => {
    console.log(222);

    const res = await $fetch.post('/config-api/faqType/queryAllFaqType', {
      t: Date.now,
    });
    if (!res.success) return;
    setTabs(res.data);
    setTabsActive(0);

    // this.inputObj.yzm = '';
  };
  const getSub = async (idx: number) => {
    if (tabs?.length) {
      const res1 = await $fetch.post('/config-api/faq/queryAllFaqByType', {
        faqTypeCode: tabs[idx].typeCode,
        id: tabs[idx].id,
      });
      setSubTabs(res1.data);
    }
  };
  // const depositInfoList = [
  //   {
  //     name: '微信支付',
  //     node: <img className={styles.icon} src={wechat} alt='logo' />,
  //     path: '/wechatPay',
  //   },
  //   {
  //     name: '支付宝支付',
  //     node: <img className={styles.icon} src={alipay} alt='logo' />,
  //     path: '/alipayPay',
  //   },
  //   {
  //     name: '银行卡转账',
  //     node: <img className={styles.icon} src={bank} alt='logo' />,
  //     path: '/bankPay',
  //   },
  //   {
  //     name: 'USDT转账',
  //     node: <img className={styles.icon} src={usdt} alt='logo' />,
  //     path: '/usdtPay',
  //   },
  // ];
  // const withdrawInfoList = [
  //   {
  //     name: '银行卡转账',
  //     node: <img className={styles.icon} src={bank} alt='logo' />,
  //     path: '/bankWithdraw',
  //   },
  //   {
  //     name: 'USDT转账',
  //     node: <img className={styles.icon} src={usdt} alt='logo' />,
  //     path: '/virtualCurrencyWithdrawal',
  //   },
  // ];
  // const betInfoList = [
  //   {
  //     name: '彩票教程',
  //     node: <img className={styles.icon} src={lottery} alt='logo' />,
  //     path: '/lotteryBet',
  //   },
  //   {
  //     name: '体育教程',
  //     node: <img className={styles.icon} src={sport} alt='logo' />,
  //     path: '/sportBet',
  //   },
  // ];
  // const quesInfoList = [
  //   {
  //     name: '如何寻找我的充值/提现单号?',
  //     node: '',
  //     path: '/ask',
  //   },
  //   {
  //     name: '在虚拟货币中什么是协议?不同协议的差异在哪里?',
  //     node: '',
  //     path: '/virtualCurrencyProtocol',
  //   },
  // ];
  useEffect(() => {
    if (!tabs) getActTabs();
    // eslint-disable-next-line
  }, [tabs]);

  useEffect(() => {
    if (tabs?.length && tabsActive !== -999) getSub(tabsActive);
    // eslint-disable-next-line
  }, [tabsActive]);

  return (
    <div className={`${styles['newbieTutorial-container']}`}>
      <Header title='新手教程' left right />
      <div className={styles['newbieTutorial-body']}>
        <div className={`${styles['newbieTutorial-main']}`}>
          <div className={styles['newbieTutorial-tabs-main']}>
            {tabs && tabs.length > 0 && (
              <JumboTabs
                defaultActiveKey='0'
                onChange={(key) => {
                  setTabsActive(Number(key));
                }}
              >
                {tabs.map((item, index) => (
                  // <button
                  //   className={`${active === item.id && styles['active-button']}`}
                  //   key={item.id}
                  //   onClick={() => setActive(item.id)}
                  // >
                  //   {item.name}
                  // </button>
                  <JumboTabs.Tab
                    title=''
                    description={item.typeName}
                    key={index}
                  ></JumboTabs.Tab>
                ))}
              </JumboTabs>
            )}
          </div>
          <div className={`${styles['newbieTutorial-content-scroll']}`}>
            <div className={`${styles['newbieTutorial-content-details']}`}>
              <List className={styles.list}>
                {subTabs?.length &&
                  subTabs.map((item, i) => (
                    <List.Item
                      key={i}
                      className={`${styles['list-items']}`}
                      onClick={() => {
                        navigate(`/newDetails/${item.id}`, {
                          state: item.title,
                        });
                      }}
                    >
                      {item.title}
                    </List.Item>
                  ))}
              </List>

              {/* {tabsActive === 2 && (
                <List className={styles.list}>
                  {withdrawInfoList.map((item, i) => (
                    <List.Item
                      key={i}
                      className={`${styles['list-items']}`}
                      prefix={item.node}
                      onClick={() => {
                        navigate(item.path);
                        console.log(item);
                      }}
                    >
                      {item.name}
                    </List.Item>
                  ))}
                </List>
              )}
              {tabsActive === 3 && (
                <List className={styles.list}>
                  {betInfoList.map((item, i) => (
                    <List.Item
                      key={i}
                      className={`${styles['list-items']}`}
                      prefix={item.node}
                      onClick={() => {
                        navigate(item.path);
                        console.log(item);
                      }}
                    >
                      {item.name}
                    </List.Item>
                  ))}
                </List>
              )}
              {tabsActive === 4 && (
                <div className={styles.withdraw}>
                  <div className={styles.content}>
                    <div className={styles.title}>
                      <div></div>
                      <h3>普通提现说明</h3>
                    </div>
                    <div className={styles.bottom}>
                      1.
                      当日免费提现3次，用完免费提现次数后，当日无法进行普通提现
                      <br />
                      2.
                      当日提现金额限制¥1,800,000，达到提现金额上限后，无法进行提现
                      <br />
                      3. 单笔提现限额¥100~¥49,999
                      <br /> 4. 当日是指00:00~24:00时间段
                    </div>
                    <div className={styles.title}>
                      <div></div>
                      <h3>大额提现说明</h3>
                    </div>
                    <div className={styles.bottom}>
                      1.
                      大额提现次数限制4次，如无免费大额提现次数，则需收取5%的手续费
                      <br /> 2.
                      当日提现金额限制¥1,800,000，达到提现金额上限后，无法进行提现
                      <br /> 3.
                      单笔提现限额¥3,000~¥300,000，发起大额提现时系统默认拆成多笔提现订单
                      <br />
                      4. 当日是指00:00~24:00时间段
                    </div>
                    <div className={styles.title}>
                      <div></div>
                      <h3>免费大额提现次数说明</h3>
                    </div>
                    <div className={styles.bottom}>
                      1. 每周有效投注额越高，当周可享受免费大额提现次数越多：
                      <br />
                      体育类有效投注额达到¥1,000,000时，可享受免费大额提现1次
                      <br />
                      体育类有效投注额达到¥2,000,000时，可享受免费大额提现2次
                      <br />
                      体育类有效投注额达到¥3,800,000时，可享受免费大额提现3次
                      <br />
                      体育类有效投注额达到¥7,800,000时，可享受免费大额提现4次
                      <br />
                      体育类有效投注额达到¥13,000,000时，可享受免费大额提现5次
                      娱乐类（所有非体育）有效投注额达到¥3,000,000时，可享受免费大额提现1次
                    </div>
                  </div>
                </div>
              )}
              {tabsActive === 5 && (
                <List className={styles.list}>
                  {quesInfoList.map((item, i) => (
                    <List.Item
                      key={i}
                      className={`${styles['list-items']}`}
                      prefix={item.node}
                      onClick={() => {
                        navigate(item.path);
                        console.log(item);
                      }}
                    >
                      {item.name}
                    </List.Item>
                  ))}
                </List>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewbieTutorial;
