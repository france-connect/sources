import type { UserPreferencesDataInterface } from '../interfaces';

export const checkHasDefaultConfiguration = (
  userPreferences: UserPreferencesDataInterface | undefined,
): boolean => {
  if (!userPreferences?.idpList) {
    return false;
  }

  const allIdpTrueOnLoad = !userPreferences.idpList.some(({ isChecked }) => !isChecked);

  return allIdpTrueOnLoad && userPreferences.allowFutureIdp;
};

export const checkSomeIdpHasBeenChangedSinceLoading = (
  dirtyFields: Record<string, boolean>,
): boolean => {
  const someIdpHasBeenChangedSinceLoading = Object.keys(dirtyFields).some((key) =>
    key.startsWith('idpList'),
  );
  return someIdpHasBeenChangedSinceLoading;
};
