/**
 * `valueDigests` map of the MSO: namespace → digestId → digest bytes.
 */
export type MdocValueDigest = ReadonlyMap<number, Uint8Array>;

export type MdocValueDigests = ReadonlyMap<string, MdocValueDigest>;
