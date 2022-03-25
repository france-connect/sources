db = db.getSiblingDB("core-fcp-low");

const collections = ['client', 'provider', 'scopes', 'claims'];

collections.forEach((collection) =>{
    print(`Reseting ${collection} collection...`);
    db[collection].remove({});
    db[collection].dropIndex({});
});
print("All collections reseted!");

