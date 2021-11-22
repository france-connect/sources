print("Creating Mongo User");
db.getSiblingDB("admin").auth("rootAdmin", "pass");
db.createUser({
  user: "fc",
  pwd: "pass",
  roles: [
    { role: "dbOwner", db: "core-fca-low" },
    { role: "readWrite", db: "core-fca-low" }
  ]
});
