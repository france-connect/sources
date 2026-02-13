export interface ElasticReindexTask {
  status: {
    total: number;
  };
}

export interface ElasticReindexTaskFailure {
  id?: string;
  cause?: {
    reason?: string;
  };
}

export interface ElasticReindexTaskResponse {
  total?: number;
  failures?: ElasticReindexTaskFailure[];
}

export interface ElasticTaskResponse {
  completed: boolean;
  task: ElasticReindexTask;
  response?: ElasticReindexTaskResponse;
}
