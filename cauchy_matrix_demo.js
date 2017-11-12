// @flow

/* eslint-env browser */

'use strict';

/* ::
import { type Field } from './field';
import { Field256Element } from './field_256';
import { Field257Element } from './field_257';
import { BigRational } from './rational';
import {
  VChildError,
  handleVChildError,
  impossible,
  spanNoWrap,
} from './demo_common';
import { Matrix, newCauchyMatrix } from './matrix';
import {
  type FieldType,
  fieldTypeChoice,
  parseField256ElementListCapped,
  parseField257ElementListCapped,
  parseBigRationalListCapped,
  listInput,
  matrixStringLengthBound,
} from './matrix_demo_common';
import { inlineMath, displayMath } from './math';
*/
/*
global
  preact,

  VChildError,
  handleVChildError,
  impossible,
  spanNoWrap,

  newCauchyMatrix,

  fieldTypeChoice,
  parseField256ElementListCapped,
  parseField257ElementListCapped,
  parseBigRationalListCapped,

  listInput,
  matrixStringLengthBound,

  inlineMath,
  displayMath,
*/

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

const xyLengthBound = 50;

const parseCauchyMatrix = (
  fieldType /* : FieldType */,
  xStr /* : string */,
  yStr /* : string */
) /* : Matrix<Field256Element> | Matrix<Field257Element> | Matrix<BigRational> */ => {
  // Duplicate some code below to work around limitations of flow's
  // type system.
  switch (fieldType) {
    case 'gf256': {
      const x = parseField256ElementListCapped('x', xStr, xyLengthBound);
      const y = parseField256ElementListCapped('y', yStr, xyLengthBound);
      checkForDuplicates(x, y);
      return newCauchyMatrix(x, y);
    }

    case 'gf257': {
      const x = parseField257ElementListCapped('x', xStr, xyLengthBound);
      const y = parseField257ElementListCapped('y', yStr, xyLengthBound);
      checkForDuplicates(x, y);
      return newCauchyMatrix(x, y);
    }

    case 'rational': {
      const x = parseBigRationalListCapped('x', xStr, xyLengthBound);
      const y = parseBigRationalListCapped('y', yStr, xyLengthBound);
      checkForDuplicates(x, y);
      return newCauchyMatrix(x, y);
    }

    default:
      return impossible(fieldType);
  }
};

const xyInput = (
  fieldType /* : FieldType */,
  xValue /* : string */,
  yValue /* : string */,
  onXChange /* : (string) => void */,
  onYChange /* : (string) => void */,
  inputClass /* : ?string */
) => {
  const inputSize = 15;
  return [
    spanNoWrap(
      inlineMath('x = ['),
      ' ',
      listInput(
        fieldType,
        xValue,
        s => onXChange(s),
        xyLengthBound,
        inputSize,
        inputClass
      ),
      ' ',
      inlineMath(']')
    ),
    ' and ',
    spanNoWrap(
      inlineMath('y = ['),
      ' ',
      listInput(
        fieldType,
        yValue,
        s => onYChange(s),
        xyLengthBound,
        inputSize,
        inputClass
      ),
      ' ',
      inlineMath(']\\text{.}')
    ),
  ];
};

/* ::
type CauchyMatrixDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  allowFieldTypeChanges: boolean,
};

type CauchyMatrixDemoState = {
  x: string,
  y: string,
  fieldType: FieldType,
};
*/

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

      const t = [
        'Then, the Cauchy matrix constructed from ',
        inlineMath('x'),
        ' and ',
        inlineMath('y'),
        ' is ',
      ];

      if (m.rows() === m.columns()) {
        const mInv /* : typeof m */ = m.inverse();
        const mInvStr = mInv.toLaTeXString();
        if (mInvStr.length > matrixStringLengthBound) {
          throw new VChildError([
            'The Cauchy matrix constructed from ',
            inlineMath('x'),
            ' and ',
            inlineMath('y'),
            ' has an inverse which is too big to display.',
          ]);
        }

        t.push(displayMath(`${mStr}\\text{,}`));
        t.push(' which has inverse ');
        t.push(displayMath(`${mInvStr}\\text{.}`));
      } else {
        t.push(displayMath(`${mStr}\\text{.}`));
      }

      return t;
    });

    const preInput = props.allowFieldTypeChanges
      ? [
          'Working over the ',
          fieldTypeChoice(
            `${props.name}FieldTypeChoice`,
            state.fieldType,
            fieldType => this.onFieldTypeChange(fieldType),
            ','
          ),
          ' let ',
        ]
      : ['Let '];

    return preact.h(
      'div',
      { class: props.containerClass },
      props.header,
      preInput,
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
