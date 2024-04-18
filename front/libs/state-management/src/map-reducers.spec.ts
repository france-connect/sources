import { mapReducers } from './map-reducers';

describe('mapReducers', () => {
  const reducersMock = {
    action1: jest.fn(),
    action2: jest.fn(),
  };

  it('should return a global handler', () => {
    const result = mapReducers(reducersMock);

    // expect
    expect(result).toBeInstanceOf(Function);
  });

  it('should call the action handler with the state and the action if it exists as reducers object own property', () => {
    // setup
    const combineReducersHandler = mapReducers(reducersMock);

    const stateMock = {
      foo: 'bar',
    };
    const actionMock = {
      type: 'action1',
    };

    // action
    combineReducersHandler(stateMock, actionMock);

    // expect
    expect(reducersMock.action1).toHaveBeenCalledOnce();
    expect(reducersMock.action1).toHaveBeenCalledWith(stateMock, actionMock);
  });

  it('should return the result of the handler call if it exists as reducers object own property', () => {
    // setup
    const combineReducersHandler = mapReducers(reducersMock);

    const stateMock = {
      foo: 'bar',
    };
    const actionMock = {
      type: 'action1',
    };
    reducersMock.action1.mockReturnValueOnce('You won :) !');

    // action
    const result = combineReducersHandler(stateMock, actionMock);

    // expect
    expect(result).toBe('You won :) !')!;
  });

  it('should return the state if there is no existing handler', () => {
    // setup
    const combineReducersHandler = mapReducers(reducersMock);

    const stateMock = {
      foo: 'bar',
    };
    const actionMock = {
      type: 'not-found',
    };

    // action
    const result = combineReducersHandler(stateMock, actionMock);

    // expect
    expect(result).toStrictEqual(stateMock);
  });

  it('should return the state without calling the reducers object non-own property methods', () => {
    // setup
    const combineReducersHandler = mapReducers(reducersMock);

    const stateMock = {
      foo: 'bar',
    };
    const actionMock = {
      type: 'toString',
    };
    jest.spyOn(Object.prototype, 'toString');

    // action
    const result = combineReducersHandler(stateMock, actionMock);

    // expect
    expect(reducersMock.toString).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(stateMock);
  });
});
