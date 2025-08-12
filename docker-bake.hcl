# docker-bake.hcl

# ===========================
# Variables: Globals
# ===========================

variable "REGISTRY_URL" {
  default = "registry.gitlab.dev-franceconnect.fr/france-connect/fc"
}

variable "INTERNET_PROXY" {
  validation {
    condition     = INTERNET_PROXY != ""
    error_message = "The variable 'INTERNET_PROXY' must not be empty."
  }
}

# ===========================
# Variables: NodeJS docker image
# ===========================

variable "NODE_VERSION" {
  default = "22"

  validation {
    condition     = NODE_VERSION != ""
    error_message = "The variable 'NODE_VERSION' must not be empty."
  }
}

variable "DEBIAN_VERSION" {
  default = "bookworm"

  validation {
    condition     = DEBIAN_VERSION != ""
    error_message = "The variable 'DEBIAN_VERSION' must not be empty."
  }
}

# ===========================
# Variables: Build
# ===========================

variable "NODE_MODULE_VERSION" {
  validation {
    condition     = NODE_MODULE_VERSION != ""
    error_message = "The variable 'NODE_MODULE_VERSION' must not be empty."
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

# ===========================
# Variables: Registry
# ===========================

variable "REGISTRY_COMMON" {
  default = {
    type              = "registry"
    compression       = "zstd"
    compression-level = 10
  }
}

variable "REGISTRY_CACHE_COMMON" {
  default = merge(
    REGISTRY_COMMON,
    {
      mode            = "max"
      image-manifest  = true
      push            = true
    }
  )
}

variable "REGISTRY_OUTPUT_COMMON" {
  default = merge(
    REGISTRY_COMMON,
    {
      rewrite-timestamp = true
    }
  )
}

# ---------------------------
# Target: commons
# ---------------------------

target "commons" {
  dockerfile = "docker/builds/nodejs-apps/prod/Dockerfile"

  args = {
    NODE_VERSION       = trim(NODE_VERSION, "v")
    NODE_IGNORE_ENGINE = false
    DEBIAN_VERSION     = DEBIAN_VERSION
    INTERNET_PROXY     = INTERNET_PROXY
  }
}

# ---------------------------
# Target: dev-deps
# ---------------------------

target "dev-deps" {
  inherits = [ "commons" ]
  target = "dev-deps"

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/dev-deps:${NODE_MODULE_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-deps:${NODE_MODULE_VERSION}-cache"
    }
  ]

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/dev-deps:${NODE_MODULE_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: prod-deps
# ---------------------------

target "prod-deps" {
  inherits = [ "commons" ]

  target = "prod-deps"

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_VERSION}-cache"
    }
  ]

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_VERSION}" }
    )
  ]
}

# ---------------------------
# Target: nodejs-apps-base
# ---------------------------

target "prod-base" {
  inherits = [ "commons" ]
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
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-deps:${NODE_MODULE_VERSION}-cache"
    },
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/prod-deps:${NODE_MODULE_VERSION}-cache"
    }
  ]
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
  target = "command-runner"

  args = {
    APP_NAME  = "command-runner-instance"
  }
  
  contexts = {
    pm2 = "./docker/builds/command-runner/includes/pm2"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      { name = "${REGISTRY_URL}/nodejs-apps/command-runner:${APP_VERSION}" }
    )
  ]
}

# ---------------------------
# Groups
# ---------------------------

group "dependencies" {
  targets = ["dev-deps", "prod-deps"]
}
