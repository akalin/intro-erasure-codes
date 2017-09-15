// @flow

/* eslint-env browser */

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
type AddDetailProps = {
  a: number,
  b: number,
  sum: number,
};
*/

const AddDetail = ({ a, b, sum } /* : AddDetailProps */) => {
  const aDec = a.toString(10);
  const bDec = b.toString(10);

  const aBin = a.toString(2);
  const bBin = b.toString(2);
  const sumBin = sum.toString(2);

  const decPadLength = Math.max(aDec.length, bDec.length);

  const aDecPadded = padStart(aDec, decPadLength, ' ');
  const bDecPadded = padStart(bDec, decPadLength, ' ');
  const decSpacer = ' '.repeat(decPadLength);

  const binPadLength = Math.max(aBin.length, bBin.length, sumBin.length);

  const aBinPadded = padStart(aBin, binPadLength, ' ');
  const bBinPadded = padStart(bBin, binPadLength, ' ');
  const sumBinPadded = padStart(sumBin, binPadLength, ' ');
  const binDivider = '-'.repeat(binPadLength);

  const output = `  a = ${aDecPadded} = ${aBinPadded}b
^ b = ${bDecPadded} = ${bBinPadded}b
      ${decSpacer}   ${binDivider}-
      ${decSpacer}   ${sumBinPadded}b`;

  return preact.h('pre', null, output);
};

const getTargetInput = (e /* : Event */) /* : HTMLInputElement */ => {
  if (!(e.target instanceof HTMLInputElement)) {
    throw new Error('e.target unexpectedly not an HTMLInputElement');
  }
  return e.target;
};

const spanNoWrap = (...children) =>
  preact.h('span', { style: { whiteSpace: 'nowrap' } }, ...children);

/* ::
type AddDemoState = {
  a: number,
  b: number,
};
*/

// eslint-disable-next-line no-unused-vars
class AddDemo extends preact.Component /* :: <{}, AddDemoState> */ {
  constructor(
    { initialA: a, initialB: b } /* : { initialA: number, initialB: number } */
  ) {
    super({});
    // Workaround for https://github.com/prettier/prettier/issues/719 .
    const state /* : AddDemoState */ = { a, b };
    this.state = state;
  }

  onAChange(a /* : number */) {
    // Should be { ...state, a }, but that is unsupported by Safari.
    this.setState(state => ({ a, b: state.b }));
  }

  onBChange(b /* : number */) {
    // Should be { ...state, b }, but that is unsupported by Safari.
    this.setState(state => ({ a: state.a, b }));
  }

  render(props /* : {} */, { a, b } /* : AddDemoState */) {
    const { h } = preact;

    // TODO: Sanity-check a and b.
    const sum = carrylessAdd(a, b);
    const aVar = h('var', null, 'a');
    const bVar = h('var', null, 'b');
    return h(
      'div',
      null,
      'Let ',
      spanNoWrap(
        aVar,
        ' = ',
        h('input', {
          type: 'text',
          value: a.toString(10),
          onInput: (e /* : Event */) => {
            const input = getTargetInput(e);
            return this.onAChange(parseInt(input.value, 10));
          },
        })
      ),
      ' and ',
      spanNoWrap(
        bVar,
        ' = ',
        h('input', {
          type: 'text',
          value: b.toString(10),
          onInput: (e /* : Event */) => {
            const input = getTargetInput(e);
            return this.onBChange(parseInt(input.value, 10));
          },
        }),
        '.'
      ),
      ' Then ',
      h(AddDetail, { a, b, sum }),
      ' so ',
      spanNoWrap(
        aVar,
        ' ⊕ ',
        bVar,
        ` = ${sum.toString(2)}`,
        h('sub', null, 'b'),
        ` = ${sum.toString(10)}.`
      )
    );
  }
}
