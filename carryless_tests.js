/* eslint-env jasmine */

/* global carrylessAdd */

'use strict';

describe('carryless', () => {
  it('add', () => {
    expect(carrylessAdd(1, 1)).toBe(0);
    expect(carrylessAdd(1, 2)).toBe(3);
    expect(carrylessAdd(2, 1)).toBe(3);
    expect(carrylessAdd(2, 2)).toBe(0);

    expect(carrylessAdd(0xffffffff, 0)).toBe(0xffffffff);
    expect(carrylessAdd(-1, 0)).toBe(0xffffffff);
  });
});
