import { Swiper, SwiperSlide } from 'swiper/react';
import { FC, useEffect, useState, useRef } from 'react';
import { Mask } from 'antd-mobile';
import { useSelector } from '@/redux/hook';
import Header from '@/components/header/Header';
import styles from './Vip.module.scss';
import 'swiper/css';

interface Item {
  weekSalary: string;
  monthSalary: string;
  bonus: string;
  yearRevenue: string;
}
interface VipInfo {
  bonus: string;
  bonusReceiveStatus: number;
  currentVipLevel: number;
  monthSalary: string;
  monthSalaryReceiveStatus: number;
  nextVipLevel: number;
  vipActivityDescription: string;
  vipCurrentBetAmount: string;
  vipCurrentRechargeScore: null;
  vipRechargeScore: null;
  vipType: number;
  vipValidBetAmount: string;
  weekSalary: string;
  weekSalaryReceiveStatus: number;
  yearRevenue: string;
}
const Vip: FC = () => {
  // const dispatch = useAppDispatch();
  const { userinfo } = useSelector((s) => s.indexData);
  const divRef = useRef<any>(null);
  const [startY, setStartY] = useState<number>(0);
  // const  [endY, setEndY] = useRef<number>(0);
  const [arr, setArr] = useState<Item[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [info, setInfo] = useState<VipInfo>({
    bonus: '0',
    bonusReceiveStatus: 0,
    currentVipLevel: 0,
    monthSalary: '0',
    monthSalaryReceiveStatus: 2,
    nextVipLevel: 1,
    vipActivityDescription: 'vip',
    vipCurrentBetAmount: '0.00',
    vipCurrentRechargeScore: null,
    vipRechargeScore: null,
    vipType: 0,
    vipValidBetAmount: '1000.00',
    weekSalary: '0',
    weekSalaryReceiveStatus: 2,
    yearRevenue: '0',
  });
  const arrVip = [
    <span className='icon iconfont'>&#xe687;</span>,
    <span className='icon iconfont'>&#xe67f;</span>,
    <span className='icon iconfont'>&#xe680;</span>,
    <span className='icon iconfont'>&#xe682;</span>,
    <span className='icon iconfont'>&#xe67e;</span>,
    <span className='icon iconfont'>&#xe683;</span>,
    <span className='icon iconfont'>&#xe684;</span>,
    <span className='icon iconfont'>&#xe681;</span>,
    <span className='icon iconfont'>&#xe685;</span>,
    <span className='icon iconfont'>&#xe686;</span>,
  ];
  const [active, setActive] = useState(0);
  const getAllSwiper = async () => {
    const res = await $fetch.post('/lottery-api/vipInfo/queryAllVipLevel', {
      t: Date.now,
    });

    const res1 = await $fetch.post('/lottery-api/vipInfo/getUserVipInfo', {
      t: Date.now,
    });
    if (!res.success) return;
    if (!res1.success) return;
    setArr(res.data);
    setInfo(res1.data);
    // this.inputObj.yzm = '';
  };
  const start = (e: any) => {
    setStartY(e.touches[0].pageY);
  };
  const end = (e: any) => {
    if (e.changedTouches[0].pageY - startY < 0) {
      setShow(true);
    }
  };
  const goTop = () => {
    const div = divRef.current;
    div.scrollTop = 0;
  };
  useEffect(() => {
    if (!arr.length) getAllSwiper();
    setActive(1);
    // eslint-disable-next-line
  }, [arr]);
  return (
    <div className={`${styles['vip-container']}`}>
      <Header title='VIP中心' left right />
      <div className={styles['vip-body']}>
        <div className={`${styles['vip-main']}`}>
          <div className={`${styles['vip-main-top']}`}>
            <div className={`${styles['vip-HJIG']}`}>
              <div className={`${styles['vip-NcJab']}`}>
                <img src={userinfo.headUrl} alt='' />
              </div>
              <div className={`${styles['vip-cDZtZ']}`}>
                {userinfo.userName}
                <span>
                  <i>VIP{info.currentVipLevel}</i>
                </span>
              </div>
              <div className={`${styles['vip-xjnN8']}`}>
                <div className={`${styles['vip-Wzr70']}`}>
                  <div>
                    <span>
                      <i className={`${styles['vip-FG6hp']}`}>
                        V{info.currentVipLevel}
                      </i>
                    </span>
                    打码量:
                    <span>
                      <i className={`${styles['vip-KDWRP']}`}>
                        {Number(info.vipCurrentBetAmount)}
                      </i>
                      / {Number(info.vipValidBetAmount)}
                    </span>
                  </div>
                  <div>
                    <span>
                      <i>V{info.currentVipLevel + 1}</i>
                    </span>
                  </div>
                </div>
                <div className={`${styles['vip-ohRa1']}`}>
                  <span
                    style={{
                      width: `${
                        (Number(info.vipCurrentBetAmount) * 100) /
                        Number(info.vipValidBetAmount)
                      }%`,
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles['vip-main-bot']}`}>
            <div className={`${styles['vip-main-one']}`}>
              <div className={`${styles['vip-YLDQf']}`}>
                {arr.length && (
                  <Swiper
                    pagination
                    onSlideChange={(swiper) => setActive(swiper.activeIndex)}
                    onSwiper={(swiper) => console.log('paymentSwiper:', swiper)}
                  >
                    {arr.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className={`${styles['vip-box']}`}>
                            <div className={`${styles['vip-eRKSV']}`}>
                              <div className={`${styles['vip-Lpux3']}`}>
                                <span className='icon iconfont'>&#xe67d;</span>
                                {index > 99 ? (
                                  <div>
                                    {arrVip[Number(index.toString()[0])]}
                                    {arrVip[Number(index.toString()[1])]}
                                    {arrVip[Number(index.toString()[2])]}
                                  </div>
                                ) : index > 9 ? (
                                  <div>
                                    {arrVip[Number(index.toString()[0])]}
                                    {arrVip[Number(index.toString()[1])]}
                                  </div>
                                ) : (
                                  <div>{arrVip[index]}</div>
                                )}
                                <span>专属特权</span>
                              </div>
                              <div
                                className={`${styles['vip-DUDaJ']} ${styles['vip-xOT0u']}`}
                              ></div>
                            </div>
                            <div className={`${styles['vip-XBXiV']}`}>
                              需要{item.bonus}打码量
                            </div>
                            <div className={`${styles['vip-m7xb9']}`}>
                              <div className={`${styles['vip-I017U']}`}>
                                <p>晋级彩金</p>
                                <p>晋级即可领取</p>
                                <p>
                                  <span
                                    className={`${styles['vip-eSVMa']}`}
                                  ></span>
                                </p>
                                <p className={`${styles['vip-EzZUb']}`}>
                                  <i>￥</i>
                                  {item.bonus}
                                </p>
                                <p className={`${styles['vip-aCW0F']}`}></p>
                              </div>
                              <div className={`${styles['vip-I017U']}`}>
                                <p>周礼金</p>
                                <p>每周一派发</p>
                                <p>
                                  <span
                                    className={`${styles['vip-m_cKC']}`}
                                  ></span>
                                </p>
                                <p className={`${styles['vip-EzZUb']}`}>
                                  <i>￥</i>
                                  {item.weekSalary}
                                </p>
                                <p
                                  className={`${styles['vip-aCW0F']} ${styles['vip-gN_hD']}`}
                                ></p>
                              </div>
                              <div className={`${styles['vip-I017U']}`}>
                                <p>月礼金</p>
                                <p>每月1号派发</p>
                                <p>
                                  <span
                                    className={`${styles['vip-usags']}`}
                                  ></span>
                                </p>
                                <p className={`${styles['vip-EzZUb']}`}>
                                  <i>￥</i>
                                  {item.monthSalary}
                                </p>
                                <p className={`${styles['vip-aCW0F']}`}></p>
                              </div>
                              <div className={`${styles['vip-I017U']}`}>
                                <p>年收益</p>
                                <p>等级高 收益高</p>
                                <p>
                                  <span
                                    className={`${styles['vip-Gtii6']}`}
                                  ></span>
                                </p>
                                <p className={`${styles['vip-EzZUb']}`}>
                                  <i>￥</i>
                                  {item.yearRevenue}
                                </p>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
              </div>
            </div>
            <div className={`${styles['vip-main-two']}`}>
              <span>VIP0</span>
              <div>
                <span className={`${styles['vip-main-span']}`}>
                  VIP{active}
                </span>
                <ul style={{ transform: `translateX(${active * -1.5}rem)` }}>
                  {new Array(arr.length + 8).fill(1).map((item, index) => {
                    return (
                      <li
                        className={`${
                          active + 2 === index ? styles['vip-main-dtExc'] : ''
                        }${
                          active + 3 === index ? styles['vip-main-VFAMJ'] : ''
                        }${
                          active + 4 === index ? styles['vip-main-vXhjb'] : ''
                        }${
                          active + 5 === index ? styles['vip-main-VFAMJ'] : ''
                        }${
                          active + 6 === index ? styles['vip-main-dtExc'] : ''
                        }`}
                        key={index}
                      ></li>
                    );
                  })}
                </ul>
              </div>
              <span>VIP{arr.length - 1}</span>
            </div>
            <div
              onTouchStart={start}
              onTouchEnd={end}
              className={`${styles['vip-main-zvXpf']}`}
            >
              上滑查看VIP详情
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles['vip-action-sheet-container']} ${
          show && styles['show-container']
        }`}
      >
        <div className={styles.touchBar}></div>
        <div className={styles.mk66M}>
          <div ref={divRef} className={styles.C8Z4S}>
            <div className={styles.aS4Zu}>
              <div className={styles.NIg_1}>
                <p>会员特权</p>
                <p>会员每升级一级 都能获得相应的奖励</p>
                <div className={styles.pEnCH}>
                  <ul className={styles.Ip6e1}>
                    <li>等级</li>
                    <li>打码要求</li>
                    <li>晋级礼金</li>
                    <li>周礼金</li>
                    <li>月礼金</li>
                    <li>年收益</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>1
                      </span>
                    </li>
                    <li>1+</li>
                    <li>0元</li>
                    <li>0.2元</li>
                    <li>0元</li>
                    <li>10.4元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>2
                      </span>
                    </li>
                    <li>1000+</li>
                    <li>3元</li>
                    <li>2元</li>
                    <li>0元</li>
                    <li>107元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>3
                      </span>
                    </li>
                    <li>1万+</li>
                    <li>6元</li>
                    <li>4元</li>
                    <li>0元</li>
                    <li>214元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>4
                      </span>
                    </li>
                    <li>3万+</li>
                    <li>18元</li>
                    <li>6元</li>
                    <li>0元</li>
                    <li>330元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>5
                      </span>
                    </li>
                    <li>6万+</li>
                    <li>28元</li>
                    <li>8元</li>
                    <li>0元</li>
                    <li>444元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>6
                      </span>
                    </li>
                    <li>10万+</li>
                    <li>38元</li>
                    <li>12元</li>
                    <li>0元</li>
                    <li>662元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>7
                      </span>
                    </li>
                    <li>20万+</li>
                    <li>88元</li>
                    <li>16元</li>
                    <li>0元</li>
                    <li>920元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>8
                      </span>
                    </li>
                    <li>40万+</li>
                    <li>168元</li>
                    <li>22元</li>
                    <li>0元</li>
                    <li>1312元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>9
                      </span>
                    </li>
                    <li>70万+</li>
                    <li>248元</li>
                    <li>28元</li>
                    <li>0元</li>
                    <li>1704元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>10
                      </span>
                    </li>
                    <li>100万+</li>
                    <li>288元</li>
                    <li>38元</li>
                    <li>0元</li>
                    <li>2264元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>11
                      </span>
                    </li>
                    <li>150万+</li>
                    <li>388元</li>
                    <li>48元</li>
                    <li>0元</li>
                    <li>2884元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>12
                      </span>
                    </li>
                    <li>200万+</li>
                    <li>398元</li>
                    <li>58元</li>
                    <li>0元</li>
                    <li>3414元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>13
                      </span>
                    </li>
                    <li>300万+</li>
                    <li>598元</li>
                    <li>68元</li>
                    <li>0元</li>
                    <li>4134元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>14
                      </span>
                    </li>
                    <li>500万+</li>
                    <li>888元</li>
                    <li>88元</li>
                    <li>0元</li>
                    <li>5464元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>15
                      </span>
                    </li>
                    <li>700万+</li>
                    <li>988元</li>
                    <li>138元</li>
                    <li>0元</li>
                    <li>8164元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>16
                      </span>
                    </li>
                    <li>1000万+</li>
                    <li>1288元</li>
                    <li>188元</li>
                    <li>0元</li>
                    <li>11064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>17
                      </span>
                    </li>
                    <li>1500万+</li>
                    <li>1688元</li>
                    <li>238元</li>
                    <li>0元</li>
                    <li>14064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>18
                      </span>
                    </li>
                    <li>2000万+</li>
                    <li>1888元</li>
                    <li>288元</li>
                    <li>0元</li>
                    <li>16864元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>19
                      </span>
                    </li>
                    <li>3000万+</li>
                    <li>2688元</li>
                    <li>388元</li>
                    <li>0元</li>
                    <li>22864元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>20
                      </span>
                    </li>
                    <li>4000万+</li>
                    <li>2788元</li>
                    <li>488元</li>
                    <li>0元</li>
                    <li>28164元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>21
                      </span>
                    </li>
                    <li>5000万+</li>
                    <li>2888元</li>
                    <li>588元</li>
                    <li>0元</li>
                    <li>33464元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>22
                      </span>
                    </li>
                    <li>6000万+</li>
                    <li>2988元</li>
                    <li>688元</li>
                    <li>0元</li>
                    <li>38764元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>23
                      </span>
                    </li>
                    <li>8000万+</li>
                    <li>3688元</li>
                    <li>888元</li>
                    <li>0元</li>
                    <li>49864元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>24
                      </span>
                    </li>
                    <li>1亿+</li>
                    <li>3888元</li>
                    <li>1388元</li>
                    <li>0元</li>
                    <li>76064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>25
                      </span>
                    </li>
                    <li>2亿+</li>
                    <li>12888元</li>
                    <li>1888元</li>
                    <li>0元</li>
                    <li>111064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>26
                      </span>
                    </li>
                    <li>3亿+</li>
                    <li>13888元</li>
                    <li>2388元</li>
                    <li>0元</li>
                    <li>138064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>27
                      </span>
                    </li>
                    <li>5亿+</li>
                    <li>22888元</li>
                    <li>2888元</li>
                    <li>0元</li>
                    <li>173064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>28
                      </span>
                    </li>
                    <li>10亿+</li>
                    <li>38888元</li>
                    <li>3888元</li>
                    <li>0元</li>
                    <li>241064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>29
                      </span>
                    </li>
                    <li>20亿+</li>
                    <li>68888元</li>
                    <li>5888元</li>
                    <li>0元</li>
                    <li>375064元</li>
                  </ul>
                  <ul className={styles.BwpQc}>
                    <li>
                      <span>
                        <i></i>30
                      </span>
                    </li>
                    <li>30亿+</li>
                    <li>88888元</li>
                    <li>8888元</li>
                    <li>0元</li>
                    <li>551064元</li>
                  </ul>
                  <div className={styles.HeRO}>收起</div>
                </div>
              </div>
              <div className={styles.sqk_e}>
                <p>会员晋升说明</p>
                <div className={styles.SfC_m}>
                  <p>晋级标准</p>
                  <p>
                    会员的累计存款以及累计流水达到相应级别的要求，即可自动晋升到相应的VIP等级。
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>晋级顺序</p>
                  <p>会员累计有效投注注额达到相应等级的要求后，逐级晋升</p>
                </div>
                <div className={styles.SfC_m}>
                  <p>保级要求</p>
                  <p>
                    会员在晋升VIP等级后，一个季度内(90天计算)须按照对应等级的保级要求完成投注，如果在此期间产生晋级，则保级要求重新按照当前等级计算
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>降级标准</p>
                  <p>
                    如会员在一个季度内(90天计算)没有完成相应的保级要求投注，系统自动降级一个等级，对应的优惠也会跟随调整至降级后的等级优惠
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>晋级礼金</p>
                  <p>
                    会员每晋升一个等级均能获得对应的晋级礼金，每个级别的晋级礼金每个账号均只能领取1次。(晋级礼金1倍流水即可提现)
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>周礼金</p>
                  <p>
                    会员晋升到一定的等级后，每周(周一开始领取)均可领取礼金，每个账号每周领取1次。(周礼金1倍流水即可提现)
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>月礼金</p>
                  <p>
                    会员晋升到一定的等级后，每月(每月1日开始领取)均可领取礼金，每个账号每月领取1次。(月礼金1倍流水即可提现)
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>生日礼金</p>
                  <p>
                    会员在注册账号3个月内过生日，今年将不能领取生日礼金，另注时间大于3个月的会员需在生日当天的VIP页面进行自主领取，每年仅领取1次。(生日礼金1倍流水即可提现)
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>特别优惠</p>
                  <p>
                    达到一定的VIP等级后，不仅可以享受高比例返水，还可联系在线客服进行申请礼品，礼品不能折算为现金，每个等级的名贵礼品每个账号仅能获得1次，我司对名贵礼品拥有最终解释权
                  </p>
                </div>
                <div className={styles.SfC_m}>
                  <p>我司保留对活动的修改，停止及最终解释权</p>
                  <p>我司保留对活动的修改，停止及最终解释权</p>
                </div>
              </div>
              <div
                onClick={() => {
                  goTop();
                }}
                className={styles.oh9XI}
              >
                回到顶部
              </div>
            </div>
          </div>
        </div>
        <Mask
          className='bottom-action-sheet-mask'
          visible={show}
          onMaskClick={() => setShow(false)}
          getContainer={() => {
            return document.getElementById('root') as HTMLElement;
          }}
        />
      </div>
    </div>
  );
};
export default Vip;
