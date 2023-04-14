import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, SwipeAction } from 'antd-mobile';
import Header from '@/components/header/Header';
import styles from './ManagePaymentMethods.module.scss';
import noData from '@/assets/images/managePaymentMethods/icon_nobank.png';
import { ObjType } from '@/types/Common';
import { cardNumberFormat } from '@/utils/tools/method';
import { toast } from '@/utils/tools/toast';

const dotList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
const ManagePaymentMethods: FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const ref = useRef<any[]>([]);
  const [allUserWithdrawType, setAllUserWithdrawType] = useState<{
    realName: string;
    bankCards: ObjType[];
    virtualCurrency: ObjType[];
  }>({
    realName: '',
    bankCards: [],
    virtualCurrency: [],
  });
  // 给手动创建的删除图标用的数据
  const userWithdraw = useRef<{
    realName: string;
    bankCards: ObjType[];
    virtualCurrency: ObjType[];
  }>({
    realName: '',
    bankCards: [],
    virtualCurrency: [],
  });

  // 获取用户提现信息(卡片,钱包等)
  const getUserWithdrawInfo = useCallback(async () => {
    toast.loading();
    const res = await $fetch.post(
      '/lottery-api/userBankCard/queryAllUserWithdrawType'
    );
    toast.clear();
    if (!res.success) return toast.fail(res);
    if (res.data.userWithdrawTypeList.length > 0) {
      const bankCards = res.data.userWithdrawTypeList.filter(
        (item: ObjType) => item.withdrawWay === 1
      );
      const virtualCurrency = res.data.userWithdrawTypeList.filter(
        (item: ObjType) => item.withdrawWay !== 1
      );
      setAllUserWithdrawType((val) => {
        return {
          ...val,
          bankCards,
          virtualCurrency,
          realName: res.data.realName,
        };
      });
      // 给手动创建的删除图标用的数据
      userWithdraw.current = {
        realName: res.data.realName,
        bankCards,
        virtualCurrency,
      };
    }
  }, []);

  // componentDidMount
  useEffect(() => {
    getUserWithdrawInfo();
  }, [getUserWithdrawInfo]);

  // 解绑
  const unBind = useCallback(
    async (item: { id: number; withdrawWay: number; index: number }) => {
      const { id, withdrawWay, index } = item;
      let url = '/lottery-api/userBankCard/unbindUserBankCard';
      switch (withdrawWay) {
        case 1:
          break;
        case 4:
          url = '/lottery-api/userUsdtAccount/unBindUserUsdtAccount';
          break;
        case 7:
          url =
            '/lottery-api/userVirtualCurrencyAccount/unBindUserVirtualCurrencyAccount';
          break;
        default:
          return url;
      }
      toast.loading({ mask: false });
      const res = await $fetch.post(url, {
        id: withdrawWay === 1 || withdrawWay === 4 ? id : null,
        virtualCurrencyAccountId: withdrawWay === 7 ? id : null,
      });
      toast.clear();
      ref.current[index]?.close();
      if (!res.success) {
        ref.current[index]?.close();
        return toast.fail(res);
      }
      await getUserWithdrawInfo();
    },
    [getUserWithdrawInfo]
  );

  // 获取当前数据
  const getCurrData = useCallback(() => {
    if (type === 'bank-cards') return userWithdraw.current.bankCards;
    return userWithdraw.current.virtualCurrency;
  }, [type]);

  // 插入左滑的内容
  const insertEle = useCallback(() => {
    const swipe = document.querySelectorAll('.adm-swipe-action-actions-right');
    const delIcon = document.querySelectorAll('.icon-shanchu');
    for (let i = 0; i < swipe.length; i += 1) {
      if (delIcon.length > 0) {
        swipe[i].removeChild(delIcon[i]);
      }
      const icon = document.createElement('i');
      icon.className = `iconfont icon-shanchu ${styles['custom-i']}`;
      icon.onclick = async (e) => {
        e.stopPropagation();
        await Dialog.confirm({
          className: 'unBindDialog',
          onConfirm: () => {
            unBind({
              id: getCurrData()[i].id,
              withdrawWay: getCurrData()[i].withdrawWay,
              index: i,
            });
          },
          onCancel: () => {
            ref.current[i].close();
          },
          content:
            type === 'bank-cards'
              ? '确认删除该提现银行卡？'
              : '确认删除该提现虚拟币钱包？',
        });
      };
      swipe[i].appendChild(icon);
    }
  }, [getCurrData, type, unBind]);

  const closeOther = (index = -100) => {
    for (let i = 0; i < ref.current.length; i += 1) {
      if (index !== i) ref.current[i]?.close();
    }
  };

  // 插入左滑的内容
  useEffect(() => {
    insertEle();
  }, [allUserWithdrawType, insertEle]);

  const toAddPaymentMethods = () => {
    if (type === 'bank-cards') {
      navigate('/add-bank-cards');
      return;
    }
    navigate('/add-virtual-wallet');
  };

  // 渲染内容
  const renderContent = () => {
    if (allUserWithdrawType.bankCards.length > 0 && type === 'bank-cards') {
      return allUserWithdrawType.bankCards.map((item: ObjType, index) => (
        <SwipeAction
          className={styles.mySwipeAction}
          key={item.id}
          ref={(swipe) => {
            ref.current[index] = swipe;
          }}
          closeOnAction={false}
          closeOnTouchOutside={false}
          rightActions={[
            {
              key: 'delete',
              text: '删除',
              color: 'danger',
              onClick: async (e) => {
                e.stopPropagation();
                await Dialog.confirm({
                  content: '确认删除该提现银行卡？',
                  className: 'unBindDialog',
                  onConfirm: () => {
                    unBind({
                      id: item.id,
                      withdrawWay: item.withdrawWay,
                      index,
                    });
                  },
                  onCancel: () => {
                    ref.current[index].close();
                  },
                });
              },
            },
          ]}
        >
          <div
            className={styles.items}
            onTouchStart={() => closeOther(index)}
            onTouchMove={() => closeOther(index)}
          >
            {item.logoUrl && (
              <div className={styles.itemsLeft}>
                <img src={item.logoUrl} alt='logo' />
              </div>
            )}

            <div className={styles.itemsRight}>
              <p>{item.withdrawName}</p>
              <div>
                {dotList.map((dot) => (
                  <b
                    key={dot}
                    className={`${dot % 4 === 0 && styles.marginB}`}
                  />
                ))}
                <p>{cardNumberFormat(item.withdrawAccount)}</p>
              </div>
            </div>
          </div>
        </SwipeAction>
      ));
    }
    if (
      allUserWithdrawType.virtualCurrency.length > 0 &&
      type !== 'bank-cards'
    ) {
      return allUserWithdrawType.virtualCurrency.map((item: ObjType, index) => (
        <SwipeAction
          className={styles.mySwipeAction}
          key={item.id}
          ref={(swipe) => {
            ref.current[index] = swipe;
          }}
          closeOnAction={false}
          closeOnTouchOutside={false}
          rightActions={[
            {
              key: 'delete',
              text: '删除',
              color: 'danger',
              onClick: async (e) => {
                e.stopPropagation();
                await Dialog.confirm({
                  className: 'unBindDialog',
                  content: '确认删除该提现虚拟币钱包？',
                  onConfirm: () => {
                    unBind({
                      id: item.id,
                      withdrawWay: item.withdrawWay,
                      index,
                    });
                  },
                  onCancel: () => {
                    ref.current[index].close();
                  },
                });
              },
            },
          ]}
        >
          <div
            className={`${styles.items} ${
              type !== 'bank-cards' && styles.virtualItems
            }`}
            onTouchStart={() => closeOther(index)}
            onTouchMove={() => closeOther(index)}
          >
            {item.logoUrl && (
              <div className={styles.itemsLeft}>
                <img src={item.logoUrl} alt='logo' />
              </div>
            )}
            <div className={styles.itemsRight}>
              <p>{item.withdrawName}</p>
              <div className={styles.virtualDiv}>
                <p>{item.withdrawAccount}</p>
              </div>
            </div>
          </div>
        </SwipeAction>
      ));
    }
    return <img className={styles.noData} src={noData} alt='logo' />;
  };
  return (
    <div className={styles.managePaymentMethodsContainer}>
      <Header
        title={type === 'bank-cards' ? '提现银行卡管理' : '提现虚拟币钱包管理'}
        right
        left
      />
      <div
        className={styles.managePaymentMethodsBody}
        onClick={() => closeOther()}
      >
        <div className={styles.managePaymentMethodsContent}>
          {renderContent()}
        </div>
        <div className={styles.managePaymentMethodsBtn}>
          <button onClick={toAddPaymentMethods}>
            {type === 'bank-cards' ? '添加银行卡' : '添加虚拟币钱包'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManagePaymentMethods;
