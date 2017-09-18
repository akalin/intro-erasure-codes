// @flow

'use strict';

/* ::
// For why +T is used instead of T, see
// https://github.com/facebook/flow/issues/5272 .
interface Field<+T> {
  toString(radix?: number): string;
  plus(b: T): T;
  minus(b: T): T;
  times(b: T): T;
  dividedBy(b: T): T;
  equals(b: T): boolean;
  // Work around the lack of static members in flow: see
  // https://github.com/facebook/flow/issues/5590 .
  zero(): T;
  one(): T;
}

export type { Field };
*/

