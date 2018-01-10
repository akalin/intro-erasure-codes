// @flow

/* eslint no-bitwise: off */

'use strict';

// eslint-disable-next-line no-unused-vars
const carrylessAdd32 = (a /* : number */, b /* : number */) /* : number */ =>
  ((a >>> 0) ^ (b >>> 0)) >>> 0;

// eslint-disable-next-line no-unused-vars
const carrylessAddBig = (
  a /* : BigInteger */,
  b /* : BigInteger */
) /* : BigInteger */ => a.xor(b);

/* :: export { carrylessAdd32, carrylessAddBig }; */
