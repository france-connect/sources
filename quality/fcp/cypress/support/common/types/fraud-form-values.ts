export interface FraudFormValues extends Record<string, string> {
  contactEmail: string;
  phoneNumber: string;
  authenticationEventId: string;
  comment: string;
}
