// == Fournisseurs de Données
const dps = {
  "DPP1-HIGH": {
    uid: "6f21b751-ed06-48b6-a59c-36e1300a368a",
    title: "Fournisseur de données Mock - 1",
    active: true,
    scopes: [
      "dgfip_rfr",
      "dgfip_aft",
      "dgfip_nbpac",
      "dgfip_nbpart",
      "dgfip_sitfam",
      "dgfip_pac",
    ],
    client_id:
      "423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0",
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      "VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=",
    jwks_uri: "https://dpp1-high.docker.dev-franceconnect.fr/api/v1/jwks",
    checktoken_signed_response_alg: "ES256",
    checktoken_encrypted_response_alg: "ECDH-ES",
    checktoken_encrypted_response_enc: "A256GCM",
  },
  "DPP2-HIGH": {
    uid: "dd5a2c9e-40ad-4f47-b8ed-869d82e6334c",
    title: "Fournisseur de données Mock - 2",
    active: true,
    scopes: ["droits_assurance_maladie", "cnam_caisse", "cnam_paiements_ij"],
    client_id:
      "8c6771b49d3985b112eeacb69ca24168222cb247429728db888ad49d44fd9688",
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      "VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=",
    jwks_uri: "https://dpp2-high.docker.dev-franceconnect.fr/api/v1/jwks",
    checktoken_signed_response_alg: "ES256",
    checktoken_encrypted_response_alg: "RSA-OAEP-256",
    checktoken_encrypted_response_enc: "A256GCM",
  },
  "DPP-INVALID-HIGH": {
    uid: "not-a-uuid",
    title: 42,
    scopes: ["test"],
    client_id: null,
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      "VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=",
    jwks_uri: "https://dpp1-high.docker.dev-franceconnect.fr/api/v1/jwks",
    checktoken_signed_response_alg: "ES256",
    checktoken_encrypted_response_alg: "RSA-OAEP",
    checktoken_encrypted_response_enc: "A256GCM",
  },
};
/* ------------------------------------------------------------------------------- */
Object.values(dps).forEach((dp) => {
  print(`DP > Initializing data provider: ${dp.title}`);
  db.dataProvider.updateOne(
    { title: dp.title },
    { $set: dp },
    { upsert: true },
  );
});
