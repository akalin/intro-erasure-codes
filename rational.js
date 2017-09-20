// @flow

'use strict';

/* ::
import { type Field } from './field';
*/

/* global BigInteger */

// eslint-disable-next-line no-unused-vars
class BigRational /* :: implements Field<BigRational> */ {
  /* ::
  _n: BigInteger;
  _d: BigInteger;
  static Zero: BigRational;
  static One: BigRational;
  */

  constructor(n /* : BigInteger */, d /* :: ?: BigInteger */) {
    let realN = n;
    let realD = d === undefined ? BigInteger.ONE : d;
    if (realD.signum() === 0) {
      throw new Error('division by zero');
    }

    if (realN.signum() === 0) {
      this._n = realN;
      this._d = BigInteger.ONE;
      return;
    }

    if (realD.signum() < 0) {
      realN = realN.negate();
      realD = realD.negate();
    }

    const gcd = realN.gcd(realD);

    this._n = realN.divide(gcd);
    this._d = realD.divide(gcd);
  }

  numerator() /* : BigInteger */ {
    return this._n;
  }

  denominator() /* : BigInteger */ {
    return this._d;
  }

  toString(radix /* : ?number */) /* : string */ {
    if (this._d.compareTo(BigInteger.ONE) === 0) {
      return this._n.toString(radix);
    }
    return `${this._n.toString(radix)}/${this._d.toString(radix)}`;
  }

  plus(b /* : BigRational */) /* : BigRational */ {
    const gcd = this._d.gcd(b._d);
    const a1 = this._n.multiply(b._d.divide(gcd));
    const a2 = b._n.multiply(this._d.divide(gcd));
    return new BigRational(a1.add(a2), this._d.multiply(b._d).divide(gcd));
  }

  minus(b /* : BigRational */) /* : BigRational */ {
    const gcd = this._d.gcd(b._d);
    const a1 = this._n.multiply(b._d.divide(gcd));
    const a2 = b._n.multiply(this._d.divide(gcd));
    return new BigRational(a1.subtract(a2), this._d.multiply(b._d).divide(gcd));
  }

  times(b /* : BigRational */) /* : BigRational */ {
    const n = this._n.multiply(b._n);
    const d = this._d.multiply(b._d);
    const gcd = n.gcd(d);
    return new BigRational(n.divide(gcd), d.divide(gcd));
  }

  dividedBy(b /* : BigRational */) /* : BigRational */ {
    if (b._n.signum() === 0) {
      throw new Error('division by zero');
    }
    const n = this._n.multiply(b._d);
    const d = this._d.multiply(b._n);
    const gcd = n.gcd(d);
    return new BigRational(n.divide(gcd), d.divide(gcd));
  }

  equals(b /* : BigRational */) /* : boolean */ {
    return this._n.compareTo(b._n) === 0 && this._d.compareTo(b._d) === 0;
  }

  zero() /* : BigRational */ {
    return this.constructor.Zero;
  }

  one() /* : BigRational */ {
    return this.constructor.One;
  }
}

BigRational.Zero = new BigRational(BigInteger.ZERO);
BigRational.One = new BigRational(BigInteger.ONE);

/* ::
export { BigRational };
*/
