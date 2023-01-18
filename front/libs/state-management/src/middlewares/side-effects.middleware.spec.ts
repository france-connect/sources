import { FSA } from '@fc/common';

import { initSideEffectsMiddleware } from './side-effects.middleware';

describe('SideEffectsMiddleware', () => {
  const ExistingHandlerType = 'ExistingHandlerType';
  const NonExistingHandlerType = 'NonExistingHandlerType';
  const storeApiMock = {
    dispatch: jest.fn(),
    getState: jest.fn(),
  };
  const nextMock = jest.fn();

  it('should return the middleware', () => {
    // when
    const result = initSideEffectsMiddleware({});

    // then
    expect(result).toBeInstanceOf(Function);
  });

  it('should return the dispatch wrapper', () => {
    // when
    const result = initSideEffectsMiddleware({})(storeApiMock);

    // then
    expect(result).toBeInstanceOf(Function);
  });

  it('should return the middleware action handler', () => {
    // when
    const result = initSideEffectsMiddleware({})(storeApiMock)(nextMock);

    // then
    expect(result).toBeInstanceOf(Function);
  });

  it('should call the action handler corresponding to the fsa type if defined', () => {
    // given
    const fsaMock = {
      meta: 'meta',
      payload: 'payload',
      type: ExistingHandlerType,
    } as unknown as FSA;

    const sideEffectMapMock = {
      [ExistingHandlerType]: jest.fn(),
    };
    const actionHandler = initSideEffectsMiddleware(sideEffectMapMock)(storeApiMock)(nextMock);

    // when
    actionHandler(fsaMock);

    // then
    expect(sideEffectMapMock[ExistingHandlerType]).toHaveBeenCalledTimes(1);
    expect(sideEffectMapMock[ExistingHandlerType]).toHaveBeenCalledWith(
      fsaMock,
      storeApiMock.dispatch,
      storeApiMock.getState,
    );
  });

  it('should not call getState if fsa type has not an existing handler', () => {
    // given
    const fsaMock = {
      meta: 'meta',
      payload: 'payload',
      type: NonExistingHandlerType,
    } as unknown as FSA;

    const sideEffectMapMock = {
      [ExistingHandlerType]: jest.fn(),
    };
    const actionHandler = initSideEffectsMiddleware(sideEffectMapMock)(storeApiMock)(nextMock);

    // when
    actionHandler(fsaMock);

    // then
    expect(storeApiMock.getState).toHaveBeenCalledTimes(0);
  });

  it('should not call an action handler if fsa type has no existing handler', () => {
    // given
    const fsaMock = {
      meta: 'meta',
      payload: 'payload',
      type: NonExistingHandlerType,
    } as unknown as FSA;

    const sideEffectMapMock = {
      [ExistingHandlerType]: jest.fn(),
    };
    const actionHandler = initSideEffectsMiddleware(sideEffectMapMock)(storeApiMock)(nextMock);

    // when
    actionHandler(fsaMock);

    // then
    expect(sideEffectMapMock[ExistingHandlerType]).toHaveBeenCalledTimes(0);
  });

  it('should call next with the fsa if fsa type has not an existing handler', () => {
    // given
    const fsaMock = {
      meta: 'meta',
      payload: 'payload',
      type: NonExistingHandlerType,
    } as unknown as FSA;

    const sideEffectMapMock = {
      [ExistingHandlerType]: jest.fn(),
    };
    const actionHandler = initSideEffectsMiddleware(sideEffectMapMock)(storeApiMock)(nextMock);

    // when
    actionHandler(fsaMock);

    // then
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(fsaMock);
  });
});
