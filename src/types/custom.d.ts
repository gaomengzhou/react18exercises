/* eslint-disable no-unused-vars */
import Fetch from '@/utils/fetch';
import Mqtt from '@/utils/mqtt';
import ENV from './env';

declare global {
  interface Window {
    // [key: string]: any;
    $env: ENV;
    $fetch: Fetch;
    $mqtt: Mqtt;
  }
  const $env: Window['$env'];
  const $fetch: Window['$fetch'];
  const $mqtt: Window['$mqtt'];
}
