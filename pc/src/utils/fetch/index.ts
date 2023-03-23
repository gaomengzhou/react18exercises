/* eslint-disable prettier/prettier */
import axios from 'axios';
import { store } from '@/redux/store';
import { broseClientType, getUniqueQueue, isLogin } from '../tools/method';
import { toDecrypt, toGenerateSign } from './cryptoZip';

const fetch = axios.create({
  timeout: 1000 * 15,
});

/** 请求配置 */
export class Fetch {
  /** 响应拦截器 */
  public interceptors = [] as any;

  /** 参数配置 */
  protected options = {};

  /**
   * get 请求
   */
  public get(url: string, body?: any, config?: any) {
    let request: any | FormData;
    if (body instanceof FormData) {
      request = body;
    } else {
      request = {
        body: body || {},
        header: {
          apiName: url,
          callTime: Date.now(),
          sign: '',
          gzipEnabled: 0,
          deviceCode: '',
        },
      };
    }
    return this.sendCommon(request, { ...(config || {}), url, method: 'get' });
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param body 请求对象中请求体
   * @param config 请求配置, 等价于axios.config
   * @return 返回响应结果
   */
  public post(url: string, body?: any, config?: any) {
    let request: any | FormData;
    if (body instanceof FormData) {
      request = body;
    } else {
      request = {
        body: body || {},
        header: {
          apiName: url,
          callTime: Date.now(),
          sign: '',
          gzipEnabled: 0,
          deviceCode: store.getState().indexData.auxiliaryCode,
          token: '',
          clientType: broseClientType(),
          languageCode: 'zh_CN',
          platformId: process.env.REACT_APP_PLATFORM_ID || '1300',
        },
      };
    }

    return this.sendCommon(request, { ...(config || {}), url, method: 'post' });
  }

  /**
   *
   * @param config axios配置
   * @param opts 配置
   */
  // eslint-disable-next-line no-unused-vars
  public async send(config: any, opts: { enableCrypto?: boolean } = {}) {
    if (typeof opts.enableCrypto !== 'boolean') {
      opts.enableCrypto = true;
    }
    const xhr = await fetch(config).then(
      (res) => {
        return res;
      },
      (res) => {
        return res.response || res;
      }
    );
    // if (!xhr.data || typeof xhr.data !== "object") xhr.data = { code: xhr.status };
    try {
      if (!xhr.data.body || typeof xhr.data.body !== 'object') {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Invalid response!');
      }
      if (
        opts.enableCrypto &&
        typeof xhr.data.body.data === 'string' &&
        xhr.data.body.data
      ) {
        const jsonStr = toDecrypt(xhr.data.body.data);
        xhr.data.body.data = jsonStr ? JSON.parse(jsonStr) : undefined;
      }
    } catch (error) {
      xhr.data = { body: { code: xhr.status } };
    }
    let res = xhr.data.body;
    res.header = xhr.data.header;
    if (typeof res.code !== 'number') {
      res.code = xhr.status;
    }
    res.success = xhr.status === 200 && +res.code === 1;
    // console.log('xhr', xhr);
    if (res.code === 1015) {
      // store.dispatch(
      //   indexData.actions.setRouterLink(`/ipLimit?ip=${res.data.ip}`)
      // );
    }
    if (!res.message) {
      if (xhr.status === 1015) {
        console.log('131231');
      }
      if (xhr.status === 404) {
        res.message = '网络请求丢失!';
      } else if (xhr.status === 503) {
        res.message = '网络不给力，验证失败';
      } else if (xhr.status === 504) {
        res.message = '网络不给力，网关超时';
      } else if (xhr.status === 500) {
        res.message = '服务维护中';
      } else {
        res.message = res.success ? '操作成功!' : '操作失败!';
      }
    }

    // 执行拦截器
    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.interceptors) {
      // 没有消息不处理了
      if (!res.message) {
        break;
      }
      res = interceptor(res);
    }
    return Promise.resolve(res);
  }

  /**
   * 发送请求
   * @param request 请求对象
   * @param config 请求配置, 等价于axios.config
   * @return 返回响应结果
   */
  protected async sendCommon(
    request: any | FormData,
    config: any
  ): Promise<any> {
    config.headers = { ...request.header };
    const reqTidUuid = [0, 1]
      .map(() => Math.random().toString(16).slice(2))
      .join('')
      .slice(0, 12);
    if (request instanceof FormData) {
      request.set('token', '');
      config.headers['content-type'] = 'multipart/form-data;';
      config.data = request;
    } else {
      config.headers['content-type'] = 'application/json;charset=UTF-8';
      config.headers.reqTid = `${request.header.callTime}-${reqTidUuid}`;
      config.headers.accept = '*/*';
      request.header.token = isLogin() || '';
      request.header.apiVersion = process.env.REACT_APP_API_VERSION;
      // 是否开启GZIP压缩
      // 阻塞获取唯一密匙成功过后，继续执行
      await getUniqueQueue('getSecret');
      request.header.gzipEnabled =
        store.getState().indexData.cryptoConfig.enableEncrypt &&
        +$env.REACT_APP_GZIP_ENABLED === 1
          ? 1
          : 0;
      request.header.sign = toGenerateSign(request);
      config.data = JSON.stringify(request);
      // 阻塞获取唯一密匙成功过后，继续执行
      config.data = request;
    }
    const res = await this.send(config);
    // 1003 登录过期 1004 登錄過期
    if ((!res.success && res.code === 1003) || res.code === 1004) {
      // store.dispatch(indexData.actions.clearUserinfo());
      localStorage.removeItem('userInfo');
      $mqtt.restart();
    }
    // 1006: 签名非法
    // 如果在加载页面之前，后台没有开启加密，后期开加密，自动切换加密
    // 如果已开加密还是报错，就不再处理
    // if (!res.success && res.code === 1006) {
    //   if (config.headers.isEncryptEnabled) return res;
    //   return this.sendCommon(request, config);
    // }
    return res;
  }
}
export default Fetch;
