// == FS
const fspLegacyPartners = {
  MarieDeHem: {
    site: "https://site.com",
    redirect_uris: [
      "https://fsp1.docker.dev-franceconnect.fr/login-callback",
      "https://fsp1.docker.dev-franceconnect.fr/data-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp1.docker.dev-franceconnect.fr/logout-callback",
    ],
    updatedAt: "2019-05-22T14:36:12.516Z",
    key: "28e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c247d28a95",
    client_secret:
      "4eQRa1ab1h8jIKVs53cW8FBUGIa5KQLlXQpdP/lGe3EJifIwUMHR0w6HKxu3ccGzR0y6+aS2wLAifrmhsT76TtVCvnNQAF5rONzLejQ7Hqy1LBF8TAUpx+8yFak=",
    signup_id: "1234567890",
    name: "Marie de HEM",
    email: "test@test.fr",
    contacts: [],
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    type: "public",
    secretCreatedAt: "2019-05-22T14:36:12.494Z",
    createdAt: "2019-05-22T14:36:12.493Z",
    credentialsFlow: false,
    scopes: [
      "openid",
      "given_name",
      "family_name",
      "birthdate",
      "gender",
      "birthplace",
      "birthcountry",
      "email",
      "dgfip_rfr",
      "dgfip_nbpart",
      "dgfip_sitfam",
      "dgfip_pac",
      "dgfip_aft",
    ],
    identityConsent: false,
    trustedIdentity: false,
    platform: "CORE_LEGACY",
    eidas: 1,
    __v: 0,
    rep_scope: [],
  },

  fsStats: {
    name: "FsStats",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp2.docker.dev-franceconnect.fr/login-callback",
      "https://fsp2.docker.dev-franceconnect.fr/data-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp2.docker.dev-franceconnect.fr/logout-callback",
    ],
    key: "28e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c247d28a68",
    client_secret:
      "bbg3e0zidcMLRFF7MPOUIgyOYQo2fkVR7xYLtLAEUiWGQBcXhg8X0/+K0ZXGipk/Cr4oZTYqL5MRN4y5v16MUFjFnvGffCzrn3M3w2voQhDzq8Ggj/gorS1hYhY=",
    credentialsFlow: false,
    email: "stats@stats.fr",
    logo: "logo_Mairie de Paris_1280px-Mairie_De_Paris.svg.png",
    IPServerAddressesAndRanges: ["2.2.2.2"],
    active: true,
    type: "private",
    __v: 4,
    updatedAt: "2019-04-24 17:09:17",
    updatedBy: "admin",
    blacklistByIdentityProviderActivated: true,
    blacklistByIdentityProvider: {
      fip1_blacklisted_by_fsp2: true,
    },
    scopes: [
      "openid",
      "given_name",
      "family_name",
      "birthdate",
      "gender",
      "birthplace",
      "birthcountry",
      "dgfip_rfr",
      "dgfip_nbpart",
      "dgfip_sitfam",
      "dgfip_pac",
      "dgfip_aft",
      "cnam_paiements_ij",
    ],
    identityConsent: false,
    trustedIdentity: false,
    platform: "CORE_LEGACY",
    eidas: 1,

    production_key:
      "28e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c247d28a68",
    whitelistByServiceProviderActivated: false,
    rep_scope: [],
  },
};

/* ------------------------------------------------------------------------------- */
Object.values(fspLegacyPartners).forEach((fs) => {
  print(`${fs.name} > Initializing provider: ${fs.name}`);
  db.client.update({ name: fs.name }, fs, { upsert: true });
});
