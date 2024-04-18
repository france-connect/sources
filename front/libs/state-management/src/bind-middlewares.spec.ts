import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { bindMiddlewares } from './bind-middlewares';

jest.mock('redux');
jest.mock('redux-devtools-extension');

describe('bindMiddlewares', () => {
  beforeEach(() => {});

  describe('used in production', () => {
    it('should have called applyMiddleware 1 time with parameters', () => {
      // given
      const mockIsDevelopment = false;
      const mockMiddlewares = [jest.fn(), jest.fn()];
      const mockApplyMiddleWares = jest.mocked(applyMiddleware);

      // when
      bindMiddlewares(mockMiddlewares, mockIsDevelopment);

      // then
      expect(mockApplyMiddleWares).toHaveBeenCalledOnce();
      expect(mockApplyMiddleWares).toHaveBeenCalledWith(...mockMiddlewares);
    });

    it('should not have called composeWithDevTools', () => {
      // given
      const mockIsDevelopment = false;
      const mockMiddlewares = [jest.fn(), jest.fn()];
      const mockComposeWithDevTools = jest.mocked(composeWithDevTools);

      // when
      bindMiddlewares(mockMiddlewares, mockIsDevelopment);

      // then
      expect(mockComposeWithDevTools).not.toHaveBeenCalled();
    });
  });

  describe('used in development', () => {
    it('should have called composeWithDevTools 1 time with parameters', () => {
      // given
      const mockIsDevelopment = true;
      const mockMiddlewares = [jest.fn(), jest.fn()];
      const mockComposeWithDevTools = jest.mocked(composeWithDevTools);
      mockComposeWithDevTools.mockReturnValueOnce(jest.fn());

      // when
      bindMiddlewares(mockMiddlewares, mockIsDevelopment);

      // then
      expect(mockComposeWithDevTools).toHaveBeenCalledOnce();
      expect(mockComposeWithDevTools).toHaveBeenCalledWith({ trace: true });
    });
  });
});
