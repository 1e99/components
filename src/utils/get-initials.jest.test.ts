import {describe, expect, test} from '@jest/globals';
import {getInitials} from './get-initials';

describe('getInitials', () => {
  test('uses the first and last words of a multi-word identity', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
  });

  test('normalizes extra whitespace and uppercases Unicode initials', () => {
    expect(getInitials('  Élodie   Durand  ')).toBe('ÉD');
  });

  test('uses the first initial for a one-word identity', () => {
    expect(getInitials('ada')).toBe('A');
  });

  test('uses the stable fallback for an empty identity', () => {
    expect(getInitials('   ')).toBe('1');
  });
});
