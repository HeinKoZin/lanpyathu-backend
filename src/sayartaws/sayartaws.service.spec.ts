import { Test, TestingModule } from '@nestjs/testing';
import { SayartawsService } from './sayartaws.service';

describe('SayartawsService', () => {
  let service: SayartawsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SayartawsService],
    }).compile();

    service = module.get<SayartawsService>(SayartawsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
