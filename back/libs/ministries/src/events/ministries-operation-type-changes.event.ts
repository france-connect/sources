import { IEvent } from '@nestjs/cqrs';

/** @TODO #447 Voir les nommages des Event/handler qui écoutent les modifications de mongo
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/447
 */
export class MinistriesOperationTypeChangesEvent implements IEvent {}
