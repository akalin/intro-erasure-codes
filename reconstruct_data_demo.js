// @flow

/* eslint-env browser */

'use strict';

/* ::
import {
  VChildError,
  handleVChildError,
  parseListCapped,
  listPattern,
  textInput,
  spanNoWrap,
} from './demo_common';
import { parseHex, byteLaTeX } from './erasure_code_demo_common';
import { Field256Element } from './field_256';
import { Matrix, type LaTeXStringOptions } from './matrix';
import {
  computeParityMatrix,
  computeReconstructionIntermediates,
  reconstructData,
  NotEnoughKnownBytesError,
} from './cauchy_erasure_code';
import { inlineMath, displayMath } from './math';
*/
/*
global
  preact,
  BigInteger,

  VChildError,
  handleVChildError,
  parseListCapped,
  listPattern,
  textInput,
  spanNoWrap,

  parseHex,
  byteLaTeX,

  Field256Element,

  Matrix,

  computeParityMatrix,
  computeReconstructionIntermediates,
  reconstructData,
  NotEnoughKnownBytesError,

  inlineMath,
  displayMath,
*/

const mnBoundReconstruct = 25;

// eslint-disable-next-line no-unused-vars
const parseMaybeByte = (
  name /* : string */,
  s /* : string */
) /* : ?Field256Element */ => {
  const makeError = () =>
    new VChildError([
      inlineMath(name),
      ' must either be a string of question marks, or be a non-negative integer that fits in a byte.',
    ]);
  if (/[?]/.test(s)) {
    if (!/^[?]+$/.test(s)) {
      throw makeError();
    }

    return null;
  }

  const n = parseHex(name, s);

  if (n.signum() < 0 || n.compareTo(new BigInteger('ff', 16)) > 0) {
    throw makeError();
  }

  return new Field256Element(n.intValue());
};

const parseMaybeByteList = (
  name /* : string */,
  s /* : string */
) /* : (?Field256Element)[] */ => {
  const strs = parseListCapped(name, s, mnBoundReconstruct);
  return strs.map((t, i) => parseMaybeByte(`{${name}}_{${i}}`, t));
};

const maybeBytePattern = '([?]+)|(0*[0-9A-Fa-f]{1,2})';

const maybeByteInput = (
  name /* : string */,
  value /* : string */,
  onChange /* : (string) => void */,
  inputClass /* : ?string */
) => {
  const inputSize = 30;
  return spanNoWrap(
    inlineMath(`${name} = [`),
    ' ',
    textInput(
      value,
      s => onChange(s),
      inputSize,
      listPattern(maybeBytePattern, mnBoundReconstruct),
      inputClass
    ),
    ' ',
    inlineMath(']')
  );
};

/* ::
type ReconstructDataDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type ReconstructDataDemoState = {
  partialD: string,
  partialP: string,
};
*/

// eslint-disable-next-line no-unused-vars
class ReconstructDataDemo extends preact.Component /* :: <ReconstructDataDemoProps, ReconstructDataDemoState> */ {
  constructor(
    // Should be { initialPartialD: partialD, initialPartialP: partialP, ...props },
    // but that is unsupported by Safari.
    props /* : ReconstructDataDemoProps & {
      initialPartialD: string,
      initialPartialP: string,
    } */
  ) {
    super(props);
    this.state = {
      partialD: props.initialPartialD,
      partialP: props.initialPartialP,
    };
  }

  onPartialDChange(partialD /* : string */) {
    // Should be { ...state, partialD }, but that is unsupported by Safari.
    this.setState(state => ({ partialD, partialP: state.partialP }));
  }

  onPartialPChange(partialP /* : string */) {
    // Should be { ...state, partialD }, but that is unsupported by Safari.
    this.setState(state => ({ partialD: state.partialD, partialP }));
  }

  render(
    props /* : ReconstructDataDemoProps */,
    state /* : ReconstructDataDemoState */
  ) {
    const children = handleVChildError(() => {
      const partialD = parseMaybeByteList('d', state.partialD);
      const partialP = parseMaybeByteList('d', state.partialP);
      const n = partialD.length;
      const m = partialP.length;

      if (n + m > 256) {
        throw new VChildError([
          'The total byte count must be less than or equal to ',
          inlineMath('256'),
          '.',
        ]);
      }

      let info;
      try {
        const { bytesToUse, M } = computeReconstructionIntermediates(
          partialD,
          partialP
        );

        const d = reconstructData(partialD, partialP);
        info = { bytesToUse, M, d };
      } catch (e) {
        if (!(e instanceof NotEnoughKnownBytesError)) {
          throw e;
        }
      }

      if (!info) {
        return [
          ' There are fewer than ',
          inlineMath(`n = ${n}`),
          ' known bytes, so we cannot reconstruct ',
          inlineMath(`d\\text{.}`),
        ];
      }

      const { bytesToUse, M, d } = info;

      const P = computeParityMatrix(n, m);
      const G = new Matrix(n + m, n, (i, j) => {
        if (i < n) {
          return i === j ? Field256Element.One : Field256Element.Zero;
        }
        return P.at(i - n, j);
      });

      const known = i =>
        i < n
          ? partialD[i] instanceof Field256Element
          : partialP[i - n] instanceof Field256Element;

      const GDisplay = (x, i) =>
        known(i) ? byteLaTeX(x) : `\\xcancel{${byteLaTeX(x)}}`;
      const GStr = G.toLaTeXString({ elementToLaTeXString: GDisplay });

      const MStr = M.toLaTeXString({ elementToLaTeXString: byteLaTeX });

      const MInv = M.inverse();
      const MInvStr = MInv.toLaTeXString({ elementToLaTeXString: byteLaTeX });

      const colOptions /* : LaTeXStringOptions<Field256Element> */ = {
        environment: 'bmatrix',
        elementToLaTeXString: byteLaTeX,
      };

      const bytesToUseCol = new Matrix(n, 1, bytesToUse);
      const bytesToUseColStr = bytesToUseCol.toLaTeXString(colOptions);

      const dCol = new Matrix(n, 1, d);

      const dColStr = dCol.toLaTeXString(colOptions);

      const dStr = d
        .map(x => `{\\color{${props.resultColor}}${byteLaTeX(x)}}`)
        .join(', ');

      return [
        ' Then, with the data byte count ',
        inlineMath(`n = ${n}`),
        ' and the parity byte count ',
        inlineMath(`m = ${m}`),
        ', and appending the rows of the ',
        inlineMath('m \\times n'),
        ' Cauchy parity matrix to the ',
        inlineMath('n \\times n'),
        ' identity matrix, we get ',
        displayMath(`${GStr}\\text{,}`),
        'where the rows corresponding to unknown data and parity bytes are crossed out. Taking the first ',
        inlineMath('n'),
        ' rows that aren\u2019t crossed out, we get the square matrix',
        displayMath(MStr),
        ' which has inverse ',
        displayMath(`${MInvStr}\\text{.}`),
        'Therefore, the data bytes are reconstructed from the first ',
        inlineMath('n'),
        ' known data and parity bytes as',
        displayMath(
          `${MInvStr} \\cdot ${bytesToUseColStr} = ${dColStr}\\text{,}`
        ),
        'and thus the output data bytes are ',
        inlineMath(`d = [ ${dStr} ]\\text{.}`),
      ];
    });

    return preact.h(
      'div',
      { class: props.containerClass },
      props.header,
      'Let ',
      maybeByteInput(
        'd_{\\text{partial}}',
        state.partialD,
        s => this.onPartialDChange(s),
        props.inputClass
      ),
      ' be the input partial data bytes, and let ',
      maybeByteInput(
        'p_{\\text{partial}}',
        state.partialP,
        s => this.onPartialPChange(s),
        props.inputClass
      ),
      ' be the input partial parity bytes. ',
      children
    );
  }
}
