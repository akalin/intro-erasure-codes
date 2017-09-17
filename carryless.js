// @flow

/* eslint no-bitwise: off */

'use strict';

/* global BigInteger */

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

// eslint-disable-next-line no-unused-vars
const carrylessMulBig = (
  a /* : BigInteger */,
  b /* : BigInteger */
) /* : BigInteger */ => {
  let product = BigInteger.ZERO;
  for (let i = 0; i < b.bitLength(); i += 1) {
    if (b.testBit(i)) {
      product = product.xor(a.shiftLeft(i));
    }
  }
  return product;
};

class DivisionByZeroError extends RangeError {
  // flowlint-next-line unclear-type:off
  constructor(...params /* : any[] */) {
    super('Division by zero', ...params);
    if (RangeError.captureStackTrace) {
      RangeError.captureStackTrace(this, DivisionByZeroError);
    }
  }
}

// eslint-disable-next-line no-unused-vars
const carrylessDiv32 = (
  a /* : number */,
  b /* : number */
) /* : { q: number, r:number } */ => {
  if (b >>> 0 === 0) {
    throw new DivisionByZeroError();
  }

  let q = 0;
  let r = a >>> 0;
  while (Math.clz32(b) >= Math.clz32(r)) {
    const shift = Math.clz32(b) - Math.clz32(r);
    r ^= b << shift;
    q |= 1 << shift;
  }
  return { q: q >>> 0, r };
};

// eslint-disable-next-line no-unused-vars
const carrylessDivBig = (
  a /* : BigInteger */,
  b /* : BigInteger */
) /* : { q: BigInteger, r:BigInteger } */ => {
  if (b.signum() === 0) {
    throw new DivisionByZeroError();
  }

  let q = BigInteger.ZERO;
  let r = a;
  while (r.bitLength() >= b.bitLength()) {
    const shift = r.bitLength() - b.bitLength();
    r = r.xor(b.shiftLeft(shift));
    q = q.setBit(shift);
  }
  return { q, r };
};

/* ::
export {
  carrylessAdd32,
  carrylessAddBig,
  carrylessMul32,
  carrylessMulBig,
  carrylessDiv32,
  carrylessDivBig,
};
*/
