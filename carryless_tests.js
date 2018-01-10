// @flow

/* eslint-env jasmine */

'use strict';

/* :: import { carrylessAdd32, carrylessAddBig } from './carryless'; */
/* global carrylessAdd32, carrylessAddBig, BigInteger */

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
});
