import { Test, TestingModule } from '@nestjs/testing';
import { SayartawsResolver } from './sayartaws.resolver';
import { SayartawsService } from './sayartaws.service';

describe('SayartawsResolver', () => {
  let resolver: SayartawsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SayartawsResolver, SayartawsService],
    }).compile();

    resolver = module.get<SayartawsResolver>(SayartawsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
