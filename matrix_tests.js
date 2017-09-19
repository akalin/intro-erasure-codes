// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { Matrix, newCauchyMatrix } from './matrix';
import { Field256Element } from './field_256';
import { Field257Element } from './field_257';
import { BigRational } from './rational';
*/
/*
global
  Matrix,
  newCauchyMatrix,

  Field256Element,

  Field257Element,

  BigRational,
*/

describe('Matrix', () => {
  it('array constructor', () => {
    const elements = [1, 2, 3, 4, 5, 6].map(x => new Field257Element(x));
    const m = new Matrix(2, 3, elements);
    expect(m._rows).toBe(2);
    expect(m._columns).toBe(3);
    expect(m._elements).not.toBe(elements);
    expect(m._elements).toEqual(elements);
  });

  it('function constructor', () => {
    const m = new Matrix(2, 3, (i, j) => new Field257Element(i + j));
    expect(m._rows).toBe(2);
    expect(m._columns).toBe(3);
    expect(m._elements).toEqual(
      [0, 1, 2, 1, 2, 3].map(x => new Field257Element(x))
    );
  });

  it('times identity', () => {
    const mElements = [1, 0, 0, 1].map(x => new Field257Element(x));
    const m = new Matrix(2, 2, mElements);

    const nElements = [1, 2, 3, 4, 5, 6].map(x => new Field257Element(x));
    const n = new Matrix(2, 3, nElements);

    const product = m.times(n);
    expect(product._rows).toBe(2);
    expect(product._columns).toBe(3);
    expect(product._elements).toEqual(nElements);
  });

  it('times scalar', () => {
    const mElements = [2, 0, 0, 2].map(x => new Field257Element(x));
    const m = new Matrix(2, 2, mElements);

    const nElements = [1, 2, 3, 4, 5, 6].map(x => new Field257Element(x));
    const n = new Matrix(2, 3, nElements);

    const product = m.times(n);
    expect(product._rows).toBe(2);
    expect(product._columns).toBe(3);
    expect(product._elements).toEqual(
      [2, 4, 6, 8, 10, 12].map(x => new Field257Element(x))
    );
  });

  it('times arbitrary', () => {
    const mElements = [7, 8, 9, 10].map(x => new Field257Element(x));
    const m = new Matrix(2, 2, mElements);

    const nElements = [1, 2, 3, 4, 5, 6].map(x => new Field257Element(x));
    const n = new Matrix(2, 3, nElements);

    const product = m.times(n);
    expect(product._rows).toBe(2);
    expect(product._columns).toBe(3);
    expect(product._elements).toEqual(
      [39, 54, 69, 49, 68, 87].map(x => new Field257Element(x))
    );
  });

  it('inverse identity', () => {
    const zero = Field257Element.Zero;
    const one = Field257Element.One;

    const size = 5;
    const m = new Matrix(size, size, (i, j) => (i === j ? one : zero));
    const mInv = m.inverse();
    expect(mInv).toEqual(m);
  });

  it('inverse scalar rational', () => {
    const zero = BigRational.Zero;
    const one = BigRational.One;
    const two = one.plus(one);
    const oneHalf = one.dividedBy(two);

    const size = 5;
    const m = new Matrix(size, size, (i, j) => (i === j ? two : zero));
    const mInv = m.inverse();
    const mInvExpected = new Matrix(
      size,
      size,
      (i, j) => (i === j ? oneHalf : zero)
    );
    expect(mInv).toEqual(mInvExpected);
  });

  it('inverse scalar GF(256)', () => {
    const zero = Field256Element.Zero;
    const one = Field256Element.One;
    const two = new Field256Element(2);
    const twoInv = one.dividedBy(two);

    const size = 5;
    const m = new Matrix(size, size, (i, j) => (i === j ? two : zero));
    const mInv = m.inverse();
    const mInvExpected = new Matrix(
      size,
      size,
      (i, j) => (i === j ? twoInv : zero)
    );
    expect(mInv).toEqual(mInvExpected);
  });

  it('inverse GF(257)', () => {
    const mElements = [1, 1, 1, 2, 4, 8, 3, 9, 27].map(
      x => new Field257Element(x)
    );
    const m = new Matrix(3, 3, mElements);

    const zero = Field257Element.Zero;
    const one = Field257Element.One;

    const identity = new Matrix(3, 3, (i, j) => (i === j ? one : zero));

    const mInv = m.inverse();
    expect(m.times(mInv)).toEqual(identity);
    expect(mInv.times(m)).toEqual(identity);
  });

  it('inverse singular', () => {
    const mElements = [1, 1, 1, 2, 4, 8, 3, 5, 9].map(
      x => new Field257Element(x)
    );
    const m = new Matrix(3, 3, mElements);
    expect(() => m.inverse()).toThrowError('Singular matrix');
  });

  it('Cauchy matrix GF(257)', () => {
    const x = [3, 4].map(t => new Field257Element(t));
    const y = [0, 1, 2].map(t => new Field257Element(t));
    const m = newCauchyMatrix(x, y);
    const mExpected = new Matrix(
      x.length,
      y.length,
      [3, 2, 1, 4, 3, 2].map(t =>
        Field257Element.One.dividedBy(new Field257Element(t))
      )
    );
    expect(m).toEqual(mExpected);
  });

  it('Cauchy matrix GF(256)', () => {
    const x = [3, 4].map(t => new Field256Element(t));
    const y = [0, 1, 2].map(t => new Field256Element(t));
    const m = newCauchyMatrix(x, y);
    const mExpected = new Matrix(
      x.length,
      y.length,
      [3, 2, 1, 4, 5, 6].map(t =>
        Field256Element.One.dividedBy(new Field256Element(t))
      )
    );
    expect(m).toEqual(mExpected);
  });
});
