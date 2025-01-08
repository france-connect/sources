#! /bin/bash

generate() {
  local name="${1}"

  local key="${name}.key"
  local crt="${name}.crt"
  local config="requests/${name}-req.conf"
  local csr="requests/${name}.csr"

  if [ ! -f "${config}" ]; then
    echo "Request file not found: ${config}"
    exit 1
  fi

  echo "# Generating key for ${name}"
  openssl genpkey -algorithm RSA -out "${key}"

  echo "# Generating certificate request for ${name}"
  openssl req -new -key "${key}" -out "${csr}" -config "${config}"

  echo "# Signing certificate for ${name}"
  openssl x509 -req \
    -in "${csr}" \
    -CA docker-stack-ca.crt \
    -CAkey docker-stack-ca.key \
    -CAcreateserial \
    -out "${crt}" \
    -days 3650 \
    -extfile "${config}" \
    -extensions req_ext

  echo "Successfully generated certificate for ${name}"
}

generate "${1}"
