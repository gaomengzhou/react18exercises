import { FC, SyntheticEvent, MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpinLoading } from 'antd-mobile';
import { changeIsShowWalletAction } from '@/redux/wallet';
import { useAppDispatch, useSelector } from '@/redux/hook';
import { indexData, queryUserAllVirtualWallet } from '@/redux/index/slice';
import USDTLogo from '../../images/icon-交易大厅-USDT.png';
import GIFTLogo from '../../images/icon-BFG.png';
import questionMark from '@/assets/images/index/疑问.png';
import styles from './Recharge.module.scss';
import { ObjType } from '@/types/Common';
import CustomImg from '@/components/customImg/CustomImg';

const Recharge: FC = () => {
  const {
    currWallet,
    walletList: { list, loading },
    inGame,
  } = useSelector((s) => s.indexData);

  const dispatch = useAppDispatch();
  const [active, setActive] = useState(false);
  const { t } = useTranslation();
  const withDrawCoinCode = useSelector(
    (states) => states.wallet.withDrawCoinCode
  );
  useEffect(() => {
    dispatch(queryUserAllVirtualWallet());
  }, [dispatch, withDrawCoinCode]);

  const onSelects = (e: SyntheticEvent, obj: ObjType) => {
    e.stopPropagation();
    dispatch(indexData.actions.selectWallet(obj));
    setActive(false);
  };

  const reChangeClick = () => {
    dispatch(changeIsShowWalletAction(true));
  };

  // 点击问号
  const handleQuestionMark = (e: MouseEvent<HTMLImageElement, Event>) => {
    e.stopPropagation();
    setActive(false);
    dispatch(indexData.actions.setShowCoinQuestionPopup(true));
  };
  return (
    <div className={`${styles.recharge}`}>
      {loading ? (
        <div className={`${loading && styles.loading}`}>
          <SpinLoading style={{ '--size': '18px' }} />
        </div>
      ) : (
        <div
          className={styles['recharge-left']}
          onClick={() => {
            if (inGame) return;
            setActive(!active);
          }}
        >
          <div>
            <CustomImg
              src={
                /^USDT$/i.test(currWallet.currencyTypeName)
                  ? USDTLogo
                  : GIFTLogo
              }
              alt='logo'
            />
            <p>{inGame ? t('header.inGame') : currWallet.balance}</p>
          </div>
          <i className={`${active && styles['active-i']}`} />
        </div>
      )}
      <div className={`${styles.selects} ${active && styles['show-selects']}`}>
        {list.map((item: ObjType) => (
          <div
            className={styles.logoBox}
            key={item.id}
            onClick={(e) => onSelects(e, item)}
          >
            <div>
              <CustomImg
                src={
                  /^gift$/i.test(item.currencyTypeName) ? GIFTLogo : USDTLogo
                }
                alt='logo'
              />
              <span>{item.currencyTypeName}</span>
              {item.currencyDetailVO && (
                <CustomImg
                  src={questionMark}
                  className={styles.question}
                  alt='questionMark'
                  onClick={handleQuestionMark}
                />
              )}
            </div>
            <div className={styles.balance}>
              <p>{item.balance}</p>
              {item.currencyDetailVO && (
                <p className={styles.lock}>{item.lockBalance}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button onClick={reChangeClick}>{t('wallet.deposit')}</button>
    </div>
  );
};
export default Recharge;
