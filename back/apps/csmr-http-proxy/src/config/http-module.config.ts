/**
 * allow to accept all requests ,bad or successful from external ressource
 * @param status
 * @returns
 */
export function validateStatus(status: number) {
  return 100 <= status && status < 600;
}

/**
 * avoid decompress (JSON.parse...) process on Axios response
 * @param raw
 * @returns
 */
/* istanbul ignore next line */
export const rawTransform = (raw) => raw;
