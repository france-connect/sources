// -- Scopes - set all scopes by types with a description label
print("Add scopes...");
db.scopes.createIndex({ scope: 1 }, { unique: true });

// -- Scopes - IDENTITY
print("Initializing IDENTITY scopes...");
db.scopes.update({ scope: "openid",              }, { scope: "openid",                fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "given_name",          }, { scope: "given_name",            fd: "IDENTITY", label: "Prénom(s)", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "usual_name",          }, { scope: "usual_name",            fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "email",               }, { scope: "email",                 fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "uid",                 }, { scope: "uid",                   fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "siren",               }, { scope: "siren",                 fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "siret",               }, { scope: "siret",                 fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "organizational_unit", }, { scope: "organizational_unit",   fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "belonging_population",}, { scope: "belonging_population",  fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "phone",               }, { scope: "phone",                 fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
db.scopes.update({ scope: "chorusdt",            }, { scope: "chorusdt",              fd: "IDENTITY", label: "", __v: 0, }, { upsert: true, });
