// @flow

/* eslint-env browser */

'use strict';

/* ::
import {
  impossible,
  strictParseInt,
  VChildError,
  styleNoWrap,
} from './demo_common';
import { inlineMath } from './math';
*/
/*
global
  preact,

  impossible,
  strictParseInt,
  VChildError,
  styleNoWrap,

  inlineMath,
*/

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

const digitBound = 50;

// eslint-disable-next-line no-unused-vars
const nonNegativeIntPatternCapped = `0*[0-9]{1,${digitBound}}`;

// eslint-disable-next-line no-unused-vars
const parseNonNegativeIntCapped = (
  name /* : string */,
  s /* : string */
) /* : BigInteger */ => {
  const n = parseNonNegativeInt(name, s);
  if (n.toString(10).length > digitBound) {
    throw new VChildError([inlineMath(name), ' is too big.']);
  }

  return n;
};

/* ::
type ArithmeticType = 'standard' | 'carry-less';
*/

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
const subOpStr = (arithmeticType /* : ArithmeticType */) /* : string */ => {
  switch (arithmeticType) {
    case 'standard':
      return '-';
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
  nonNegativeIntPatternCapped,
  parseNonNegativeIntCapped,
  impossible,
  addOpStr,
  subOpStr,
  mulOpStr,
  arithmeticTypeChoice,
};
export type { ArithmeticType };
*/
