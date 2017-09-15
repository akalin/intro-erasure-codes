// @flow

/* eslint-env browser */

/* eslint no-bitwise: off */

'use strict';

/* :: import { carrylessAdd } from './carryless'; */
/* global preact, carrylessAdd */

const padStart = (
  s /* : string */,
  targetLength /* : number */,
  padString /* : string */
) /* : string */ => {
  if (s.length > targetLength) {
    return s;
  }

  const padLength = targetLength - s.length;
  let padding = padString;
  if (padLength > padding.length) {
    padding += padding.repeat(padLength / padding.length);
  }
  return padding.slice(0, padLength) + s;
};

/* ::
type ArithmeticType = 'standard' | 'carry-less';

type AddDetailProps = {
  a: number,
  b: number,
  sum: number,
  arithmeticType: ArithmeticType,
};
*/

// flowlint-next-line unclear-type:off
const impossible = (value /* : empty */) /* : any */ => {
  throw new Error(`Impossible case encountered: ${value}`);
};

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

  let op;
  switch (arithmeticType) {
    case 'standard':
      op = '+';
      break;
    case 'carry-less':
      op = '^';
      break;
    default:
      op = impossible(arithmeticType);
  }

  const output = `  a = ${aDecPadded} = ${aBinPadded}b
${op} b = ${bDecPadded} = ${bBinPadded}b
      ${decSpacer}   ${binDivider}-
      ${decSpacer}   ${sumBinPadded}b`;

  return preact.h('pre', null, output);
};

class VChildError extends Error {
  /* ::
  children: VChild[];
  */

  // flowlint-next-line unclear-type:off
  constructor(children /* : VChild[] */, ...params /* : any[] */) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VChildError);
    }
    this.children = children;
  }
}

const strictParseInt = (
  name /* : string */,
  s /* : string */
) /* : number */ => {
  if (!/^[+-]?[0-9]+$/.test(s)) {
    const nameVar = preact.h('var', null, name);
    throw new VChildError([nameVar, ' is not a valid number.']);
  }

  const n = parseInt(s, 10);
  if (Number.isNaN(n)) {
    throw new Error('Unexpected NaN');
  }

  return n;
};

const parseInt31 = (name /* : string */, s /* : string */) /* : number */ => {
  const n = strictParseInt(name, s);

  const nameVar = preact.h('var', null, name);

  if (n < 0) {
    throw new VChildError([nameVar, ' cannot be negative.']);
  }

  const maxInt31 = ~0 >>> 1;
  if (n > maxInt31) {
    throw new VChildError([nameVar, ' is too big.']);
  }

  return n;
};

const getTargetInput = (e /* : Event */) /* : HTMLInputElement */ => {
  if (!(e.target instanceof HTMLInputElement)) {
    throw new Error('e.target unexpectedly not an HTMLInputElement');
  }
  return e.target;
};

const styleNoWrap = { style: { whiteSpace: 'nowrap' } };

const spanNoWrap = (...children) => preact.h('span', styleNoWrap, ...children);

/* ::
type AddDemoState = {
  a: string,
  b: string,
  arithmeticType: ArithmeticType,
};
*/

// eslint-disable-next-line no-unused-vars
class AddDemo extends preact.Component /* :: <{}, AddDemoState> */ {
  constructor(
    { initialA: a, initialB: b } /* : { initialA: string, initialB: string } */
  ) {
    super({});
    // Workaround for https://github.com/prettier/prettier/issues/719 .
    const state /* : AddDemoState */ = { a, b, arithmeticType: 'carry-less' };
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

  render(props /* : {} */, state /* : AddDemoState */) {
    const { h } = preact;

    let children;
    try {
      const a = parseInt31('a', state.a);
      const b = parseInt31('b', state.b);

      const choiceGroupName = 'carrylessAddDemoArithmeticTypeChoice';
      const choiceRadio = (
        arithmeticType /* : ArithmeticType */,
        trailer /* : string */
      ) =>
        h(
          'label',
          styleNoWrap,
          h('input', {
            checked: state.arithmeticType === arithmeticType,
            name: choiceGroupName,
            type: 'radio',
            onChange: () => this.onArithmeticTypeChange(arithmeticType),
          }),
          ` ${arithmeticType} arithmetic${trailer}`
        );

      let sum;
      let op;
      switch (state.arithmeticType) {
        case 'standard':
          sum = (a + b) >>> 0;
          op = '+';
          break;
        case 'carry-less':
          sum = carrylessAdd(a, b);
          op = '⊕';
          break;
        default:
          [sum, op] = impossible(state.arithmeticType);
      }

      children = [
        'Then, with ',
        choiceRadio('standard', ''),
        ' ',
        choiceRadio('carry-less', ','),
        ' ',
        h(AddDetail, { a, b, sum, arithmeticType: state.arithmeticType }),
        ' so ',
        spanNoWrap(
          h('var', null, 'a'),
          ` ${op} `,
          h('var', null, 'b'),
          ` = ${sum.toString(2)}`,
          h('sub', null, 'b'),
          ` = ${sum.toString(10)}.`
        ),
      ];
    } catch (e) {
      if (!(e instanceof VChildError)) {
        throw e;
      }

      ({ children } = e);
    }

    return h(
      'div',
      null,
      'Let ',
      spanNoWrap(
        h('var', null, 'a'),
        ' = ',
        h('input', {
          type: 'text',
          value: state.a,
          onInput: (e /* : Event */) => {
            const input = getTargetInput(e);
            return this.onAChange(input.value);
          },
        })
      ),
      ' and ',
      spanNoWrap(
        h('var', null, 'b'),
        ' = ',
        h('input', {
          type: 'text',
          value: state.b,
          onInput: (e /* : Event */) => {
            const input = getTargetInput(e);
            return this.onBChange(input.value);
          },
        }),
        '.'
      ),
      ' ',
      children
    );
  }
}
