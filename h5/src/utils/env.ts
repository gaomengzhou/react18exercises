import Fetch from '@/utils/fetch';
import Mqtt from '@/utils/mqtt';

const options = {
  $env: { ...process.env },
  $fetch: new Fetch(),
  $mqtt: new Mqtt(),
};

Object.assign(window, options);
