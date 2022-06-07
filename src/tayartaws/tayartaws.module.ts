import { Module } from '@nestjs/common';
import { TayartawsService } from './tayartaws.service';
import { TayartawsResolver } from './tayartaws.resolver';
import { SayartawsService } from 'src/sayartaws/sayartaws.service';

@Module({
  providers: [TayartawsResolver, TayartawsService, SayartawsService],
})
export class TayartawsModule {}
