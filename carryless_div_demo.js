// @flow

/* eslint-env browser */

'use strict';

/* ::
import { carrylessDivBig } from './carryless';
import { handleVChildError, binaryOpInput } from './demo_common';
import {
  padStart,
  nonNegativeIntPatternCapped,
  parseNonNegativeIntCapped,
  type ArithmeticType,
  impossible,
  subOpStr,
  arithmeticTypeChoice,
} from './carryless_demo_common';
import { computeIntermediates } from './carryless_div_demo_util';
import { inlineMath } from './math';
*/
/*
global
  preact,

  carrylessDivBig,

  handleVChildError,
  binaryOpInput,

  padStart,
  nonNegativeIntPatternCapped,
  parseNonNegativeIntCapped,
  impossible,
  subOpStr,
  arithmeticTypeChoice,
  computeIntermediates,

  inlineMath
*/

/* ::
type DivDetailProps = {
  a: BigInteger,
  b: BigInteger,
  quotient: BigInteger,
  remainder: BigInteger,
  arithmeticType: ArithmeticType,
};
*/

const DivDetail = (
  { a, b, quotient, remainder, arithmeticType } /* : DivDetailProps */
) => {
  const aDec = a.toString(10);
  const bDec = b.toString(10);

  const aBin = a.toString(2);
  const bBin = b.toString(2);
  const quotientBin = quotient.toString(2);

  const intermediates = computeIntermediates(a, b, arithmeticType);
  const lastIntermediate = intermediates[intermediates.length - 1].intermediate;
  if (lastIntermediate.compareTo(remainder) !== 0) {
    throw new Error(
      `Expected last intermediate ${remainder.toString(
        10
      )}, got ${lastIntermediate.toString(10)}`
    );
  }
  intermediates.shift();

  const quotientBinPadded = padStart(quotientBin, aBin.length, ' ');

  const subOp = subOpStr(arithmeticType);

  const bStr = `b = ${bDec} = ${bBin}b`;
  const bPadding = ' '.repeat(bStr.length + 2);

  const topDivider = '-'.repeat(aBin.length + 1);

  const intermediatesStr = intermediates
    .map((o, i) => {
      const prevOffset = i > 0 ? intermediates[i - 1].offset : 0;
      const opBPadding = ' '.repeat(
        bStr.length + 2 - (subOp.length + 1) + prevOffset
      );
      const dividerPadding = ' '.repeat(bStr.length + 2 + prevOffset);
      const intermediatePadding = ' '.repeat(bStr.length + 2 + o.offset);
      const last = i >= intermediates.length - 1;
      return `${opBPadding}${subOp} ${bBin}
${dividerPadding}${'-'.repeat(bBin.length)}
${intermediatePadding}${o.intermediate.toString(2)}${last ? 'b' : ''}`;
    })
    .join('\n');

  const output = `${bPadding}${quotientBinPadded}b
${bPadding}${topDivider}
${bStr} )${aBin}b = ${aDec} = a
${intermediatesStr}`;

  return preact.h('pre', null, output);
};

/* ::
type DivDemoProps = {
  name: string,
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type DivDemoState = {
  a: string,
  b: string,
  arithmeticType: ArithmeticType,
};
*/

// eslint-disable-next-line no-unused-vars
class DivDemo extends preact.Component /* :: <DivDemoProps, DivDemoState> */ {
  constructor(
    // Should be { initialA: a, initialB: b, ...props }, but that is
    // unsupported by Safari.
    props /* : DivDemoProps & { initialA: string, initialB: string } */
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

  render(props /* : DivDemoProps */, state /* : DivDemoState */) {
    const { h } = preact;

    const children = handleVChildError(() => {
      const a = parseNonNegativeIntCapped('a', state.a);
      const b = parseNonNegativeIntCapped('b', state.b);

      let quotient;
      let remainder;
      let op;
      switch (state.arithmeticType) {
        case 'standard':
          [quotient, remainder] = a.divideAndRemainder(b);
          op = '\\div';
          break;
        case 'carry-less':
          ({ q: quotient, r: remainder } = carrylessDivBig(a, b));
          op = '\\oslash';
          break;
        default:
          [quotient, remainder, op] = impossible(state.arithmeticType);
      }

      const quotientBin = quotient.toString(2);
      const quotientDec = quotient.toString(10);
      const remainderBin = remainder.toString(2);
      const remainderDec = remainder.toString(10);
      return [
        'Then, with ',
        arithmeticTypeChoice(
          `${props.name}ArithmeticTypeChoice`,
          state.arithmeticType,
          arithmeticType => this.onArithmeticTypeChange(arithmeticType),
          ','
        ),
        ' ',
        h(DivDetail, {
          a,
          b,
          quotient,
          remainder,
          arithmeticType: state.arithmeticType,
        }),
        ' so ',
        inlineMath(
          `a ${op} b = ${quotientBin}_{\\text{b}} = {\\color{${
            props.resultColor
          }}${quotientDec}}`
        ),
        ' with remainder ',
        inlineMath(
          `${remainderBin}_{\\text{b}} = {\\color{${
            props.resultColor
          }}${remainderDec}}\\text{.}`
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
