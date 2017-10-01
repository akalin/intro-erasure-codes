// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { Matrix, SingularMatrixError } from './matrix';
import { rowReduceInitialState, rowReduceNextState } from './row_reduce';
import { Field257Element } from './field_257';
import { BigRational } from './rational';
*/
/*
global
  Matrix,
  SingularMatrixError,

  rowReduceInitialState,
  rowReduceNextState,

  Field257Element,

  BigRational,
*/

describe('row reduction', () => {
  const new2x2 = (a, b, c, d) =>
    new Matrix(2, 2, [a, b, c, d].map(x => new Field257Element(x)));

  const id2x2 = new2x2(1, 0, 0, 1);

  const new3x3 = (a, b, c, d, e, f, g, h, i) =>
    new Matrix(
      3,
      3,
      [a, b, c, d, e, f, g, h, i].map(x => new Field257Element(x))
    );

  const id3x3 = new3x3(1, 0, 0, 0, 1, 0, 0, 0, 1);

  it('rowReduceInitialState', () => {
    const m = new2x2(1, 2, 3, 4);

    expect(rowReduceInitialState(m)).toEqual({
      type: 'initial',
      aLeft: m,
      aRight: id2x2,
    });
  });

  it('rowReduceNextState swap', () => {
    const m = new2x2(0, 2, 3, 4);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(initialState)).toEqual({
      type: 'swap',
      aLeftPrev: m,
      aRightPrev: id2x2,
      aLeft: new2x2(3, 4, 0, 2),
      aRight: new2x2(0, 1, 1, 0),
      rowA: 0,
      rowB: 1,
    });
  });

  it('rowReduceNextState singular', () => {
    const m = new2x2(0, 2, 0, 4);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(initialState)).toEqual({
      type: 'singular',
      aLeft: m,
      aRight: id2x2,
    });
  });

  it('rowReduceNextState divide', () => {
    const m = new2x2(2, 2, 2, 4);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(initialState)).toEqual({
      type: 'divide',
      aLeftPrev: m,
      aRightPrev: id2x2,
      aLeft: new2x2(1, 1, 2, 4),
      aRight: new2x2(129, 0, 0, 1),
      row: 0,
      divisor: new Field257Element(2),
    });
  });

  it('rowReduceNextState subtract scaled before upper triangular', () => {
    const m = new2x2(1, 1, 2, 4);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(initialState)).toEqual({
      type: 'subtractScaled',
      aLeftPrev: m,
      aRightPrev: id2x2,
      aLeft: new2x2(1, 1, 0, 2),
      aRight: new2x2(1, 0, 255, 1),
      rowDest: 1,
      rowSrc: 0,
      scale: new Field257Element(2),
    });
  });

  it('rowReduceNextState subtract after upper triangular', () => {
    const m = new3x3(1, 1, 0, 0, 1, 1, 0, 0, 1);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(initialState)).toEqual({
      type: 'subtractScaled',
      aLeftPrev: m,
      aRightPrev: id3x3,
      aLeft: new3x3(1, 1, 0, 0, 1, 0, 0, 0, 1),
      aRight: new3x3(1, 0, 0, 0, 1, 256, 0, 0, 1),
      rowDest: 1,
      rowSrc: 2,
      scale: null,
    });
  });

  it('rowReduceNextState subtract scaled after upper triangular', () => {
    const m = new3x3(1, 1, 0, 0, 1, 2, 0, 0, 1);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(initialState)).toEqual({
      type: 'subtractScaled',
      aLeftPrev: m,
      aRightPrev: id3x3,
      aLeft: new3x3(1, 1, 0, 0, 1, 0, 0, 0, 1),
      aRight: new3x3(1, 0, 0, 0, 1, 255, 0, 0, 1),
      rowDest: 1,
      rowSrc: 2,
      scale: new Field257Element(2),
    });
  });

  it('rowReduceNextState inverse found', () => {
    const m = new2x2(1, 1, 0, 1);
    const initialState = rowReduceInitialState(m);

    expect(rowReduceNextState(rowReduceNextState(initialState))).toEqual({
      type: 'inverseFound',
      aLeft: new2x2(1, 0, 0, 1),
      aRight: new2x2(1, 256, 0, 1),
    });
  });

  const invert = m => {
    let state = rowReduceInitialState(m);
    for (;;) {
      if (state.type === 'inverseFound') {
        break;
      }

      if (state.type === 'singular') {
        throw new SingularMatrixError();
      }

      state = rowReduceNextState(state);
    }

    return state.aRight;
  };

  it('invert identity', () => {
    const zero = Field257Element.Zero;
    const one = Field257Element.One;

    const size = 5;
    const m = new Matrix(size, size, (i, j) => (i === j ? one : zero));
    const mInv = invert(m);
    expect(mInv).toEqual(m);
  });

  it('invert scalar rational', () => {
    const zero = BigRational.Zero;
    const one = BigRational.One;
    const two = one.plus(one);
    const oneHalf = one.dividedBy(two);

    const size = 5;
    const m = new Matrix(size, size, (i, j) => (i === j ? two : zero));
    const mInv = invert(m);
    const mInvExpected = new Matrix(
      size,
      size,
      (i, j) => (i === j ? oneHalf : zero)
    );
    expect(mInv).toEqual(mInvExpected);
  });

  it('invert GF(257)', () => {
    const mElements = [1, 1, 1, 2, 4, 8, 3, 9, 27].map(
      x => new Field257Element(x)
    );
    const m = new Matrix(3, 3, mElements);

    const zero = Field257Element.Zero;
    const one = Field257Element.One;

    const identity = new Matrix(3, 3, (i, j) => (i === j ? one : zero));

    const mInv = invert(m);
    expect(m.times(mInv)).toEqual(identity);
    expect(mInv.times(m)).toEqual(identity);
  });

  it('invert singular', () => {
    const mElements = [1, 1, 1, 2, 4, 8, 3, 5, 9].map(
      x => new Field257Element(x)
    );
    const m = new Matrix(3, 3, mElements);
    expect(() => invert(m)).toThrowError('Singular matrix');
  });
});
