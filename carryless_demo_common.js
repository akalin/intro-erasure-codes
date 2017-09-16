// @flow

/* eslint-env browser */

'use strict';

/* :: import { inlineMath } from './inline_math'; */

/* global preact, BigInteger, inlineMath */

// eslint-disable-next-line no-unused-vars
const padStart = (
  s /* : string */,
  targetLength /* : number */,
  padString /* : string */
) /* : string */ => {
  if (s.length > targetLength) {
    return s;
  }

  const padLength = targetLength - s.length;
  let padding = padString;
  if (padLength > padding.length) {
    padding += padding.repeat(padLength / padding.length);
  }
  return padding.slice(0, padLength) + s;
};

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

const strictParseInt = (
  name /* : string */,
  s /* : string */
) /* : BigInteger */ => {
  if (!/^[+-]?[0-9]+$/.test(s)) {
    throw new VChildError([inlineMath(name), ' is not a valid number.']);
  }

  return new BigInteger(s, 10);
};

// eslint-disable-next-line no-unused-vars
const parseNonNegativeInt = (
  name /* : string */,
  s /* : string */
) /* : BigInteger */ => {
  const n = strictParseInt(name, s);
  if (n.signum() < 0) {
    throw new VChildError([inlineMath(name), ' cannot be negative.']);
  }

  return n;
};

/* ::
type ArithmeticType = 'standard' | 'carry-less';
*/

// flowlint-next-line unclear-type:off
const impossible = (value /* : empty */) /* : any */ => {
  throw new Error(`Impossible case encountered: ${value}`);
};

// eslint-disable-next-line no-unused-vars
const addOpStr = (arithmeticType /* : ArithmeticType */) /* : string */ => {
  switch (arithmeticType) {
    case 'standard':
      return '+';
    case 'carry-less':
      return '^';
    default:
      return impossible(arithmeticType);
  }
};

// eslint-disable-next-line no-unused-vars
const mulOpStr = (arithmeticType /* : ArithmeticType */) /* : string */ => {
  switch (arithmeticType) {
    case 'standard':
      return ' *';
    case 'carry-less':
      return '^*';
    default:
      return impossible(arithmeticType);
  }
};

const textInput = (
  value /* : string */,
  onChange /* : (string) => void */,
  className /* : ?string */
) =>
  preact.h('input', {
    class: className,
    type: 'text',
    value,
    size: 12,
    pattern: '[0-9]+',
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
  inputClass /* : ?string */
) => [
  'Let ',
  spanNoWrap(
    inlineMath('a ='),
    ' ',
    textInput(aValue, s => onAChange(s), inputClass)
  ),
  ' and ',
  spanNoWrap(
    inlineMath('b ='),
    ' ',
    textInput(bValue, s => onBChange(s), inputClass),
    '.'
  ),
];

// eslint-disable-next-line no-unused-vars
const arithmeticTypeChoice = (
  name /* : string */,
  chosenArithmeticType /* : ArithmeticType */,
  onArithmeticTypeChange /* : (ArithmeticType) => void */,
  trailer /* : string */
) => {
  const { h } = preact;
  const choiceRadio = (
    arithmeticType /* : ArithmeticType */,
    t /* : string */
  ) =>
    h(
      'label',
      styleNoWrap,
      h('input', {
        checked: chosenArithmeticType === arithmeticType,
        name,
        type: 'radio',
        onChange: () => onArithmeticTypeChange(arithmeticType),
      }),
      ` ${arithmeticType} arithmetic${t}`
    );

  return [choiceRadio('standard', ''), ' ', choiceRadio('carry-less', trailer)];
};

/* ::
export {
  padStart,
  VChildError,
  handleVChildError,
  parseNonNegativeInt,
  impossible,
  addOpStr,
  mulOpStr,
  binaryOpInput,
  arithmeticTypeChoice,
};
export type { ArithmeticType };
*/
