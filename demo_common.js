// @flow

/* eslint-env browser */

'use strict';

/* ::
import { Field256Element } from './field_256';
import { Field257Element } from './field_257';
import { inlineMath } from './math';
*/
/* global preact, BigInteger, Field256Element, Field257Element, inlineMath */

class VChildError extends Error {
  /* ::
  children: VChild[];
  */

  // flowlint-next-line unclear-type:off
  constructor(children /* : VChild[] */, ...params /* : any[] */) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VChildError);
    }
    this.children = children;
  }
}

// eslint-disable-next-line no-unused-vars
const handleVChildError = (fn /* : () => VChild[] */) /* : VChild[] */ => {
  try {
    return fn();
  } catch (e) {
    if (!(e instanceof VChildError)) {
      throw e;
    }

    return e.children;
  }
};

// eslint-disable-next-line no-unused-vars, prettier/prettier
const impossible = (value /* : empty */) /* : any */ => { // flowlint-line unclear-type:off
  throw new Error(`Impossible case encountered: ${value}`);
};

// eslint-disable-next-line no-unused-vars
const strictParseInt = (
  name /* : string */,
  s /* : string */
) /* : BigInteger */ => {
  if (!/^[+-]?[0-9]+$/.test(s)) {
    throw new VChildError([inlineMath(name), ' is not a valid number.']);
  }

  return new BigInteger(s, 10);
};

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

// eslint-disable-next-line no-unused-vars
const parseField256Element = (
  name /* : string */,
  s /* : string */
) /* : Field256Element */ =>
  new Field256Element(parseNonNegativeBoundedInt(name, s, 256));

// eslint-disable-next-line no-unused-vars
const parseField257Element = (
  name /* : string */,
  s /* : string */
) /* : Field257Element */ =>
  new Field257Element(parseNonNegativeBoundedInt(name, s, 257));

// eslint-disable-next-line no-unused-vars
const parseListCapped = (
  name /* : string */,
  s /* : string */,
  lengthBound /* : number */
) /* : string[] */ => {
  const strs = s.split(',');
  if (strs.length > lengthBound) {
    throw new VChildError([inlineMath(name), ' has too many elements.']);
  }
  return strs.map(t => t.trim());
};

// Needed to work around
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12263977/
// .
const isEdge = window.navigator.userAgent.indexOf('Edge/') > 0;

// eslint-disable-next-line no-unused-vars
const field256Pattern = isEdge
  ? '0*[0-9]{1,3}'
  : '0*(([0-9])|([0-9]{2})|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))';

// eslint-disable-next-line no-unused-vars
const field257Pattern = isEdge
  ? '0*[0-9]{1,3}'
  : '0*(([0-9])|([0-9]{2})|(1[0-9]{2})|(2[0-4][0-9])|(25[0-6]))';

// eslint-disable-next-line no-unused-vars
const listPattern = (
  pattern /* : string */,
  lengthBound /* : number */
) /* : string */ =>
  `\\s*((${pattern})\\s*,\\s*){0,${lengthBound - 1}}(${pattern})\\s*`;

// eslint-disable-next-line no-unused-vars
const textInput = (
  value /* : string */,
  onChange /* : (string) => void */,
  size /* : number */,
  pattern /* : string */,
  className /* : ?string */
) =>
  preact.h('input', {
    class: className,
    type: 'text',
    value,
    size,
    pattern,
    onInput: (e /* : Event */) => {
      if (!(e.target instanceof HTMLInputElement)) {
        throw new Error('e.target unexpectedly not an HTMLInputElement');
      }
      onChange(e.target.value);
    },
  });

const styleNoWrap = { style: { whiteSpace: 'nowrap' } };

const spanNoWrap = (...children /* : VChild[] */) =>
  preact.h('span', styleNoWrap, ...children);

// eslint-disable-next-line no-unused-vars
const binaryOpInput = (
  aValue /* : string */,
  bValue /* : string */,
  onAChange /* : (string) => void */,
  onBChange /* : (string) => void */,
  pattern /* : string */,
  inputClass /* : ?string */
) => {
  const size = 12;
  return [
    spanNoWrap(
      inlineMath('a ='),
      ' ',
      textInput(aValue, s => onAChange(s), size, pattern, inputClass)
    ),
    ' and ',
    spanNoWrap(
      inlineMath('b ='),
      ' ',
      textInput(bValue, s => onBChange(s), size, pattern, inputClass),
      '.'
    ),
  ];
};

// eslint-disable-next-line no-unused-vars
const matrixStringLengthBound = 10 * 1024;

/* :: export {
  VChildError,
  handleVChildError,
  impossible,
  strictParseInt,
  parseField256Element,
  parseField257Element,
  parseListCapped,
  isEdge,
  field256Pattern,
  field257Pattern,
  listPattern,
  textInput,
  styleNoWrap,
  spanNoWrap,
  binaryOpInput,
  matrixStringLengthBound,
}; */
