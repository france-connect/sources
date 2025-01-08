import type { FormValuesInterface, UserPreferencesDataInterface } from '../interfaces';

export interface UserPreferencesServiceInterface {
  allowFutureIdp: boolean;
  idpList: { [key: string]: boolean } | undefined;
}

export class UserPreferencesService {
  static encodeFormData({ allowFutureIdp, idpList }: UserPreferencesServiceInterface) {
    const uidList = Object.entries(idpList || {})
      .filter(([, isChecked]) => !!isChecked)
      .map(([uid]) => uid);

    return {
      allowFutureIdp,
      idpList: uidList,
    };
  }

  static parseFormData({
    allowFutureIdp,
    idpList,
  }: UserPreferencesDataInterface): FormValuesInterface {
    const checkedIdpMap = (idpList || []).reduce((acc, { isChecked, uid }) => {
      const next = { ...acc, [uid]: isChecked };
      return next;
    }, {});

    return { allowFutureIdp, idpList: checkedIdpMap };
  }
}
