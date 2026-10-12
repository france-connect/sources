import { DcqlQuery } from 'dcql';

import { Injectable } from '@nestjs/common';

import { DcqlCredentialFormat } from '../enums';
import { DcqlBaseException, DcqlInvalidQueryException } from '../exceptions';
import {
  extractClaimNames,
  parseMdocJsonPath,
  toFcDcqlQuery,
} from '../helpers';
import {
  BuildMdocDcqlQueryInputInterface,
  DcqlClaimQueryInterface,
  DcqlQueryInterface,
} from '../interfaces';

const DCQL_ID_FORBIDDEN_CHARS = /[^a-zA-Z0-9_-]/g;

@Injectable()
export class DcqlService {
  buildMdocQuery(input: BuildMdocDcqlQueryInputInterface): DcqlQueryInterface {
    const rawQuery = this.buildRawMdocQuery(input);

    return this.parse(rawQuery);
  }

  parse(input: unknown): DcqlQueryInterface {
    try {
      const parsed = DcqlQuery.parse(input as DcqlQuery.Input);

      DcqlQuery.validate(parsed);

      return toFcDcqlQuery(parsed);
    } catch (error: unknown) {
      throw this.wrapParseError(error);
    }
  }

  extractClaimNames(query: DcqlQueryInterface): string[] {
    return extractClaimNames(query);
  }

  private buildRawMdocQuery(
    input: BuildMdocDcqlQueryInputInterface,
  ): DcqlQueryInterface {
    const requiredIds = this.toClaimIds(input.requiredPaths);
    const optionalIds = this.toClaimIds(input.optionalPaths).filter(
      (id) => !requiredIds.includes(id),
    );
    const claimSets = this.buildClaimSets(requiredIds, optionalIds);

    return {
      credentials: [
        {
          id: input.id,
          format: DcqlCredentialFormat.MSO_MDOC,
          meta: { doctype_value: input.doctype },
          claims: this.buildMdocClaims(input),
          claim_sets: claimSets,
        },
      ],
    };
  }

  private buildMdocClaims(
    input: BuildMdocDcqlQueryInputInterface,
  ): DcqlClaimQueryInterface[] {
    const allPaths = [...input.requiredPaths, ...input.optionalPaths].map(
      (jsonPath) => parseMdocJsonPath(jsonPath),
    );

    const uniquePaths = new Map(
      allPaths.map((path) => [JSON.stringify(path), path]),
    );

    return [...uniquePaths.values()].map((path) => ({
      id: this.toClaimId(path),
      path,
      intent_to_retain: input.intentToRetain,
    }));
  }

  private toClaimIds(jsonPaths: readonly string[]): string[] {
    const ids = jsonPaths.map((jsonPath) =>
      this.toClaimId(parseMdocJsonPath(jsonPath)),
    );

    return [...new Set(ids)];
  }

  private toClaimId([namespace, claim]: readonly [string, string]): string {
    return `${namespace}_${claim}`.replace(DCQL_ID_FORBIDDEN_CHARS, '_');
  }

  private buildClaimSets(
    requiredIds: string[],
    optionalIds: string[],
  ): string[][] | undefined {
    if (!optionalIds.length) {
      return undefined;
    }

    const subsets: string[][] = [];

    for (let mask = 0; mask < 1 << optionalIds.length; mask++) {
      const optionalSubset = optionalIds.filter(
        (_, index) => (mask >> index) & 1,
      );

      subsets.push([...requiredIds, ...optionalSubset]);
    }

    return subsets.sort((a, b) => b.length - a.length);
  }

  private wrapParseError(error: unknown): DcqlBaseException {
    if (error instanceof DcqlBaseException) {
      return error;
    }

    return new DcqlInvalidQueryException(
      error instanceof Error ? error : undefined,
    );
  }
}
