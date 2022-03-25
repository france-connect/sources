export const useUserHistory = jest.fn(() => [
  { active: false, display: true, name: 'mock-name-1', uid: 'mokc-uid-1' },
  { active: false, display: true, name: 'mock-name-2', uid: 'mokc-uid-2' },
  { active: false, display: true, name: 'mock-name-3', uid: 'mokc-uid-3' },
  { active: false, display: true, name: 'mock-name-4', uid: 'mokc-uid-4' },
]);

export const useAddToUserHistory = jest.fn(() => jest.fn());

export const useRemoveFromUserHistory = jest.fn(() => jest.fn());
