export interface ResponseInterface<PayloadType> {
  type: 'VERSION';
  payload: PayloadType;
}
