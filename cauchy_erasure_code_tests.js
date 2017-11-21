// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { Field256Element } from './field_256';
import { Matrix } from './matrix';
import {
  computeParityMatrix,
  computeParity,
  reconstructData,
} from './cauchy_erasure_code';
*/
/*
global
 Field256Element,

  Matrix,

  computeParityMatrix,
  computeParity,
  reconstructData,
*/

describe('Cauchy erasure code', () => {
  it('computeParityMatrix', () => {
    const P = computeParityMatrix(3, 2);
    expect(P).toEqual(
      new Matrix(
        2,
        3,
        [3, 2, 1, 4, 5, 6].map(x =>
          Field256Element.One.dividedBy(new Field256Element(x))
        )
      )
    );

    expect(computeParityMatrix(255, 1)).toBeDefined();
  });

  it('computeParityMatrix error', () => {
    expect(() => computeParityMatrix(3, 0)).toThrowError('Empty matrix');
    expect(() => computeParityMatrix(0, 3)).toThrowError('Empty matrix');
    expect(() => computeParityMatrix(256, 1)).toThrowError(
      'n must be >= 0 and < 256'
    );
  });

  const to256 = a => a.map(x => new Field256Element(x));

  it('computeParity', () => {
    const d = [0xda, 0xdb, 0x0d];
    const p = computeParity(to256(d), 2);
    expect(p).toEqual(to256([0x52, 0x0c]));
  });

  const to256Partial = a =>
    a.map(x => (typeof x === 'number' ? new Field256Element(x) : x));

  it('reconstructData 0 missing', () => {
    const partialD = [0xda, 0xdb, 0x0d];
    const p = [null, null];
    const d = reconstructData(to256Partial(partialD), to256Partial(p));
    expect(d).toEqual(to256([0xda, 0xdb, 0x0d]));
  });

  it('reconstructData 1 missing', () => {
    const partialD = [0xda, null, 0x0d];
    const p = [null, 0x0c];
    const d = reconstructData(to256Partial(partialD), to256Partial(p));
    expect(d).toEqual(to256([0xda, 0xdb, 0x0d]));
  });

  it('reconstructData 2 missing', () => {
    const partialD = [null, 0xdb, null];
    const p = [0x52, 0x0c];
    const d = reconstructData(to256Partial(partialD), to256Partial(p));
    expect(d).toEqual(to256([0xda, 0xdb, 0x0d]));
  });

  it('reconstructData 3 missing', () => {
    const partialD = [null, 0xdb, null];
    const p = [0x52, null];
    expect(() =>
      reconstructData(to256Partial(partialD), to256Partial(p))
    ).toThrowError('Not enough known bytes to reconstruct');
  });

  it('reconstructData error', () => {
    expect(() => reconstructData([], [])).toThrowError('Empty matrix');
    const partialD = [];
    for (let i = 0; i < 256; i += 1) {
      partialD.push(Field256Element.One);
    }
    const knownP = [Field256Element.One];
    expect(() => reconstructData(partialD, knownP)).toThrowError(
      'n must be >= 0 and < 256'
    );
  });
});
