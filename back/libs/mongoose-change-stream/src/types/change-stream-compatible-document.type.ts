import {
  ChangeStreamDeleteDocument,
  ChangeStreamInsertDocument,
  ChangeStreamRenameDocument,
  ChangeStreamReplaceDocument,
  ChangeStreamUpdateDocument,
} from 'mongodb';

export type ChangeStreamCompatibleDocument =
  | ChangeStreamInsertDocument
  | ChangeStreamUpdateDocument
  | ChangeStreamDeleteDocument
  | ChangeStreamReplaceDocument
  | ChangeStreamRenameDocument;
