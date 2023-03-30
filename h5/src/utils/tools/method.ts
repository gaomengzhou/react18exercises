import { useEffect, useState } from 'react';
import { Zlib } from 'zlibt';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { store } from '@/redux/store';
import { NumOrStrType, ObjType } from '@/types/Common';
import indexData from '@/redux/index/slice';
import { toast } from '@/utils/tools/toast';

// 到顶部
export const scrollToTop = () => {
  (document.querySelector('.scroll-body-main') as HTMLDivElement).scrollTop = 0;
};
export const setLoadingStatus = (status: boolean) => {
  /*   const myLoading = React.createElement(
    'div',
    {
      id: 'my-loading',
      visible: store.getState().indexData.showBetVisible,
    },
    React.createElement(
      Mask,
      null,
      React.createElement(
        'div',
        { className: 'bet-loading-content' },
        React.createElement(
          'div',
          { className: 'loading' },
          React.createElement('img', { src: loading, alt: 'logo' })
        )
      )
    )
  );
  const root = ReactDOM.createRoot(
    document.querySelector('#root') as HTMLElement
  );
  root.render(myLoading); */
  store.dispatch(indexData.actions.setBetVisible(status));
};

// 判断当前设备是ios还是安卓
export const appIsAndroidOrIOS = () => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) {
    return 'android';
  }
  if (isiOS) {
    return 'ios';
  }
  return false;
};

/** 队列存储中心 */
const uniqueQueueStore: any = {};

/**
 * 等待N秒后再走下一步
 * @param delay 要等待的秒数
 */
export const sleep = (delay = 1000): Promise<boolean> =>
  new Promise((resolve): void => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });

// 防抖
export const useDebounce = <T>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    // 每次在value变化以后，设置一个定时器
    const timeout = setTimeout((): void => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

// 函数节流
export const useThrottleFn = () => {
  const [flag, setFlag] = useState(true);
  return async <T>(fn: () => T, delay = 1000) => {
    if (!flag) return toast.show({ content: '你点的太快了!' });
    fn();
    setFlag(false);
    await sleep(delay);
    setFlag(true);
  };
};

/**
 * 获取进程队列
 * @param uniqueQueueName 队列名称
 * @return 返回队列实例
 */
export function getUniqueQueue(uniqueQueueName: string) {
  if (!uniqueQueueStore[uniqueQueueName]) {
    uniqueQueueStore[uniqueQueueName] = (() => {
      let finish;
      const p: any = new Promise((resolve) => {
        finish = resolve;
      });
      p.finish = finish;
      return p;
    })();
  }
  return uniqueQueueStore[uniqueQueueName];
}

/** 字符串转成unit8Array */
export const stringToUint8Array = (str: string) => {
  const arr = [];
  for (let i = 0, j = str.length; i < j; i += 1) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
};

/** unit8ArrayToString */
export const Uint8ArrayToString = (fileData: Uint8Array) => {
  let dataString = '';
  for (let i = 0; i < fileData.length; i += 1) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString;
};
/**
 * 加密
 * @param entryStr 待加密正文
 * @param aesSecretKey 键默认值"aesSecret"
 * @return 加密正文
 */
export const toEncrypt = (entryStr: string, aesSecretKey = 'aesSecret') => {
  const config: any = {};
  const aesSecret = config[aesSecretKey];
  const key = CryptoJS.enc.Utf8.parse(aesSecret || `AK1234567890OK03`);
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  const encrypt = CryptoJS.AES.encrypt(entryStr, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypt.toString();
};

/** 解压缩 */
export const zlibDecompress = (bodyJson: string) => {
  try {
    const byteArray = stringToUint8Array(bodyJson);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const inflate = new Zlib.Inflate(byteArray);
    const decompressResult = inflate.decompress();
    return decodeURIComponent(
      Uint8ArrayToString(decompressResult).replace(/\+/g, ' ')
    );
  } catch (err) {
    console.log('解压失败', err);
  }
};

/**
 * 解密
 * @param decryptStr 待解密正文
 * @param aesSecretKey 键默认值"aesSecret"
 * @return 解密正文
 */
export const toDecrypt = (decryptStr: string, aesSecretKey = 'aesSecret') => {
  const config: any = {};
  const aesSecret = config[aesSecretKey];
  const ciphertext = CryptoJS.enc.Base64.parse(decryptStr);
  const key = CryptoJS.enc.Utf8.parse(aesSecret || `AK1234567890OK03`);
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  // tslint:disable no-object-literal-type-assertion
  const encryptedMessage = { ciphertext } as any;
  let result: any = CryptoJS.AES.decrypt(encryptedMessage, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  if (config.enableEncrypt && +$env.REACT_APP_GZIP_ENABLED === 1) {
    result = zlibDecompress(result);
  }

  return result;
};

/** 压缩 */
export const zlibCompress = (bodyJson: string) => {
  const byteArray = stringToUint8Array(encodeURIComponent(bodyJson));
  const deflate = new Zlib.Deflate(byteArray, {
    compressionType: 1,
  });
  // 压缩
  const compressedByteArray = deflate.compress();
  return toEncrypt(Uint8ArrayToString(compressedByteArray));
};

export const toGenerateSign = (
  requestEntity: any,
  aesSecretKey = 'aesSecret'
) => {
  const { signSecret = '', enableEncrypt = false } = {};
  const { platformId, apiName, callTime, token, clientType } =
    requestEntity.header;
  if (enableEncrypt && typeof requestEntity.body !== 'string') {
    const jsonStr = JSON.stringify(requestEntity.body);
    requestEntity.body =
      +requestEntity.header.gzipEnabled === 1
        ? zlibCompress(jsonStr)
        : toEncrypt(jsonStr, aesSecretKey);
  }
  const bodyJson = requestEntity.body;
  const str =
    clientType +
    platformId +
    apiName +
    token +
    callTime +
    bodyJson +
    signSecret;
  return CryptoJS.MD5(str).toString();
};

export const isLogin = (): boolean => {
  const token = window.localStorage.getItem('token') || '';
  return token || store.getState().indexData.userinfo.token;
};

// 未登录弹框
export const showNotLoggedInPopup = () => {
  store.dispatch(indexData.actions.setNotLoggedIn(true));
};
export const setLoginStatus = (status: boolean) => {
  /*   const myLoading = React.createElement(
    'div',
    {
      id: 'my-loading',
      visible: store.getState().indexData.showBetVisible,
    },
    React.createElement(
      Mask,
      null,
      React.createElement(
        'div',
        { className: 'bet-loading-content' },
        React.createElement(
          'div',
          { className: 'loading' },
          React.createElement('img', { src: loading, alt: 'logo' })
        )
      )
    )
  );
  const root = ReactDOM.createRoot(
    document.querySelector('#root') as HTMLElement
  );
  root.render(myLoading); */
  store.dispatch(indexData.actions.setVisible(status));
};
export const newValidatorPassword = (
  value: string
): { pass: boolean; name: string }[] => {
  // const RATE = [
  //   { pass: true, name: '数字' },
  //   { pass: true, name: '字母' },
  //   { pass: false, name: '字符' },
  // ];
  const currentRate = [];
  if (value.length < 8) return [];
  const abcABC: string = value.replace(/[^a-zA-Z]/g, '');
  const num = value.replace(/\D/g, '');
  // eslint-disable-next-line no-useless-escape
  const symbol = value.match(/[^\d|^\[a-zA-Z\]|^\[\u4e00-\u9fa5\]]/g);
  // eslint-disable-next-line no-unused-expressions
  abcABC.length > 0
    ? currentRate.push({ pass: true, name: '字母' })
    : currentRate.push({ pass: false, name: '字母' });
  // eslint-disable-next-line no-unused-expressions
  num.length > 0
    ? currentRate.push({ pass: true, name: '数字' })
    : currentRate.push({ pass: false, name: '数字' });
  // eslint-disable-next-line no-unused-expressions
  symbol && symbol.length
    ? currentRate.push({ pass: true, name: '字符' })
    : currentRate.push({ pass: false, name: '字符' });
  // if(abcABC.length === 0 )
  return currentRate;
};

export const validatorPassword = (value: string) => {
  // const RATE = ['弱', '中', '强'];
  let score = 0;
  let ispass = false;
  const params = {
    passwordLength: 0,
    passwordScore: 0,
    alphabetLength: 0,
    alphabetScore: 0,
    numberLength: 0,
    numberScore: 0,
    symbolLength: 0,
    symbolScore: 0,
    extra: 0,
  };

  if (value.length === 0) return false;
  // 密码长度  5分:小于等于8个字符  10分:8到10字符  25分:大于等于10个字符
  params.passwordLength = value.length;
  if (params.passwordLength < 8) return false;
  if (!(/[a-z]+/g.test(value) && /[A-Z]+/g.test(value))) {
    return false;
  }
  // if (/[A-Z]+/g.test(value)) {
  //   console.log('大写', value);
  // }
  params.passwordScore =
    params.passwordLength > 10 ? 15 : params.passwordLength >= 8 ? 15 : 5;
  // 字母   0分:没有字母  10分:全都是小（大）写字母  20分:大小写混合字母
  const abcABC = value.replace(/[^a-zA-Z]/g, '');
  params.alphabetScore =
    abcABC.length === 0
      ? 0
      : /^[a-z]+$/.test(abcABC) || /^[A-Z]+$/.test(abcABC)
      ? 1
      : /^[a-zA-Z]+$/.test(abcABC)
      ? 25
      : 0;
  // 数字个数 0分:没有数字  10分:大等于1个数字
  params.numberLength = value.replace(/\D/g, '').length;
  params.numberScore =
    params.numberLength === 0 ? 0 : params.numberLength >= 1 ? 10 : 0;
  // 符号个数  0分:没有符号  10分:1个符号   25分:大于1个符号小于10个符号
  params.symbolLength = value.replace(/[0-9a-zA-Z]/g, '').length;
  params.symbolScore =
    params.symbolLength === 0
      ? 0
      : params.symbolLength === 1
      ? 20
      : params.symbolLength > 1 && params.symbolLength < 10
      ? 25
      : 0;
  // 额外奖励  2分:字母和数字  3分:字母、数字和符号  5分:大小写字母、数字和符号
  params.extra =
    abcABC.length === 0
      ? 0
      : /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)[A-Za-z0-9]+$/.test(value)
      ? 2
      : /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![\W_]+$)[a-z0-9\W_]+$/.test(
          value
        )
      ? 3
      : /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![\W_]+$)[A-Z0-9\W_]+$/.test(
          value
        )
      ? 3
      : /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![\W_]+$)[a-zA-Z0-9\W_]+$/.test(
          value
        )
      ? 5
      : 0;
  score =
    params.passwordScore +
    params.alphabetScore +
    params.numberScore +
    params.symbolScore +
    params.extra;

  switch (true) {
    case score >= 80:
      ispass = true;
      break;
    case score > 45:
      ispass = true;
      break;
    case score >= 0:
      ispass = true;
      break;
    default:
      ispass = false;
  }

  return ispass;
};

export const broseClientType = () => {
  const broseClientWidth = document.documentElement.clientWidth;
  return broseClientWidth < 960 ? '3' : '4';
};

// 是不是PC的分辨率
export const isPcClient = (): boolean => {
  const broseClientWidth = document.documentElement.clientWidth;
  return broseClientWidth > 960;
};

/**
 * 输出日志（开发/内部生产）
 * @param logs 输出日志
 */
export const log = (...logs: any[]) => {
  const logger = console;
  if (process.env.NODE_ENV !== 'production') {
    if (logger && logger.log) logger.log(...logs);
  }
};

/**
 * 输出日志（开发/内部生产）
 * @param logs 输出日志
 */
log.warn = (...logs: any[]) => {
  const logger = console;
  if (process.env.NODE_ENV !== 'production') {
    if (logger && logger.warn) logger.warn(...logs);
  }
};
/**
 * 输出日志（开发/内部生产）
 * @param logs 输出日志
 */
log.error = (...logs: any[]) => {
  const logger = console;
  if (process.env.NODE_ENV !== 'production') {
    if (logger && logger.error) logger.error(...logs);
  }
};

/**
 * 可以序列化对象，深层次拷贝
 * @param serializeObj 序列化对象
 * @return 序列化对象
 */
export function serialize(serializeObj: any) {
  return JSON.parse(JSON.stringify(serializeObj));
}

/**
 * 倒计时
 * @param date 时间戳
 */
export const countdown = (date: NumOrStrType) => {
  const time = Number(date);
  if (time < 0) return false;
  let min = String((time / 1000 / 60) % 60).split('.')[0];
  let s = String((time / 1000) % 60).split('.')[0];

  if (min.length === 1) {
    min = 0 + min;
  }
  if (s.length === 1) {
    s = 0 + s;
  }
  return `${min[0]}${min[1]}:${s[0]}${s[1]}`;
};

export const qsJson = (search: string) => {
  if (!search) return {};
  let arr = [] as any; // 存储参数的数组

  const res = {} as any; // 存储最终JSON结果对象
  arr = search.split('?')[1].split('&'); // 获取浏览器地址栏中的参数

  for (let i = 0; i < arr.length; i += 1) {
    // 遍历参数

    if (arr[i].indexOf('=') !== -1) {
      // 如果参数中有值
      const str = arr[i].split('=');
      const [, value] = str;
      res[str[0]] = value;
    } else {
      // 如果参数中无值

      res[arr[i]] = '';
    }
  }

  return res;
};

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @return 已处理的数字数据
 */
export const toFixed = (
  number: number | string,
  fractionDigits = 2,
  isrounded = true
) => {
  let value = +number || 0;
  if (!value) {
    return 0;
  }
  const digits = +fractionDigits || 2;
  let numstr = `${number}`;
  const index = numstr.indexOf('.');
  if (index === 0) {
    numstr = `0${numstr}`;
  }
  let raw = 0;
  if (index !== -1) {
    raw = numstr.length - 1 - index;
    value = +numstr.replace(/\./g, '');
  }
  if (raw > digits) {
    value /= 10 ** (raw - digits);
  } else if (raw < digits) {
    value *= 10 ** (digits - raw);
  }
  return (isrounded ? Math.round(value) : Math.floor(value)) / 10 ** digits;
};

export const postData = async (url = '', data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

// 获取每个号码出现次数
const getArrItemNum = (arr: string[]) => {
  const obj: any = {};
  arr.forEach((str) => {
    if (obj[str]) {
      obj[str] += 1;
    } else {
      obj[str] = 1;
    }
  });
  return obj;
};

// 计算冷热
export const getHotAndCold = (list: []) => {
  let arr = '';
  list.forEach((item: ObjType) => {
    const str = `${item.openNumber},`;
    arr += str;
  });
  const resultObj = arr.slice(0, arr.length - 1).split(',');
  // 移除号码是 'null' 的数组成员
  for (let i = 0; i < resultObj.length; i += 1) {
    if (resultObj[i] === 'null') {
      resultObj.splice(i, 1);
    }
  }
  const result = getArrItemNum(resultObj);
  const resultList = Object.keys(result).sort((a, b) => {
    return result[b] - result[a];
  });
  const hot = resultList.slice(0, 5);
  const cold = resultList.slice(-5);
  return {
    hot,
    cold,
  };
};

// 计算结果是 Heads or Evens or Tails
export const calculationResults = (lotteryInfo: ObjType) => {
  let a = 0;
  let b = 0;
  let whoIsWin = '';
  const arr =
    lotteryInfo.openNumber?.split(',') ||
    '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20'.split(',');
  arr.forEach((item: string) => {
    if (+item <= 40) {
      a += 1;
    } else {
      b += 1;
    }
    if (a > b) {
      whoIsWin = 'Heads wins';
    }
    if (a < b) {
      whoIsWin = 'Tails wins';
    }
    if (a === b) {
      whoIsWin = 'Evens wins';
    }
  });
  return whoIsWin;
};

// 返回背景颜色
export const getBgColor = (no: number) => {
  let color: string;
  if (no <= 10) {
    color = '#c5202b';
  } else if (no <= 20) {
    color = '#006bb5';
  } else if (no <= 30) {
    color = '#00843d';
  } else if (no <= 40) {
    color = '#f9a800';
  } else if (no <= 50) {
    color = '#b42996';
  } else if (no <= 60) {
    color = '#f05000';
  } else if (no <= 70) {
    color = '#8eaac0';
  } else {
    color = '#523191';
  }
  return color;
};

// formatMoney函数

const formatToFixed = (money: string | number, decimals = 2) => {
  return (
    Math.round((parseFloat(String(money)) + Number.EPSILON) * 10 ** decimals) /
    10 ** decimals
  ).toFixed(decimals);
};

export const formatMoney = (
  money: string | number,
  symbol = '',
  decimals = 2
) => {
  let result = `${symbol}${parseFloat(
    formatToFixed(String(money), decimals)
  ).toLocaleString('zh', {
    maximumFractionDigits: decimals,
    useGrouping: true,
  })}`;
  const arr = result.split('.');
  if (arr.length === 1) {
    result += '.00';
  } else if (arr.length === 2 && arr[1].length === 1) {
    result += '0';
  }
  return result;
};

// 截取卡号后四位
export const cardNumberFormat = (cardNumber: string) => {
  return cardNumber.substring(cardNumber.length - 4);
};

// 获取用户详细信息
export const getUserDetail = async () => {
  const {
    userinfo: { token },
    auxiliaryCode,
  } = store.getState().indexData;
  if (!token) return;
  const detailRes = await $fetch.post('/lottery-api/user/getUserDetail', {
    auxiliaryCode,
    appVersion: $env.REACT_APP_API_VERSION,
    deviceCode: 'H5',
  });
  if (!detailRes.success) return toast.fail(detailRes);
  store.dispatch(indexData.actions.setUserinfo(detailRes.data));
};

// 查询日期
class FormatDate {
  dayjs = dayjs();

  // 今天
  today = () => {
    return {
      startTime: this.dayjs.format('YYYY-MM-DD 00:00:00'),
      endTime: this.dayjs.format('YYYY-MM-DD 23:59:59'),
    };
  };

  // 昨天
  yesterday = () => {
    return {
      startTime: this.dayjs.add(-1, 'day').format('YYYY-MM-DD 00:00:00'),
      endTime: this.dayjs.add(-1, 'day').format('YYYY-MM-DD 23:59:59'),
    };
  };

  // 近7天
  week = () => {
    return {
      startTime: this.dayjs.add(-7, 'day').format('YYYY-MM-DD 00:00:00'),
      endTime: this.dayjs.format('YYYY-MM-DD 23:59:59'),
    };
  };

  // 近30天
  month = () => {
    return {
      startTime: this.dayjs.add(-30, 'day').format('YYYY-MM-DD 00:00:00'),
      endTime: this.dayjs.format('YYYY-MM-DD 23:59:59'),
    };
  };
}
// 查询日期
export const formatDate = new FormatDate();

/**
 * 比较两个值是否相等
 * @param target 目标对象
 * @param source 源对象
 * @return 是否相等
 */
export const equals = <T, S>(target: T, source: S) => {
  try {
    return JSON.stringify(target) === JSON.stringify(source);
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 *  获取时间区间
 * @param type 1:今天|2:昨天|3:近7天|4:近30天
 */
export const timeInterval = (type: number) => {
  switch (type) {
    case 1:
      return formatDate.today();
    case 2:
      return formatDate.yesterday();
    case 3:
      return formatDate.week();
    case 4:
      return formatDate.month();
    default:
      return formatDate.today();
  }
};

export const routerCache = (pathname: string) => {
  const cache = window.sessionStorage.getItem('routerCache');
  return [cache === pathname, false];
};

/* export const routerCache = (cb: any, remove: any) => {
  cb().forEach((item: ObjType) => {
    console.log(item);
    remove(item.name);
  });
  return [cb().name, false];
}; */
