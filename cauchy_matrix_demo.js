// @flow

/* eslint-env browser */

'use strict';

/* ::
import { Field } from './field';
import { Field256Element } from './field_256';
import { Field257Element } from './field_257';
import { BigRational } from './rational';
import { Matrix, newCauchyMatrix } from './matrix';
import {
  VChildError,
  handleVChildError,
  impossible,
  parseField256Element,
  parseField257Element,
  field256Pattern,
  field257Pattern,
  textInput,
  styleNoWrap,
  spanNoWrap,
} from './demo_common';
import { inlineMath, displayMath } from './math';
*/
/*
global
  preact,
  BigInteger,

  BigRational,

  newCauchyMatrix,

  VChildError,
  handleVChildError,
  impossible,
  parseField256Element,
  parseField257Element,
  field256Pattern,
  field257Pattern,
  textInput,
  styleNoWrap,
  spanNoWrap,

  inlineMath,
  displayMath,
*/

/* ::
type FieldType = 'gf256' | 'gf257' | 'rational'
*/

const lengthBound = 50;

const parseListCapped = (
  name /* : string */,
  s /* : string */
) /* : string[] */ => {
  const strs = s.split(',');
  if (strs.length > lengthBound) {
    throw new VChildError([inlineMath(name), ' has too many elements.']);
  }
  return strs.map(t => t.trim());
};

const parseField256ElementListCapped = (
  name /* : string */,
  s /* : string */
) /* : Field256Element[] */ => {
  const strs = parseListCapped(name, s);
  return strs.map((t, i) => parseField256Element(`{${name}}_{${i}}`, t));
};

const parseField257ElementListCapped = (
  name /* : string */,
  s /* : string */
) /* : Field257Element[] */ => {
  const strs = parseListCapped(name, s);
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

const parseBigRationalListCapped = (
  name /* : string */,
  s /* : string */
) /* : BigRational[] */ => {
  const strs = parseListCapped(name, s);
  return strs.map((t, i) => parseBigRational(`{${name}}_{${i}}`, t));
};

const checkForDuplicates = /* :: <T: Field<*>> */ (
  x /* : T[] */,
  y /* : T[] */
) => {
  const xy = x.concat(y);
  const name = i => (i < x.length ? `x_{${i}}` : `y_{${i - x.length}}`);
  const elems /* : { [string]: number } */ = {};
  for (let i = 0; i < xy.length; i += 1) {
    const n = xy[i].toString(10);
    if (n in elems) {
      throw new VChildError([
        inlineMath(name(elems[n])),
        ' and ',
        inlineMath(name(i)),
        ' must be distinct.',
      ]);
    }
    elems[n] = i;
  }
};

const parseCauchyMatrix = (
  fieldType /* : FieldType */,
  xStr /* : string */,
  yStr /* : string */
) /* : Matrix<Field256Element> | Matrix<Field257Element> | Matrix<BigRational> */ => {
  // Duplicate some code below to work around limitations of flow's
  // type system.
  switch (fieldType) {
    case 'gf256': {
      const x = parseField256ElementListCapped('x', xStr);
      const y = parseField256ElementListCapped('y', yStr);
      checkForDuplicates(x, y);
      return newCauchyMatrix(x, y);
    }

    case 'gf257': {
      const x = parseField257ElementListCapped('x', xStr);
      const y = parseField257ElementListCapped('y', yStr);
      checkForDuplicates(x, y);
      return newCauchyMatrix(x, y);
    }

    case 'rational': {
      const x = parseBigRationalListCapped('x', xStr);
      const y = parseBigRationalListCapped('y', yStr);
      checkForDuplicates(x, y);
      return newCauchyMatrix(x, y);
    }

    default:
      return impossible(fieldType);
  }
};

const listPattern = pattern =>
  `\\s*((${pattern})\\s*,\\s*){0,${lengthBound - 1}}(${pattern})\\s*`;

const intPattern = `[+-]?0*[0-9]{1,${rationalDigitBound}}`;
const intOrRatPattern = `${intPattern}(\\s*\\/\\s*${intPattern})?`;

const xyInput = (
  fieldType /* : FieldType */,
  xValue /* : string */,
  yValue /* : string */,
  onXChange /* : (string) => void */,
  onYChange /* : (string) => void */,
  inputClass /* : ?string */
) => {
  const size = 15;
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

  pattern = listPattern(pattern);

  return [
    'let ',
    spanNoWrap(
      inlineMath('x = ['),
      ' ',
      textInput(xValue, s => onXChange(s), size, pattern, inputClass),
      ' ',
      inlineMath(']')
    ),
    ' and ',
    spanNoWrap(
      inlineMath('y = ['),
      ' ',
      textInput(yValue, s => onYChange(s), size, pattern, inputClass),
      ' ',
      inlineMath(']\\text{.}')
    ),
  ];
};

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

/* ::
type CauchyMatrixDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
};

type CauchyMatrixDemoState = {
  x: string,
  y: string,
  fieldType: FieldType,
};
*/

const matrixStringLengthBound = 10 * 1024;

// eslint-disable-next-line no-unused-vars
class CauchyMatrixDemo extends preact.Component /* :: <CauchyMatrixDemoProps, CauchyMatrixDemoState> */ {
  constructor(
    // Should be { initialX: x, initialY: y, initialFieldType: fieldType, ...props },
    // but that is unsupported by Safari.
    props /* : CauchyMatrixDemoProps & {
      initialX: string,
      initialY: string,
      initialFieldType: FieldType,
    } */
  ) {
    super(props);
    this.state = {
      x: props.initialX,
      y: props.initialY,
      fieldType: props.initialFieldType,
    };
  }

  onXChange(x /* : string */) {
    // Should be { ...state, x }, but that is unsupported by Safari.
    this.setState(state => ({ x, y: state.y, fieldType: state.fieldType }));
  }

  onYChange(y /* : string */) {
    // Should be { ...state, y }, but that is unsupported by Safari.
    this.setState(state => ({ x: state.x, y, fieldType: state.fieldType }));
  }

  onFieldTypeChange(fieldType /* : FieldType */) {
    // Should be { ...state, fieldType }, but that is unsupported by Safari.
    this.setState(state => ({ x: state.x, y: state.y, fieldType }));
  }

  render(
    props /* : CauchyMatrixDemoProps */,
    state /* : CauchyMatrixDemoState */
  ) {
    const children = handleVChildError(() => {
      const m = parseCauchyMatrix(state.fieldType, state.x, state.y);
      const mStr = m.toLaTeXString();
      if (mStr.length > matrixStringLengthBound) {
        throw new VChildError([
          'The Cauchy matrix constructed from ',
          inlineMath('x'),
          ' and ',
          inlineMath('y'),
          ' is too big to display.',
        ]);
      }

      return [
        'Then, the Cauchy matrix constructed from ',
        inlineMath('x'),
        ' and ',
        inlineMath('y'),
        ' is ',
        displayMath(`${mStr}\\text{.}`),
      ];
    });

    return preact.h(
      'div',
      { class: props.containerClass },
      props.header,
      'Working over the ',
      fieldTypeChoice(
        `${props.name}FieldTypeChoice`,
        state.fieldType,
        fieldType => this.onFieldTypeChange(fieldType),
        ','
      ),
      ' ',
      xyInput(
        state.fieldType,
        state.x,
        state.y,
        s => this.onXChange(s),
        s => this.onYChange(s),
        props.inputClass
      ),
      ' ',
      children
    );
  }
}