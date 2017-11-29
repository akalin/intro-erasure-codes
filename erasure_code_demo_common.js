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

// eslint-disable-next-line no-unused-vars
const byteArrayComponent = (
  a /* : Field256Element[] */,
  name /* : string */,
  color /* : string */,
  trailer /* : string */
) /* : VChild[] */ => {
  const components = [inlineMath(`${name} = [`)];
  for (let i = 0; i < a.length; i += 1) {
    components.push(inlineMath(`{\\color{${color}}${byteLaTeX(a[i])}}`));
    if (i < a.length - 1) {
      components.push(', ');
    }
  }
  components.push(inlineMath(`]\\text{${trailer}}`));
  return components;
};

/* ::
export { parseHex, byteLaTeX, byteArrayComponent };
*/
