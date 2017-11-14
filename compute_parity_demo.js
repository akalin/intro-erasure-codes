// @flow

/* eslint-env browser */

'use strict';

/* ::
import {
  VChildError,
  handleVChildError,
  strictParseInt,
  parseListCapped,
  isEdge,
  listPattern,
  textInput,
  spanNoWrap,
  matrixStringLengthBound,
} from './demo_common';
import { Field256Element } from './field_256';
import { Matrix, type LaTeXStringOptions } from './matrix';
import { computeParityMatrix, computeParity } from './cauchy_erasure_code';
import { inlineMath, displayMath } from './math';
*/
/*
global
  preact,
  BigInteger,

  VChildError,
  handleVChildError,
  strictParseInt,
  parseListCapped,
  isEdge,
  listPattern,
  textInput,
  spanNoWrap,
  matrixStringLengthBound,

  Field256Element,

  Matrix,

  computeParityMatrix,
  computeParity,

  inlineMath,
  displayMath,
*/

const mnBound = 50;

// Work around
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12263977/
// .
const mPattern = isEdge ? '0*[0-9]{1,2}' : '(0*[0-9])|(0*[1-4][0-9])|(0*50)';

// eslint-disable-next-line no-unused-vars
const parseHex = (name /* : string */, s /* : string */) /* : BigInteger */ => {
  if (!/^[+-]?[0-9A-Fa-f]+$/.test(s)) {
    throw new VChildError([
      inlineMath(name),
      ' is not a valid hexadecimal number.',
    ]);
  }

  return new BigInteger(s, 16);
};

const parseByte = (
  name /* : string */,
  s /* : string */
) /* : Field256Element */ => {
  const n = parseHex(name, s);

  if (n.signum() < 0 || n.compareTo(new BigInteger('ff', 16)) > 0) {
    throw new VChildError([
      inlineMath(name),
      ' must be non-negative and fit in a byte.',
    ]);
  }

  return new Field256Element(n.intValue());
};

const parseByteList = (
  name /* : string */,
  s /* : string */
) /* : Field256Element[] */ => {
  const strs = parseListCapped(name, s, mnBound);
  return strs.map((t, i) => parseByte(`{${name}}_{${i}}`, t));
};

const bytePattern = '0*[0-9A-Fa-f]{1,2}';

const dataInput = (
  dValue /* : string */,
  onDChange /* : (string) => void */,
  inputClass /* : ?string */
) => {
  const inputSize = 30;
  return spanNoWrap(
    inlineMath('d = ['),
    ' ',
    textInput(
      dValue,
      s => onDChange(s),
      inputSize,
      listPattern(bytePattern, mnBound),
      inputClass
    ),
    ' ',
    inlineMath(']')
  );
};

const parsePositiveInt = (
  name /* : string */,
  s /* : string */
) /* : BigInteger */ => {
  const n = strictParseInt(name, s);
  if (n.signum() <= 0) {
    throw new VChildError([inlineMath(name), ' cannot be negative.']);
  }

  return n;
};

const hex = x => `\\mathtt{${x.toString(16).padStart(2, '0')}}`;

/* ::
type ComputeParityDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type ComputeParityDemoState = {
  d: string,
  m: string,
};
*/

// eslint-disable-next-line no-unused-vars
class ComputeParityDemo extends preact.Component /* :: <ComputeParityDemoProps, ComputeParityDemoState> */ {
  constructor(
    // Should be { initialD: d, initialM: m, ...props }, but that is
    // unsupported by Safari.
    props /* : ComputeParityDemoProps & {
      initialD: string,
      initialM: string,
    } */
  ) {
    super(props);
    this.state = { d: props.initialD, m: props.initialM };
  }

  onDChange(d /* : string */) {
    // Should be { ...state, d }, but that is unsupported by Safari.
    this.setState(state => ({ d, m: state.m }));
  }

  onMChange(m /* : string */) {
    // Should be { ...state, m }, but that is unsupported by Safari.
    this.setState(state => ({ d: state.d, m }));
  }

  render(
    props /* : ComputeParityDemoProps */,
    state /* : ComputeParityDemoState */
  ) {
    const children = handleVChildError(() => {
      const d = parseByteList('d', state.d);
      const n = d.length;
      const mBig = parsePositiveInt('m', state.m);
      if (mBig.compareTo(new BigInteger(mnBound.toString(10), 10)) > 0) {
        throw new VChildError([
          inlineMath('m'),
          ' must be less than or equal to ',
          inlineMath(mnBound.toString()),
          '.',
        ]);
      }

      const nBig = new BigInteger(n.toString(10), 10);
      if (mBig.add(nBig).compareTo(new BigInteger('256', 10)) > 0) {
        throw new VChildError([
          'The total byte count must be less than or equal to ',
          inlineMath('256'),
          '.',
        ]);
      }

      const m = mBig.intValue();

      const p = computeParity(d, m);

      const P = computeParityMatrix(n, m);

      const PStr = P.toLaTeXString({ elementToLaTeXString: hex });
      if (PStr.length > matrixStringLengthBound) {
        throw new VChildError([
          'The Cauchy matrix parity matrix is too big to display.',
        ]);
      }

      const colOptions /* : LaTeXStringOptions<Field256Element> */ = {
        environment: 'bmatrix',
        elementToLaTeXString: hex,
      };

      const pCol = new Matrix(m, 1, p);
      const dCol = new Matrix(n, 1, d);

      const dColStr = dCol.toLaTeXString(colOptions);
      const pColStr = pCol.toLaTeXString(colOptions);

      const pStr = p
        .map(x => `{\\color{${props.resultColor}}${hex(x)}}`)
        .join(', ');

      return [
        ' Then, with the input byte count ',
        inlineMath(`n = ${n}`),
        ', the ',
        inlineMath('m \\times n'),
        ' Cauchy parity matrix computed using ',
        inlineMath('x_i = n + i'),
        ' and ',
        inlineMath('y_i = i'),
        ' is ',
        displayMath(`${PStr}\\text{.}`),
        ' Therefore, the parity bytes are computed as',
        displayMath(`${PStr} \\cdot ${dColStr} = ${pColStr}\\text{,}`),
        ' and thus the output parity bytes are ',
        inlineMath(`p = [ ${pStr} ]\\text{.}`),
      ];
    });

    return preact.h(
      'div',
      { class: props.containerClass },
      props.header,
      'Let ',
      dataInput(state.d, s => this.onDChange(s), props.inputClass),
      ' be the input data bytes, and let ',
      spanNoWrap(
        inlineMath('m ='),
        ' ',
        textInput(
          state.m,
          s => this.onMChange(s),
          mnBound.toString(10).length,
          mPattern,
          props.inputClass
        )
      ),
      ' be the desired parity byte count. ',
      children
    );
  }
}
