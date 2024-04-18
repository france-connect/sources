import { ucfirst } from './ucfirst';

describe('ucfirst', () => {
  it('should return first letter uppercase, others unchanged (all caps)', () => {
    // when
    const result = ucfirst('ANY WORD');

    // then
    expect(result).toBe('ANY WORD');
  });

  it('should return first letter uppercase, others unchanged (caps)', () => {
    // when
    const result = ucfirst('tHiS Is MoRe SuItAbLe');

    // then
    expect(result).toBe('THiS Is MoRe SuItAbLe');
  });

  it('should return first letter uppercase, others unchanged (all low)', () => {
    // when
    const result = ucfirst('any word');

    // then
    expect(result).toBe('Any word');
  });
});
