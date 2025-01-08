// -- Claims - set all claims by name
print("Add claim...");
db.claims.createIndex({ name: 1 }, { unique: true });

// -- Claims - name
print("Initializing CLAIMS...");
db.claims.updateOne(
  { name: "amr" },
  { $set: { name: "amr" } },
  { upsert: true },
);
