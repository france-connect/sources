// == ACCOUNTS
const accounts = [
  // BDD default account - to check federationKey
  {
    identityHash: "ieFUFlBzMSDN+mz+DSHCjgmaPbOd2OPRsSP4QbUMvxE=",
    createdAt: ISODate("2023-03-20T09:37:28.535Z"),
    active: true,
    updatedAt: ISODate("2023-03-20T10:17:46.996Z"),
    lastConnection: ISODate("2023-03-20T10:17:46.992Z"),
    spFederation: {
      abcd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc:
        "fff725a2ab2971fa9e5329b2ac30d0fb3a063db332b9ffd69d7f186deacffa63v1",
    },
    id: "1a013922-e3d1-4488-9ad6-4619256255be",
    __v: 0,
  },
];

// -- ACCOUNTS -----
print("Initializing user account...");
accounts.forEach((account) =>
  db.account.update({ id: account.id }, account, { upsert: true }),
);
