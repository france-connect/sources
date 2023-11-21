// == ACCOUNTS
const accountsLegacy = [
  {
    id: "E000001",
    identityHash: "FBazvqZ/4W7b76RmlV86MH9HNzVkofupYc74cHgInnQ=",
    createdAt: new Date("2019-12-11T11:16:23.540Z"),
    active: false,
    servicesProvidersFederationKeys: [
      {
        sub: "1830df713fd5d004115a4420999fde9f3f146b0c591cd9912c916438ad32e3cfv1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "fim55",
        matchRNIPP: false,
      },
    ],
    __v: 1,
    noDisplayConfirmation: false,
  },

  {
    id: "utilisateur_français_actif",
    identityHash: "G6I4QnBKE6tWKLhHS7BHswMD9FSkSXmZcbaxy6qC4fo=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: true,
    servicesProvidersFederationKeys: [
      {
        sub: "4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },

  {
    id: "utilisateur_étranger_actif",
    identityHash: "JaT8pFBj02oTgKQt70JOuFdrfk0rji5YTXUMXOMH14c=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: true,
    servicesProvidersFederationKeys: [
      {
        sub: "4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },

  {
    id: "utilisateur_étranger_désactivé_jamais_connecté",
    active: false,
    identityHash: "+M5PwmJ+RZfgSDgFDqLc50givH32DmkkskPD3TJeyIU=",
  },

  {
    id: "utilisateur_japonais_actif_à_désactiver",
    identityHash: "3sJDedlavuVqQPW4b7f3IVMncImUnvjOJcDDvlx4848=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: true,
    servicesProvidersFederationKeys: [
      {
        sub: "4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },

  {
    id: "utilisateur_dont_on_ne_connaît_pas_le_jour_de_naissance",
    identityHash: "PM0TEdQS4/sfl4I38nkxtXWmmCNqYDrxMNCrJLIIihM=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: true,
    servicesProvidersFederationKeys: [
      {
        sub: "bb5e249ede9cc8d499f8f5b07140ca3bc9eee06062c6710a5a5f51e91477c264v1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },

  {
    id: "utilisateur_dont_on_ne_connaît_pas_le_mois_et_le_jour_de_naissance",
    identityHash: "rOKHO6/MmQxewxsLKHY1sD/0tn5+/nrX4t0GzE/vp4Y=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: true,
    servicesProvidersFederationKeys: [
      {
        sub: "e00235278b9c263985763fa16e05f7cdad331b9e89dd1f9be4bf6d184b58bd9av1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },

  {
    id: "test_TRACE_USER",
    identityHash: "m+yf8zrTpLBGrSjYIL+kzpjNkTtE6LTbl9dikcHd7A0=",
    active: true,
    __v: 0,
  },

  {
    id: "utilisateur_français_actif_homonyme_1",
    identityHash: "uM0vHEOW6N9aKS8eQjVRFGcLVuPacH6C6o0/DE0DKFQ=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: true,
    servicesProvidersFederationKeys: [
      {
        sub: "4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },

  {
    id: "utilisateur_français_actif_desactive_homonyme_2",
    identityHash: "QbICB/D3TsJ/6rwO87Fr4HylXTZiMvga+h/JT+AzDBA=",
    updatedAt: ISODate("2020-01-08T14:33:26.495Z"),
    createdAt: ISODate("2020-01-08T14:33:13.841Z"),
    active: false,
    servicesProvidersFederationKeys: [
      {
        sub: "4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1",
        clientId:
          "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
      },
    ],
    federationKeys: [
      {
        clientId: "fip1",
        sub: "1",
        matchRNIPP: false,
      },
    ],
    __v: 0,
  },
];

// -- ACCOUNTS -----
print("Initializing user account...");
accountsLegacy.forEach((account) =>
  db.account.update({ id: account.id }, account, { upsert: true }),
);
