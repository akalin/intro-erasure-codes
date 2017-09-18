// @flow

/* eslint-env jasmine */

/* eslint no-bitwise: off */

'use strict';

/* ::
import { Field256Element } from './field_256';
*/
/* global Field256Element */

describe('Field256Element', () => {
  it('constructor errors', () => {
    expect(() => new Field256Element(-1)).toThrowError(
      'n must be >= 0 and < 256'
    );
    expect(() => new Field256Element(256)).toThrowError(
      'n must be >= 0 and < 256'
    );
  });

  it('toString', () => {
    const n = new Field256Element(255);
    expect(n.toString()).toBe('255');
    expect(n.toString(10)).toBe('255');
    expect(n.toString(16)).toBe('ff');
  });

  const plus = (a, b) => new Field256Element(a).plus(new Field256Element(b));

  it('plus', () => {
    expect(plus(1, 1)).toEqual(new Field256Element(0));
    expect(plus(255, 2)).toEqual(new Field256Element(253));
  });

  const minus = (a, b) => new Field256Element(a).minus(new Field256Element(b));

  it('minus', () => {
    expect(minus(1, 1)).toEqual(new Field256Element(0));
    expect(minus(1, 2)).toEqual(new Field256Element(3));
  });

  it('zero', () => {
    const n = new Field256Element(100);
    expect(n.plus(Field256Element.Zero)).toEqual(n);
    expect(n.minus(Field256Element.Zero)).toEqual(n);
  });

  const times = (a, b) => new Field256Element(a).times(new Field256Element(b));

  it('times', () => {
    expect(times(100, 100)).toEqual(new Field256Element(215));
  });

  const dividedBy = (a, b) =>
    new Field256Element(a).dividedBy(new Field256Element(b));

  it('divide by zero', () => {
    expect(() => dividedBy(1, 0)).toThrowError('Division by zero');
  });

  it('dividedBy', () => {
    expect(dividedBy(1, 2)).toEqual(new Field256Element(141));
    expect(dividedBy(3, 255)).toEqual(new Field256Element(36));
  });

  it('one', () => {
    const n = new Field256Element(100);
    expect(n.times(Field256Element.One)).toEqual(n);
    expect(n.dividedBy(Field256Element.One)).toEqual(n);
  });

  it('inverses', () => {
    for (let i = 1; i < 256; i += 1) {
      const t = new Field256Element(i);
      const tInv = Field256Element.One.dividedBy(t);
      expect(t.times(tInv)).toEqual(Field256Element.One);
    }
  });

  it('equals', () => {
    const t1 = new Field256Element(1);
    const t2 = new Field256Element(2);
    expect(t1.equals(t1)).toBe(true);
    expect(t2.equals(t2)).toBe(true);
    expect(t1.equals(t2)).toBe(false);
  });
});
