declare class BigInteger {
  constructor(a?: string, b?: number): BigInteger;

  toString(b: ?number): string;

  signum(): number;
  xor(a: BigInteger): BigInteger;
  add(a: BigInteger): BigInteger;

  static ZERO: BigInteger;
  static ONE: BigInteger;
};
