import { ucfirst } from './ucfirst';

describe('ucfirst', () => {
  it('should return first letter uppercase, others unchanged (all caps)', () => {
    // then
    const result = ucfirst('ANY WORD');
    // when
    expect(result).toEqual('ANY WORD');
  });

  it('should return first letter uppercase, others unchanged (caps)', () => {
    // then
    const result = ucfirst('tHiS Is MoRe SuItAbLe');
    // when
    expect(result).toEqual('THiS Is MoRe SuItAbLe');
  });

  it('should return first letter uppercase, others unchanged (all low)', () => {
    // then
    const result = ucfirst('any word');
    // when
    expect(result).toEqual('Any word');
  });
});
