// @flow

/* eslint-env jasmine */

'use strict';

/* ::
import { isEdge, field256Pattern, field257Pattern } from './demo_common';
*/
/* global isEdge, field256Pattern, field257Pattern */

describe('demo common', () => {
  const re256 = new RegExp(`^(${field256Pattern})$`);
  const re257 = new RegExp(`^(${field257Pattern})$`);

  it('field256Pattern positive', () => {
    for (let i = 0; i < 256; i += 1) {
      const s = i.toString();
      expect(re256.test(s)).toBe(true);
      expect(re256.test(`0${s}`)).toBe(true);
      expect(re256.test(`000${s}`)).toBe(true);
    }
  });

  it('field256Pattern negative', () => {
    expect(re256.test('100s')).toBe(false);

    for (let i = -256; i < 0; i += 1) {
      const s = i.toString();
      expect(re256.test(s)).toBe(false);
      expect(re256.test(`0${s}`)).toBe(false);
      expect(re256.test(`000${s}`)).toBe(false);
    }

    const startI = isEdge ? 1000 : 256;
    const endI = isEdge ? 1500 : 1000;

    for (let i = startI; i < endI; i += 1) {
      const s = i.toString();
      expect(re256.test(s)).toBe(false);
      expect(re256.test(`0${s}`)).toBe(false);
      expect(re256.test(`000${s}`)).toBe(false);
    }
  });

  it('field257Pattern positive', () => {
    for (let i = 0; i < 257; i += 1) {
      const s = i.toString();
      expect(re257.test(s)).toBe(true);
      expect(re257.test(`0${s}`)).toBe(true);
      expect(re257.test(`000${s}`)).toBe(true);
    }
  });

  it('field257Pattern negative', () => {
    expect(re257.test('100s')).toBe(false);

    for (let i = -256; i < 0; i += 1) {
      const s = i.toString();
      expect(re257.test(s)).toBe(false);
      expect(re257.test(`0${s}`)).toBe(false);
      expect(re257.test(`000${s}`)).toBe(false);
    }

    const startI = isEdge ? 1000 : 257;
    const endI = isEdge ? 1500 : 1000;

    for (let i = startI; i < endI; i += 1) {
      const s = i.toString();
      expect(re257.test(s)).toBe(false);
      expect(re257.test(`0${s}`)).toBe(false);
      expect(re257.test(`000${s}`)).toBe(false);
    }
  });
});
