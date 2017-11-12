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
import { Matrix } from './matrix';
import {
  type FieldType,
  fieldTypeChoice,
  parseField256ElementListCapped,
  parseField257ElementListCapped,
  parseBigRationalListCapped,
  listInput,
  matrixStringLengthBound,
} from './matrix_demo_common';
import {
  type RowReduceState,
  rowReduceInitialState,
  rowReduceNextState,
} from './row_reduce';
import { inlineMath, displayMath } from './math';
*/
/*
global
  preact,

  VChildError,
  handleVChildError,
  impossible,
  spanNoWrap,

  Matrix,

  fieldTypeChoice,
  parseField256ElementListCapped,
  parseField257ElementListCapped,
  parseBigRationalListCapped,

  listInput,
  matrixStringLengthBound,

  rowReduceInitialState,
  rowReduceNextState,

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

const color = (c, s) => `{\\color{${c}}${s}}`;

const augmentedMatrixLaTeXString = /* :: <T: Field<*>> */ (
  aLeft /* : Matrix<T> */,
  aRight /* : Matrix<T> */,
  rowColors /* : (?string)[] */
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
    const rowColor = rowColors[i] || '';
    const elemColor = rowColor ? s => color(rowColor, s) : s => s;
    const elemStrs = [];
    for (let j = 0; j < aLeft.columns(); j += 1) {
      elemStrs.push(elemColor(aLeft.at(i, j).toString()));
    }
    for (let j = 0; j < aRight.columns(); j += 1) {
      elemStrs.push(elemColor(aRight.at(i, j).toString()));
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

const isUnitUpperTriangular = /* :: <T: Field<*>> */ (
  // See https://github.com/prettier/prettier/issues/719 .
  // eslint-disable-next-line prettier/prettier
  m /* : Matrix<T> */
) /* : boolean */ => {
  for (let i = 0; i < m.rows(); i += 1) {
    for (let j = 0; j <= i; j += 1) {
      if (!m.at(i, j).equals(i === j ? m.oneElement() : m.zeroElement())) {
        return false;
      }
    }
  }
  return true;
};

const isIdentity = /* :: <T: Field<*>> */ (
  // See https://github.com/prettier/prettier/issues/719 .
  // eslint-disable-next-line prettier/prettier
  m /* : Matrix<T> */
) /* : boolean */ => {
  for (let i = 0; i < m.rows(); i += 1) {
    for (let j = 0; j < m.rows(); j += 1) {
      if (!m.at(i, j).equals(i === j ? m.oneElement() : m.zeroElement())) {
        return false;
      }
    }
  }
  return true;
};

const getDetails = /* :: <T: Field<*>> */ (
  s /* : string */,
  mPrev /* : Matrix<T> */,
  m /* : Matrix<T> */,
  trailer /* : string */
) => {
  if (!isIdentity(mPrev) && isIdentity(m)) {
    return [
      inlineMath(`${s}\\text{,}`),
      ' which makes the left side of ',
      inlineMath('A'),
      ' the identity matrix',
      trailer,
    ];
  }

  if (!isUnitUpperTriangular(mPrev) && isUnitUpperTriangular(m)) {
    return [
      inlineMath(`${s}\\text{,}`),
      ' which makes the left side of ',
      inlineMath('A'),
      ' a unit upper triangular matrix',
      trailer,
    ];
  }

  return inlineMath(`${s}\\text{${trailer}}`);
};

/* ::
type RowReduceColors = {
  swapRowAColor: string,
  swapRowBColor: string,
  divideRowColor: string,
  subtractScaledRowSrcColor: string,
  subtractScaledRowDestColor: string,
};

type RowReduceProps = RowReduceColors & {
  m: Matrix<*>,
};

type RowReduceComponentState = {
  i: number,
  knownStates: RowReduceState<*>[],
};
*/

const colorsEqual = (a /* : RowReduceColors */, b /* : RowReduceColors */) => {
  const keys = Object.keys(a);
  for (let i = 0; i < keys.length; i += 1) {
    if (a[keys[i]] !== b[keys[i]]) {
      return false;
    }
  }
  return true;
};

// eslint-disable-next-line no-unused-vars
class RowReduce extends preact.Component /* :: <RowReduceProps, RowReduceComponentState> */ {
  constructor(props /* : RowReduceProps */) {
    super(props);
    this.state = { i: 0, knownStates: [rowReduceInitialState(props.m)] };
  }

  shouldComponentUpdate(
    nextProps /* : RowReduceProps */,
    nextState /* : RowReduceComponentState */
  ) {
    if (!this.props.m.equals(nextProps.m)) {
      return true;
    }

    if (!colorsEqual(this.props, nextProps)) {
      return true;
    }

    if (this.state.i !== nextState.i) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps /* : RowReduceProps */) {
    if (this.props.m.equals(nextProps.m)) {
      return;
    }

    this.setState({ i: 0, knownStates: [rowReduceInitialState(nextProps.m)] });
  }

  onPreviousStep() {
    // Should be { ...state, i: state.i - 1 }, but that is unsupported
    // by Safari.
    this.setState(state => ({
      i: state.i - 1,
      knownStates: state.knownStates,
    }));
  }

  onNextStep() {
    this.setState(state => {
      if (state.i + 1 < state.knownStates.length) {
        // Should be { ...state, i: state.i + 1 }, but that is unsupported
        // by Safari.
        return { i: state.i + 1, knownStates: state.knownStates };
      }

      const lastState = state.knownStates[state.knownStates.length - 1];
      const newState = rowReduceNextState(lastState);
      // Should be { ...state, i: state.i + 1, knownStates: state.knownStates.concat(newState) },
      // but that is unsupported by Safari.
      return {
        i: state.i + 1,
        knownStates: state.knownStates.concat(newState),
      };
    });
  }

  render(props /* : RowReduceProps */, state /* : RowReduceComponentState */) {
    const { h } = preact;

    const currState = state.knownStates[state.i];

    let children;
    switch (currState.type) {
      case 'initial': {
        const { aLeft, aRight } = currState;

        children = ['The initial augmented matrix ', inlineMath('A'), ' is '];

        const aStr = augmentedMatrixLaTeXString(aLeft, aRight, []);
        if (aStr.length > matrixStringLengthBound) {
          children.push(' too big to display.');
        } else {
          children.push(displayMath(`${aStr}\\text{.}`));
        }
        break;
      }

      case 'swap': {
        const {
          i,
          aLeftPrev,
          aRightPrev,
          aLeft,
          aRight,
          rowA,
          rowB,
        } = currState;

        children = [
          'We need ',
          inlineMath(`A_{${i}${i}}`),
          ' to be non-zero, so swap rows ',
          inlineMath(color(props.swapRowAColor, rowA.toString())),
          ' and ',
        ];

        const rowBStr = color(props.swapRowBColor, rowB.toString());

        const rowColorsPrev = [];
        rowColorsPrev[rowA] = props.swapRowAColor;
        rowColorsPrev[rowB] = props.swapRowBColor;

        const rowColors = [];
        rowColors[rowA] = props.swapRowBColor;
        rowColors[rowB] = props.swapRowAColor;

        const aStrPrev = augmentedMatrixLaTeXString(
          aLeftPrev,
          aRightPrev,
          rowColorsPrev
        );
        const aStr = augmentedMatrixLaTeXString(aLeft, aRight, rowColors);
        if (
          aStrPrev.length > matrixStringLengthBound ||
          aStr.length > matrixStringLengthBound
        ) {
          children = children.concat(
            getDetails(rowBStr, aLeftPrev, aLeft, '.'),
            ' (Matrices too big to display.)'
          );
        } else {
          children = children.concat(
            getDetails(rowBStr, aLeftPrev, aLeft, ':'),
            displayMath(`${aStrPrev} \\rightarrow ${aStr}\\text{.}`)
          );
        }
        break;
      }

      case 'singular': {
        const { aLeft, aRight } = currState;

        children = ['The current value of ', inlineMath('A'), ' is '];

        const aStr = augmentedMatrixLaTeXString(aLeft, aRight, []);
        if (aStr.length > matrixStringLengthBound) {
          children = children.concat(
            'too big to display, but its current value implies that ',
            inlineMath('M'),
            ' is not invertible.'
          );
        } else {
          children = [
            displayMath(`${aStr}\\text{.}`),
            'Since the left side of ',
            inlineMath('A'),
            ' has a column where the children on and below the diagonal are all zero, it cannot be transformed to the identity matrix, and thus ',
            inlineMath('M'),
            ' is not invertible.',
          ];
        }
        break;
      }

      case 'divide': {
        const {
          i,
          aLeftPrev,
          aRightPrev,
          aLeft,
          aRight,
          row,
          divisor,
        } = currState;

        children = [
          'We need ',
          inlineMath(`A_{${i}${i}}`),
          ' to be ',
          inlineMath('1'),
          ', so divide row ',
          inlineMath(color(props.divideRowColor, row.toString())),
          ' by ',
        ];

        const divisorStr = divisor.toString();

        const rowColors = [];
        rowColors[row] = props.divideRowColor;

        const aStrPrev = augmentedMatrixLaTeXString(
          aLeftPrev,
          aRightPrev,
          rowColors
        );
        const aStr = augmentedMatrixLaTeXString(aLeft, aRight, rowColors);
        if (
          aStrPrev.length > matrixStringLengthBound ||
          aStr.length > matrixStringLengthBound
        ) {
          children = children.concat(
            getDetails(divisorStr, aLeftPrev, aLeft, '.'),
            ' (Matrices too big to display.)'
          );
        } else {
          children = children.concat(
            getDetails(divisorStr, aLeftPrev, aLeft, ':'),
            displayMath(`${aStrPrev} \\rightarrow ${aStr}\\text{.}`)
          );
        }
        break;
      }

      case 'subtractScaled': {
        const {
          i,
          j,
          aLeftPrev,
          aRightPrev,
          aLeft,
          aRight,
          rowSrc,
          rowDest,
          scale,
        } = currState;

        children = [
          'We need ',
          inlineMath(`A_{${i}${j}}`),
          ' to be ',
          inlineMath('0'),
          ', so subtract row ',
          inlineMath(color(props.subtractScaledRowSrcColor, rowSrc.toString())),
        ];

        const rowColorsPrev = [];
        rowColorsPrev[rowSrc] = props.subtractScaledRowSrcColor;
        rowColorsPrev[rowDest] = props.subtractScaledRowDestColor;

        const rowColors = [];
        rowColors[rowDest] = props.subtractScaledRowDestColor;

        const aStrPrev = augmentedMatrixLaTeXString(
          aLeftPrev,
          aRightPrev,
          rowColorsPrev
        );
        const aStr = augmentedMatrixLaTeXString(aLeft, aRight, rowColors);

        if (scale) {
          children = children.concat(
            ' scaled by ',
            inlineMath(scale.toString())
          );
        }

        const rowDestStr = color(
          props.subtractScaledRowDestColor,
          rowDest.toString()
        );

        const tooBig =
          aStrPrev.length > matrixStringLengthBound ||
          aStr.length > matrixStringLengthBound;

        const trailer = tooBig ? '.' : ':';

        children = children.concat(
          ' from row ',
          getDetails(rowDestStr, aLeftPrev, aLeft, trailer)
        );

        if (tooBig) {
          children.push(' (Matrices too big to display.)');
        } else {
          children.push(
            displayMath(`${aStrPrev} \\rightarrow ${aStr}\\text{.}`)
          );
        }
        break;
      }

      case 'inverseFound': {
        const { aLeft, aRight } = currState;

        children = ['The current value of ', inlineMath('A'), ' is '];

        const aStr = augmentedMatrixLaTeXString(aLeft, aRight, []);
        const mInvStr = aRight.toLaTeXString();
        if (mInvStr.length > matrixStringLengthBound) {
          children = children.concat(
            'too big to display, but since its left side is the identity matrix, its right side is ',
            inlineMath('M^{-1}\\text{,}'),
            ' which is also too big to display.'
          );
        } else {
          if (aStr.length > matrixStringLengthBound) {
            children = children.concat(
              ' too big to display, but since its left side is the identity matrix, its right side'
            );
          } else {
            children = children.concat(
              displayMath(`${aStr}\\text{.}`),
              'Since the left side of ',
              inlineMath('A'),
              ' is the identity matrix, the right side of ',
              inlineMath('A')
            );
          }

          children = children.concat(
            ' is ',
            inlineMath('M^{-1}'),
            '. Therefore,',
            displayMath(`M^{-1} = ${mInvStr}\\text{.}`)
          );
        }
        break;
      }

      default:
        impossible(currState.type);
    }

    const prevDisabled = currState.type === 'initial';
    const prevButton = h(
      'button',
      { disabled: prevDisabled, onClick: () => this.onPreviousStep() },
      'Previous step'
    );

    const nextDisabled =
      currState.type === 'singular' || currState.type === 'inverseFound';
    const nextButton = h(
      'button',
      { disabled: nextDisabled, onClick: () => this.onNextStep() },
      'Next step'
    );

    return h('div', {}, children, h('div', {}, prevButton, ' ', nextButton));
  }
}

/* ::
type MatrixInverseDemoProps = RowReduceColors & {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  allowFieldTypeChanges: boolean,
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
        // Should be { ...props, m }, but that is unsupported by Safari.
        h(RowReduce, {
          swapRowAColor: props.swapRowAColor,
          swapRowBColor: props.swapRowBColor,
          divideRowColor: props.divideRowColor,
          subtractScaledRowSrcColor: props.subtractScaledRowSrcColor,
          subtractScaledRowDestColor: props.subtractScaledRowDestColor,
          m,
        }),
      ];
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

    const inputSize = 30;
    return h(
      'div',
      { class: props.containerClass },
      props.header,
      preInput,
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
