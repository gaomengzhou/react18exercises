import CryptoJS from 'crypto-js';
import pako from 'pako';
import { Zlib } from 'zlibt';
import { store } from '@/redux/store';
import { zlibDecompress } from '../tools/method';

/** 自定义：请求头 */
export interface AkHeader {
  /** 平台编号 */
  platformId: string;
  /** 客户端类型 1: android | 2: ios | 3:h5  | 4: pc */
  clientType: 1 | 2 | 3 | 4 | number;
  /** 用户令牌 */
  token: string;
  /** 接口版本 */
  apiVersion: number;
  /** 调用时间(请求发送) */
  callTime?: number;
  /** 扩展头部 */
  [key: string]: any;
}

/** 请求参数 */
export interface AkRequestBody {
  /** 请求扩展参数 */
  [key: string]: any;
}

/** 请求响应对象响应体 */
export interface AkResponseBody {
  header: any;
  success: boolean;
  message: string;
  code: number;
  data?: any;
}

/** 响应自定义响应头 */
export interface AkResponseBodyHeader extends AkHeader {
  /** 服务端接口返回的时间 */
  callTime: number;
}

/** 请求体 */
export interface AkRequest {
  /** 请求参数：请求 */
  header: AkHeader;
  /** 请求参数：请求体 */
  body: any;
}

export interface AkResponse {
  /** 请求参数：请求 */
  header: AkHeader;
  /** 请求参数：请求体 */
  body: AkResponseBody;
}

/** 字符串转成unit8Array */
export const stringToUint8Array = (str: string): Uint8Array => {
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
 * 解密
 * @param decryptStr 待解密正文
 * @param aesSecretKey 键默认值"aesSecret"
 * @return 解密正文
 */
export const toDecrypt = (
  decryptStr: string,
  aesSecretKey = 'aesSecret'
): string | any => {
  const config = store.getState().indexData.cryptoConfig || {};
  const aesSecret = config[aesSecretKey];
  const ciphertext = CryptoJS.enc.Base64.parse(decryptStr);
  const key = CryptoJS.enc.Utf8.parse(aesSecret || `AK1234567890OK03`);
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  // tslint:disable no-object-literal-type-assertion
  const encryptedMessage = { ciphertext } as CryptoJS.lib.CipherParams;
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

/**
 * 加密
 * @param entryStr 待加密正文
 * @param aesSecretKey 键默认值"aesSecret"
 * @return 加密正文
 */
export const toEncrpt = (
  entryStr: string,
  aesSecretKey = 'aesSecret'
): string => {
  const config = store.getState().indexData.cryptoConfig || {};
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
/** 压缩 */
const zlibCompress = (bodyJson: string): string => {
  const byteArray = stringToUint8Array(encodeURIComponent(bodyJson));
  const deflate = new Zlib.Deflate(byteArray, {
    compressionType: 1,
  });
  // 压缩
  const compressedByteArray = deflate.compress();
  return toEncrpt(Uint8ArrayToString(compressedByteArray));
};

/**
 * MQTT解密通道
 * @param decryptStr 待解密正文
 * @param aesSecretKey 键默认值"aesSecret"
 * @return 解密正文
 */
export const toDecryptMqtt = (
  decryptStr: string,
  aesSecretKey = 'aesSecret'
): string | any => {
  const config = store.getState().indexData.cryptoConfig || {};
  const aesSecret = config[aesSecretKey];
  const ciphertext = CryptoJS.enc.Base64.parse(decryptStr);
  const key = CryptoJS.enc.Utf8.parse(aesSecret || `AK1234567890OK03`);
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  // tslint:disable no-object-literal-type-assertion
  const encryptedMessage = { ciphertext } as CryptoJS.lib.CipherParams;
  return CryptoJS.AES.decrypt(encryptedMessage, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
};

/**
 * 生成请求参数签名
 * 签名生成规则 "apiName + bodyParamsStr + callTime + secretForSign + token + clientType"
 * @param requestEntity 请求对象
 * @param aesSecretKey 键默认值"aesSecret"
 * @return 签名字符串
 */
export const toGenerateSign = (
  requestEntity: AkRequest,
  aesSecretKey = 'aesSecret'
) => {
  const { signSecret = '', enableEncrypt = false } =
    store.getState().indexData.cryptoConfig || {};
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

/**
 * 验证响应结果签名是否正确
 * @param response 响应体
 * @return 是否签名正确
 */
export const toVerifySign = (response: AkResponse) => {
  const { header, body } = response;
  if (!header.apiName || !header.callTime || !header.token) {
    console.warn('验证签名失败', { header, body });
    return false;
  }
  // 生成md5参数签名，验证包装响应体是否篡改
  const sign = toGenerateSign({ header, body });
  if (sign === header.sign) {
    return true;
  }
  console.warn('验证签名失败', { header, body });
  return false;
};

/** 压缩 */
// protected gzip(bodyJson: string) {
//   const str = encodeURIComponent(bodyJson);
//   const output = pako.gzip(str, { to: "string" });
//   return this.toEncrpt(output);
// }

/** 解压缩 */
// protected unGzip(str: string) {
//   const binData = this.stringToUint8Array(str);
//   const data = pako.inflate(binData);
//   // @ts-ignore
//   const output = String.fromCharCode.apply(null, new Uint16Array(data));
//   return decodeURIComponent(output);
// }

/** MQTT压缩 */
export const gzipMqtt = (bodyJson: any) => {
  try {
    const data = pako.gzip(bodyJson);
    return Uint8ArrayToString(data);
  } catch (e) {
    console.log('压缩失败===>', e);
  }
};

/** MQTT解压缩 */
export const unGzipMqtt = (str: string) => {
  try {
    const binData = stringToUint8Array(str);
    return pako.inflate(binData, { to: 'string' });
  } catch (e) {
    console.error('解压失败====>', e);
  }
};
