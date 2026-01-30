print("Execute default script...");
load("/opt/scripts/db-states/_default/index.js");

print("Create 1500 SPs...");

// Build a generic SP from the default script
let fs = {
  ...fsp["FSP1-LOW"]
};

for (let i = 0; i < 1500; i++) {
  fs.name = `FSP-generated-${i}-LOW`;
  fs.title = `FSP-generated-${i}-LOW`;
  fs.key = `${fsp["FSP1-LOW"].key}-${i}`;

  print(`${i} > Initializing provider: ${fs.name}`);

  db.client.updateOne({ name: fs.name }, { $set: fs }, { upsert: true });
}
