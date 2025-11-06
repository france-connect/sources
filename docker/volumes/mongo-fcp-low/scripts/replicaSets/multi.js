rs.reconfig({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-fcp-low:27017" },
    { _id: 1, host: "mongo-fcp-low-replica-1:27017" },
    { _id: 2, host: "mongo-fcp-low-replica-2:27017" },
  ],
});
printjson(rs.status());
