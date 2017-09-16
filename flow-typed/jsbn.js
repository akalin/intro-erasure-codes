declare class BigInteger {
  constructor(a?: string, b?: number): BigInteger;

  toString(b: ?number): string;
  bitLength(): number;

  signum(): number;
  xor(a: BigInteger): BigInteger;
  shiftLeft(n: number): BigInteger;
  shiftRight(n: number): BigInteger;
  testBit(n: number): boolean;
  add(a: BigInteger): BigInteger;
  multiply(a: BigInteger): BigInteger;

  static ZERO: BigInteger;
  static ONE: BigInteger;
};
