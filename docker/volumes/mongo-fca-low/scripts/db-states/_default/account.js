// == ACCOUNTS
const accounts = {
    // -- User Account already desactivated for tests purposes
    E000001: {
        id: "E000001",
        identityHash: "grO29G7EujZx15MPnNBR5OCVxyCx2yidDcztss32MO0=",
        updatedAt: new Date("2019-12-11T12:16:26.931Z"),
        createdAt: new Date("2019-12-11T11:16:23.540Z"),
        active: false,
        servicesProvidersFederationKeys: [
        {
            sub: "542c3ed7454708ad75be62808c8a697a09668d5273be312f930d33817ea039e6v1",
            clientId:
            "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
        },
        ],
        federationKeys: [
        {
            clientId: "fia1-low",
            sub: "fim55",
            matchRNIPP: false,
        },
        ],
        __v: 1,
        noDisplayConfirmation: false,
    },
};

// -- ACCOUNTS -----
print("Initializing user account: E000001...");
db.account.update({ id: "E000001" }, accounts.E000001, { upsert: true });