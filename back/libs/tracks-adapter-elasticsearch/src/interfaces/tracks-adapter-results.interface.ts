import { TracksFormatterOutputAbstract } from './tracks-formatter-output.abstract';

export interface TracksAdapterResultsInterface<
  TOutput extends TracksFormatterOutputAbstract,
> {
  total: number;
  payload: TOutput[];
}
