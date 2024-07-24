// == ACCOUNTS
const accountsFca = {
  // -- User E000001 already deactivated for test purpose
  deactivated: {
    id: "ec64cb33-6d86-4a8d-836f-fe635c59840d",
    sub: "2c98c3a8-5094-45e9-9c85-7e453323c328",
    createdAt: new Date("2024-05-11T11:16:23.540Z"),
    idpIdentityKeys: [
      {
        idpUid: "9c716f61-b8a1-435c-a407-ef4d677ec270",
        idpSub: "92ca6417-634a-467a-b65b-c89088d97ec9",
      },
    ],
    active: false,
    __v: 1,
  },
  // -- User 12355 with multiple idp sub
  multipleIdpSub: {
    id: "dfee2663-6e6c-4a90-a669-9c864c0cb0d9",
    sub: "d68cec59-ed65-48ab-bfbf-1ca65dd807f8",
    createdAt: new Date("2024-05-11T11:16:23.540Z"),
    idpIdentityKeys: [
      {
        idpUid: "9c716f61-b8a1-435c-a407-ef4d677ec270", // fia1
        idpSub:
          "e3322382e75c0d0a8e95f80af703932bd3c38f940aa59ad08b1cb4900998578c",
      },
      {
        idpUid: "71144ab3-ee1a-4401-b7b3-79b44f7daeeb", // mcp
        idpSub:
          "e3322382e75c0d0a8e95f80af703932bd3c38f940aa59ad08b1cb4900998578c",
      },
    ],
    active: true,
    __v: 1,
  },
};

// -- ACCOUNTS -----
db.accountFca.createIndex(
  { "idpIdentityKeys.idpUid": 1, "idpIdentityKeys.idpSub": 1 },
  { unique: true },
);

Object.entries(accountsFca).forEach(([key, account]) => {
  print(`${key} > Initializing user account: ${key}...`);
  db.accountFca.update({ id: account.id }, account, { upsert: true });
});
