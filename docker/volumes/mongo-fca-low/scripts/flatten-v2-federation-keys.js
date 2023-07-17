const LIMIT = 1000;
const SLEEP_DELAY = 50; // milliseconds
const DRY_RUN = true;

if (DRY_RUN) {
  print('⚠️  Running in dry run mode, no changes will be done');
}

print(`   Fetch ${LIMIT} items from collection`);

let ERRORS_COUNT = 0;
const cursor = db.account
  .find(
    {
      spFederation: { $exists: true },
      migrated: { $exists: false },
    },
    {
      _id: true,
      spFederation: true,
    },
  )
  .limit(LIMIT);

while (cursor.hasNext()) {
  SLEEP_DELAY && sleep(SLEEP_DELAY);

  const account = cursor.next();

  try {
    const { _id, spFederation } = account;

    const spFederationUpgrade = {};

    Object.keys(spFederation).forEach((clientId) => {
      const subData = spFederation[clientId];
      if (typeof subData === 'object') {
        spFederationUpgrade[clientId] = subData.sub;
      } else {
        spFederationUpgrade[clientId] = subData;
      }
    });

    const where = { _id };
    const update = {
      $set: {
        spFederation: spFederationUpgrade,
        migrated: true,
      },
    };

    if (DRY_RUN) {
      print(
        `   🧐 ${_id}: dry run, query would be: db.account.update(${JSON.stringify(
          where,
        )}, ${JSON.stringify(update)}`,
      );
    } else {
      db.account.update(where, update);
      print(`   ✅ ${_id}: updated`);
    }
  } catch (error) {
    ERRORS_COUNT++;
    print(`   ❌ ${account._id}: ${error} `);
  }
}

if (!cursor.hasNext()) {
  cursor.close();
  print('   No more record to update');
}

if (ERRORS_COUNT > 0) {
  print(`⚠️  Done with errors (${ERRORS_COUNT})`);
} else {
  print('✅ Done');
}
