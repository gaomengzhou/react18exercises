import { useEffect, useState } from 'react';
import { Zlib } from 'zlibt';
import CryptoJS from 'crypto-js';
import { store } from '@/redux/store';
import { NumOrStrType } from '@/types/Common';

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
    if (!flag) return;
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
export const toEncrpt = (entryStr: string, aesSecretKey = 'aesSecret') => {
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
  return toEncrpt(Uint8ArrayToString(compressedByteArray));
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
        : toEncrpt(jsonStr, aesSecretKey);
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
  const userInfo = window.localStorage.getItem('userInfo') || '{}';
  const { token } = JSON.parse(userInfo);
  return token || store.getState().indexData.userinfo.token;
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
      ispass = false;
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
 * 世界杯倒计时
 * @param date 时间戳
 */
export const countdown = (date: NumOrStrType) => {
  const now = new Date().getTime();
  const time = Number(date) - Number(now);
  if (time < 0) return false;
  let day = String(time / 1000 / 3600 / 24).split('.')[0];
  let hour = String((time / 1000 / 3600) % 24).split('.')[0];
  let min = String((time / 1000 / 60) % 60).split('.')[0];
  let s = String((time / 1000) % 60).split('.')[0];
  if (day.length === 1) {
    day = 0 + day;
  }
  if (hour.length === 1) {
    hour = 0 + hour;
  }
  if (min.length === 1) {
    min = 0 + min;
  }
  if (s.length === 1) {
    s = 0 + s;
  }
  // Array [0]:十位 | [1]:个位
  return {
    day: day.split(''),
    hour: hour.split(''),
    min: min.split(''),
    s: s.split(''),
  };
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
