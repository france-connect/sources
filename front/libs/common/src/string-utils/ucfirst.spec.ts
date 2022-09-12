import { ucfirst } from './ucfirst';

describe('ucfirst', () => {
  it('should return first letter uppercase, others unchanged (all caps)', () => {
    // when
    const result = ucfirst('ANY WORD');

    // then
    expect(result).toEqual('ANY WORD');
  });

  it('should return first letter uppercase, others unchanged (caps)', () => {
    // when
    const result = ucfirst('tHiS Is MoRe SuItAbLe');

    // then
    expect(result).toEqual('THiS Is MoRe SuItAbLe');
  });

  it('should return first letter uppercase, others unchanged (all low)', () => {
    // when
    const result = ucfirst('any word');

    // then
    expect(result).toEqual('Any word');
  });
});
