// == ACCOUNTS
const accountsFca = {
  // -- User Account already desactivated for tests purposes
  E000001: {
    id: "E000001",
    sub: "2c98c3a8-5094-45e9-9c85-7e453323c328",
    createdAt: new Date("2019-12-11T11:16:23.540Z"),
    idpIdentityKeys: [
      {
        idpUid: "9c716f61-b8a1-435c-a407-ef4d677ec270",
        idpSub: "92ca6417-634a-467a-b65b-c89088d97ec9",
      },
    ],
    active: false,
    __v: 1,
  },
  // -- User with multiple idpIdentityKeys
  E000002: {
    id: "E000002",
    sub: "d68cec59-ed65-48ab-bfbf-1ca65dd807f8",
    createdAt: new Date("2019-12-11T11:16:23.540Z"),
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

print("Initializing user account: E000001...");
db.accountFca.update({ id: "E000001" }, accountsFca.E000001, { upsert: true });
print("Initializing user account: E000002...");
db.accountFca.update({ id: "E000002" }, accountsFca.E000002, { upsert: true });
