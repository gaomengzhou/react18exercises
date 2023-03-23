import { FC } from 'react';

import styles from './VirtualCurrencyProtocol.module.scss';
import Header from '@/components/header/Header';
import pro from '@/assets/images/newbie/protocol.7798b204.png';

const VirtualCurrencyProtocol: FC = () => {
  return (
    <div className={`${styles['virtualcurrencyprotocol-container']}`}>
      <Header title='虚拟货币协议' left />
      <div className={styles['virtualcurrencyprotocol-body']}>
        <div className={`${styles['virtualcurrencyprotocol-main']}`}>
          <div className={styles['virtualcurrencyprotocol-LMZw']}>
            <div className={styles['virtualcurrencyprotocol-ysf3F']}>
              <div className={styles['virtualcurrencyprotocol-tKMGq']}>
                <div className={styles['virtualcurrencyprotocol-jieXm']}>
                  在虚拟货币中什么是协议？不同协议的差异在哪里？
                </div>
                <div className={styles['virtualcurrencyprotocol-AIEnA']}>
                  <div className={styles['virtualcurrencyprotocol-CWZjP']}>
                    什么是数字货币？
                  </div>
                  <div className={styles['virtualcurrencyprotocol-CWZjP']}>
                    使用数字币交易平台购买数字币后，将数字币转入平台提供的数字币收款地址，从而进行游戏。
                  </div>
                  <div
                    className={`${styles['virtualcurrencyprotocol-CWZjP']} ${styles['virtualcurrencyprotocol-URj3Q']}`}
                  >
                    注意：
                  </div>
                  <div
                    className={`${styles['virtualcurrencyprotocol-CWZjP']} ${styles['virtualcurrencyprotocol-URj3Q']}`}
                  >
                    平台目前仅支持数字币USDT，常见的USDT协议主要有ERC20,OMNI,TRC,三种协议地址不互通，转账时请务必确认转入转出的地址协议一致；因为协议错误，可能导致充值款项无法找回。
                  </div>
                  <div className={`${styles['virtualcurrencyprotocol-CWZjP']}`}>
                    快速了解三种USDT的常见协议
                  </div>
                  <img
                    className={styles['virtualcurrencyprotocol-KfBz3']}
                    src={pro}
                    alt='协议'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VirtualCurrencyProtocol;
