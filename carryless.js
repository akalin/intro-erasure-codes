'use strict';

const carrylessAdd = (a, b) => ((a >>> 0) ^ (b >>> 0)) >>> 0;
