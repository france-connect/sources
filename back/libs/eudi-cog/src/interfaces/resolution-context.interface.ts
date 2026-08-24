export interface ResolutionContextInterface {
  result: {
    birthplace: string | undefined;
    birthcountry: string | undefined;
  };
  data?: {
    [key: string]: unknown;
  };
}
