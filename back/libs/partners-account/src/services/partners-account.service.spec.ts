import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import { PartnersAccountService } from './partners-account.service';

describe('PartnersAccountService', () => {
  let service: PartnersAccountService;

  const accountMock = {
    sub: 'sub',
    firstname: 'test',
    lastname: 'test',
    email: 'test@test.fr',
    siren: '123456789',
  };

  const repositoryMock = {
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersAccount])],

      providers: [PartnersAccountService, Repository<PartnersAccount>],
    })
      .overrideProvider(getRepositoryToken(PartnersAccount))
      .useValue(repositoryMock)
      .compile();

    service = module.get<PartnersAccountService>(PartnersAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert the account', async () => {
      // When
      await service.upsert(accountMock);

      // Then
      expect(repositoryMock.upsert).toHaveBeenCalledWith(accountMock, [
        'email',
      ]);
    });
  });
});
