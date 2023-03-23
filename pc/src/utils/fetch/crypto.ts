/* eslint-disable @typescript-eslint/no-non-null-assertion */
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import { AxiosRequestConfig } from 'axios';
import { broseClientType, getUniqueQueue } from '../tools/method';
import { NumOrStrType } from '@/types/Common';
import { store } from '@/redux/store';
import indexData from '@/redux/index/slice';

/** 自定义：请求头 */
export interface AkHeader {
  /** 平台编号 */
  platformId: NumOrStrType;
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

/** 自定义头部 */
export interface AkFetchHeader extends AkHeader {
  /** 接口名称 */
  apiName: string;
  /** 调用时间(客户端请求时间) */
  callTime: number;
  /** 签名 */
  sign?: string;
}
export const getSecretFn = async () => {
  // VUE_APP_XXX 是解密得到的字段与VUE.JS无关.
  const rsaPublicKey: any = $env.VUE_APP_CONFIG_RSA_PAIR2_PUBLIC_KEY;
  const rsaPrivateKey: any = $env.VUE_APP_CONFIG_RSA_PAIR1_PRIVATE_KEY;
  const clientType = broseClientType();
  const platformId = process.env.REACT_APP_PLATFORM_ID || '1300';
  const apiVersion = process.env.REACT_APP_API_VERSION;
  const apiName = '/common-api/system/getSecret';
  const token = '';
  const callTime = Date.now();
  const str = clientType + platformId + apiName + token + callTime;
  let rsa = new JSEncrypt({
    default_key_size: '2048',
    default_public_exponent: '10001',
  });

  rsa.setPublicKey(rsaPublicKey);
  const rsaStr = rsa.encrypt(str);
  const config: AxiosRequestConfig = { headers: {} };
  config.url = '/common-api/system/getSecret';
  config.headers!['content-type'] = 'application/json;charset=UTF-8';

  // 每次请求生成一个相对唯一的12位UUID
  const reqTidUuid = [0, 1]
    .map(() => Math.random().toString(16).slice(2))
    .join('')
    .slice(0, 12);

  // andy 日志系统，添加真实请求头参数 reqTid, 格式 `$datetime-uuid(12)`
  config.headers!.reqTid = `${callTime}-${reqTidUuid}`;
  config.method = 'post';
  const header: AkFetchHeader = {
    apiName,
    platformId,
    token,
    clientType: Number(clientType),
    callTime,
    sign: 'noSign',
    apiVersion: Number(apiVersion),
  };
  const params = { header, body: { conventionValue: rsaStr } };
  config.data = JSON.stringify(params);
  const res = await $fetch.send(config);
  rsa = new JSEncrypt({
    default_key_size: '2048',
    default_public_exponent: '10001',
  });
  rsa.setPrivateKey(rsaPrivateKey);
  const {
    aesSecret,
    signSecret,
    mqttAesSecret,
    enableEncrypt = false,
  } = res.data;
  try {
    res.data.aesSecret = rsa.decrypt(aesSecret);
    res.data.mqttAesSecret = rsa.decrypt(mqttAesSecret);
    res.data.signSecret = rsa.decrypt(signSecret);
    const cryptoConfig = { ...res.data, enableEncrypt };
    store.dispatch(indexData.actions.setUserinfo(cryptoConfig));
    store.dispatch(indexData.actions.setCryptoConfig(cryptoConfig));
    getUniqueQueue('getSecret').finish(cryptoConfig);
  } catch (error) {
    console.log('解析服务配置失败', error);
  }
  return res;
};

export const actionCryptoInfo = async () => {
  const res = await getSecretFn();
  res.sercretFinished = true;
};

(async () => {
  try {
    const ciphertext = CryptoJS.enc.Base64.parse($env.REACT_APP_CONFIG_PEM_STR);
    const key = CryptoJS.enc.Utf8.parse($env.REACT_APP_CONFIG_PEM_KEY);
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
    const encryptedMessage = { ciphertext } as CryptoJS.lib.CipherParams;
    // 配置字符串
    const configStr = CryptoJS.AES.decrypt(encryptedMessage, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    // 配置
    const config = JSON.parse(configStr || '{}');
    // 合并配置
    Object.assign($env, config);
    await actionCryptoInfo();
  } catch (error) {
    console.error('(AES)解析加密失败', error);
    setTimeout(() => {
      throw new Error('(AES)解析加密失败');
    }, 0);
  }
})();

(() => {
  try {
    // 加密配置KEY
    const decryptKey = $env.REACT_APP_CONFIG_ENCRYPTED_KEY;
    // 加密配置字符串
    const ciphertext = CryptoJS.enc.Base64.parse(
      $env.REACT_APP_CONFIG_ENCRYPTED_STR
    );
    const encryptedMessage = { ciphertext };
    const secretPassphrase = CryptoJS.enc.Utf8.parse(decryptKey);
    const option = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
    const decrypted = (CryptoJS.DES.decrypt as any)(
      encryptedMessage,
      secretPassphrase,
      option
    );
    // 配置字符串
    const configStr = decrypted.toString(CryptoJS.enc.Utf8);
    // 配置
    const config = JSON.parse(configStr || '{}');
    // 合并配置
    Object.assign($env, config);
  } catch (error) {
    console.error('(DES)解析加密失败', error);
    setTimeout(() => {
      throw new Error('(DES)解析加密失败');
    }, 0);
  }
})();
