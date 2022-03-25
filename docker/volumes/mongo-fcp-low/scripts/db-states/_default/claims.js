// -- Claims - set all claims by name
print("Add claim...");
db.claims.createIndex({ name: 1 }, { unique: true });

// -- Claims - name
print("Initializing CLAIMS...");
db.claims.update({ name: "amr"}, { name: "amr", __v: 0, }, { upsert: true, });
