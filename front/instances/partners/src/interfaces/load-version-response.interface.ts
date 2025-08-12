export interface LoadVersionResponseInterface {
  payload: {
    versions: Array<{
      data: Record<string, unknown>;
    }>;
  };
}
