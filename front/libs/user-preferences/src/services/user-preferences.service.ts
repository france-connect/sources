import { FormValues, UserPreferencesData } from '../interfaces';

interface UserPreferencesServiceInterface {
  allowFutureIdp: boolean;
  csrfToken: string;
  idpList: { [key: string]: boolean };
}

export class UserPreferencesService {
  static encodeFormData({ allowFutureIdp, csrfToken, idpList }: UserPreferencesServiceInterface) {
    const formData = new URLSearchParams();
    Object.entries(idpList)
      .filter(([, value]) => value)
      .forEach(([key]) => {
        formData.append('idpList', key);
      });
    formData.append('allowFutureIdp', allowFutureIdp.toString());
    formData.append('csrfToken', csrfToken);
    return formData;
  }

  static parseFormData({ allowFutureIdp, idpList }: UserPreferencesData): FormValues {
    const list =
      idpList &&
      idpList.reduce((acc, { isChecked, uid }) => {
        const next = { ...acc, [uid]: isChecked };
        return next;
      }, {});
    return { allowFutureIdp, idpList: list };
  }
}
