import { Test, TestingModule } from '@nestjs/testing';
import { TayartawsService } from './tayartaws.service';

describe('TayartawsService', () => {
  let service: TayartawsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TayartawsService],
    }).compile();

    service = module.get<TayartawsService>(TayartawsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
