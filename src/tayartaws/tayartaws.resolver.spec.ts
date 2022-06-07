import { Test, TestingModule } from '@nestjs/testing';
import { TayartawsResolver } from './tayartaws.resolver';
import { TayartawsService } from './tayartaws.service';

describe('TayartawsResolver', () => {
  let resolver: TayartawsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TayartawsResolver, TayartawsService],
    }).compile();

    resolver = module.get<TayartawsResolver>(TayartawsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
