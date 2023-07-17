// == Fournisseurs de Données
const dps = {
  'DP1-HIGH': {
    uid: '6f21b751-ed06-48b6-a59c-36e1300a368a',
    title: 'Fournisseur de données Mock - 1',
    active: true,
    client_id:
      '423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0',
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      'VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=',
  },
  'DP-INVALID-HIGH': {
    uid: 'not-a-uuid',
    title: 42,
    client_id: null,
    client_secret:
      // client_secret decrypted : 36aa214e7a0043c8da60ae991d8908947147d637137c5bf14bc2fc53e1055847
      'VZdGyhdVO6Axm1yqR3RYKqQdI7r4jHScaiqzCAfvh1ZEEnY5L3g4zPHqMJIx5V70Iff9B6IOfmiQQrw6AeR6Bq16P4CzGe3kC5HNinR7oc6e68STyJhE+T9EMlY=',
  },
};
/* ------------------------------------------------------------------------------- */
Object.values(dps).forEach((dp) => {
  print(`${dp.title} > Initializing data provider: ${dp.title}`);
  db.dataProvider.update({ title: dp.title }, dp, { upsert: true });
});
