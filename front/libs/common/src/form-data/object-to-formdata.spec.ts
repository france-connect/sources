import { FormDataError } from '../errors';
import { objectToFormData } from './object-to-formdata';

/**
 * @TODO Should implement others types (array, object, function...)
 */
describe('objectToFormData', () => {
  // given
  const mockObject = {
    mockObjectArray: ['symbolObjectArr value', false, true, 1234, Symbol('symbolObjectArr value')],
    mockObjectBooleanFalse: false,
    mockObjectBooleanTrue: true,
    mockObjectNumber: 1234,
    mockObjectString: 'stringObject value',
    mockObjectSymbol: Symbol('symbolObject value'),
  };
  const objectMock = {
    mockArray: ['symbolArr value', false, true, 1234, Symbol('symbolArr value'), mockObject],
    mockBooleanFalse: false,
    mockBooleanTrue: true,
    mockNumber: 1234,
    mockObject,
    mockString: 'any string value',
    mockSymbol: Symbol('any symbol value'),
  };

  it('should throw if argument is null', () => {
    // given
    const object = null as unknown as {};

    // then
    expect(() => {
      objectToFormData(object);
    }).toThrow(FormDataError);
  });

  it('should throw if argument is undefined', () => {
    // given
    const object = undefined as unknown as {};

    // then
    expect(() => {
      objectToFormData(object);
    }).toThrow(FormDataError);
  });

  it('should throw if argument is not an array', () => {
    // given
    const object = [] as unknown as {};

    // then
    expect(() => {
      objectToFormData(object);
    }).toThrow(FormDataError);
  });

  it('should not throw if argument is not plain object', () => {
    // given
    const object = {};

    // then
    expect(() => {
      objectToFormData(object);
    }).not.toThrow(FormDataError);
  });

  it('should return a FormData instance', () => {
    // when
    const result = objectToFormData(objectMock);

    // then
    expect(result).toBeInstanceOf(URLSearchParams);
  });

  it('should be strict equal to the formData value', () => {
    // given
    const appendMock = jest.fn();
    const URLSearchParamsMock = jest.fn().mockImplementation(() => ({
      append: appendMock,
    }));
    global.URLSearchParams = URLSearchParamsMock;

    // when
    objectToFormData(objectMock);

    // then
    expect(URLSearchParamsMock).toHaveBeenCalledTimes(1);
    expect(appendMock).toHaveBeenCalledTimes(5);
  });
});
