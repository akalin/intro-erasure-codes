// @flow

/* eslint-env browser */

'use strict';

/* ::
import { type Field } from './field';
import { Matrix } from './matrix';
*/

/* ::

type RowReduceSwapState<T: Field<*>> = {
  type: 'swap',
  m: Matrix<T>,
};

type RowReduceSingularState<T: Field<*>> = {
  type: 'singular',
  m: Matrix<T>,
};

type RowReduceDivideState<T: Field<*>> = {
  type: 'divide',
  m: Matrix<T>,
};

type RowReduceSubtractScaledState<T: Field<*>> = {
  type: 'subtractScaled',
  m: Matrix<T>,
};

type RowReduceState<T: Field<*>> =
  | RowReduceSwapState<T>
  | RowReduceSingularState<T>
  | RowReduceDivideState<T>
  | RowReduceSubtractScaledState<T>;
*/

// eslint-disable-next-line no-unused-vars
const rowReduceNextState = /* :: <T: Field<*>> */ (
  state /* : RowReduceState<T> */
) => {
  const { m } = state;

  const zero = m.zeroElement();
  if (zero.equals(zero)) {
    zero.equals(zero);
  }
};

/* ::
export type { RowReduceState };
export { rowReduceNextState };
*/
