// @flow

/* eslint-env browser */

'use strict';

/* ::
import { Field256Element } from './field_256';
import {
  handleVChildError,
  parseField256Element,
  field256Pattern,
  binaryOpInput,
} from './demo_common';
import { inlineMath } from './math';
*/
/*
global
  preact,

  Field256Element,

  handleVChildError,
  parseField256Element,
  field256Pattern,
  binaryOpInput,

  inlineMath,
*/

/* ::
type Field256DemoProps = {
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
  resultColor: string,
};

type Field256DemoState = {
  a: string,
  b: string,
};
*/

// eslint-disable-next-line no-unused-vars
class Field256Demo extends preact.Component /* :: <Field256DemoProps, Field256DemoState> */ {
  constructor(
    // Should be { initialA: a, initialB: b, ...props }, but that is
    // unsupported by Safari.
    props /* : Field256DemoProps & { initialA: string, initialB: string } */
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

  render(props /* : Field256DemoProps */, state /* : Field256DemoState */) {
    const { h } = preact;

    const children = handleVChildError(() => {
      const a = parseField256Element('a', state.a);
      const b = parseField256Element('b', state.b);

      const sum = a.plus(b);
      const product = a.times(b);

      const aStr = a.toString(10);
      const bStr = b.toString(10);

      const color = s => `{\\color{${props.resultColor}}${s}}`;

      const sumStr = color(sum.toString(10));
      const plusItem = [
        inlineMath(
          `a \\oplus_{256} b = a \\ominus_{256} b = ${aStr} \\oplus ${bStr} = ${sumStr}\\text{;}`
        ),
      ];

      const negationStr = color(b.toString(10));
      const negationItem = [
        inlineMath(`\\ominus_{256}b = b = ${negationStr}\\text{;}`),
      ];

      const minusItem = [
        inlineMath(
          `a \\ominus_{256} b = a \\oplus_{256} \\ominus_{256}b = a \\oplus_{256} b = ${sumStr}\\text{;}`
        ),
      ];

      const productStr = color(product.toString(10));
      const timesItem = [
        inlineMath(
          `a \\otimes_{256} b = (${aStr} \\otimes ${bStr}) \\mathbin{\\mathrm{clmod}} 283 = ${productStr}\\text{;}`
        ),
      ];

      let divItems;
      if (b.equals(Field256Element.Zero)) {
        divItems = [
          [
            'and ',
            inlineMath(`{b^{-1}}_{256}`),
            ' and ',
            inlineMath(`a \\div_{256} b`),
            ' are undefined.',
          ],
        ];
      } else {
        const bInv = Field256Element.One.dividedBy(b);
        const quotient = a.dividedBy(b);

        const bInvStr = bInv.toString(10);
        const quotientStr = quotient.toString(10);
        const coloredQuotientStr = color(quotientStr);

        divItems = [
          [
            inlineMath(`${bStr} \\otimes_{256} ${bInvStr} = 1\\text{,}`),
            ' so ',
            inlineMath(`{b^{-1}}_{256} = ${color(bInvStr)}\\text{;}`),
          ],
          [
            inlineMath(
              `a \\oslash_{256} b = a \\otimes_{256} {b^{-1}}_{256} = (${aStr} \\otimes ${bInvStr}) \\mathbin{\\mathrm{clmod}} 283 = ${coloredQuotientStr}\\text{,}`
            ),
            ' and indeed ',
            inlineMath(
              `b \\otimes_{256} (a \\oslash_{256} b) = (${bStr} \\otimes ${quotientStr}) \\mathbin{\\mathrm{clmod}} 283 = ${aStr} = a\\text{.}`
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
      inlineMath('256'),
      ' elements by a ',
      inlineMath('{}_{256}'),
      ' subscript, and let ',
      binaryOpInput(
        state.a,
        state.b,
        s => this.onAChange(s),
        s => this.onBChange(s),
        field256Pattern,
        props.inputClass
      ),
      ' ',
      children
    );
  }
}
