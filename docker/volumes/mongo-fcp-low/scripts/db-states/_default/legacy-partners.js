const partners = {
  test: {
    email: 'test@test.fr',
    _id: ObjectId('5cc330c81257e61a1c54095d'),
    legacy: false,
    updatedAt: '2019-05-22T14:37:07.146Z',
    createdAt: '2019-05-22T14:36:12.548Z',
    registerCode: 'kjlkj654fdgr6f4g64rfg46ert4e6ty4eryt6er4y6',
    clients: [
      {
        role: 'admin',
        type: 'particuliers',
        key: '28e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c247d28a95',
      },
      {
        role: 'admin',
        type: 'particuliers',
        key: '64e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c288d28a67',
      },
    ],
    __v: 0,
    password:
      '322c738546f56998d554db621b0cf55cace2a6ef7b2a55e54cb77a54df623fb0bf31ba0475a9f4af1395e1f366f92a479589027fe9226132c963a5c7d6e08411:6602392ae8468444c598905f847bbb88', // georgesmoustaki
    lastConnection: '2019-05-22T14:37:07.145Z',
  },
  toto: {
    email: 'toto@toto.fr',
    _id: ObjectId('5dd330c81257e61a1c54095d'),
    legacy: false,
    updatedAt: '2019-05-22T14:37:07.146Z',
    createdAt: '2019-05-22T14:36:12.548Z',
    registerCode: 'da64grf654bh6gf463te1i65498o7l9i4l61erz6498',
    clients: [
      {
        role: 'admin',
        type: 'particuliers',
        key: '64e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c288d28a67',
      },
      {
        role: 'admin',
        type: 'particuliers',
        key: '28e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c247d28a95',
      },
    ],
    __v: 0,
    password:
      '322c738546f56998d554db621b0cf55cace2a6ef7b2a55e54cb77a54df623fb0bf31ba0475a9f4af1395e1f366f92a479589027fe9226132c963a5c7d6e08411:6602392ae8468444c598905f847bbb88', // georgesmoustaki
    lastConnection: '2019-05-22T14:37:07.145Z',
  },
  stats: {
    email: 'stats@stats.fr',
    _id: ObjectId('5dd330c81257e61a1c54095f'),
    legacy: false,
    updatedAt: '2019-05-22T14:37:07.146Z',
    createdAt: '2019-05-22T14:36:12.548Z',
    clients: [
      {
        role: 'admin',
        type: 'particuliers',
        key: '28e9ed103d6b075d371303a8bc5a66446f0cd4c0ce7ec237773276c247d28a68',
      },
    ],
    __v: 1,
    password:
      '322c738546f56998d554db621b0cf55cace2a6ef7b2a55e54cb77a54df623fb0bf31ba0475a9f4af1395e1f366f92a479589027fe9226132c963a5c7d6e08411:6602392ae8468444c598905f847bbb88', // georgesmoustaki
    lastConnection: '2019-05-22T14:37:07.145Z',
  },
};

/* ------------------------------------------------------------------------------- */
Object.values(partners).forEach((partner) => {
  print(`${partner.email} > Initializing partner: ${partner.email}`);
  db.partner.update({ email: partner.email }, partner, { upsert: true });
});