/** MQTT常量类 */
export default {
  /** 聊天室：请求主题 */
  MQTT_CHATROOMREQUEST: '/chatRequest/',

  /** 聊天室：响应主题 */
  MQTT_CHATROOMRESPONSE: '/new/chatResponse/',

  /** C2C 聊天室响应主题  */
  MQTT_C2CCHATROOMRESPONSE: '/new/c2c/chat/broadcast/',

  /** 聊天室：广播主题 */
  MQTT_CHATROOMBROADCAST: '/new/chat/broadcast/',

  /** 聊天室：广播主题-键，用于Store储存 */
  MQTT_CHATROOMBROADCASTKEY: 'MQTT_CHATROOMBROADCAST',

  /** 聊天室：红包雨广播主题 */
  MQTT_HBCHATROOMBROADCAST: '/new/hb/chat/broadcast/',

  /** 聊天室：红包雨广播主题-键，用于Store储存 */
  MQTT_HBCHATROOMBROADCASTKEY: 'MQTT_HBCHATROOMBROADCAST',

  /** 红包雨： mqtt推送 */
  MQTT_BETTING_NEWS: '/new/platformMqttBroadcast/',

  /** 红包雨：mqtt推送 ，用于Store储存 */
  MQTT_HBRAINBROADCASTKEY: 'MQTT_HBRAINBROADCAST',

  /** 彩种：广播主题 */
  MQTT_LOTTERYBROADCAST: '/new/openNumberNotice/',

  /** 彩种：广播主题-键，用于Store储存 */
  MQTT_LOTTERYBROADCASTKEY: 'MQTT_LOTTERYBROADCAST',

  /** 彩种：广播主题-已结算 */
  MQTT_LOTTERYSETTLEDBROADCAST: '/new/openNumberSettledNotice/',

  /** 彩种：广播主题-已结算-键，用于Store储存 */
  MQTT_LOTTERYSETTLEDBROADCASTKEY: 'MQTT_LOTTERYSETTLEDBROADCAST',

  /** 全屏公告主题 */
  MQTT_NOTICE: '/new/topNotice/',

  /** 全屏公告主题-键，用于Store储存 */
  MQTT_NOTICEKEY: 'MQTT_NOTICE',

  /** 首页滚动公告 */
  MQTT_HOMEPAGEROLLANNOUNCEMENT: '/new/homePageRollAnnouncement/',

  /** 首页滚动公告，用于Store储存 */
  MQTT_HOMEPAGEROLLANNOUNCEMENTKEY: 'MQTT_HOMEPAGEROLLANNOUNCEMENT',

  /** 用户被服务器注销账号 */
  MQTT_OFFLINE: '/new/offline/',

  /** 用户被服务器注销账号 */
  MQTT_OFFLINEKEY: 'MQTT_OFFLINE',

  /** 配置修改推送主题 */
  MQTT_EDITCONFIG: '/new/editConfig/',

  /** 配置修改推送主题，用于Store储存 */
  MQTT_EDITCONFIGKEY: 'MQTT_EDITCONFIG',

  /** 平台维护通知 */
  MQTT_PLATFORMMAINTENANCE: '/new/platformMaintenance',

  /** 平台维护通知，用于Store储存 */
  MQTT_PLATFORMMAINTENANCEKEY: 'MQTT_PLATFORMMAINTENANCE',

  /** 平台维护通知 */
  MQTT_REFRESHMAINTENANCE: '/new/pcH5Refresh',

  /** 平台维护通知，用于Store储存 */
  MQTT_REFRESHMAINTENANCEKEY: 'MQTT_REFRESHMAINTENANCE',

  /** 平台未读消息 */
  MQTT_PLATFORMMESSAGE: '/new/platformMessage',

  /** 平台未读消息，用于Store储存 */
  MQTT_PLATFORMMESSAGEKEY: 'MQTT_PLATFORMMESSAGE',

  /** 聊天室计划  */
  MQTT_PLATFORMCHATPLAN: '/new/sendPlan/',

  /** 聊天室计划  */
  MQTT_PLATFORMCHATPLAN_KEY: 'MQTT_PLATFORMCHATPLAN',
};
