# docker-bake.hcl

# ===========================
# Variables: Globals
# ===========================

variable "FC_ROOT" {
  validation {
    condition     = FC_ROOT != ""
    error_message = "The variable 'FC_ROOT' must not be empty."
  }
}

variable "INTERNET_PROXY" {
  validation {
    condition     = INTERNET_PROXY != ""
    error_message = "The variable 'INTERNET_PROXY' must not be empty."
  }
}

variable "DOCKER_HUB_PROXY" {
  default = ""
}

variable "DOCKER_VERSION" {
  validation {
    condition     = DOCKER_VERSION != ""
    error_message = "The variable 'DOCKER_VERSION' must not be empty."
  }
}

variable "NODE_VERSION" {
  validation {
    condition     = NODE_VERSION != ""
    error_message = "The variable 'NODE_VERSION' must not be empty."
  }
}

variable "DEBIAN_VERSION" {
  validation {
    condition     = DEBIAN_VERSION != ""
    error_message = "The variable 'DEBIAN_VERSION' must not be empty."
  }
}

# ===========================
# Variables: Registry
# ===========================

variable "REGISTRY_URL" {
  validation {
    condition     = REGISTRY_URL != ""
    error_message = "The variable 'REGISTRY_URL' must not be empty."
  }
}

variable "REGISTRY_COMMON" {
  default = {
    type              = "registry"
    compression       = "zstd"
    compression-level = 3
  }
}

variable "REGISTRY_CACHE_COMMON" {
  default = merge(
    REGISTRY_COMMON,
    {
      mode = "max"
      push = true
    }
  )
}

# For oci-artifact = false (I lost soooo much time...)
# @see https://github.com/moby/buildkit/issues/7007
# @see https://gitlab.com/gitlab-org/container-registry/-/work_items/2367
variable "REGISTRY_OUTPUT_COMMON" {
  default = merge(
    REGISTRY_COMMON,
    {
      oci-artifact = false
    }
  )
}

# ---------------------------
# Target: commons
# ---------------------------

target "commons" {
  context = "${FC_ROOT}/fc"

  args = {
    INTERNET_PROXY   = INTERNET_PROXY
    DOCKER_HUB_PROXY = DOCKER_HUB_PROXY
    DEBIAN_VERSION   = DEBIAN_VERSION
    DOCKER_VERSION   = DOCKER_VERSION
    NODE_VERSION     = trim(NODE_VERSION, "v")
  }

  attest = [
    { type = "provenance", mode = "min" },
  ]
}
