import { Events } from '../events';
import { Loading } from './loading.reducer';

describe('Loading', () => {
  it('Should return true if action is Events.LOADING_STARTED', () => {
    // Given
    const stateMock = Symbol('state') as unknown as boolean;
    const actionMock = { type: Events.LOADING_STARTED };
    // When
    const result = Loading(stateMock, actionMock);
    // Then
    expect(result).toBe(true);
  });

  it('Should return false if action is Events.LOADING_COMPLETED', () => {
    // Given
    const stateMock = Symbol('state') as unknown as boolean;
    const actionMock = { type: Events.LOADING_COMPLETED };
    // When
    const result = Loading(stateMock, actionMock);
    // Then
    expect(result).toBe(false);
  });

  it('Should return inputed state if action is none of the above', () => {
    // Given
    const stateMock = Symbol('state') as unknown as boolean;
    const actionMock = { type: 'random value' };
    // When
    const result = Loading(stateMock, actionMock);
    // Then
    expect(result).toBe(stateMock);
  });

  it('Should return true if action is Events.LOADING_STARTED and state omitted', () => {
    // Given
    const stateMock = undefined;
    const actionMock = { type: Events.LOADING_STARTED };
    // When
    const result = Loading(stateMock, actionMock);
    // Then
    expect(result).toBe(true);
  });

  it('Should return false if action is Events.LOADING_COMPLETED and state omitted', () => {
    // Given
    const stateMock = undefined;
    const actionMock = { type: Events.LOADING_COMPLETED };
    // When
    const result = Loading(stateMock, actionMock);
    // Then
    expect(result).toBe(false);
  });

  it('Should return inputed state if action is none of the above and state omitted', () => {
    // Given
    const stateMock = undefined;
    const actionMock = { type: 'random value' };
    // When
    const result = Loading(stateMock, actionMock);
    // Then
    expect(result).toBe(false);
  });
});
