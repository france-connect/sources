import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {
  describe('encodeFormData', () => {
    // given
    const idpList = {
      uidMock1: false,
      uidMock2: true,
      uidMock3: false,
      uidMock4: true,
    };

    const csrfToken = 'csrfTokenMockValue';

    it('should return a instance of URLSearchParams', () => {
      // when
      const result = UserPreferencesService.encodeFormData({
        allowFutureIdp: false,
        csrfToken,
        idpList,
      });

      // then
      expect(result).toBeInstanceOf(URLSearchParams);
    });

    it('should call URLSearchParams.append atleast 2 times with idpList param', () => {
      // given
      const appendSpy = jest.spyOn(URLSearchParams.prototype, 'append');

      // when
      UserPreferencesService.encodeFormData({
        allowFutureIdp: false,
        csrfToken,
        idpList,
      });

      // then
      expect(appendSpy).toHaveBeenNthCalledWith(1, 'idpList', 'uidMock2');
      expect(appendSpy).toHaveBeenNthCalledWith(2, 'idpList', 'uidMock4');
    });

    it('should call URLSearchParams.append 1 times with allowFutureIdp param', () => {
      // given
      const appendSpy = jest.spyOn(URLSearchParams.prototype, 'append');

      // when
      UserPreferencesService.encodeFormData({
        allowFutureIdp: false,
        csrfToken,
        idpList: {},
      });

      // then
      expect(appendSpy).toHaveBeenNthCalledWith(1, 'allowFutureIdp', 'false');
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

    it('should return allowFutureIdp as true', () => {
      // when
      const result = UserPreferencesService.parseFormData({
        ...userPreferences,
        allowFutureIdp: true,
      });

      // then
      expect(result).toStrictEqual(expect.objectContaining({ allowFutureIdp: true }));
    });

    it('should return allowFutureIdp as false', () => {
      // when
      const result = UserPreferencesService.parseFormData({
        ...userPreferences,
        allowFutureIdp: false,
      });

      // then
      expect(result).toStrictEqual(expect.objectContaining({ allowFutureIdp: false }));
    });

    it('should return a parsed list of services', () => {
      // when
      const result = UserPreferencesService.parseFormData(userPreferences);

      // then
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
