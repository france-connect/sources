db.getSiblingDB("admin").auth("rootAdmin", "pass");

/* ------------------------------------------------------------------------------- */

print("Creating Mongo FCP-LOW User");
db.createUser({
  user: "core-fcp-low",
  pwd: "pass",
  roles: [
    { role: "dbOwner", db: "core-fcp-low" },
    { role: "readWrite", db: "core-fcp-low" },
  ],
});

/* ------------------------------------------------------------------------------- */

rs.status();
