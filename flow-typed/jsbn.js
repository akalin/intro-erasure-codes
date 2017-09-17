declare class BigInteger {
  constructor(a?: string, b?: number): BigInteger;

  toString(b: ?number): string;
  compareTo(a: BigInteger): number;
  bitLength(): number;

  signum(): number;
  xor(a: BigInteger): BigInteger;
  shiftLeft(n: number): BigInteger;
  shiftRight(n: number): BigInteger;
  testBit(n: number): boolean;
  setBit(n: number): BigInteger;
  add(a: BigInteger): BigInteger;
  subtract(a: BigInteger): BigInteger;
  multiply(a: BigInteger): BigInteger;
  divideAndRemainder(a: BigInteger): [ BigInteger, BigInteger ];

  static ZERO: BigInteger;
  static ONE: BigInteger;
};
