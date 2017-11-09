// @flow

/* eslint-env browser */

'use strict';

/* ::
import { type Field } from './field';
import { Matrix } from './matrix';
*/
/* global Matrix */

/* ::

type RowReduceInitialState<T: Field<*>> = {
  type: 'initial',
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
};

type RowReduceSwapState<T: Field<*>> = {
  type: 'swap',
  i: number,
  aLeftPrev: Matrix<T>,
  aRightPrev: Matrix<T>,
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
  rowA: number,
  rowB: number,
};

type RowReduceSingularState<T: Field<*>> = {
  type: 'singular',
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
};

type RowReduceDivideState<T: Field<*>> = {
  type: 'divide',
  i: number,
  aLeftPrev: Matrix<T>,
  aRightPrev: Matrix<T>,
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
  row: number,
  divisor: Field<T>,
};

type RowReduceSubtractScaledState<T: Field<*>> = {
  type: 'subtractScaled',
  i: number,
  j: number,
  aLeftPrev: Matrix<T>,
  aRightPrev: Matrix<T>,
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
  rowDest: number,
  rowSrc: number,
  scale: ?Field<T>,
};

type RowReduceInverseFoundState<T: Field<*>> = {
  type: 'inverseFound',
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
};

type RowReduceState<T: Field<*>> =
  | RowReduceInitialState<T>
  | RowReduceSwapState<T>
  | RowReduceSingularState<T>
  | RowReduceDivideState<T>
  | RowReduceSubtractScaledState<T>
  | RowReduceInverseFoundState<T>;
*/

// eslint-disable-next-line no-unused-vars
const rowReduceInitialState = /* :: <T: Field<*>> */ (
  m /* : Matrix<T> */
) /* : RowReduceInitialState<T> */ => {
  const rows = m.rows();
  const columns = m.columns();

  if (rows !== columns) {
    throw new Error('Non-square matrix');
  }

  const aRight = new Matrix(
    rows,
    rows,
    (i, j) => (i === j ? m.oneElement() : m.zeroElement())
  );
  return { type: 'initial', aLeft: m, aRight };
};

// eslint-disable-next-line no-unused-vars
const rowReduceNextState = /* :: <T: Field<*>> */ (
  state /* : RowReduceState<T> */
) /* : RowReduceState<T> */ => {
  if (state.type === 'singular' || state.type === 'inverseFound') {
    throw new Error('Unexpected terminal state');
  }

  // We could save some work by storing the current index, but that
  // makes things more complicated for no real gain, since we'll be
  // working with small matrices anyway.

  const { aLeft, aRight } = state;

  const zero = aLeft.zeroElement();
  const one = aLeft.oneElement();
  for (let i = 0; i < aLeft.rows(); i += 1) {
    const pivot = aLeft.at(i, i);
    if (pivot.equals(zero)) {
      for (let j = i + 1; j < aLeft.rows(); j += 1) {
        if (!aLeft.at(j, i).equals(zero)) {
          return {
            type: 'swap',
            i,
            aLeftPrev: aLeft,
            aRightPrev: aRight,
            aLeft: aLeft.swapRows(i, j),
            aRight: aRight.swapRows(i, j),
            rowA: i,
            rowB: j,
          };
        }
      }

      return {
        type: 'singular',
        aLeft,
        aRight,
      };
    }

    if (!pivot.equals(one)) {
      return {
        type: 'divide',
        i,
        aLeftPrev: aLeft,
        aRightPrev: aRight,
        aLeft: aLeft.divideRow(i, pivot),
        aRight: aRight.divideRow(i, pivot),
        row: i,
        divisor: pivot,
      };
    }

    for (let j = i + 1; j < aLeft.rows(); j += 1) {
      const t = aLeft.at(j, i);
      if (!t.equals(zero)) {
        return {
          type: 'subtractScaled',
          i: j,
          j: i,
          aLeftPrev: aLeft,
          aRightPrev: aRight,
          aLeft: aLeft.subtractScaledRow(j, i, t),
          aRight: aRight.subtractScaledRow(j, i, t),
          rowDest: j,
          rowSrc: i,
          scale: t.equals(one) ? null : t,
        };
      }
    }
  }

  for (let i = aLeft.rows() - 1; i >= 0; i -= 1) {
    for (let j = i - 1; j >= 0; j -= 1) {
      const t = aLeft.at(j, i);
      if (!t.equals(zero)) {
        return {
          type: 'subtractScaled',
          i: j,
          j: i,
          aLeftPrev: aLeft,
          aRightPrev: aRight,
          aLeft: aLeft.subtractScaledRow(j, i, t),
          aRight: aRight.subtractScaledRow(j, i, t),
          rowDest: j,
          rowSrc: i,
          scale: t.equals(one) ? null : t,
        };
      }
    }
  }

  return {
    type: 'inverseFound',
    aLeft,
    aRight,
  };
};

/* ::
export type { RowReduceState };
export { rowReduceInitialState, rowReduceNextState };
*/
