// @flow

'use strict';

/* ::
import { Matrix, newCauchyMatrix } from './matrix';
import { Field256Element } from './field_256';
*/
/* global newCauchyMatrix, Field256Element */

// eslint-disable-next-line no-unused-vars
const computeParityMatrix = (
  n /* : number */,
  m /* : number */
) /* : Matrix<Field256Element> */ => {
  const x = [];
  for (let i = 0; i < m; i += 1) {
    x.push(new Field256Element(n + i));
  }
  const y = [];
  for (let i = 0; i < n; i += 1) {
    y.push(new Field256Element(i));
  }
  return newCauchyMatrix(x, y);
};

/* ::
export { computeParityMatrix };
*/
