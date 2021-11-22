import pipe from './pipe';

let mockConcatArgs = jest.fn();
let mockAddPlusOne = jest.fn();
let mockMultiplyDouble = jest.fn();
let mockMultiplySeven = jest.fn();

describe('pipe', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    mockConcatArgs = jest
      .fn()
      .mockImplementationOnce((n1: any, n2: any): Number => n1 + n2);

    mockAddPlusOne = jest
      .fn()
      .mockImplementationOnce((n: any): Number => n + 1);

    mockMultiplyDouble = jest
      .fn()
      .mockImplementationOnce((n: any): Number => n * 2);

    mockMultiplySeven = jest
      .fn()
      .mockImplementationOnce((n: any): Number => n * 7);
  });

  it('should call each callbacks once', () => {
    // when
    const pipeline = pipe(
      mockAddPlusOne,
      mockMultiplyDouble,
      mockMultiplySeven,
    );
    pipeline(2);
    // then
    expect(mockAddPlusOne).toHaveBeenCalledTimes(1);
    expect(mockAddPlusOne).toHaveBeenCalledWith(2);

    expect(mockMultiplyDouble).toHaveBeenCalledTimes(1);
    expect(mockMultiplyDouble).toHaveBeenCalledWith(3);

    expect(mockMultiplySeven).toHaveBeenCalledTimes(1);
    expect(mockMultiplySeven).toHaveBeenCalledWith(6);
  });

  it('should compose final result with previous results', () => {
    // given
    const expected = 42;
    // when
    const pipeline = pipe(
      mockAddPlusOne,
      mockMultiplyDouble,
      mockMultiplySeven,
    );
    const result = pipeline(2);
    // then
    expect(result).toStrictEqual(expected);
  });

  it('should compose final result with multiple args', () => {
    // given
    const expected = 42;
    // when
    const pipeline = pipe(mockConcatArgs, mockAddPlusOne, mockMultiplySeven);
    const result = pipeline(3, 2);
    // then
    expect(result).toStrictEqual(expected);
  });
});
