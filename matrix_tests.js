// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { Matrix } from './matrix';
import { Field257Element } from './field_257';
*/
/* global Matrix, Field257Element */

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
});
