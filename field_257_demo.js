// @flow

/* eslint-env browser */

'use strict';

/* ::
import { Field257Element } from './field_257';
import {
  VChildError,
  handleVChildError,
  strictParseInt,
  field257Pattern,
  binaryOpInput,
} from './demo_common';
import { inlineMath } from './inline_math';
*/
/*
global
  preact,
  BigInteger,

  Field257Element,

  VChildError,
  handleVChildError,
  strictParseInt,
  field257Pattern,
  binaryOpInput,

  inlineMath,
*/

const parseField257Element = (
  name /* : string */,
  s /* : string */
) /* : Field257Element */ => {
  const n = strictParseInt(name, s);

  if (n.signum() < 0 || n.compareTo(new BigInteger('257')) >= 0) {
    throw new VChildError([
      inlineMath(name),
      ' must be non-negative and less than ',
      inlineMath('257'),
      '.',
    ]);
  }

  return new Field257Element(n.intValue());
};

/* ::
type Field257DemoProps = {
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type Field257DemoState = {
  a: string,
  b: string,
};
*/

// eslint-disable-next-line no-unused-vars
class Field257Demo extends preact.Component /* :: <Field257DemoProps, Field257DemoState> */ {
  constructor(
    // Should be { initialA: a, initialB: b, ...props }, but that is
    // unsupported by Safari.
    props /* : Field257DemoProps & { initialA: string, initialB: string } */
  ) {
    super(props);
    this.state = {
      a: props.initialA,
      b: props.initialB,
    };
  }

  onAChange(a /* : string */) {
    // Should be { ...state, a }, but that is unsupported by Safari.
    this.setState(state => ({ a, b: state.b }));
  }

  onBChange(b /* : string */) {
    // Should be { ...state, b }, but that is unsupported by Safari.
    this.setState(state => ({ a: state.a, b }));
  }

  render(props /* : Field257DemoProps */, state /* : Field257DemoState */) {
    const { h } = preact;

    const children = handleVChildError(() => {
      const a = parseField257Element('a', state.a);
      const b = parseField257Element('b', state.b);

      const sum = a.plus(b);
      const bNegation = Field257Element.Zero.minus(b);
      const difference = a.minus(b);
      const product = a.times(b);

      const aStr = a.toString(10);
      const bStr = b.toString(10);
      const bNegationStr = bNegation.toString(10);

      const color = s => `{\\color{${props.resultColor}}${s}}`;

      // Workaround for https://github.com/Khan/KaTeX/issues/982 .
      const bmod = '\\mathbin{\\mathrm{mod}}';

      const sumStr = color(sum.toString(10));
      const plusItem = [
        inlineMath(
          `a +_{257} b = (${aStr} + ${bStr}) ${bmod} 257 = ${sumStr}\\text{;}`
        ),
      ];

      const negationStr = color(bNegationStr);
      const negationItem = [
        inlineMath(
          `-_{257}b = (257 - ${bStr}) ${bmod} 257 = ${negationStr}\\text{;}`
        ),
      ];

      const differenceStr = color(difference.toString(10));
      const minusItem = [
        inlineMath(
          `a -_{257} b = a +_{257} -_{257}b = (${aStr} + ${bNegationStr}) ${bmod} 257 = ${differenceStr}\\text{;}`
        ),
      ];

      const productStr = color(product.toString(10));
      const timesItem = [
        inlineMath(
          `a \\times_{257} b = (${aStr} \\times ${bStr}) ${bmod} 257 = ${productStr}\\text{;}`
        ),
      ];

      let divItems;
      if (b.equals(Field257Element.Zero)) {
        divItems = [
          [
            'and ',
            inlineMath(`{b^{-1}}_{257}`),
            ' and ',
            inlineMath(`a \\div_{257} b`),
            ' are undefined.',
          ],
        ];
      } else {
        const bInv = Field257Element.One.dividedBy(b);
        const quotient = a.dividedBy(b);

        const bInvStr = bInv.toString(10);
        const quotientStr = quotient.toString(10);
        const coloredQuotientStr = color(quotientStr);

        divItems = [
          [
            inlineMath(`${bStr} \\times_{257} ${bInvStr} = 1\\text{,}`),
            ' so ',
            inlineMath(`{b^{-1}}_{257} = ${color(bInvStr)}\\text{;}`),
          ],
          [
            inlineMath(
              `a \\div_{257} b = a \\times_{257} {b^{-1}}_{257} = (${aStr} \\times ${bInvStr}) ${bmod} 257 = ${coloredQuotientStr}\\text{,}`
            ),
            ' and indeed ',
            inlineMath(
              `b \\times_{257} (a \\div_{257} b) = (${bStr} \\times ${quotientStr}) ${bmod} 257 = ${aStr} = a\\text{.}`
            ),
          ],
        ];
      }

      return [
        'Then',
        h(
          'ul',
          null,
          [plusItem, negationItem, minusItem, timesItem]
            .concat(divItems)
            .map(item => h('li', null, item))
        ),
      ];
    });

    return h(
      'div',
      { class: props.containerClass },
      props.header,
      'Denote operations on the field with ',
      inlineMath('257'),
      ' elements by a ',
      inlineMath('{}_{257}'),
      ' subscript, and let ',
      binaryOpInput(
        state.a,
        state.b,
        s => this.onAChange(s),
        s => this.onBChange(s),
        field257Pattern,
        props.inputClass
      ),
      ' ',
      children
    );
  }
}
