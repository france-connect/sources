export interface ReindexFailureInterface {
  id: string;
  reason: string;
}

export interface ReindexStatusInterface {
  id: string;
  completed: boolean;
  total?: number;
  failures?: ReindexFailureInterface[];
}
