db.getSiblingDB("admin").auth("rootAdmin", "pass");

/* ------------------------------------------------------------------------------- */
print("Creating Mongo User");

db.createUser({
  user: "fc",
  pwd: "pass",
  roles: [
    { role: "dbOwner", db: "core-fcp-high" },
    { role: "readWrite", db: "core-fcp-high" }
  ]
});

/* ------------------------------------------------------------------------------- */

rs.status();