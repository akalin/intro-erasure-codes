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

const augmentedMatrixLaTeXString = /* :: <T: Field<*>> */ (
  aLeft /* : Matrix<T> */,
  aRight /* : Matrix<T> */
) /* : string */ => {
  if (aLeft.rows() !== aRight.rows()) {
    throw new Error('Row count mismatch');
  }

  // TODO: Use an array environment with {cc...cc|cc...cc} when the
  // bug with midlines disappearing gets fixed. Better yet, use a
  // pmatrix environment with [cc...cc|cc...cc] when that gets
  // supported by KaTeX.

  const rowStrs = [];
  for (let i = 0; i < aLeft.rows(); i += 1) {
    const elemStrs = [];
    for (let j = 0; j < aLeft.columns(); j += 1) {
      elemStrs.push(aLeft.at(i, j).toString());
    }
    for (let j = 0; j < aRight.columns(); j += 1) {
      elemStrs.push(aRight.at(i, j).toString());
    }
    const rowStr = elemStrs.join(' & ');
    rowStrs.push(rowStr);
  }
  const elementStr = rowStrs.join(' \\\\\n');

  // Build the augmented matrix KaTeX string as described in
  // https://github.com/Khan/KaTeX/issues/971 .

  const arrayColSep = '5pt';
  const leftColStr = 'c'.repeat(aLeft.columns());
  const rightColStr = 'c'.repeat(aRight.columns());

  return `\\left( \\hskip -${arrayColSep}
\\begin{array}{${leftColStr}|${rightColStr}}
${elementStr}
\\end{array}
\\hskip -${arrayColSep} \\right)`;
};

/* ::
type RowReduceState<T : Field<*>> = {
  aLeft: Matrix<T>,
  aRight: Matrix<T>,
};
*/

const newState = /* :: <T: Field<*>> */ (
  m /* : Matrix<T> */
) /* : RowReduceState<T> */ => {
  const rows = m.rows();
  const columns = m.columns();

  if (rows !== columns) {
    throw new Error('Non-square matrix');
  }

  const aRight = new Matrix(
    rows,
    rows,
    (i, j) => (i === j ? m.oneElement() : m.zeroElement())
  );
  return { aLeft: m, aRight };
};

/* ::
type RowReduceProps = {
  m: Matrix<*>,
};

type RowReduceComponentState = RowReduceState<*>;
*/

// eslint-disable-next-line no-unused-vars
class RowReduce extends preact.Component /* :: <RowReduceProps, RowReduceComponentState> */ {
  constructor({ m } /* : RowReduceProps */) {
    super({ m });
    this.state = newState(m);
  }

  shouldComponentUpdate({ m: nextM } /* : RowReduceProps */) {
    return !this.props.m.equals(nextM);
  }

  componentWillReceiveProps({ m } /* : RowReduceProps */) {
    this.setState(newState(m));
  }

  render(props /* : RowReduceProps */, state /* : RowReduceComponentState */) {
    let mInv;
    try {
      mInv = props.m.inverse();
    } catch (e) {
      if (!(e instanceof SingularMatrixError)) {
        throw e;
      }
    }

    const aStr = augmentedMatrixLaTeXString(state.aLeft, state.aRight);
    const aElements = [
      'The initial augmented matrix ',
      inlineMath('A'),
      ' is ',
    ];
    if (aStr.length > matrixStringLengthBound) {
      aElements.push(' too big to display.');
    } else {
      aElements.push(displayMath(`${aStr}\\text{.}`));
    }

    let mInvElements = [' Also,'];
    if (mInv) {
      const mInvStr = mInv.toLaTeXString();
      if (mInvStr.length > matrixStringLengthBound) {
        mInvElements = mInvElements.concat(
          ' ',
          inlineMath('M^{-1}'),
          ' exists, but is too big to display.'
        );
      } else {
        mInvElements.push(displayMath(`M^{-1} = ${mInvStr}\\text{.}`));
      }
    } else {
      mInvElements = [
        ' ',
        inlineMath('M'),
        ' is singular, and thus has no inverse.',
      ];
    }

    return preact.h('div', {}, [aElements, mInvElements]);
  }
}

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
    const { h } = preact;

    const children = handleVChildError(() => {
      const m = parseSquareMatrix(state.fieldType, state.elements);
      const mStr = m.toLaTeXString();
      if (mStr.length > matrixStringLengthBound) {
        throw new VChildError([
          inlineMath('\\mathtt{SquareMatrix}(m)'),
          ' is too big to display.',
        ]);
      }

      return [
        'Then, let ',
        inlineMath('M = \\mathtt{SquareMatrix}(m)\\text{,}'),
        ' so ',
        displayMath(`M = ${mStr}\\text{.}`),
        h(RowReduce, { m }),
      ];
    });

    const inputSize = 30;
    return h(
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
