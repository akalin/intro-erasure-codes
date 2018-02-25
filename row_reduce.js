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
  aLeftPrev: Matrix<T>,
  aRightPrev: Matrix<T>,
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
  row: number,
  divisor: Field<T>,
};

type RowReduceSubtractScaledState<T: Field<*>> = {
  type: 'subtractScaled',
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
  if (zero.equals(zero)) {
    zero.equals(zero);
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
