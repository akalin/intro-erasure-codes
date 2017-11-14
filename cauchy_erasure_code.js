// @flow

'use strict';

/* ::
import { Matrix, newCauchyMatrix } from './matrix';
import { Field256Element } from './field_256';
*/
/* global Matrix, newCauchyMatrix, Field256Element */

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

// eslint-disable-next-line no-unused-vars
const computeParity = (
  d /* : Field256Element[] */,
  m /* : number */
) /* : Field256Element[] */ => {
  const n = d.length;
  const P = computeParityMatrix(n, m);
  const dCol = new Matrix(n, 1, d);
  const pCol = P.times(dCol);
  return pCol.elements();
};

/* ::
export { computeParityMatrix, computeParity };
*/
