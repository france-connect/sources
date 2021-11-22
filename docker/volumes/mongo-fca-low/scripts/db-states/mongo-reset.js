db = db.getSiblingDB("core-fca-low");

print("Reseting account collection...");
db.account.remove({});

print("Reseting user collection...");
db.user.remove({});

print("Reseting client collection");
db.client.remove({});

print("Reseting provider collection");
db.provider.remove({});

print("Reseting scopes collection");
db.scopes.remove({});

print('Reseting ministries collection...');
db.ministries.remove({});

print("All collections reseted!");
