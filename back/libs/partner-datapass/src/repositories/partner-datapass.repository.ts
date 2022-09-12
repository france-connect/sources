import { EntityRepository, Repository } from 'typeorm';

import { Datapass } from '@entities/typeorm';

@EntityRepository(Datapass)
export class PartnerDatapassRepository extends Repository<Datapass> {}
