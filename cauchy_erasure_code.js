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

class NotEnoughKnownBytesError extends Error {
  // flowlint-next-line unclear-type:off
  constructor(...params /* : any[] */) {
    super('Not enough known bytes to reconstruct', ...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotEnoughKnownBytesError);
    }
  }
}

// eslint-disable-next-line no-unused-vars
const computeReconstructionIntermediates = (
  partialD /* : (?Field256Element)[] */,
  partialP /* : (?Field256Element)[] */
) /* : { bytesToUse: Field256Element[], M: Matrix<Field256Element> } */ => {
  const n = partialD.length;
  const m = partialP.length;

  const knownData = [];
  const knownDataIndices = [];
  for (let i = 0; i < n; i += 1) {
    if (partialD[i] instanceof Field256Element) {
      knownData.push(partialD[i]);
      knownDataIndices.push(i);
    }
  }

  const parityToUse = [];
  const parityIndicesToUse = [];
  for (let i = 0; i < m && knownData.length + parityToUse.length < n; i += 1) {
    if (partialP[i] instanceof Field256Element) {
      parityToUse.push(partialP[i]);
      parityIndicesToUse.push(i);
    }
  }

  if (knownData.length + parityToUse.length < n) {
    throw new NotEnoughKnownBytesError();
  }

  const P = computeParityMatrix(n, m);
  const M = new Matrix(n, n, (i, j) => {
    if (i < knownDataIndices.length) {
      return knownDataIndices[i] === j
        ? Field256Element.One
        : Field256Element.Zero;
    }
    return P.at(parityIndicesToUse[i - knownDataIndices.length], j);
  });

  return { bytesToUse: knownData.concat(parityToUse), M };
};

// eslint-disable-next-line no-unused-vars
const reconstructData = (
  partialD /* : (?Field256Element)[] */,
  partialP /* : (?Field256Element)[] */
) /* : Field256Element[] */ => {
  const n = partialD.length;

  const { bytesToUse, M } = computeReconstructionIntermediates(
    partialD,
    partialP
  );
  const MInv = M.inverse();

  const bytesToUseCol = new Matrix(n, 1, bytesToUse);
  const dCol = MInv.times(bytesToUseCol);
  return dCol.elements();
};

/* ::
export {
  computeParityMatrix,
  computeParity,
  computeReconstructionIntermediates,
  reconstructData,
  NotEnoughKnownBytesError,
};
*/
