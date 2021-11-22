db.client.update(
  { name: "FSP - FSP1-HIGH" },
  {
    $set: {
      scopes: [
        "openid",
        "given_name",
        "family_name",
        "birthdate",
        "gender",
      ],
    }
  }
)
