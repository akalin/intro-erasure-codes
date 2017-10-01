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
import { SingularMatrixError, Matrix } from './matrix';
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

  SingularMatrixError,
  Matrix,

  fieldTypeChoice,
  parseField256ElementListCapped,
  parseField257ElementListCapped,
  parseBigRationalListCapped,

  listInput,
  matrixStringLengthBound,

  inlineMath,
  displayMath,
*/

const checkSquareSize = /* :: <T: Field<*>> */ (
  name /* : string */,
  x /* : T[] */
) /* : number */ => {
  const count = x.length;
  const dim = Math.floor(Math.sqrt(count));
  if (dim * dim !== count) {
    throw new VChildError([
      inlineMath(name),
      ' must have enough elements to fill a square matrix.',
    ]);
  }
  return dim;
};

const mLengthBound = 900;

const parseSquareMatrix = (
  fieldType /* : FieldType */,
  mStr /* : string */
) /* : Matrix<Field256Element> | Matrix<Field257Element> | Matrix<BigRational> */ => {
  // Duplicate some code below to work around limitations of flow's
  // type system.
  switch (fieldType) {
    case 'gf256': {
      const m = parseField256ElementListCapped('m', mStr, mLengthBound);
      const dim = checkSquareSize('m', m);
      return new Matrix(dim, dim, m);
    }

    case 'gf257': {
      const m = parseField257ElementListCapped('m', mStr, mLengthBound);
      const dim = checkSquareSize('m', m);
      return new Matrix(dim, dim, m);
    }

    case 'rational': {
      const m = parseBigRationalListCapped('m', mStr, mLengthBound);
      const dim = checkSquareSize('m', m);
      return new Matrix(dim, dim, m);
    }

    default:
      return impossible(fieldType);
  }
};

/* ::

type MatrixInverseDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
};

type MatrixInverseDemoState = {
  elements: string,
  fieldType: FieldType,
};
*/

// eslint-disable-next-line no-unused-vars
class MatrixInverseDemo extends preact.Component /* :: <MatrixInverseDemoProps, MatrixInverseDemoState> */ {
  constructor(
    // Should be { initialElements: elements, initialFieldType: fieldType, ...props },
    // but that is unsupported by Safari.
    props /* : MatrixInverseDemoProps & {
      initialElements: string,
      initialFieldType: FieldType,
    } */
  ) {
    super(props);
    this.state = {
      elements: props.initialElements,
      fieldType: props.initialFieldType,
    };
  }

  onElementsChange(elements /* : string */) {
    // Should be { ...state, elements }, but that is unsupported by Safari.
    this.setState(state => ({ elements, fieldType: state.fieldType }));
  }

  onFieldTypeChange(fieldType /* : FieldType */) {
    // Should be { ...state, fieldType }, but that is unsupported by Safari.
    this.setState(state => ({ elements: state.elements, fieldType }));
  }

  render(
    props /* : MatrixInverseDemoProps */,
    state /* : MatrixInverseDemoState */
  ) {
    const children = handleVChildError(() => {
      const m = parseSquareMatrix(state.fieldType, state.elements);
      const mStr = m.toLaTeXString();
      if (mStr.length > matrixStringLengthBound) {
        throw new VChildError([
          inlineMath('\\mathtt{SquareMatrix}(m)'),
          ' is too big to display.',
        ]);
      }

      const t = [
        'Then, let ',
        inlineMath('M = \\mathtt{SquareMatrix}(m)\\text{,}'),
        ' so ',
        displayMath(`M = ${mStr}\\text{.}`),
      ];

      let mInv;
      try {
        mInv = m.inverse();
      } catch (e) {
        if (!(e instanceof SingularMatrixError)) {
          throw e;
        }
      }

      if (mInv) {
        const mInvStr = mInv.toLaTeXString();
        if (mInvStr.length > matrixStringLengthBound) {
          throw new VChildError([
            inlineMath('\\mathtt{SquareMatrix}(m)^{-1}'),
            ' is too big to display.',
          ]);
        }
        t.push(' Also, ');
        t.push(displayMath(`M^{-1} = ${mInvStr}\\text{.}`));
      } else {
        t.push(' ');
        t.push(inlineMath('M'));
        t.push(' is singular, and thus has no inverse.');
      }

      return t;
    });

    const inputSize = 30;
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
      ' let ',
      spanNoWrap(
        inlineMath('m = ['),
        ' ',
        listInput(
          state.fieldType,
          state.elements,
          s => this.onElementsChange(s),
          mLengthBound,
          inputSize,
          props.inputClass
        ),
        ' ',
        inlineMath(']\\text{.}')
      ),
      ' ',
      children
    );
  }
}
