db.provider.update(
  { name: "fip2-high" },
  {
    $set: {
      title: "aGreatTitle",
      url: "https://fip1-high.docker.dev-franceconnect.fr",
    }
  }
)
