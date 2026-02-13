import {
  ElasticReindexTaskResponse,
  ElasticTransformStatsEntry,
  ReindexFailureInterface,
} from '../interfaces';

export function getTransformLastCheckpoint(
  transform: ElasticTransformStatsEntry,
): number | undefined {
  return transform?.checkpointing?.last?.checkpoint;
}

export function getTransformDocIndexed(
  transform: ElasticTransformStatsEntry,
): number | undefined {
  return transform?.stats?.documents_indexed;
}

export function mapReindexFailures(
  response: ElasticReindexTaskResponse,
): ReindexFailureInterface[] {
  if (!response?.failures?.length) {
    return [];
  }

  return response.failures.map(({ id, cause }) => ({
    id,
    reason: cause?.reason,
  }));
}
