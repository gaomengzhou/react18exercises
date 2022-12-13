import type { KeyboardEvent } from 'react';
import { ObjType } from '@/types/Common';

export const copy = async (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  } else {
    // 创建text area
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, rej) => {
      // 执行复制命令并移除文本框
      if (document.execCommand('copy')) {
        resolve(textArea.value);
      } else {
        rej();
      }
      textArea.remove();
    });
  }
};

export const paste = async () => {
  const clipboardObj = navigator.clipboard;
  // eslint-disable-next-line no-return-await
  return await clipboardObj.readText();
};

export function isObjectEmpty(obj: ObjType) {
  return !!Object.keys(obj).length;
}

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @param defaultValue 是否开启严格模式显示0与默认值，或默认值显示值
 * @return 已处理的数字数据
 */
export function toFixed(
  number: number | string,
  fractionDigits = 2,
  isrounded = true,
  defaultValue: string | boolean = true
) {
  let value = +number;
  if (!value) {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      if (defaultValue === false) return number;
      if (typeof defaultValue === 'string') return defaultValue;
    }
    return 0;
  }
  const digits = +fractionDigits || 2;
  let numstr = `${number}`;
  const index = numstr.indexOf('.');
  if (index === 0) numstr = `0${numstr}`;
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
}

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @param defaultValue  是否开启严格模式显示0与默认值，或默认值显示值
 * @return 已处理的数字数据
 */
export function toFixedStr(
  number: number | string,
  fractionDigits = 2,
  isrounded = true,
  defaultValue: string | boolean = true
) {
  const value = toFixed(number, fractionDigits, isrounded, defaultValue);
  // eslint-disable-next-line no-restricted-globals
  if (typeof value === 'number' && !isNaN(value))
    return value.toFixed(fractionDigits);
  return value;
}

/** 具体的时间格式 YYYY-MM-DD h:m:s */
export function dateTime(time: number) {
  const date = new Date(time);
  const Y = `${date.getFullYear()}-`;
  const M = `${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-`;
  const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
  const h = `${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }:`;
  const m = `${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }:`;
  const s = `${
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  }`;
  return `${Y}${M}${D} ${h}${m}${s}`;
}

/** 当天凌晨 */
export function startTime() {
  return new Date(new Date().setHours(0, 0, 0, 0));
}

/** 7天 */
export function sevenDayAgo() {
  return (startTime() as any) - 86400 * 7 * 1000;
}

/** 一个月 */
export function amonthAgo() {
  return (startTime() as any).setMonth((startTime() as any).getMonth() - 1);
}

/** input框输入限制 */
export function clearInput(event: KeyboardEvent, type = true) {
  const { key } = event;
  if (type) {
    if (
      key === 'e' ||
      key === 'E' ||
      key === '+' ||
      key === '-' ||
      key === '.'
    ) {
      event.nativeEvent.returnValue = false;
      return false;
    }
    return true;
  }
  if (key === 'e' || key === 'E' || key === '+' || key === '-') {
    event.nativeEvent.returnValue = false;
    return false;
  }
  return true;
}

export function isMobile() {
  if (
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    // 手机
    return true;
  }
  // 电脑
  return false;
}
