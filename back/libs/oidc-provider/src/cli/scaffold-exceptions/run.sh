#!/usr/bin/env bash

_generate_oidc_provider_exceptions() {
  cd $FC_ROOT/fc/back/node_modules/oidc-provider/lib

  local exceptionDir="${FC_ROOT}/fc/back/libs/oidc-provider/src/exceptions/runtime"

  local pattern="${exceptionDir}/*.exception.ts"

  local header="/**
  * Code generated from oidc-provider exceptions
  * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
  */
"
  indexMap="export const exceptionSourceMap = {"
  local indexImports="${header}"
  local i18nFr="${header}const DEFAULT_MESSAGE = 'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
  
export const frFR = {"
  local i18nEn="${header}const DEFAULT_MESSAGE = 'A technical error has occurred. Please close your browser tab and reconnect.';
  
export const enGB = {"

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
    local message=$(
      echo "$line" |
        # Extract everything inside the throw new statement
        sed -E "s/.*throw new [a-zA-Z0-9.]+\((.*)\)/\1/" |

        # Tokenize legit escaped single quotes
        sed -E "s/([^[:space:]])\\\\'([^[:space:]])/\1__LEGIT_ESC_QUOTE__\2/g" |

        # Convert string concatenations to ease readability
        sed -E "s/\" \\+ ([a-zA-Z0-9_.]+) \\+ \"/\${\1}/g" |

        # Replace quotes with double quotes for consistency
        sed -E "s/\\\\?['\"\`]/\"/g" |

        # Removes only unwanted quotes betweens args, but not inside function calls
        awk '
        BEGIN {FS = ", "}  # Use ", " as the primary field separator
        {
          parens = 0  # Track parentheses nesting level
          for (i = 1; i <= NF; i++) {
            # Adjust parentheses count
            parens += gsub(/\(/, "(", $i) - gsub(/\)/, ")", $i)

            # Remove double quotes only if they are field delimiters but not nested in function calls
            if (parens == 0 && $i ~ /^".*"$/) {
              gsub(/^"|"$/, "", $i)
            }

            printf "%s%s", $i, (i < NF ? ", " : "")
          }
          print ""
        }
      ' |

        # Remove start/end string delimiters ('"`)
        sed -E "s/^['\"\`](.*)['\"\`]$/\1/g" |

        # Restore legit escaped single quotes
        sed -E "s/__LEGIT_ESC_QUOTE__/\\\\'/g" |

        # Fix unescaped quote that have been transformed in single quote (TODO: find a more consistent way to prevent this ?)
        sed -E "s/([a-zA-Z])\"([a-zA-Z])/\1\\\\'\2/g"
    )

    # @example: CB6B
    local identifier=$(printf "%x" $(echo -n "${source}" | cksum | cut -d' ' -f 1) | head -c 5 | tr '[:lower:]' '[:upper:]')

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
    local TEMPLATE="${header}import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

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

    i18nFr="${i18nFr}
    '${i18nKey}': DEFAULT_MESSAGE,"

    i18nEn="${i18nEn}
    '${i18nKey}': DEFAULT_MESSAGE,"

    indexMap="${indexMap}
  '${source}': ${className},"
    indexImports="${indexImports}
import { ${className} } from './${relativeFileName}';"

  done < <(grep -rnEio 'throw new ([a-z0-9.]+)\(.*\)' | LC_ALL=C sort -fu)

  indexMap="${indexMap}
};
"
  i18nFr="${i18nFr}
};
"
  i18nEn="${i18nEn}
};
"

  local barrelFile="${exceptionDir}/index.ts"
  local translationFrFile="${exceptionDir}/fr-FR.i18n.ts"
  local translationEnFile="${exceptionDir}/en-GB.i18n.ts"

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
  echo "${i18nFr}" >"${translationFrFile}"
  echo "${i18nEn}" >"${translationEnFile}"

  cd $FC_ROOT/fc/back

  echo "Auto lint generated files"
  npx eslint $exceptionDir --fix

  echo "Auto format generated files"
  npx prettier --log-level=error -w $exceptionDir --config .prettierrc
}

_generate_oidc_provider_exceptions
