import {
  TransformStatesEnum,
  TransformStatusInterface,
} from '@fc/elasticsearch';

import {
  isTransformCompleted,
  isTransformRunning,
} from './transform-states.util';

describe('isTransformCompleted', () => {
  it('should return true if state is STOPPED and lastCheckpoint is 1', () => {
    // Given
    const transform: TransformStatusInterface = {
      id: 'test',
      state: TransformStatesEnum.STOPPED,
      lastCheckpoint: 1,
    };

    // When
    const result = isTransformCompleted(transform);

    // Then
    expect(result).toBe(true);
  });

  it('should return false if state is STOPPED but lastCheckpoint is 0', () => {
    // Given
    const transform: TransformStatusInterface = {
      id: 'test',
      state: TransformStatesEnum.STOPPED,
      lastCheckpoint: 0,
    };

    // When
    const result = isTransformCompleted(transform);

    // Then
    expect(result).toBe(false);
  });

  it('should return false if state is STOPPED but lastCheckpoint is undefined', () => {
    // Given
    const transform: TransformStatusInterface = {
      id: 'test',
      state: TransformStatesEnum.STOPPED,
      lastCheckpoint: undefined,
    };

    // When
    const result = isTransformCompleted(transform);

    // Then
    expect(result).toBe(false);
  });

  it('should return false if state is not COMPLETED', () => {
    // Given
    const transform: TransformStatusInterface = {
      id: 'test',
      state: TransformStatesEnum.STARTED,
      lastCheckpoint: 1,
    };

    // When
    const result = isTransformCompleted(transform);

    // Then
    expect(result).toBe(false);
  });
});

describe('isTransformRunning', () => {
  it('should return true if state is STARTED', () => {
    // Given
    const transform: TransformStatusInterface = {
      id: 'test',
      state: TransformStatesEnum.STARTED,
    };

    // When
    const result = isTransformRunning(transform);

    // Then
    expect(result).toBe(true);
  });

  it('should return false if state is not STARTED', () => {
    // Given
    const transform: TransformStatusInterface = {
      id: 'test',
      state: TransformStatesEnum.STOPPED,
    };

    // When
    const result = isTransformRunning(transform);

    // Then
    expect(result).toBe(false);
  });
});
