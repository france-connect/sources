# ===========================
# Variables: Build
# ===========================

variable "CI_COMMIT_REF_SLUG" {
  validation {
    condition     = CI_COMMIT_REF_SLUG != ""
    error_message = "The variable 'CI_COMMIT_REF_SLUG' must not be empty."
  }
}

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

variable "NODE_MODULE_CACHE_KEY" {
  validation {
    condition     = NODE_MODULE_CACHE_KEY != ""
    error_message = "The variable 'NODE_MODULE_CACHE_KEY' must not be empty."
  }
}

# ---------------------------
# Targets
# ---------------------------

target "ci-cd-commons" {
  inherits = [ "commons" ]
  dockerfile = "./docker/builds/ci-cd/Dockerfile"

  args = {
    REGISTRY_URL                = REGISTRY_URL
    NODE_MODULE_BACK_VERSION    = NODE_MODULE_BACK_VERSION
    NODE_MODULE_FRONT_VERSION   = NODE_MODULE_FRONT_VERSION
    NODE_MODULE_QUALITY_VERSION = NODE_MODULE_QUALITY_VERSION
  }
}

target "ci-cd-slim" {
  inherits   = [ "ci-cd-commons" ]
  target     = "ci-cd-slim"

  labels = {
    "org.opencontainers.image.title"       = "FranceConnect CI/CD Slim"
    "org.opencontainers.image.description" = "Mostly for build jobs"
    "org.opencontainers.image.version"     = "Docker: ${DOCKER_VERSION}"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      {
        name = "${REGISTRY_URL}/ci-cd-slim:${DOCKER_VERSION}"
      }
    ),
  ]
}

target "ci-cd-full" {
  inherits   = [ "ci-cd-commons" ]
  target     = "ci-cd-full"

  args = {}

  cache-to = [
    merge(
      REGISTRY_CACHE_COMMON,
      { ref = "${REGISTRY_URL}/ci-cd-full:${DEBIAN_VERSION}-${DOCKER_VERSION}-${NODE_VERSION}-cache" }
    )
  ]

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/ci-cd-full:${DEBIAN_VERSION}-${DOCKER_VERSION}-${NODE_VERSION}-cache"
    }
  ]

  labels = {
    "org.opencontainers.image.title"       = "FranceConnect CI/CD Full"
    "org.opencontainers.image.description" = "A good base to run CI/CD test pipelines"
    "org.opencontainers.image.version"     = "Debian: ${DEBIAN_VERSION}\nDocker: ${DOCKER_VERSION}\nNode: ${NODE_VERSION}"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      {
        name = "${REGISTRY_URL}/ci-cd-full:${DEBIAN_VERSION}-${DOCKER_VERSION}-${NODE_VERSION}"
      }
    ),
  ]
}

# ---------------------------
# Target: dev-generic
# ---------------------------

target "dev-generic" {
  inherits   = [ "ci-cd-commons" ]
  target     = "dev-generic"

  cache-from = [
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/ci-cd-full:${DEBIAN_VERSION}-${DOCKER_VERSION}-${NODE_VERSION}-cache"
    },
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-back-deps:${NODE_MODULE_BACK_VERSION}-cache"
    },
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-front-deps:${NODE_MODULE_FRONT_VERSION}-cache"
    },
    {
      type = "registry"
      ref  = "${REGISTRY_URL}/nodejs-apps/dev-quality-deps:${NODE_MODULE_QUALITY_VERSION}-cache"
    }
  ]

  labels = {
    "org.opencontainers.image.title"       = "FranceConnect Dev Generic"
    "org.opencontainers.image.description" = "Development image containing all dependencies for running tests"
    "org.opencontainers.image.version"     = "Debian: ${DEBIAN_VERSION}\nDocker: ${DOCKER_VERSION}\nNode: ${NODE_VERSION}\nNode Modules Back: ${NODE_MODULE_BACK_VERSION}\nNode Modules Front: ${NODE_MODULE_FRONT_VERSION}\nNode Modules Quality: ${NODE_MODULE_QUALITY_VERSION}"
  }

  output = [
    merge(
      REGISTRY_OUTPUT_COMMON,
      {
        name = "${REGISTRY_URL}/dev-generic:${NODE_MODULE_CACHE_KEY}"
      }
    ),
    merge(
      REGISTRY_OUTPUT_COMMON,
      {
        name = "${REGISTRY_URL}/dev-generic:${CI_COMMIT_REF_SLUG}"
      }
    ),
  ]
}
