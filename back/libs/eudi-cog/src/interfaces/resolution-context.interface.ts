export interface ResolutionContextInterface {
  result: {
    birthplace: string;
    birthcountry: string | undefined;
  };
  data?: {
    [key: string]: unknown;
  };
}
