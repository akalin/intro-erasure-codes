// @flow

/* eslint-env browser */

'use strict';

/* ::
import { Field257Element } from './field_257';
import { newCauchyMatrix } from './matrix';
import {
  VChildError,
  handleVChildError,
  parseField257Element,
  textInput,
  spanNoWrap,
} from './demo_common';
import { inlineMath, displayMath } from './math';
*/
/*
global
  preact,

  newCauchyMatrix,

  VChildError,
  handleVChildError,
  parseField257Element,
  textInput,
  spanNoWrap,

  inlineMath,
  displayMath,
*/

const lengthBound = 50;

const parseField257ElementListCapped = (
  name /* : string */,
  s /* : string */
) /* : Field257Element[] */ => {
  const strs = s.split(',');
  if (strs.length > lengthBound) {
    throw new VChildError([inlineMath(name), ' has too many elements.']);
  }
  const strsTrimmed = strs.map(t => t.trim());
  return strsTrimmed.map((t, i) => parseField257Element(`{${name}}_{${i}}`, t));
};

const xyInput = (
  xValue /* : string */,
  yValue /* : string */,
  onXChange /* : (string) => void */,
  onYChange /* : (string) => void */,
  inputClass /* : ?string */
) => {
  const size = 15;
  // TODO: Make the pattern more specific.
  const pattern = '[0-9+\\-, \t\n/]+';
  return [
    'let ',
    spanNoWrap(
      inlineMath('x = ['),
      ' ',
      textInput(xValue, s => onXChange(s), size, pattern, inputClass),
      ' ',
      inlineMath(']')
    ),
    ' and ',
    spanNoWrap(
      inlineMath('y = ['),
      ' ',
      textInput(yValue, s => onYChange(s), size, pattern, inputClass),
      ' ',
      inlineMath(']\\text{.}')
    ),
  ];
};

/* ::
type CauchyMatrixDemoProps = {
  header?: HTMLElement,
  containerClass?: string,
  inputClass?: string,
};

type CauchyMatrixDemoState = {
  x: string,
  y: string,
};
*/

// eslint-disable-next-line no-unused-vars
class CauchyMatrixDemo extends preact.Component /* :: <CauchyMatrixDemoProps, CauchyMatrixDemoState> */ {
  constructor(
    // Should be { initialX: x, initialY: y, ...props }, but that is
    // unsupported by Safari.
    props /* : CauchyMatrixDemoProps & { initialX: string, initialY: string } */
  ) {
    super(props);
    this.state = {
      x: props.initialX,
      y: props.initialY,
    };
  }

  onXChange(x /* : string */) {
    // Should be { ...state, x }, but that is unsupported by Safari.
    this.setState(state => ({ x, y: state.y }));
  }

  onYChange(y /* : string */) {
    // Should be { ...state, y }, but that is unsupported by Safari.
    this.setState(state => ({ x: state.x, y }));
  }

  render(
    props /* : CauchyMatrixDemoProps */,
    state /* : CauchyMatrixDemoState */
  ) {
    const children = handleVChildError(() => {
      const x = parseField257ElementListCapped('x', state.x);
      const y = parseField257ElementListCapped('y', state.y);

      const xy = x.concat(y);
      const name = i => (i < x.length ? `x_{${i}}` : `y_{${i - x.length}}`);
      const elems /* : { [string]: number } */ = {};
      for (let i = 0; i < xy.length; i += 1) {
        const n = xy[i].toString(10);
        if (n in elems) {
          throw new VChildError([
            inlineMath(name(elems[n])),
            ' and ',
            inlineMath(name(i)),
            ' must be distinct.',
          ]);
        }
        elems[n] = i;
      }

      const m = newCauchyMatrix(x, y);

      return [
        ' Then, the Cauchy matrix constructed from ',
        inlineMath('x'),
        ' and ',
        inlineMath('y'),
        ' is ',
        displayMath(`${m.toLaTeXString()}\\text{.}`),
      ];
    });

    return preact.h(
      'div',
      { class: props.containerClass },
      props.header,
      'Working over the field with 257 elements, ',
      xyInput(
        state.x,
        state.y,
        s => this.onXChange(s),
        s => this.onYChange(s),
        props.inputClass
      ),
      ' ',
      children
    );
  }
}
