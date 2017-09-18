// @flow

/* eslint no-bitwise: off */

'use strict';

/* ::
import { type Field } from './field';
import { DivisionByZeroError } from './arithmetic';
import { carrylessMul32, carrylessDiv32 } from './carryless';
*/

/* global DivisionByZeroError, carrylessMul32, carrylessDiv32 */

// eslint-disable-next-line no-unused-vars
class Field256Element /* :: implements Field<Field256Element> */ {
  /* ::
  _n: number;
  static Zero: Field256Element;
  static One: Field256Element;
  */

  constructor(n /* : number */) {
    const nUint32 = n >>> 0;
    if (nUint32 < 0 || nUint32 >= 256) {
      throw new RangeError('n must be >= 0 and < 256');
    }
    this._n = nUint32;
  }

  toString(radix /* :: ?: number */) /* : string */ {
    return this._n.toString(radix);
  }

  plus(b /* : Field256Element */) /* : Field256Element */ {
    return new Field256Element(this._n ^ b._n);
  }

  minus(b /* : Field256Element */) /* : Field256Element */ {
    return new Field256Element(this._n ^ b._n);
  }

  times(b /* : Field256Element */) /* : Field256Element */ {
    const t = carrylessMul32(this._n, b._n);
    const { r } = carrylessDiv32(t, 283);
    return new Field256Element(r);
  }

  _reciprocal() /* : Field256Element */ {
    if (this._n === 0) {
      throw new DivisionByZeroError();
    }
    for (let i = 1; i < 256; i += 1) {
      const t = new Field256Element(i);
      if (this.times(t)._n === 1) {
        return t;
      }
    }
    throw new Error(`Could not find inverse for ${this._n}`);
  }

  dividedBy(b /* : Field256Element */) /* : Field256Element */ {
    return this.times(b._reciprocal());
  }

  equals(b /* : Field256Element */) /* : boolean */ {
    return this._n === b._n;
  }

  zero() /* : Field256Element */ {
    return this.constructor.Zero;
  }

  one() /* : Field256Element */ {
    return this.constructor.One;
  }
}

Field256Element.Zero = new Field256Element(0);
Field256Element.One = new Field256Element(1);

/* ::
export { Field256Element };
*/
