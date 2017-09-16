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

// eslint-disable-next-line no-unused-vars
const carrylessMul32 = (a /* : number */, b /* : number */) /* : number */ => {
  let product = 0;
  for (let t = b >>> 0, i = 0; t > 0; t >>>= 1, i += 1) {
    if ((t & 1) !== 0) {
      product ^= a << i;
    }
  }
  return product >>> 0;
};

/* :: export { carrylessAdd32, carrylessAddBig, carrylessMul32 }; */
