db = db.getSiblingDB("core-fcp-high");

const collections = ['account', 'user', 'client', 'provider', 'scopes'];

collections.forEach((collection) =>{
    print(`Reseting ${collection} collection...`);
    db[collection].remove({});
    db[collection].dropIndex({});
});
print("All collections reseted!");

