// @flow

/* eslint-env jasmine */

/* eslint no-bitwise: off */

'use strict';

/* ::
import {
  carrylessAdd32,
  carrylessAddBig,
  carrylessMul32,
} from './carryless';
*/
/* global carrylessAdd32, carrylessAddBig, carrylessMul32, BigInteger */

describe('carryless', () => {
  it('add32', () => {
    expect(carrylessAdd32(1, 1)).toBe(0);
    expect(carrylessAdd32(1, 2)).toBe(3);
    expect(carrylessAdd32(2, 1)).toBe(3);
    expect(carrylessAdd32(2, 2)).toBe(0);

    expect(carrylessAdd32(0xffffffff, 0)).toBe(0xffffffff);
    expect(carrylessAdd32(-1, 0)).toBe(0xffffffff);
  });

  const toBigInt = (
    n /* : number | string */,
    base /* : number */ = 10
  ) /* : BigInteger */ =>
    new BigInteger(typeof n === 'number' ? n.toString(base) : n, base);

  const carrylessAddBigStr = (
    a /* : number | string */,
    b /* : number | string */,
    base /* : number */ = 10
  ) /* : string */ =>
    carrylessAddBig(toBigInt(a, base), toBigInt(b, base)).toString(base);

  it('addBig', () => {
    expect(carrylessAddBigStr(1, 1)).toBe('0');
    expect(carrylessAddBigStr(1, 2)).toBe('3');
    expect(carrylessAddBigStr(2, 1)).toBe('3');
    expect(carrylessAddBigStr(2, 2)).toBe('0');

    expect(carrylessAddBigStr(0xffffffff, 0, 16)).toBe('ffffffff');
    expect(carrylessAddBigStr('ffffffffff', 1, 16)).toBe('fffffffffe');
  });

  it('mul32', () => {
    expect(carrylessMul32(7, 0)).toBe(0);
    expect(carrylessMul32(7, 1)).toBe(7);
    expect(carrylessMul32(7, 2)).toBe(14);
    expect(carrylessMul32(7, 3)).toBe(9);
    expect(carrylessMul32(7, 4)).toBe(28);
    expect(carrylessMul32(7, 5)).toBe(27);

    expect(carrylessMul32(0, 7)).toBe(0);
    expect(carrylessMul32(1, 7)).toBe(7);
    expect(carrylessMul32(2, 7)).toBe(14);
    expect(carrylessMul32(3, 7)).toBe(9);
    expect(carrylessMul32(4, 7)).toBe(28);
    expect(carrylessMul32(5, 7)).toBe(27);

    expect(carrylessMul32(1 << 31, 1)).toBe(0x80000000);
    expect(carrylessMul32(1, 1 << 31)).toBe(0x80000000);
    expect(carrylessMul32(1 << 31, 2)).toBe(0);
    expect(carrylessMul32(2, 1 << 31)).toBe(0);
  });
});
