// @flow

/* eslint-env browser */

'use strict';

/* ::
import { carrylessMulBig } from './carryless';
import {
  padStart,
  handleVChildError,
  parseNonNegativeIntCapped,
  type ArithmeticType,
  impossible,
  addOpStr,
  mulOpStr,
  binaryOpInput,
  arithmeticTypeChoice,
} from './carryless_demo_common';
import { inlineMath } from './inline_math';
*/
/*
global
  preact,

  carrylessMulBig,

  padStart,
  handleVChildError,
  parseNonNegativeIntCapped,
  impossible,
  addOpStr,
  mulOpStr,
  binaryOpInput,
  arithmeticTypeChoice,

  inlineMath
*/

/* ::
type MulDetailProps = {
  a: BigInteger,
  b: BigInteger,
  product: BigInteger,
  arithmeticType: ArithmeticType,
};
*/

const MulDetail = (
  { a, b, product, arithmeticType } /* : MulDetailProps */
) => {
  const aDec = a.toString(10);
  const bDec = b.toString(10);

  const aBin = a.toString(2);
  const bBin = b.toString(2);
  const productBin = product.toString(2);

  const intermediates = [];
  if (a.signum() !== 0 && b.signum() !== 0) {
    for (let i = 0; i < b.bitLength(); i += 1) {
      if (b.testBit(i)) {
        intermediates.push(aBin + ' '.repeat(i));
      }
    }
  }

  const decPadLength = Math.max(aDec.length, bDec.length);

  const aDecPadded = padStart(aDec, decPadLength, ' ');
  const bDecPadded = padStart(bDec, decPadLength, ' ');

  // Always account for the carry bit.
  const binPadLength = Math.max(aBin.length + bBin.length);
  if (
    product.signum() !== 0 &&
    (productBin.length < binPadLength - 1 || productBin.length > binPadLength)
  ) {
    throw new Error(`Unexpected product ${productBin} for ${aBin} and ${bBin}`);
  }

  const aBinPadded = padStart(aBin, binPadLength, ' ');
  const bBinPadded = padStart(bBin, binPadLength, ' ');
  const intermediatesPadded = intermediates.map(s =>
    padStart(s, binPadLength, ' ')
  );
  const productBinPadded = padStart(productBin, binPadLength, ' ');
  const binDivider = '-'.repeat(binPadLength);

  const addOp = addOpStr(arithmeticType);
  const op = mulOpStr(arithmeticType);

  const opLength = op.length + 1;
  const varLength = `x = ${aDecPadded} = `.length;

  const intermediatePadding = ' '.repeat(
    opLength + varLength - (addOp.length + 2)
  );

  const intermediatesStr = intermediatesPadded
    .map(
      (s, i) =>
        `${intermediatePadding} ${
          i > 0 ? addOp : ' '.repeat(addOp.length)
        } ${s}`
    )
    .join('\n');

  const opPadding = ' '.repeat(opLength);
  const opVarPadding = ' '.repeat(opLength + varLength);

  const longMultStr =
    intermediatesPadded.length > 1
      ? `${intermediatesStr}
${opVarPadding}${binDivider}-
`
      : '';

  const output = `${opPadding}a = ${aDecPadded} = ${aBinPadded}b
${op} b = ${bDecPadded} = ${bBinPadded}b
${opVarPadding}${binDivider}-
${longMultStr}${opVarPadding}${productBinPadded}b`;

  return preact.h('pre', null, output);
};

/* ::
type MulDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type MulDemoState = {
  a: string,
  b: string,
  arithmeticType: ArithmeticType,
};
*/

// eslint-disable-next-line no-unused-vars
class MulDemo extends preact.Component /* :: <MulDemoProps, MulDemoState> */ {
  constructor(
    // Should be { initialA: a, initialB: b, ...props }, but that is
    // unsupported by Safari.
    props /* : MulDemoProps & { initialA: string, initialB: string } */
  ) {
    super(props);
    this.state = {
      a: props.initialA,
      b: props.initialB,
      arithmeticType: 'carry-less',
    };
  }

  onAChange(a /* : string */) {
    // Should be { ...state, a }, but that is unsupported by Safari.
    this.setState(state => ({
      a,
      b: state.b,
      arithmeticType: state.arithmeticType,
    }));
  }

  onBChange(b /* : string */) {
    // Should be { ...state, b }, but that is unsupported by Safari.
    this.setState(state => ({
      a: state.a,
      b,
      arithmeticType: state.arithmeticType,
    }));
  }

  onArithmeticTypeChange(arithmeticType /* : ArithmeticType */) {
    // Should be { ...state, arithmeticType }, but that is unsupported
    // by Safari.
    this.setState(state => ({ a: state.a, b: state.b, arithmeticType }));
  }

  render(props /* : MulDemoProps */, state /* : MulDemoState */) {
    const { h } = preact;

    const children = handleVChildError(() => {
      const a = parseNonNegativeIntCapped('a', state.a);
      const b = parseNonNegativeIntCapped('b', state.b);

      let product;
      let op;
      switch (state.arithmeticType) {
        case 'standard':
          product = a.multiply(b);
          op = '\\times';
          break;
        case 'carry-less':
          product = carrylessMulBig(a, b);
          op = '\\otimes';
          break;
        default:
          [product, op] = impossible(state.arithmeticType);
      }

      const productBin = product.toString(2);
      const productDec = product.toString(10);
      return [
        'Then, with ',
        arithmeticTypeChoice(
          `${props.name}ArithmeticTypeChoice`,
          state.arithmeticType,
          arithmeticType => this.onArithmeticTypeChange(arithmeticType),
          ','
        ),
        ' ',
        h(MulDetail, {
          a,
          b,
          product,
          arithmeticType: state.arithmeticType,
        }),
        ' so ',
        inlineMath(
          `a ${op} b = ${productBin}_{\\text{b}} = {\\color{${
            props.resultColor
          }}${productDec}}\\text{.}`
        ),
      ];
    });

    return h(
      'div',
      { class: props.containerClass },
      props.header,
      binaryOpInput(
        state.a,
        state.b,
        s => this.onAChange(s),
        s => this.onBChange(s),
        props.inputClass
      ),
      ' ',
      children
    );
  }
}
