import { Swiper, SwiperSlide } from 'swiper/react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from '@/redux/hook';
// import indexData from '@/redux/index/slice';
import Header from '@/components/header/Header';
// import avatar from '@/assets/images/vip/头像1.png';
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
  const [arr, setArr] = useState<Item[]>([]);
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
    console.log(res1);
    // this.inputObj.yzm = '';
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
                {userinfo.nickName}
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
                      </i>{' '}
                      / 1000
                    </span>
                  </div>
                  <div>
                    <span>
                      <i className={`${styles['vip-YCT5L']}`}>
                        V{info.currentVipLevel + 1}
                      </i>
                    </span>
                  </div>
                </div>
                <div className={`${styles['vip-ohRa1']}`}>
                  <span style={{ width: '4%' }}></span>
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
                        <SwiperSlide
                          key={index}
                          className={styles.activeSwiper}
                        >
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
                                <p
                                  className={`${styles['vip-aCW0F']} ${styles['vip-a1wrS']}`}
                                ></p>
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
                                <p
                                  className={`${styles['vip-aCW0F']} ${styles['vip-a1wrS']}`}
                                ></p>
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
                  {/* <li></li>
                  <li></li>
                  <li className={`${styles['vip-main-dtExc']}`}></li>
                  <li className={`${styles['vip-main-VFAMJ']}`}></li>
                  <li className={`${styles['vip-main-vXhjb']}`}></li>
                  <li className={`${styles['vip-main-VFAMJ']}`}></li>
                  <li className={`${styles['vip-main-dtExc']}`}></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li> */}
                </ul>
              </div>
              <span>VIP{arr.length - 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vip;
