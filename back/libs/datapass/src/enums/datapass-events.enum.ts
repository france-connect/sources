/**
 * @see https://github.com/etalab/data_pass/blob/develop/docs/webhooks.md
 */
export enum DatapassEvents {
  /** The habilitation request has just been created */
  CREATE = 'create',

  /** The habilitation request has been updated by the requester */
  UPDATE = 'update',

  /** The habilitation request has been submitted by the requester */
  SUBMIT = 'submit',

  /** The habilitation request has been refused by an instructor */
  REFUSE = 'refuse',

  /** The habilitation has been revoked by an instructor */
  REVOKE = 'revoke',

  /** The habilitation request has been reviewed by an instructor and requires changes from the requester */
  REQUEST_CHANGES = 'request_changes',

  /** The habilitation request has been archived by an instructor */
  ARCHIVE = 'archive',

  /** The habilitation request has been approved by an instructor */
  APPROVE = 'approve',

  /** The habilitation has been reopened by the requester */
  REOPEN = 'reopen',

  /** The reopening request has been cancelled by a requester or an instructor */
  CANCEL_REOPENING = 'cancel_reopening',

  /** The habilitation request has been transferred to a new requester or organization */
  TRANSFER = 'transfer',
}
