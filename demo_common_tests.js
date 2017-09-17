// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { isEdge, field257Pattern } from './demo_common';
*/
/* global isEdge, field257Pattern */

describe('demo common', () => {
  const re = new RegExp(`^(${field257Pattern})$`);

  it('field257Pattern positive', () => {
    for (let i = 0; i < 257; i += 1) {
      const s = i.toString();
      expect(re.test(s)).toBe(true);
      expect(re.test(`0${s}`)).toBe(true);
      expect(re.test(`000${s}`)).toBe(true);
    }
  });

  it('field257Pattern negative', () => {
    expect(re.test('100s')).toBe(false);

    for (let i = -256; i < 0; i += 1) {
      const s = i.toString();
      expect(re.test(s)).toBe(false);
      expect(re.test(`0${s}`)).toBe(false);
      expect(re.test(`000${s}`)).toBe(false);
    }

    const startI = isEdge ? 1000 : 257;
    const endI = isEdge ? 1500 : 1000;

    for (let i = startI; i < endI; i += 1) {
      const s = i.toString();
      expect(re.test(s)).toBe(false);
      expect(re.test(`0${s}`)).toBe(false);
      expect(re.test(`000${s}`)).toBe(false);
    }
  });
});
