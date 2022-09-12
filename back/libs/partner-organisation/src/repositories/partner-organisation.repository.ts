import { EntityRepository, Repository } from 'typeorm';

import { Organisation } from '@entities/typeorm';

@EntityRepository(Organisation)
export class PartnerOrganisationRepository extends Repository<Organisation> {}
