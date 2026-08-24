variable "APP_VERSION" {
  validation {
    condition     = APP_VERSION != ""
    error_message = "The variable 'APP_VERSION' must not be empty."
  }
}

target "mongodb-fixtures" {
  dockerfile = "./docker/builds/mongodb/fixtures/Dockerfile"
  target = "mongodb-fixtures"

  matrix = {
    env = ["integ"]
    app = ["fc-low", "fc-high"]
  }

  name = "${env}-${app}"

  contexts = {
    fixtures = "./docker/builds/mongodb/fixtures/${env}/${app}"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/mongodb/${env}-${app}:${APP_VERSION}" }
    )
  ]
}
