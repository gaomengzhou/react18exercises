import Client from 'mqtt/dist/mqtt';
import { broseClientType, serialize } from '@/utils/tools/method';
import { unGzipMqtt } from '@/utils/fetch/cryptoZip';
import { store } from '@/redux/store';
/** clientId 客户端编号 */
const clientIdStatic = `mqttjs_${Math.random().toString(16).slice(2, 10)}`;
/** mqtt 客户端配置信息 */
interface AkMqOptions {
  /** 配置：请求地址 */
  brokerUrl?: string;
  /** 配置：路径 */
  path?: string;
  /** 配置：用户名 */
  username?: string;
  /** 配置：密码 */
  password?: string;
  /** 配置：请求等待时间, 单位毫秒 */
  timeout?: number;
  /** 配置：命名空间 */
  namespace?: string;
  /** 配置：客户端编号 */
  clientId?: string;
  /** 是否开启调试 */
  debug?: boolean;
}
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

// /** 请求参数 */
// interface AkMqHeader extends AkHeader {
//   /** 业务编号/接口类型编号 */
//   cmd: string | number;
//   /** 业务标识唯一编号 */
//   requestId?: string;
//   /** GZIP压缩 */
//   gzipEnabled?: number;
//   /** 语言环境 */
//   languageCode?: string;
// }

// interface AkMqRequest extends AkMqHeader {
//   /** 请求主题 */
//   requestTopic: string;
//   /** 响应主题 */
//   responseTopic: string;
// }

export class Mqtt {
  [x: string]: any;

  /** 获取状态 */
  public get started() {
    return Boolean(this.client);
  }

  /** 连接字符串 */
  public get connectStr() {
    if (this.connected) return `连接成功`;
    return `连接中`;
  }

  /** 连接字符串 */
  public get connectStr2() {
    if (this.connected) return `连接成功`;
    return `连接中第${this.connectCount}次`;
  }

  /** 连接状态 */
  public connected = false;

  /** 连接状态说明 */
  public connectCount = 1;

  /** 消息存储 */
  public messages = {};

  /** 客户端连接 */
  protected client?: Client.MqttClient;

  /** 响应拦截器 */
  protected interceptors: [] = [];

  /** 参数配置 */
  protected options: AkMqOptions = {
    /** 参数配置：路径 */
    path: '/mqtt',
    /** 参数配置：全局请求等待时间，单位毫秒 */
    timeout: 1000 * 15,
    /** 参数配置：命名空间 */
    namespace: 'mqtt',
    /** 客户端编号 */
    clientId: clientIdStatic,
    /** 参数配置：是否开启调试模式 */
    debug: process.env.NODE_ENV === 'development',
  };

  /** 连接中状态 */
  private starting = this.reset();

  /** 订阅的主题 */
  // eslint-disable-next-line no-unused-vars
  private subscribeTopics: { [topic: string]: (res: string) => void } = {};

  /** 订阅的主题一次性 */
  private subscribeTopicOnces: string[] = [];

  /**
   * 配置更新
   * @param options 配置参数
   */
  public config(options: AkMqOptions = {}) {
    if (Object.keys(options).length === 0) {
      return;
    }
    this.options = { ...this.options, ...options };
  }

  /** 连接状态 */
  public waitConnectting() {
    if (this.connected) return this.connected;
    console.log(`[MQTT]等待连接中[${new Date().toLocaleTimeString()}]...`);
    return Promise.resolve(this.starting.status).then((d) => {
      console.log('[MQTT]:等待连接成功');
      return d;
    });
  }

  /**
   * 重新启动
   * @param options 配置参数
   */
  public restart(options?: AkMqOptions) {
    this.stop();
    this.start(options || {});
  }

  /**
   * 启动
   * @param options 配置参数
   */
  public start(options: AkMqOptions) {
    if (this.client) {
      return this.starting.status;
    }
    this.config(options);
    console.log(`[MQTT]${this.connectStr2}`);
    const res = new Promise<boolean>((resolve) => {
      const { brokerUrl, username, password, path, clientId } = this.options;
      const keepalive = 10000;
      // 1000毫秒，两次重新连接之间的间隔
      const reconnectPeriod = 1000;
      // 30 * 1000毫秒，等待收到Cconnect的时间
      const connectTimeout = 1000 * 30;
      const resubscribe = false;
      this.client = (Client as any).connect(brokerUrl, {
        username,
        password,
        path,
        resubscribe,
        keepalive,
        reconnectPeriod,
        connectTimeout,
        clientId,
      });
      this.client?.on('message', async (topic: any, payload: any) => {
        let messageRes: any = null;
        try {
          const rst = JSON.parse(payload.toString());

          // mqtt 开启加密
          // await this.$tool.getUniqueQueue("getSecret");
          // if (1 === +this.$env.VUE_APP_MQTT_SECRET_ENABLE && this.$store.state.cryptoConfig.mqttAesSecret) {
          if (+$env.REACT_APP_MQTT_SECRET_ENABLE) {
            try {
              const bodyStr = unGzipMqtt(rst.body) as any;
              rst.body = JSON.parse(bodyStr);
              const debugLogSettingsMqtt = false;
              if (
                process.env.NODE_ENV === 'production' &&
                debugLogSettingsMqtt
              ) {
                const topicPrefix = `${topic
                  .split('/')
                  .slice(0, 2)
                  .join('/')}/`;
                if (topicPrefix && rst.header.cmd) {
                  try {
                    //  console.log.groupCollapsed(`mqtt/message(cmdGroup:${rst.header.cmdGroup}|cmd:${rst.header.cmd}):${topic}`);
                    //  console.log("解压前:", JSON.parse(payload.toString()));
                    //  console.log("解压后:", serialize(rst));
                    //  console.log.groupEnd();
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
              if ($env.REACT_APP_PLATFORM_ID === 1300 && rst.header.cmd) {
                console.log('解压前:', JSON.parse(payload.toString()));
                console.log('解压后:', serialize(rst));
              }
            } catch (error) {
              console.log(error);
            }
          }

          try {
            rst.body.header = rst.header;
            // 后端为了安全考虑，每次返回的头部没有用户登录令牌，前端补上用户令牌
            if (!rst.body.header.token)
              rst.body.header.token =
                store.getState().indexData.userinfo.token || '';
          } catch (e) {
            console.log(e);
          }
          rst.body.success = +rst.body.code === 1;
          if (!rst.body.message) {
            rst.body.message = rst.body.success ? `操作成功!` : `操作失败`;
          }
          messageRes = rst;
        } catch (e) {
          console.log(e);
        }
        if (!messageRes) {
          messageRes = {
            body: {
              success: false,
              code: 500,
              message: `服务响应异常`,
              data: {},
              header: {},
            },
          };
        }
        if (
          this.options.debug &&
          !(
            $env.REACT_APP_MQTT_SECRET_ENABLE === 1 &&
            store.getState().indexData.cryptoConfig.mqttAesSecret
          )
        ) {
          // console.log('mqtt消息', { topic, messageRes });
        }
        if (this.subscribeTopics[topic]) {
          setTimeout(() => {
            this.subscribeTopics[topic](messageRes);
          }, 0);
          // setTimeout(() => this.$emit(topic, messageRes.body), 0);
        } else {
          console.log('messageRes', messageRes);
          // setTimeout(() => this.$emit(topic, messageRes), 0);
        }
      });
      this.client?.on('disconnect', () => {
        console.log(`[MQTT][断开]-${this.connectStr2}`);
      });
      this.client?.on('reconnect', () => {
        if (this.connected) this.starting = this.reset();
        this.connectCount += 1;
        console.log(`[MQTT][重连]-${this.connectStr2}`);
      });
      this.client?.on('connect', async () => {
        resolve((this.connected = true));
        this.connected = true;
        this.connectCount = 0;
        console.log(`[MQTT][连接]-${this.connectStr2}`);
        Object.keys(this.subscribeTopics).forEach((topic) =>
          this.subscribe(topic, this.subscribeTopics[topic])
        );
        this.subscribeTopicOnces.forEach((topic) => {
          //  console.log("[MQTT]一次性订阅主题开始:" + topic);
          // tslint:disable no-non-null-assertion
          this.client?.subscribe(topic, (error: any) => {
            console.log(
              error ? '[MQTT]一次性订阅主题失败:' : '[MQTT]一次性订阅主题成功:',
              topic
            );
          });
        });
      });
      this.client?.on('error', (error: any) => {
        console.error('[MQTT]异常', error);
      });
    });
    res.then(this.starting.resolve);

    return this.starting.status;
  }

  /**
   * 关闭
   *  @param {Boolean} force - 强制关闭
   */
  public stop(force = false) {
    if (!this.client) {
      return;
    }
    this.client.end(force);
    this.client = undefined;
  }

  /**
   * 订阅topic
   * @param topic 主题
   * @param callback 回调
   */
  public subscribe(topic: string, callback: any) {
    const topicStr = topic.replace(/\/\//g, '/');
    // this.unsubscribe(topicStr);
    this.subscribeTopics[topicStr] = callback;
    if (this.connected) {
      console.log(`[MQTT]全局订阅主题开始:${topicStr}`);
      this.client?.subscribe(topic, (error: any) => {
        // if (callback) {
        //   callback(error);
        // }
        console.log(
          error ? '[MQTT]全局订阅主题失败:' : '[MQTT]全局订阅主题成功:',
          topicStr
        );
      });
    }
  }

  /**
   * 取消订阅topic
   * @param topic 主题
   */
  public unsubscribe(topic: string) {
    const topicStr = topic.replace(/\/\//g, '/');
    if (this.client) {
      this.client.unsubscribe(topicStr);
    }
    if (this.subscribeTopics[topicStr]) {
      delete this.subscribeTopics[topicStr];
      console.log('[MQTT]全局退订主题成功', topicStr);
    }
  }

  /**
   * 发送聊天室请求
   * @param cmd 请求命令
   * @param params 请求参数
   * @param opts 请求配置
   * @return 响应结果
   */
  public sendChatroom(
    cmd: number,
    params?: { [key: string]: any },
    opts?: any
  ) {
    const platformId = $env.REACT_APP_PLATFORM_ID;
    const token = store.getState().indexData.userinfo.token || '';
    const requestId = `${cmd}_${Math.random().toString(16).slice(2)}`;
    const requestTopic = `${this.$constants.MQTTConstant.MQTT_CHATROOMREQUEST}/`;
    const responseTopic = `${this.$constants.MQTTConstant.MQTT_CHATROOMRESPONSE}/${platformId}/${token}/${requestId}/`;
    const clientType = broseClientType();
    const apiVersion = this.$env.VUE_APP_API_VERSION;
    const req = {
      cmd,
      clientType,
      platformId,
      token,
      requestId,
      requestTopic,
      responseTopic,
      apiVersion,
    };
    return this.send(req, params, opts);
  }

  /**
   * 发送自定义自定义
   * @param request 请求命令
   * @param params 请求参数
   * @param opts 请求配置
   * @return 响应结果
   */
  public sendCustom(
    request: { cmd?: number; requestTopic: string; responseTopic?: string },
    params?: { [key: string]: any },
    opts?: any
  ) {
    const { cmd = 0, requestTopic, responseTopic = '' } = request;
    const platformId = $env.REACT_APP_PLATFORM_ID;
    const token = store.getState().indexData.userinfo.token || '';
    const requestId = `${cmd}_${Math.random().toString(16).slice(2)}`;
    const clientType = $env.REACT_APP_CLIENT_TYPE;
    const apiVersion = $env.REACT_APP_API_VERSION;
    const req = {
      cmd,
      clientType,
      platformId,
      token,
      requestId,
      requestTopic,
      responseTopic,
      apiVersion,
    };
    return this.send(req, params, opts);
  }

  public queryGroupMsg(
    request: { cmd?: number; requestTopic: string; responseTopic?: string },
    params?: { [key: string]: any },
    opts?: any
  ) {
    const { cmd = 0, requestTopic, responseTopic = '' } = request;
    const platformId = this.$env.VUE_APP_PLATFORM_ID;
    const token = store.getState().indexData.userinfo.token || '';
    const requestId = `${cmd}_${Math.random().toString(16).slice(2)}`;
    const clientType = broseClientType();
    const apiVersion = this.$env.VUE_APP_API_VERSION;
    const req = {
      cmd,
      clientType,
      platformId,
      token,
      requestId,
      requestTopic,
      responseTopic,
      apiVersion,
    };
    return this.send(req, params, opts);
  }

  /**
   * 发送聊天室请求
   * @param request 请求命令
   * @param params 请求参数
   * @param opts 请求配置
   * @return 响应结果
   */
  public async send(
    request: any,
    params?: { [key: string]: any },
    opts: any = {}
  ): Promise<any> {
    if (!request.platformId) {
      request.platformId = $env.REACT_APP_PLATFORM_ID;
    }
    if (!request.token) {
      request.token = store.getState().indexData.userinfo.token || '';
    }
    if (!request.requestId) {
      request.requestId = `${request.cmd}_${Math.random()
        .toString(16)
        .slice(2)}`;
    }

    request.requestTopic = request.requestTopic.replace(/\/\//g, '/');
    request.responseTopic = request.responseTopic.replace(/\/\//g, '/');

    if (
      request.responseTopic &&
      this.subscribeTopicOnces.indexOf(request.responseTopic) >= 0
    ) {
      throw new Error(
        `[MQTT]一次性订阅主题重复:[MQTT]${request.responseTopic}`
      );
    }
    // await this.$tool.getUniqueQueue("getSecret");
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const languageCode = 'zh_CN';
      const gzipEnabled = 1;
      // eslint-disable-next-line prefer-const
      let { cmd, requestId, token, platformId, clientType } = request;
      const { userType } = store.getState().indexData.userinfo;
      if (+userType === 0) token = '';
      let { apiVersion } = request;
      if (typeof apiVersion !== 'number')
        apiVersion = this.$env.VUE_APP_API_VERSION;
      const deviceCode = store.getState().indexData.auxiliaryCode || '';
      const header = {
        cmd,
        requestId,
        clientType,
        token,
        platformId,
        apiVersion,
        gzipEnabled,
        languageCode,
        deviceCode,
      };
      const body = params;
      if (request.responseTopic) {
        let timeoutId: any = null;
        if (opts.timeout !== 0) {
          const timeout =
            +(opts.timeout || this.options.timeout || 0) ||
            this.options.timeout ||
            1000 * 3;
          timeoutId = setTimeout(() => {
            console.warn('mqtt/timeout', { header, body });
            const message =
              this.$env.IS_DEVELOPMENT || this.$env.IS_PRODUCTION_INNER
                ? `加载失败，请检查你的网络`
                : '';
            this.$emit(request.responseTopic, {
              header,
              body: { header, code: 0, success: false, message },
            });
          }, timeout);
        }
        this.$once(request.responseTopic, async (res: any) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          this.client?.unsubscribe(request.responseTopic);
          const index = this.subscribeTopicOnces.indexOf(request.responseTopic);
          if (index >= 0) {
            this.subscribeTopicOnces.splice(index, 1);
          }
          resolve(res.body);
        });
      }

      if (!this.connected) {
        console.log(`[MQTT][${request.requestTopic}|${cmd}]-等待中...`);
        await this.starting.status;
      }

      if (!this.connected) return;
      // tslint:disable no-non-null-assertion
      if (request.responseTopic) {
        this.subscribeTopicOnces.push(request.responseTopic);
        this.client?.subscribe(request.responseTopic, (error: any) => {
          console.log(
            error ? '[MQTT]一次性订阅主题失败:' : '[MQTT]一次性订阅主题成功:',
            request.responseTopic
          );
          if (error) {
            console.error(error);
          }
        });
      }

      const akRequest: any = { header, body };
      // if (1 === +this.$env.VUE_APP_MQTT_SECRET_ENABLE && this.$store.state.cryptoConfig.mqttAesSecret) {
      // if (+$env.REACT_APP_MQTT_SECRET_ENABLE === 1) {
      //   // MQTT压缩-gzipMqtt
      //   akRequest.body = this.gzipMqtt(JSON.stringify(akRequest.body));
      //   // akRequest.body = this.toEncrpt(JSON.stringify(akRequest.body), "mqttAesSecret");
      //   const { debugLogSettings } = this.$store.state;
      //   // 推送服务器的消息
      //   if (
      //     process.env.NODE_ENV === 'development' &&
      //     debugLogSettings.mqtt !== false
      //   ) {
      //     const topicPrefix = `${request.requestTopic
      //       .split('/')
      //       .slice(0, 2)
      //       .join('/')}/`;
      //     if (debugLogSettings[topicPrefix] !== false) {
      //       try {
      //         const key = 'console';
      //         const logWin = window[key];
      //         logWin.groupCollapsed(
      //           `mqtt/publish(cmd:${cmd}):${request.requestTopic}`
      //         );
      //         console.log('压缩前:', serialize({ header, body }));
      //         console.log('压缩后:', serialize(akRequest));
      //         logWin.groupEnd();
      //       } catch (error) {
      //          console.log(error);
      //       }
      //     }
      //   }
      // }
      const message = JSON.stringify(akRequest);
      // 推送消息给服务器
      this.client?.publish(request.requestTopic, message, (error?: Error) => {
        console.log(
          `[MQTT][${request.requestTopic}|${cmd}]-${
            error ? '发送失败' : '发送成功'
          }`
        );
      });
    });
  }

  /** 重置状态 */
  protected reset() {
    this.connected = false;
    this.connectCount = this.connectCount >= 1 ? 1 : 0;
    const rst = {} as any;
    rst.status = new Promise<boolean>((resolve) => {
      rst.resolve = (stauts: boolean) => {
        rst.status = stauts;
        resolve(stauts);
      };
    });
    return rst as {
      status: Promise<boolean> | boolean;
      resolve: () => void;
    };
  }
}

export default Mqtt;
