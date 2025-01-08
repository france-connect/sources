import { ucfirst } from './uc-first.util';

describe('ucfirst', () => {
  it('should return first letter uppercase, others unchanged (all caps)', () => {
    // When
    const result = ucfirst('ANY WORD');

    // Then
    expect(result).toBe('ANY WORD');
  });

  it('should return first letter uppercase, others unchanged (caps)', () => {
    // When
    const result = ucfirst('tHiS Is MoRe SuItAbLe');

    // Then
    expect(result).toBe('THiS Is MoRe SuItAbLe');
  });

  it('should return first letter uppercase, others unchanged (all low)', () => {
    // When
    const result = ucfirst('any word');

    // Then
    expect(result).toBe('Any word');
  });
});
