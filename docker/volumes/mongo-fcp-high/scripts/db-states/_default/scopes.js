// -- Scopes - set all scopes by types with a description label
print("Add scopes...");
db.scopes.createIndex({ scope: 1 }, { unique: true });

// -- Scopes - IDENTITY
print("Initializing IDENTITY scopes...");
db.scopes.update({ scope: "openid",              }, { scope: "openid",             fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "given_name",          }, { scope: "given_name",         fd: "IDENTITY", label: "Prénom(s)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "family_name",         }, { scope: "family_name",        fd: "IDENTITY", label: "Nom de naissance", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "preferred_username",  }, { scope: "preferred_username", fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birthdate",           }, { scope: "birthdate",          fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "gender",              }, { scope: "gender",             fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birthplace",          }, { scope: "birthplace",         fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birthcountry",        }, { scope: "birthcountry",       fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "email",               }, { scope: "email",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "address",             }, { scope: "address",            fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "phone",               }, { scope: "phone",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "profile",             }, { scope: "profile",            fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "birth",               }, { scope: "birth",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "identite_pivot",      }, { scope: "identite_pivot",     fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
