export function getTypeormServiceMock() {
  return {
    withTransaction: jest.fn(),
    withQueryRunner: jest.fn(),
  };
}
