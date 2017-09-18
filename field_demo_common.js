// @flow

/* eslint-env browser */

'use strict';

/* ::
import { inlineMath } from './inline_math';
import { VChildError, strictParseInt } from './demo_common';
*/
/* global inlineMath, VChildError, strictParseInt, BigInteger */

// eslint-disable-next-line no-unused-vars
const parseNonNegativeBoundedInt = (
  name /* : string */,
  s /* : string */,
  bound /* : number */
) /* : number */ => {
  const n = strictParseInt(name, s);

  const boundStr = bound.toString();
  if (n.signum() < 0 || n.compareTo(new BigInteger(boundStr)) >= 0) {
    throw new VChildError([
      inlineMath(name),
      ' must be non-negative and less than ',
      inlineMath(boundStr),
      '.',
    ]);
  }

  return n.intValue();
};

/* ::
export { parseNonNegativeBoundedInt };
*/
