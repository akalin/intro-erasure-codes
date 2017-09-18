// @flow

/* eslint no-bitwise: off */

'use strict';

/* ::
import { type Field } from './field';
import { DivisionByZeroError } from './arithmetic';
*/

/* global DivisionByZeroError */

// eslint-disable-next-line no-unused-vars
class Field257Element /* :: implements Field<Field257Element> */ {
  /* ::
  _n: number;
  static Zero: Field257Element;
  static One: Field257Element;
  */

  constructor(n /* : number */) {
    const nUint32 = n >>> 0;
    if (nUint32 < 0 || nUint32 >= 257) {
      throw new RangeError('n must be >= 0 and < 257');
    }
    this._n = nUint32;
  }

  toString(radix /* :: ?: number */) /* : string */ {
    return this._n.toString(radix);
  }

  plus(b /* : Field257Element */) /* : Field257Element */ {
    return new Field257Element((this._n + b._n) % 257);
  }

  minus(b /* : Field257Element */) /* : Field257Element */ {
    return new Field257Element((this._n - b._n + 257) % 257);
  }

  times(b /* : Field257Element */) /* : Field257Element */ {
    return new Field257Element((this._n * b._n) % 257);
  }

  _reciprocal() /* : Field257Element */ {
    if (this._n === 0) {
      throw new DivisionByZeroError();
    }
    for (let i = 1; i < 257; i += 1) {
      const t = new Field257Element(i);
      if (this.times(t)._n === 1) {
        return t;
      }
    }
    throw new Error(`Could not find inverse for ${this._n}`);
  }

  dividedBy(b /* : Field257Element */) /* : Field257Element */ {
    return this.times(b._reciprocal());
  }

  equals(b /* : Field257Element */) /* : boolean */ {
    return this._n === b._n;
  }

  zero() /* : Field257Element */ {
    return this.constructor.Zero;
  }

  one() /* : Field257Element */ {
    return this.constructor.One;
  }
}

Field257Element.Zero = new Field257Element(0);
Field257Element.One = new Field257Element(1);

/* ::
export { Field257Element };
*/
