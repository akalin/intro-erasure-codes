// @flow

/* eslint-env browser */

'use strict';

/* global preact, katex */

/* ::
type MathProps = {
  math: string;
};
*/

// See https://preactjs.com/guide/external-dom-mutations for an
// explanation.
class InlineMath extends preact.Component /* :: <MathProps, {}> */ {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    katex.render(this.props.math, this.base);
  }

  componentWillReceiveProps(nextProps /* : MathProps */) {
    katex.render(nextProps.math, this.base);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return preact.h('span');
  }
}

// eslint-disable-next-line no-unused-vars
const inlineMath = (math /* : string */) => preact.h(InlineMath, { math });

/* :: export { inlineMath }; */
