db = db.getSiblingDB("core-fcp-high");

const collections = db.getCollectionNames();

collections.forEach((collection) => {
  print(`Resetting ${collection} collection...`);
  db[collection].remove({});
  db[collection].dropIndexes();
});
print("All collections reset!");
