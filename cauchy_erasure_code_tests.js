// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { Field256Element } from './field_256';
import { Matrix } from './matrix';
import { computeParityMatrix } from './cauchy_erasure_code';
*/
/* global Field256Element, Matrix, computeParityMatrix */

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
});
