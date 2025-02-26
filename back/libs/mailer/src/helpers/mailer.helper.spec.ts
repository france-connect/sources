import { MailerHelper } from './mailer.helper';

describe('MailerHelper', () => {
  // Given
  const familyNameStringMock = 'Teach';
  const preferredUsernameMock = 'BARBE NOIRE';
  const givenNameArrayMock = ['Edward', 'Edouard', 'Edouardo'];

  describe('getFirstName', () => {
    it('should return the firstname as en empty string when givenName is an empty array', () => {
      // When
      const result = MailerHelper.getFirstName([]);

      // Then
      expect(result).toEqual('');
    });

    it('should return the firstname as the first string of the array', () => {
      // When
      const result = MailerHelper.getFirstName(givenNameArrayMock);

      // Then
      expect(result).toEqual('Edward');
    });
  });

  describe('getLastName', () => {
    it('should return the preferredUsername when it is defined', () => {
      // When
      const result = MailerHelper.getLastName(
        familyNameStringMock,
        preferredUsernameMock,
      );

      // Then
      expect(result).toEqual('BARBE NOIRE');
    });

    it('should return the familyName when preferredUsername is undefined', () => {
      // When
      const result = MailerHelper.getLastName(familyNameStringMock);

      // Then
      expect(result).toEqual('Teach');
    });

    it('should return an empty string when familyName and preferredUsername are undefined', () => {
      // When
      const result = MailerHelper.getLastName(undefined);

      // Then
      expect(result).toEqual('');
    });
  });

  describe('getPerson', () => {
    it('should call MailerHelper.getFirstName and MailerHelper.getLastName with params', () => {
      // Given
      const getLastNameMock = jest.spyOn(MailerHelper, 'getLastName');
      const getFirstNameMock = jest.spyOn(MailerHelper, 'getFirstName');

      // When
      MailerHelper.getPerson({
        givenNameArray: givenNameArrayMock,
        familyName: familyNameStringMock,
        preferredUsername: preferredUsernameMock,
      });

      // Then
      expect(getLastNameMock).toHaveBeenCalledOnce();
      expect(getLastNameMock).toHaveBeenCalledWith(
        familyNameStringMock,
        preferredUsernameMock,
      );
      expect(getFirstNameMock).toHaveBeenCalledOnce();
      expect(getFirstNameMock).toHaveBeenCalledWith(givenNameArrayMock);
    });

    it('should return a string with firstname and lastname', () => {
      // Given
      const lastnameMock = 'any-lastname-mock';
      const firstnameMock = 'any-firstname-mock';

      jest.mocked(MailerHelper.getLastName).mockReturnValueOnce(lastnameMock);
      jest.mocked(MailerHelper.getFirstName).mockReturnValueOnce(firstnameMock);

      // When
      const result = MailerHelper.getPerson({
        givenNameArray: expect.anything(),
        familyName: expect.anything(),
        preferredUsername: expect.anything(),
      });

      // Then
      expect(result).toEqual('any-firstname-mock any-lastname-mock');
    });

    it('should return lastname only when firstname is undefined', () => {
      // Given
      jest
        .mocked(MailerHelper.getLastName)
        .mockReturnValueOnce('any-lastname-mock');
      jest.mocked(MailerHelper.getFirstName).mockReturnValueOnce(undefined);

      // When
      const result = MailerHelper.getPerson({
        givenNameArray: expect.anything(),
        familyName: expect.anything(),
        preferredUsername: expect.anything(),
      });

      // Then
      expect(result).toEqual('any-lastname-mock');
    });

    it('should return firstname only when lastname is undefined', () => {
      // Given
      jest.mocked(MailerHelper.getLastName).mockReturnValueOnce(undefined);
      jest
        .mocked(MailerHelper.getFirstName)
        .mockReturnValueOnce('any-firstname-mock');

      // When
      const result = MailerHelper.getPerson({
        givenNameArray: expect.anything(),
        familyName: expect.anything(),
        preferredUsername: expect.anything(),
      });

      // Then
      expect(result).toEqual('any-firstname-mock');
    });

    it('should return an empty string when lastname and firstname are both undefined', () => {
      // Given
      jest.mocked(MailerHelper.getLastName).mockReturnValueOnce(undefined);
      jest.mocked(MailerHelper.getFirstName).mockReturnValueOnce(undefined);

      // When
      const result = MailerHelper.getPerson({
        givenNameArray: expect.anything(),
        familyName: expect.anything(),
        preferredUsername: expect.anything(),
      });

      // Then
      expect(result).toEqual('');
    });
  });
});
