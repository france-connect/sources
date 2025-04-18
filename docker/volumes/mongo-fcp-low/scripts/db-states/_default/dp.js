// == Fournisseurs de Données
const dps = {
  "DPP1-LOW": {
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
    jwks_uri: "https://dpp1-low.docker.dev-franceconnect.fr/api/v1/jwks",
    checktoken_signed_response_alg: "RS256",
    checktoken_encrypted_response_alg: "ECDH-ES",
    checktoken_encrypted_response_enc: "A256GCM",
  },
  "DPP2-LOW": {
    uid: "735c6dc3-1e47-41b1-9fa6-6c7f667cfba1",
    title: "Fournisseur de données Mock - 2",
    active: true,
    scopes: ["droits_assurance_maladie", "cnam_caisse", "cnam_paiements_ij"],
    client_id:
      "71c27fec9540e5aa30b34f8c012154f88f8416530b25f31ba4873a2e58e3d3fe",
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      "VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=",
    jwks_uri: "https://dpp2-low.docker.dev-franceconnect.fr/api/v1/jwks",
    checktoken_signed_response_alg: "ES256",
    checktoken_encrypted_response_alg: "RSA-OAEP-256",
    checktoken_encrypted_response_enc: "A256GCM",
  },
  "DPP-INVALID-LOW": {
    uid: "not-a-uuid",
    title: 42,
    scopes: ["test"],
    client_id: null,
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      "VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=",
    jwks_uri: "https://dpp1-low.docker.dev-franceconnect.fr/api/v1/jwks",
    checktoken_signed_response_alg: "ES256",
    checktoken_encrypted_response_alg: "ECDH-ES",
    checktoken_encrypted_response_enc: "A256GCM",
  },
};
/* ------------------------------------------------------------------------------- */
Object.values(dps).forEach((dp) => {
  print(`${dp.title} > Initializing data provider: ${dp.title}`);
  db.dataProvider.updateOne(
    { title: dp.title },
    { $set: dp },
    { upsert: true },
  );
});
