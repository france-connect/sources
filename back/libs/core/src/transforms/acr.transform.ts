// Oidc naming convention
// eslint-disable-next-line @typescript-eslint/naming-convention
export type AcrValues = Partial<{ acr_values: any }>;

export function pickAcr(
  knownAcrValues: string[],
  acrValues: string[],
  defaultAcrValue: string,
): string {
  /**
   * @note Items inside `knownAcrValues` parameter (eidas levels)
   * should be ordered from weakest to strongest
   */
  const intersection = knownAcrValues.filter((acr) => acrValues.includes(acr));

  const hasCommonValues = Boolean(intersection.length);
  if (!hasCommonValues) {
    // acrValues are not known
    return defaultAcrValue;
  }

  const lowestEidasValue = intersection.shift();
  return lowestEidasValue;
}
