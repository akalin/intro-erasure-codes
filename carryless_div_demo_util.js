// @flow

'use strict';

/* ::
import { type ArithmeticType, impossible } from './carryless_demo_common';
*/
/* global impossible */

/* ::
type Intermediate = {
  intermediate: BigInteger,
  offset: number,
};
*/

// eslint-disable-next-line no-unused-vars
const computeIntermediates = (
  a /* : BigInteger */,
  b /* : BigInteger */,
  arithmeticType /* : ArithmeticType */
) /* : Intermediate[] */ => {
  const intermediates = [];
  let r = a;
  switch (arithmeticType) {
    case 'standard':
      for (let offset = 0; ; ) {
        if (r.compareTo(b) < 0) {
          intermediates.push({ intermediate: r, offset });
          break;
        }
        const rLength = r.bitLength();
        let shift = rLength - b.bitLength();
        let bShift = b.shiftLeft(shift);
        if (r.compareTo(bShift) < 0) {
          shift -= 1;
          bShift = bShift.shiftRight(1);
        }
        intermediates.push({ intermediate: r.shiftRight(shift), offset });
        r = r.subtract(bShift);
        offset += rLength - r.bitLength();
      }
      break;
    case 'carry-less':
      for (let offset = 0; ; ) {
        if (r.bitLength() < b.bitLength()) {
          intermediates.push({ intermediate: r, offset });
          break;
        }
        const rLength = r.bitLength();
        const shift = rLength - b.bitLength();
        intermediates.push({ intermediate: r.shiftRight(shift), offset });
        r = r.xor(b.shiftLeft(shift));
        offset += rLength - r.bitLength();
      }

      break;
    default:
      return impossible(arithmeticType);
  }
  return intermediates;
};

/* :: export { computeIntermediates }; */
