import {
  TransformStatesEnum,
  TransformStatusInterface,
} from '@fc/elasticsearch';

export function isTransformCompleted(
  transform: TransformStatusInterface,
): boolean {
  return (
    transform.state === TransformStatesEnum.STOPPED &&
    transform.lastCheckpoint >= 1
  );
}

export function isTransformRunning(
  transform: TransformStatusInterface,
): boolean {
  return transform.state === TransformStatesEnum.STARTED;
}
