// @flow

/* eslint-env browser */

'use strict';

/* ::
import { inlineMath } from './inline_math';
*/
/* global preact, BigInteger, inlineMath */

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

// Needed to work around
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12263977/
// .
const isEdge = window.navigator.userAgent.indexOf('Edge/') > 0;

// eslint-disable-next-line no-unused-vars
const field257Pattern = isEdge
  ? '0*[0-9]{1,3}'
  : '0*(([0-9])|([0-9]{2})|(1[0-9]{2})|(2[0-4][0-9])|(25[0-6]))';

const textInput = (
  value /* : string */,
  onChange /* : (string) => void */,
  pattern /* : string */,
  className /* : ?string */
) =>
  preact.h('input', {
    class: className,
    type: 'text',
    value,
    size: 12,
    pattern,
    onInput: (e /* : Event */) => {
      if (!(e.target instanceof HTMLInputElement)) {
        throw new Error('e.target unexpectedly not an HTMLInputElement');
      }
      onChange(e.target.value);
    },
  });

const styleNoWrap = { style: { whiteSpace: 'nowrap' } };

const spanNoWrap = (...children) => preact.h('span', styleNoWrap, ...children);

// eslint-disable-next-line no-unused-vars
const binaryOpInput = (
  aValue /* : string */,
  bValue /* : string */,
  onAChange /* : (string) => void */,
  onBChange /* : (string) => void */,
  pattern /* : string */,
  inputClass /* : ?string */
) => [
  spanNoWrap(
    inlineMath('a ='),
    ' ',
    textInput(aValue, s => onAChange(s), pattern, inputClass)
  ),
  ' and ',
  spanNoWrap(
    inlineMath('b ='),
    ' ',
    textInput(bValue, s => onBChange(s), pattern, inputClass),
    '.'
  ),
];

/* :: export {
  VChildError,
  handleVChildError,
  strictParseInt,
  isEdge,
  field257Pattern,
  styleNoWrap,
  binaryOpInput,
}; */
