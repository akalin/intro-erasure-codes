// @flow

/* eslint-env jasmine */

/* eslint no-bitwise: off */

'use strict';

/* ::
import { BigRational } from './rational';
*/
/* global BigInteger, BigRational */

describe('BigRational', () => {
  const makeRational = (n /* : number */, d /* :: ?: number */) =>
    new BigRational(
      new BigInteger(n.toString(10), 10),
      d === undefined ? undefined : new BigInteger(d.toString(10), 10)
    );

  it('constructor zero canonical form', () => {
    const zeroCanonical = makeRational(0, 1);
    expect(makeRational(0, 2)).toEqual(zeroCanonical);
    expect(makeRational(0, 5)).toEqual(zeroCanonical);
  });

  it('constructor negative canonical form', () => {
    const canonical = makeRational(-5, 3);
    expect(makeRational(5, -3)).toEqual(canonical);
  });

  it('constructor positive canonical form', () => {
    const canonical = makeRational(5, 3);
    expect(makeRational(-5, -3)).toEqual(canonical);
  });

  it('constructor lowest terms', () => {
    const canonical = makeRational(3, 5);
    expect(makeRational(-6, -10)).toEqual(canonical);
  });

  it('constructor errors', () => {
    expect(() => makeRational(1, 0)).toThrowError('division by zero');
  });

  it('zero toString', () => {
    for (let i = 1; i < 16; i += 1) {
      expect(makeRational(0, i).toString()).toBe('0');
      for (let j = 2; j < 16; j += 1) {
        expect(makeRational(0, i).toString(j)).toBe('0');
      }
    }
  });

  it('integer toString', () => {
    for (let i = 1; i < 16; i += 1) {
      expect(makeRational(i, 1).toString()).toBe(i.toString());
      for (let j = 2; j < 16; j += 1) {
        expect(makeRational(i, 1).toString(j)).toBe(i.toString(j));
      }
    }
  });

  it('toString radix', () => {
    const n = makeRational(255);
    expect(n.toString()).toBe('255');
    expect(n.toString(10)).toBe('255');
    expect(n.toString(16)).toBe('ff');
  });

  const plus = (a, b) =>
    makeRational(a)
      .plus(makeRational(b))
      .toString(10);

  it('plus', () => {
    expect(plus(1, 1)).toEqual('2');
    expect(plus(255, 2)).toEqual('257');
    expect(
      makeRational(1, 2)
        .plus(makeRational(1, 3))
        .toString(10)
    ).toEqual('5/6');
  });

  const minus = (a, b) =>
    makeRational(a)
      .minus(makeRational(b))
      .toString(10);

  it('minus', () => {
    expect(minus(1, 1)).toEqual('0');
    expect(minus(1, 2)).toEqual('-1');
  });

  it('zero', () => {
    const n = makeRational(100);
    expect(n.plus(BigRational.Zero).toString(10)).toEqual('100');
    expect(n.minus(BigRational.Zero).toString(10)).toEqual('100');
  });

  const times = (a, b) =>
    makeRational(a)
      .times(makeRational(b))
      .toString(10);

  it('times', () => {
    expect(times(100, 100)).toEqual('10000');
  });

  const dividedBy = (a, b) =>
    makeRational(a)
      .dividedBy(makeRational(b))
      .toString(10);

  it('divide by zero', () => {
    expect(() => dividedBy(1, 0)).toThrowError('division by zero');
  });

  it('dividedBy', () => {
    expect(dividedBy(1, 2)).toEqual('1/2');
    expect(dividedBy(3, 255)).toEqual('1/85');
  });

  it('one', () => {
    const n = makeRational(100);
    expect(n.times(BigRational.One).toString(10)).toEqual('100');
    expect(n.dividedBy(BigRational.One).toString(10)).toEqual('100');
  });

  it('equals', () => {
    const t1 = makeRational(1);
    const t2 = makeRational(2);
    expect(t1.equals(t1)).toBe(true);
    expect(t2.equals(t2)).toBe(true);
    expect(t1.equals(t2)).toBe(false);
  });
});
