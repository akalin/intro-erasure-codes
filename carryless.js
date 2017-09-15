// @flow

/* eslint no-bitwise: off */

'use strict';

// eslint-disable-next-line no-unused-vars
const carrylessAdd = (a /* : number */, b /* : number */) /* : number */ =>
  ((a >>> 0) ^ (b >>> 0)) >>> 0;

/* :: export { carrylessAdd }; */
