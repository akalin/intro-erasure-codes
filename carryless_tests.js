// @flow

/* eslint-env jasmine */

/* eslint no-bitwise: off */

'use strict';

/* ::
import {
  carrylessAdd32,
  carrylessAddBig,
  carrylessMul32,
  carrylessMulBig,
  carrylessDiv32,
} from './carryless';
*/
/*
global
  BigInteger,

  carrylessAdd32,
  carrylessAddBig,
  carrylessMul32,
  carrylessMulBig,
  carrylessDiv32,
*/

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

  const carrylessMulBigStr = (
    a /* : number | string */,
    b /* : number | string */,
    base /* : number */ = 10
  ) /* : string */ =>
    carrylessMulBig(toBigInt(a, base), toBigInt(b, base)).toString(base);

  it('mulBig', () => {
    expect(carrylessMulBigStr(7, 0)).toEqual('0');
    expect(carrylessMulBigStr(7, 1)).toEqual('7');
    expect(carrylessMulBigStr(7, 2)).toEqual('14');
    expect(carrylessMulBigStr(7, 3)).toEqual('9');
    expect(carrylessMulBigStr(7, 4)).toEqual('28');
    expect(carrylessMulBigStr(7, 5)).toEqual('27');

    expect(carrylessMulBigStr(0, 7)).toEqual('0');
    expect(carrylessMulBigStr(1, 7)).toEqual('7');
    expect(carrylessMulBigStr(2, 7)).toEqual('14');
    expect(carrylessMulBigStr(3, 7)).toEqual('9');
    expect(carrylessMulBigStr(4, 7)).toEqual('28');
    expect(carrylessMulBigStr(5, 7)).toEqual('27');

    expect(carrylessMulBigStr(0x80000000, 1, 16)).toEqual('80000000');
    expect(carrylessMulBigStr(1, 0x80000000, 16)).toEqual('80000000');
    expect(carrylessMulBigStr(0x80000000, 2, 16)).toEqual('100000000');
    expect(carrylessMulBigStr(2, 0x80000000, 16)).toEqual('100000000');
    expect(carrylessMulBigStr(0x80000000, 0x80000000, 16)).toEqual(
      '4000000000000000'
    );
  });

  it('div32', () => {
    expect(carrylessDiv32(4, 1)).toEqual({ q: 4, r: 0 });
    expect(carrylessDiv32(4, 2)).toEqual({ q: 2, r: 0 });
    expect(carrylessDiv32(4, 3)).toEqual({ q: 3, r: 1 });
    expect(carrylessDiv32(4, 4)).toEqual({ q: 1, r: 0 });

    expect(carrylessDiv32(7, 1)).toEqual({ q: 7, r: 0 });
    expect(carrylessDiv32(7, 2)).toEqual({ q: 3, r: 1 });
    expect(carrylessDiv32(7, 3)).toEqual({ q: 2, r: 1 });
    expect(carrylessDiv32(7, 4)).toEqual({ q: 1, r: 3 });
    expect(carrylessDiv32(7, 5)).toEqual({ q: 1, r: 2 });

    expect(carrylessDiv32(0xffffffff, 1)).toEqual({ q: 0xffffffff, r: 0 });
    expect(carrylessDiv32(0xffffffff, 2)).toEqual({ q: 0x7fffffff, r: 1 });
    expect(carrylessDiv32(0xf0000000, 0xffffffff)).toEqual({
      q: 1,
      r: 0xfffffff,
    });
  });
});
