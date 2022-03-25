export const searchResultsMock = [
  {
    identityProviders: [
      {
        active: true,
        display: true,
        name: 'idp-name-mock-1.1',
        uid: 'idp-uid-mock-1.1',
      },
    ],
    ministry: {
      id: 'ministry-id-mock-1',
      identityProviders: ['idp-uid-mock-1.1'],
      name: 'ministry-name-mock-1',
      sort: 0,
    },
  },
  {
    identityProviders: [
      {
        active: true,
        display: false,
        name: 'idp-name-mock-2.1',
        uid: 'idp-uid-mock-2.1',
      },
      {
        active: false,
        display: true,
        name: 'idp-name-mock-2.2',
        uid: 'idp-uid-mock-2.2',
      },
      {
        active: true,
        display: true,
        name: 'idp-name-mock-2.3',
        uid: 'idp-uid-mock-2.3',
      },
    ],
    ministry: {
      id: 'ministry-id-mock-2',
      identityProviders: ['idp-uid-mock-2.1', 'idp-uid-mock-2.2', 'idp-uid-mock-2.3'],
      name: 'ministry-name-mock-2',
      sort: 0,
    },
  },
  {
    identityProviders: [],
    ministry: {
      id: 'ministry-id-mock-3',
      identityProviders: ['idp-uid-mock-3.1', 'idp-uid-mock-3.2'],
      name: 'ministry-name-mock-3',
      sort: 0,
    },
  },
  {
    identityProviders: [
      {
        active: true,
        display: false,
        name: 'idp-name-mock-4.1',
        uid: 'idp-uid-mock-4.1',
      },
    ],
    ministry: {
      id: 'ministry-id-mock-4',
      identityProviders: ['idp-uid-mock-4.1'],
      name: 'ministry-name-mock-4',
      sort: 0,
    },
  },
];
