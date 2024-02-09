const fqdnToProviders = [
  {
    fqdn: "fia1.fr",
    identityProvider: "9c716f61-b8a1-435c-a407-ef4d677ec270",
  },
  {
    fqdn: "fia2.fr",
    identityProvider: "0e7c099f-fe86-49a0-b7d1-19df45397212",
  },
  {
    fqdn: "fia3.fr",
    identityProvider: "405d3839-9182-415f-9926-597489d11509",
  },
  {
    fqdn: "fia4.fr",
    identityProvider: "87762a76-7da0-442d-8243-5785f859b88b",
  },
  {
    fqdn: "fia5.fr",
    identityProvider: "46f5d9f9-881d-46b1-bdcc-0548913ea443",
  },
  {
    fqdn: "fia6.fr",
    identityProvider: "ccae1186-3695-4ae2-8b38-d3a9926d92c4",
  },
  {
    fqdn: "fia7.fr",
    identityProvider: "b61f31b8-c131-40d0-9eca-109219249db6",
  },
  {
    fqdn: "fia8.fr",
    identityProvider: "56c5831b-7749-4206-b961-11f840bc566b",
  },
  {
    fqdn: "moncomptepro.fr",
    identityProvider: "71144ab3-ee1a-4401-b7b3-79b44f7daeeb",
  },
  // an example of fqdn linked to more than one idp (fia1 and fia2)
  {
    fqdn: "polyfi.fr",
    identityProvider: "9c716f61-b8a1-435c-a407-ef4d677ec270",
  },
  {
    fqdn: "polyfi.fr",
    identityProvider: "0e7c099f-fe86-49a0-b7d1-19df45397212",
  },
  // by default we use abcd.com fqdn and fia1-low provider
  {
    fqdn: "abcd.com",
    identityProvider: "9c716f61-b8a1-435c-a407-ef4d677ec270",
  },
];

print("Initializing fqdnToProvider collection");
db.provider.update(fqdnToProviders, {
  upsert: true,
});

fqdnToProviders.forEach((fqdnToProvider) => {
  print(`Initializing fqdnToProvider :: ${JSON.stringify(fqdnToProvider)}`);

  db.fqdnToProvider.update(fqdnToProvider, fqdnToProvider, { upsert: true });
});
