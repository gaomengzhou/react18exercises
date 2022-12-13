import { NumOrStrType } from './Common';

interface ENV {
  // 打包文件夹名
  BUILD_PATH?: NumOrStrType;
  // BASE URL
  REACT_APP_API_URL?: NumOrStrType;
  // 应用名称
  REACT_APP_NAME?: NumOrStrType;
  // 版本号
  REACT_APP_API_VERSION?: NumOrStrType;
  // 应用关键字
  REACT_APP_META_KEYWORDS?: NumOrStrType;
  // 应用描述
  REACT_APP_META_DESCRIPTION?: NumOrStrType;
  // 应用平台标识
  REACT_APP_PLATFORM_ID?: NumOrStrType;
  // 客户端id 3H5 4PC
  REACT_APP_CLIENT_TYPE: NumOrStrType;
  //
  REACT_APP_CONFIG_PEM_STR: string;
  //
  REACT_APP_CONFIG_PEM_KEY: string;
  //
  VUE_APP_CONFIG_RSA_PAIR2_PUBLIC_KEY: string;
  //
  VUE_APP_CONFIG_RSA_PAIR1_PRIVATE_KEY: string;
  // MQTT用户名
  VUE_APP_MQTT_USERNAME: string;
  // MQTT密码
  VUE_APP_MQTT_PASSWORD: string;
  // MQTT链接地址
  VUE_APP_MQTTT_BROKER_URL: string;
  //
  REACT_APP_GZIP_ENABLED: boolean;
  //
  REACT_APP_CONFIG_ENCRYPTED_KEY: string;
  //
  REACT_APP_CONFIG_ENCRYPTED_STR: string;
  //
  REACT_APP_MQTT_SECRET_ENABLE: number;
  //
  REACT_APP_MQTT_BROKER_URL: string;
  //
  REACT_APP_MQTT_PASSWORD: string;

  REACT_APP_MQTT_USERNAME: string;
}
export default ENV;
