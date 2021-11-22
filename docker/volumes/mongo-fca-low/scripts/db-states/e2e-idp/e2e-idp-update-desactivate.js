db.provider.update(
  { "uid": "fip2v2" },
  {
    $set: {
      title: "Idp test Updated, desactivated",
      active: false,
    }
  }
)
