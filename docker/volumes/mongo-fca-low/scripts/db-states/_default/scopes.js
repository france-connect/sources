// -- Scopes - set all scopes by types with a description label
print("Add scopes index");
db.scopes.createIndex({ scope: 1 }, { unique: true });

const scopes = [
  { scope: "openid", fd: "IDENTITY", label: "" },
  { scope: "given_name", fd: "IDENTITY", label: "Prénom(s)" },
  { scope: "usual_name", fd: "IDENTITY", label: "" },
  { scope: "email", fd: "IDENTITY", label: "" },
  { scope: "uid", fd: "IDENTITY", label: "" },
  { scope: "siren", fd: "IDENTITY", label: "" },
  { scope: "siret", fd: "IDENTITY", label: "" },
  { scope: "organizational_unit", fd: "IDENTITY", label: "" },
  { scope: "belonging_population", fd: "IDENTITY", label: "" },
  { scope: "phone", fd: "IDENTITY", label: "" },
  { scope: "chorusdt", fd: "IDENTITY", label: "" },
  { scope: "idp_id", fd: "IDENTITY", label: "" },
  { scope: "idp_acr", fd: "IDENTITY", label: "" },
  { scope: "custom", fd: "IDENTITY", label: "" },
];

print("Insert scopes");
scopeList.forEach((scope) => {
  db.scope.updateOne({ scope: scope.scope }, { $set: scope }, { upsert: true });
});
