// @flow

/* eslint-env browser */

'use strict';

/* ::
import { carrylessAddBig } from './carryless';
import { handleVChildError, binaryOpInput } from './demo_common';
import {
  padStart,
  nonNegativeIntPatternCapped,
  parseNonNegativeIntCapped,
  type ArithmeticType,
  impossible,
  addOpStr,
  arithmeticTypeChoice,
} from './carryless_demo_common';
import { inlineMath } from './math';
*/
/*
global
  preact,

  carrylessAddBig,

  handleVChildError,
  binaryOpInput,

  padStart,
  nonNegativeIntPatternCapped,
  parseNonNegativeIntCapped,
  impossible,
  addOpStr,
  arithmeticTypeChoice,

  inlineMath,
*/

/* ::

type AddDetailProps = {
  a: BigInteger,
  b: BigInteger,
  sum: BigInteger,
  arithmeticType: ArithmeticType,
};
*/

const AddDetail = ({ a, b, sum, arithmeticType } /* : AddDetailProps */) => {
  const aDec = a.toString(10);
  const bDec = b.toString(10);

  const aBin = a.toString(2);
  const bBin = b.toString(2);
  const sumBin = sum.toString(2);

  const decPadLength = Math.max(aDec.length, bDec.length);

  const aDecPadded = padStart(aDec, decPadLength, ' ');
  const bDecPadded = padStart(bDec, decPadLength, ' ');
  const decSpacer = ' '.repeat(decPadLength);

  // Always account for the carry bit.
  const binPadLength = Math.max(aBin.length, bBin.length) + 1;
  if (sumBin.length < binPadLength - 1 || sumBin.length > binPadLength) {
    throw new Error(`Unexpected sum ${sumBin} for ${aBin} and ${bBin}`);
  }

  const aBinPadded = padStart(aBin, binPadLength, ' ');
  const bBinPadded = padStart(bBin, binPadLength, ' ');
  const sumBinPadded = padStart(sumBin, binPadLength, ' ');
  const binDivider = '-'.repeat(binPadLength);

  const op = addOpStr(arithmeticType);
  const output = `  a = ${aDecPadded} = ${aBinPadded}b
${op} b = ${bDecPadded} = ${bBinPadded}b
      ${decSpacer}   ${binDivider}-
      ${decSpacer}   ${sumBinPadded}b`;

  return preact.h('pre', null, output);
};

/* ::
type AddDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type AddDemoState = {
  a: string,
  b: string,
  arithmeticType: ArithmeticType,
};
*/

// eslint-disable-next-line no-unused-vars
class AddDemo extends preact.Component /* :: <AddDemoProps, AddDemoState> */ {
  constructor(
    // Should be { initialA: a, initialB: b, ...props }, but that is
    // unsupported by Safari.
    props /* : AddDemoProps & { initialA: string, initialB: string } */
  ) {
    super(props);
    // Workaround for https://github.com/prettier/prettier/issues/719 .
    const state /* : AddDemoState */ = {
      a: props.initialA,
      b: props.initialB,
      arithmeticType: 'carry-less',
    };
    this.state = state;
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

  render(props /* : AddDemoProps */, state /* : AddDemoState */) {
    const { h } = preact;

    const children = handleVChildError(() => {
      const a = parseNonNegativeIntCapped('a', state.a);
      const b = parseNonNegativeIntCapped('b', state.b);

      let sum;
      let op;
      switch (state.arithmeticType) {
        case 'standard':
          sum = a.add(b);
          op = '+';
          break;
        case 'carry-less':
          sum = carrylessAddBig(a, b);
          op = '\\oplus';
          break;
        default:
          [sum, op] = impossible(state.arithmeticType);
      }

      const sumBin = sum.toString(2);
      const sumDec = sum.toString(10);
      return [
        'Then, with ',
        arithmeticTypeChoice(
          `${props.name}ArithmeticTypeChoice`,
          state.arithmeticType,
          arithmeticType => this.onArithmeticTypeChange(arithmeticType),
          ','
        ),
        ' ',
        h(AddDetail, { a, b, sum, arithmeticType: state.arithmeticType }),
        ' so ',
        inlineMath(
          `a ${op} b = ${sumBin}_{\\text{b}} = {\\color{${
            props.resultColor
          }}${sumDec}}\\text{.}`
        ),
      ];
    });

    return h(
      'div',
      { class: props.containerClass },
      props.header,
      'Let ',
      binaryOpInput(
        state.a,
        state.b,
        s => this.onAChange(s),
        s => this.onBChange(s),
        nonNegativeIntPatternCapped,
        props.inputClass
      ),
      ' ',
      children
    );
  }
}
