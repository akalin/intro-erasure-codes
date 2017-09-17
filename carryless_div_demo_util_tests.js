// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { type ArithmeticType } from './carryless_demo_common';
import { computeIntermediates } from './carryless_div_demo_util';
*/
/* global computeIntermediates, BigInteger */

describe('carryless div demo', () => {
  const toBigInt = (
    n /* : number | string */,
    base /* : number */ = 10
  ) /* : BigInteger */ =>
    new BigInteger(typeof n === 'number' ? n.toString(base) : n, base);

  const computeIntermediatesStr = (
    a /* : number | string */,
    b /* : number | string */,
    arithmeticType /* : ArithmeticType */,
    base /* : number */ = 10
  ) /* : { intermediate: string, offset: number }[] */ => {
    const aBig = toBigInt(a, base);
    const bBig = toBigInt(b, base);
    return computeIntermediates(aBig, bBig, arithmeticType).map(o => ({
      intermediate: o.intermediate.toString(base),
      offset: o.offset,
    }));
  };

  it('computeIntermediatesStandard', () => {
    expect(computeIntermediatesStr(1, 1, 'standard')).toEqual([
      { intermediate: '1', offset: 0 },
      { intermediate: '0', offset: 1 },
    ]);

    expect(computeIntermediatesStr(4, 3, 'standard')).toEqual([
      { intermediate: '4', offset: 0 },
      { intermediate: '1', offset: 2 },
    ]);

    expect(computeIntermediatesStr(55, 19, 'standard')).toEqual([
      { intermediate: '27', offset: 0 },
      { intermediate: '17', offset: 1 },
    ]);
  });

  it('computeIntermediatesCarryless', () => {
    expect(computeIntermediatesStr(1, 1, 'carry-less')).toEqual([
      { intermediate: '1', offset: 0 },
      { intermediate: '0', offset: 1 },
    ]);

    expect(computeIntermediatesStr(4, 3, 'carry-less')).toEqual([
      { intermediate: '2', offset: 0 },
      { intermediate: '2', offset: 1 },
      { intermediate: '1', offset: 2 },
    ]);

    expect(computeIntermediatesStr(55, 19, 'carry-less')).toEqual([
      { intermediate: '27', offset: 0 },
      { intermediate: '17', offset: 1 },
      { intermediate: '2', offset: 4 },
    ]);
  });
});
