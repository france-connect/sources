/**
 * @TODO Move this helper from Mailer lib
 *      To a identity library manager
 */
export class MailerHelper {
  static getLastName(familyName?: string, preferredUsername?: string): string {
    const lastName = preferredUsername || familyName || '';
    return lastName;
  }

  static getFirstName(givenNameArray: string[]): string {
    const firstName = givenNameArray.length > 0 ? givenNameArray[0] : '';
    return firstName;
  }

  static getPerson({
    givenNameArray,
    familyName,
    preferredUsername,
  }: {
    givenNameArray: string[];
    familyName?: string | undefined;
    preferredUsername?: string | undefined;
  }): string {
    const firstName = MailerHelper.getFirstName(givenNameArray);
    const lastName = MailerHelper.getLastName(familyName, preferredUsername);

    const person = [firstName, lastName].filter(Boolean).join(' ');
    return person;
  }
}
