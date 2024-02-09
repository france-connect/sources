db = db.getSiblingDB("core-fcp-high");

const collections = db.getCollectionNames();

collections.forEach((collection) => {
  print(`Resetting ${collection} collection...`);
  db[collection].remove({});
  db[collection].dropIndex({});
});
print("All collections reset!");
