/* eslint no-bitwise: off */

'use strict';

// eslint-disable-next-line no-unused-vars
const carrylessAdd = (a, b) => ((a >>> 0) ^ (b >>> 0)) >>> 0;
