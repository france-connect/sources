# ===========================
# Variables: Build
# ===========================

variable "NODE_MODULE_BACK_VERSION" {
  validation {
    condition     = NODE_MODULE_BACK_VERSION != ""
    error_message = "The variable 'NODE_MODULE_BACK_VERSION' must not be empty."
  }
}

variable "NODE_MODULE_FRONT_VERSION" {
  validation {
    condition     = NODE_MODULE_FRONT_VERSION != ""
    error_message = "The variable 'NODE_MODULE_FRONT_VERSION' must not be empty."
  }
}

variable "NODE_MODULE_QUALITY_VERSION" {
  validation {
    condition     = NODE_MODULE_QUALITY_VERSION != ""
    error_message = "The variable 'NODE_MODULE_QUALITY_VERSION' must not be empty."
  }
}

variable "APP_VERSION" {
  validation {
    condition     = APP_VERSION != ""
    error_message = "The variable 'APP_VERSION' must not be empty."
  }
}

variable "APP_LIST" {
  validation {
    condition     = APP_LIST != ""
    error_message = "The variable 'APP_LIST' must not be empty."
  }
}

# ---------------------------
# Target: commons-nodejs-apps
# ---------------------------

target "commons-nodejs-apps" {
  inherits = [ "commons" ]

  args = {
    REGISTRY_URL              = REGISTRY_URL
    NODE_VERSION              = trim(NODE_VERSION, "v")
    NODE_IGNORE_ENGINE        = false
    DEBIAN_VERSION            = DEBIAN_VERSION
    NODE_MODULE_BACK_VERSION  = NODE_MODULE_BACK_VERSION
    INTERNET_PROXY            = INTERNET_PROXY
  }
}

# ---------------------------
# Target: dev-back-deps
# ---------------------------

target "dev-back-deps" {
  inherits = [ "commons-nodejs-apps" ]

  dockerfile = "./docker/builds/nodejs-apps/dev/Dockerfile"
  target = "dev-back-deps"

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/dev-back-deps:${NODE_MODULE_BACK_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-back-deps:${NODE_MODULE_BACK_VERSION}-cache"
    }
  ]

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/dev-back-deps:${NODE_MODULE_BACK_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: dev-front-deps
# ---------------------------

target "dev-front-deps" {
  inherits = [ "commons-nodejs-apps" ]

  dockerfile = "./docker/builds/nodejs-apps/dev/Dockerfile"
  target = "dev-front-deps"

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/dev-front-deps:${NODE_MODULE_FRONT_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-front-deps:${NODE_MODULE_FRONT_VERSION}-cache"
    }
  ]

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/dev-front-deps:${NODE_MODULE_FRONT_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: dev-quality-deps
# ---------------------------

target "dev-quality-deps" {
  inherits = [ "commons-nodejs-apps" ]

  dockerfile = "./docker/builds/nodejs-apps/dev/Dockerfile"
  target = "dev-quality-deps"

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/dev-quality-deps:${NODE_MODULE_QUALITY_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-quality-deps:${NODE_MODULE_QUALITY_VERSION}-cache"
    }
  ]

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/dev-quality-deps:${NODE_MODULE_QUALITY_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: prod-deps
# ---------------------------

target "prod-deps" {
  inherits = [ "commons-nodejs-apps" ]

  dockerfile = "./docker/builds/nodejs-apps/prod/Dockerfile"
  target = "prod-deps"

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_BACK_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_BACK_VERSION}-cache"
    }
  ]

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_BACK_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: nodejs-apps-base
# ---------------------------

target "prod-base" {
  inherits = [ "commons-nodejs-apps" ]

  dockerfile = "./docker/builds/nodejs-apps/prod/Dockerfile"
  target = "prod-base"

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/prod-base:${DEBIAN_VERSION}-cache"
    }
  ]

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/prod-base:${DEBIAN_VERSION}-cache" }
    )
  ]

  contexts = {
    pm2 = "./docker/builds/nodejs-apps/prod/includes/pm2"
    tls = "./docker/builds/tls"
  }

  output = ["type=cacheonly"]
}


# ---------------------------
# Target: prod-generic-commons
# ---------------------------

target "prod-generic-commons" {
  inherits = [ "prod-base" ]
  target = "prod-generic"

  args = {
    APP_VERSION = APP_VERSION
  }

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/prod-base:${DEBIAN_VERSION}-cache"
    },
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-deps:${NODE_MODULE_BACK_VERSION}-cache"
    },
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_BACK_VERSION}-cache"
    }
  ]

  cache-to = []
  output = []
}

# ---------------------------
# Target: prod-generic (matrix)
# ---------------------------

target "prod-generic" {
  inherits = [ "prod-generic-commons" ]

  matrix = {
    app = split(",", APP_LIST)
  }

  name = "${app}"

  args = {
    APP_NAME = "${app}"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/${app}:${APP_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: prod-with-hsm (specific)
# ---------------------------

target "csmr-hsm-high" {
  inherits = ["prod-generic-commons"]
  target = "prod-with-hsm"

  args = {
    APP_NAME = "csmr-hsm-high"
  }

  contexts = {
    hsm = "./docker/builds/nodejs-apps/prod/includes/hsm"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/csmr-hsm-high:${APP_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: command-runner (specific)
# ---------------------------

target "command-runner" {
  inherits = ["prod-base"]
  target = "command-runner-generic"

  args = {
    APP_NAME  = "command-runner-instance"
    COMMAND_ARGS = "deployment"
  }
  
  contexts = {
    pm2 = "./docker/builds/command-apps/includes/pm2"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/command-runner:${APP_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: command-import-sp-sandbox (specific)
# ---------------------------

target "command-import-sp-sandbox" {
  inherits = ["prod-base"]
  target = "command-runner-generic"

  args = {
    APP_NAME  = "command-import-sp-sandbox"
    COMMAND_ARGS = "import-sp-sandbox"
  }
  
  contexts = {
    pm2 = "./docker/builds/command-apps/includes/pm2"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/command-import-sp-sandbox:${APP_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: command-import-datapass (specific)
# ---------------------------

target "command-import-datapass" {
  inherits = ["prod-base"]
  target = "command-runner-generic"

  args = {
    APP_NAME  = "command-import-datapass"
    COMMAND_ARGS = "import-datapass"
  }

  contexts = {
    pm2 = "./docker/builds/command-apps/includes/pm2"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/command-import-datapass:${APP_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: command-pre-deploy (specific)
# ---------------------------

target "command-pre-deploy" {
  inherits = ["prod-base"]
  target = "command-pre-deploy"

  matrix = {
    app = ["partners"]
  }

  name = "${app}-pre-deploy"

  args = {
    APP_NAME = "command-pre-deploy"
    TARGET_APP = "${app}"
    COMMAND_ARGS = "command-pre-deploy"
  }

  contexts = {
    pm2 = "./docker/builds/command-apps/includes/pm2"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/${app}-pre-deploy:${APP_VERSION}" }
    )
  ]
}


# ---------------------------
# Groups
# ---------------------------

group "dependencies" {
  targets = ["dev-back-deps", "prod-deps"]
}
