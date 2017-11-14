// @flow

/* eslint-env browser */

'use strict';

/* ::
import {
  VChildError,
  impossible,
  parseField256Element,
  parseField257Element,
  parseListCapped,
  field256Pattern,
  field257Pattern,
  listPattern,
  styleNoWrap,
  textInput,
} from './demo_common';
import { Field256Element } from './field_256';
import { Field257Element } from './field_257';
import { BigRational } from './rational';
import { inlineMath } from './math';
*/

/*
global
  preact,
  BigInteger,

  VChildError,
  impossible,
  parseField256Element,
  parseField257Element,
  parseListCapped,
  field256Pattern,
  field257Pattern,
  listPattern,
  styleNoWrap,
  textInput,

  BigRational,

  inlineMath,
*/

/* ::
type FieldType = 'gf256' | 'gf257' | 'rational'
*/

// eslint-disable-next-line no-unused-vars
const fieldTypeChoice = (
  name /* : string */,
  chosenFieldType /* : FieldType */,
  onFieldTypeChange /* : (FieldType) => void */,
  trailer /* : string */
) => {
  const { h } = preact;
  const choiceRadio = (
    fieldType /* : FieldType */,
    description /* : string */
  ) =>
    h(
      'label',
      styleNoWrap,
      h('input', {
        checked: chosenFieldType === fieldType,
        name,
        type: 'radio',
        onChange: () => onFieldTypeChange(fieldType),
      }),
      description
    );

  return [
    choiceRadio('gf256', ' field with 256 elements'),
    ' ',
    choiceRadio('gf257', ' field with 257 elements'),
    ' ',
    choiceRadio('rational', ` field of rational numbers${trailer}`),
  ];
};

// eslint-disable-next-line no-unused-vars
const parseField256ElementListCapped = (
  name /* : string */,
  s /* : string */,
  lengthBound /* : number */
) /* : Field256Element[] */ => {
  const strs = parseListCapped(name, s, lengthBound);
  return strs.map((t, i) => parseField256Element(`{${name}}_{${i}}`, t));
};

// eslint-disable-next-line no-unused-vars
const parseField257ElementListCapped = (
  name /* : string */,
  s /* : string */,
  lengthBound /* : number */
) /* : Field257Element[] */ => {
  const strs = parseListCapped(name, s, lengthBound);
  return strs.map((t, i) => parseField257Element(`{${name}}_{${i}}`, t));
};

const rationalDigitBound = 25;

const parseBigRational = (
  name /* : string */,
  s /* : string */
) /* : BigRational */ => {
  const match = s.match(/^([+-]?[0-9]+)(?:\s*\/\s*([+-]?[0-9]+))?$/);
  if (!match) {
    throw new VChildError([
      inlineMath(name),
      ' is not a valid rational number.',
    ]);
  }

  const n = new BigInteger(match[1], 10);

  if (n.abs().toString(10).length > rationalDigitBound) {
    throw new VChildError([
      'The numerator of ',
      inlineMath(name),
      ' has too big an absolute value.',
    ]);
  }

  let d;
  if (match[2]) {
    d = new BigInteger(match[2], 10);
    if (d.signum() === 0) {
      throw new VChildError([
        inlineMath(name),
        ' cannot have a zero denominator.',
      ]);
    }
    if (d.abs().toString(10).length > rationalDigitBound) {
      throw new VChildError([
        'The denominator of ',
        inlineMath(name),
        ' has too big an absolute value.',
      ]);
    }
  } else {
    d = BigInteger.ONE;
  }

  return new BigRational(n, d);
};

// eslint-disable-next-line no-unused-vars
const parseBigRationalListCapped = (
  name /* : string */,
  s /* : string */,
  lengthBound /* : number */
) /* : BigRational[] */ => {
  const strs = parseListCapped(name, s, lengthBound);
  return strs.map((t, i) => parseBigRational(`{${name}}_{${i}}`, t));
};

const intPattern = `[+-]?0*[0-9]{1,${rationalDigitBound}}`;
const intOrRatPattern = `${intPattern}(\\s*\\/\\s*${intPattern})?`;

// eslint-disable-next-line no-unused-vars
const listInput = (
  fieldType /* : FieldType */,
  value /* : string */,
  onChange /* : (string) => void */,
  lengthBound /* : number */,
  size /* : number */,
  inputClass /* : ?string */
) => {
  let pattern;
  switch (fieldType) {
    case 'gf256':
      pattern = field256Pattern;
      break;

    case 'gf257':
      pattern = field257Pattern;
      break;

    case 'rational':
      pattern = intOrRatPattern;
      break;

    default:
      pattern = impossible(fieldType);
  }

  pattern = listPattern(pattern, lengthBound);

  return textInput(value, onChange, size, pattern, inputClass);
};

/* ::
export {
  fieldTypeChoice,
  parseField256ElementListCapped,
  parseField257ElementListCapped,
  parseBigRational,
  parseBigRationalListCapped,
  listInput,
};
export type { FieldType };
*/
