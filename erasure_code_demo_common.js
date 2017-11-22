// @flow

/* eslint-env browser */

'use strict';

/* ::
import { Field256Element } from './field_256';
import { VChildError } from './demo_common';
import { inlineMath } from './math';
*/

/* global BigInteger, VChildError, inlineMath */

// eslint-disable-next-line no-unused-vars
const parseHex = (name /* : string */, s /* : string */) /* : BigInteger */ => {
  if (!/^[+-]?[0-9A-Fa-f]+$/.test(s)) {
    throw new VChildError([
      inlineMath(name),
      ' is not a valid hexadecimal number.',
    ]);
  }

  return new BigInteger(s, 16);
};

// eslint-disable-next-line no-unused-vars
const byteLaTeX = (x /* : Field256Element */) =>
  `\\mathtt{${x.toString(16).padStart(2, '0')}}`;

/* ::
export { parseHex, byteLaTeX };
*/
