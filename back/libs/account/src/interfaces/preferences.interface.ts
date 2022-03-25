export interface IIdpSettings {
  updatedAt?: Date;
  isExcludeList: boolean;
  list: string[];
}
export interface IPreferences {
  idpSettings?: IIdpSettings;
}
