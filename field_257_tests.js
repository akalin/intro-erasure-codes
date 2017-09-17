// @flow

/* eslint-env jasmine */

/* eslint no-bitwise: off */

'use strict';

/* ::
import { Field257Element } from './field_257';
*/
/* global Field257Element */

describe('Field257Element', () => {
  it('constructor errors', () => {
    expect(() => new Field257Element(-1)).toThrowError(
      'n must be >= 0 and < 257'
    );
    expect(() => new Field257Element(257)).toThrowError(
      'n must be >= 0 and < 257'
    );
  });

  it('toString', () => {
    const n = new Field257Element(255);
    expect(n.toString()).toBe('255');
    expect(n.toString(10)).toBe('255');
    expect(n.toString(16)).toBe('ff');
  });

  const plus = (a, b) => new Field257Element(a).plus(new Field257Element(b));

  it('plus', () => {
    expect(plus(1, 1)).toEqual(new Field257Element(2));
    expect(plus(255, 2)).toEqual(new Field257Element(0));
  });

  const minus = (a, b) => new Field257Element(a).minus(new Field257Element(b));

  it('minus', () => {
    expect(minus(1, 1)).toEqual(new Field257Element(0));
    expect(minus(1, 2)).toEqual(new Field257Element(256));
  });

  it('zero', () => {
    const n = new Field257Element(100);
    expect(n.plus(Field257Element.Zero)).toEqual(n);
    expect(n.minus(Field257Element.Zero)).toEqual(n);
  });

  const times = (a, b) => new Field257Element(a).times(new Field257Element(b));

  it('times', () => {
    expect(times(100, 100)).toEqual(new Field257Element(234));
  });

  const dividedBy = (a, b) =>
    new Field257Element(a).dividedBy(new Field257Element(b));

  it('divide by zero', () => {
    expect(() => dividedBy(1, 0)).toThrowError('Division by zero');
  });

  it('dividedBy', () => {
    expect(dividedBy(1, 2)).toEqual(new Field257Element(129));
    expect(dividedBy(3, 256)).toEqual(new Field257Element(254));
  });

  it('one', () => {
    const n = new Field257Element(100);
    expect(n.times(Field257Element.One)).toEqual(n);
    expect(n.dividedBy(Field257Element.One)).toEqual(n);
  });

  it('inverses', () => {
    for (let i = 1; i < 257; i += 1) {
      const t = new Field257Element(i);
      const tInv = Field257Element.One.dividedBy(t);
      expect(t.times(tInv)).toEqual(Field257Element.One);
    }
  });

  it('equals', () => {
    const t1 = new Field257Element(1);
    const t2 = new Field257Element(2);
    expect(t1.equals(t1)).toBe(true);
    expect(t2.equals(t2)).toBe(true);
    expect(t1.equals(t2)).toBe(false);
  });
});
