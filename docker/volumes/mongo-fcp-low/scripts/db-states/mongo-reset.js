db = db.getSiblingDB("core-fcp-low");

const collections = db.getCollectionNames();

collections.forEach((collection) => {
  print(`Resetting ${collection} collection...`);
  db[collection].deleteMany({});
  db[collection].dropIndexes();
});
print("All collections reset!");
