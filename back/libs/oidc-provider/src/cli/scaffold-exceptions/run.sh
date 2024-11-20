#!/usr/bin/env bash

_generate_oidc_provider_exceptions() {
  cd $FC_ROOT/fc/back/node_modules/oidc-provider/lib

  local exceptionDir="${FC_ROOT}/fc/back/libs/oidc-provider/src/exceptions/runtime"

  local pattern="${exceptionDir}/*.exception.ts"

  local istanbulIgnore="/* istanbul ignore file */

/**
  * Code generated from oidc-provider exceptions
  * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
  */
"
  indexMap="export const exceptionSourceMap = {"
  local indexImports="${istanbulIgnore}"
  local i18n="${istanbulIgnore}const DEFAULT_MESSAGE = 'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
  
export const frFR = {"

  echo "Purging generated exception from ${pattern}"
  rm -f ${pattern}

  local identifier=0
  local idList=""

  #
  # line will contains matches from the grep command below
  # Example line:
  #
  # @example: shared/token_jwt_auth.js:57:throw new InvalidClientAuth('client assertion tokens must only be used once')
  #          |          source           |         |      class       |                 message                      |
  while read -r line; do
    # @example: InvalidClientAuth
    local class=$(echo "$line" | sed -E 's/.*throw new ([a-zA-Z0-9.]+)\(.*/\1/' | sed 's/\./_/g')

    # @example: shared/token_jwt_auth.js:57
    local source=$(echo "$line" | sed -E 's/(.*):throw new .*/\1/')

    # @example: client assertion tokens must only be used once
    local message=$(echo "$line" | sed -E "s/.*throw new [a-zA-Z0-9.]+\((.*)\)/\1/" | sed -E 's/["'"'"'`]//g')

    # @example: CB6B
    local identifier=$(printf "%x" $(echo -n "${source}" | cksum | cut -d' ' -f 1) | head -c 4 | tr '[:lower:]' '[:upper:]')

    # @example: OidcProvider.exceptions.InvalidClientAuth.CB6B
    local i18nKey="OidcProvider.exceptions.${class}.${identifier}"

    # Update the id list to keep track of duplicates
    idList="${idList}
${identifier}"

    # Output the results
    # echo "Exception Class: $class"
    # echo "Message: $message"
    # echo "Source: $source"
    # echo "Line: $line"
    # echo "---------------------"

    local relativeFileName="oidc-provider-runtime-${class}-${identifier}.exception"
    local fileName="${exceptionDir}/${relativeFileName}.ts"
    local className="OidcProviderRuntime_${class}_${identifier}_Exception"
    local TEMPLATE="${istanbulIgnore}import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class ${className} extends OidcProviderBaseRuntimeException {
  static CODE = '${identifier}';
  static ERROR_CLASS = '${class}';
  static ERROR_DETAIL = '${message}';
  static DOCUMENTATION = '${message}';
  static ERROR_SOURCE = '${source}';
  static UI = '${i18nKey}';
}
"
    echo "writing ${fileName}"
    echo "${TEMPLATE}" >"${fileName}"

    i18n="${i18n}
    '${i18nKey}': DEFAULT_MESSAGE,"

    indexMap="${indexMap}
  '${source}': ${className},"
    indexImports="${indexImports}
import { ${className} } from './${relativeFileName}';"

  done < <(grep -rnEio 'throw new ([a-z0-9.]+)\(.*\)' | LC_ALL=C sort -fu)

  indexMap="${indexMap}
};
"
  i18n="${i18n}
};
"

  local barrelFile="${exceptionDir}/index.ts"
  local translationlFile="${exceptionDir}/fr-FR.i18n.ts"

  local idCount=$(echo "${idList}" | wc -l)
  local uniqueIdCount=$(echo "${idList}" | sort | uniq | wc -l)

  if [ "${idCount}" -ne "${uniqueIdCount}" ]; then
    echo "Duplicate identifiers detected"
    echo "${idList}"
    exit 1
  fi

  echo "Generate index"
  echo "${indexImports}" >"${barrelFile}"
  echo "${indexMap}" >>"${barrelFile}"

  echo "Generate translation file"
  echo "${i18n}" >"${translationlFile}"

  cd $FC_ROOT/fc/back

  echo "Auto lint generated files"
  npx eslint --quiet --fix $exceptionDir

  echo "Auto format generated files"
  npx prettier --log-level=error -w $exceptionDir --config .prettierrc
}

_generate_oidc_provider_exceptions
