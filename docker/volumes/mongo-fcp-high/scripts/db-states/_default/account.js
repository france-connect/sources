// == ACCOUNTS
const accounts = [
  // -- User Account already desactivated for tests purposes
  {
    id: "Y180001",
    identityHash: "X5SdAu/G7jgltChquZKbuXpRYkCgWGhd3K1sMefoHzQ=",
    createdAt: new Date("2019-12-11T11:16:23.540Z"),
    active: false,
    idpFederation: {
      "fip1-high": {
        sub: "523936b6acf099298298878742e972adbfde3f482bce71bd58490081a4df2fb8v1",
      },
    },
    spFederation: {
      a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc: {
        sub: "d431e61c3bb64eba755d9ea52c0d6de3d2e9e9e482b099797cdd87e406e0ee54v1",
      },
    },
    __v: 1,
    noDisplayConfirmation: false,
  },

  {
    active: true,
    identityHash: "Sr1x7B9YHc4uoiIcvqx8lzxq6nvLg1rN/n1klPFSgGA=",
    lastConnection: ISODate("2021-08-19T14:49:39.945Z"),
    updatedAt: ISODate("2021-08-19T14:49:39.950Z"),
    createdAt: ISODate("2021-08-19T14:49:39.950Z"),
    idpFederation: {
      "fip1-high": {
        sub: "35b5d1ae1093b5e00304ac54fc9fef5c90387ecfa36d4f886e9b9ee23c1bc899v1",
      },
    },
    spFederation: {
      a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc: {
        sub: "4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1",
      },
    },
    id: "3ec64565-a907-4284-935a-0ff0213cc120",
    __v: 0,
  },
  {
    active: true,
    identityHash: "m+yf8zrTpLBGrSjYIL+kzpjNkTtE6LTbl9dikcHd7A0=",

    lastConnection: ISODate("2022-02-01T13:06:06.029Z"),
    updatedAt: ISODate("2022-02-01T13:06:06.039Z"),
    createdAt: ISODate("2021-08-19T14:49:39.950Z"),

    idpFederation: {
      "fip1-high": {
        sub: "d3b57b2d664198a340c315c2b11dc129b982b13274512564ba8e1b1e2eab9cc5v1",
      },
    },
    spFederation: {
      a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc: {
        sub: "bfac09b3bd2d4d729c051b9f63186532ed5410c098c2c9eb10db51c6fe6a9ae9v1",
      },
    },
    id: "test_TRACE_USER",
    __v: 0,
  },
  // BDD default account - to check federationKey
  {
    identityHash: "ieFUFlBzMSDN+mz+DSHCjgmaPbOd2OPRsSP4QbUMvxE=",
    active: true,
    createdAt: ISODate("2023-03-20T11:10:55.754Z"),
    id: "ed67f90a-62e0-4f29-b2dc-4085dbefa2ac",
    updatedAt: ISODate("2023-03-20T11:11:14.276Z"),
    lastConnection: ISODate("2023-03-20T11:11:14.272Z"),
    idpFederation: {
      "fip1-high": {
        sub: "1b4e2cfc692f386b66ab7921b231e6a2b639d055b049fe403594f6fdf90124b9v1",
      },
    },
    spFederation: {
      "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39555": {
        sub: "fff725a2ab2971fa9e5329b2ac30d0fb3a063db332b9ffd69d7f186deacffa63v1",
      },
    },
    __v: 0,
  },
];

// -- ACCOUNTS -----
print("Initializing user account...");
accounts.forEach((account) =>
  db.account.update({ id: account.id }, account, { upsert: true })
);
