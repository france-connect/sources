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
      servicesProvidersFederationKeys: { $exists: true },
    },
    {
      _id: true,
      servicesProvidersFederationKeys: true,
      spFederation: true,
    },
  )
  .limit(LIMIT);

while (cursor.hasNext()) {
  SLEEP_DELAY && sleep(SLEEP_DELAY);

  const account = cursor.next();

  try {
    const { _id, servicesProvidersFederationKeys, spFederation = {} } = account;

    servicesProvidersFederationKeys.forEach(({ clientId, sub }) => {
      spFederation[clientId] = sub;
    });

    const where = { _id };
    const update = {
      $set: {
        spFederation,
      },
      $unset: {
        servicesProvidersFederationKeys: true,
      },
    };

    if (DRY_RUN) {
      print(
        `   🧐 ${_id}: dry run, query would be: db.account.update(${JSON.stringify(
          where,
        )}, ${JSON.stringify(update)})})`,
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
