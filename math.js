// @flow

/* eslint-env browser */

'use strict';

/* global preact, katex */

/* ::
type MathProps = {
  math: string;
  options?: KaTeXOptions,
};
*/

// See https://preactjs.com/guide/external-dom-mutations for an
// explanation.
class KaTeX extends preact.Component /* :: <MathProps, {}> */ {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    katex.render(this.props.math, this.base, this.props.options);
  }

  componentWillReceiveProps(nextProps /* : MathProps */) {
    katex.render(nextProps.math, this.base, nextProps.options);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return preact.h('span');
  }
}

// eslint-disable-next-line no-unused-vars
const inlineMath = (math /* : string */) => preact.h(KaTeX, { math });

// eslint-disable-next-line no-unused-vars
const displayMath = (math /* : string */) =>
  preact.h(KaTeX, { math, options: { displayMode: true } });

/* :: export { inlineMath, displayMath }; */
