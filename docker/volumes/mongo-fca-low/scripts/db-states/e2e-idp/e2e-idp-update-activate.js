db.provider.update(
  { uid: "fia2-low" },
  {
    $set: {
      title: "Idp test Updated, activated",
      active: true,
    },
  }
);
