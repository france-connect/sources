import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {
  describe('encodeFormData', () => {
    // Given
    const idpList = {
      uidMock1: false,
      uidMock2: true,
      uidMock3: false,
      uidMock4: true,
    };

    it('should return an object with idpList as an array of keys', () => {
      // When
      const result = UserPreferencesService.encodeFormData({
        allowFutureIdp: false,
        idpList,
      });

      // Then
      expect(result).toStrictEqual({
        allowFutureIdp: false,
        idpList: ['uidMock2', 'uidMock4'],
      });
    });

    it('should return an empty idpList array when idpList is undefined', () => {
      // When
      const result = UserPreferencesService.encodeFormData({
        allowFutureIdp: false,
        idpList: undefined,
      });

      // Then
      expect(result).toStrictEqual({
        allowFutureIdp: false,
        idpList: [],
      });
    });
  });

  describe('parseFormData', () => {
    const userPreferences = {
      allowFutureIdp: true,
      idpList: [
        {
          active: false,
          image: undefined,
          isChecked: false,
          name: 'name-mock-1',
          title: 'title-mock',
          uid: 'uidMock1',
        },
        {
          active: false,
          image: undefined,
          isChecked: true,
          name: 'name-mock-2',
          title: 'title-mock',
          uid: 'uidMock2',
        },
        {
          active: false,
          image: undefined,
          isChecked: false,
          name: 'name-mock-3',
          title: 'title-mock',
          uid: 'uidMock3',
        },
        {
          active: false,
          image: undefined,
          isChecked: true,
          name: 'name-mock-4',
          title: 'title-mock',
          uid: 'uidMock4',
        },
      ],
    };

    it('should return an empty idpList object when idpList argument is undefined', () => {
      // When
      const result = UserPreferencesService.parseFormData({
        allowFutureIdp: true,
        idpList: undefined,
      });

      // Then
      expect(result).toStrictEqual(expect.objectContaining({ allowFutureIdp: true, idpList: {} }));
    });

    it('should return allowFutureIdp as true', () => {
      // When
      const result = UserPreferencesService.parseFormData({
        ...userPreferences,
        allowFutureIdp: true,
      });

      // Then
      expect(result).toStrictEqual(expect.objectContaining({ allowFutureIdp: true }));
    });

    it('should return allowFutureIdp as false', () => {
      // When
      const result = UserPreferencesService.parseFormData({
        ...userPreferences,
        allowFutureIdp: false,
      });

      // Then
      expect(result).toStrictEqual(expect.objectContaining({ allowFutureIdp: false }));
    });

    it('should return a parsed list of services', () => {
      // When
      const result = UserPreferencesService.parseFormData(userPreferences);

      // Then
      expect(result).toStrictEqual(
        expect.objectContaining({
          idpList: {
            uidMock1: false,
            uidMock2: true,
            uidMock3: false,
            uidMock4: true,
          },
        }),
      );
    });
  });
});
