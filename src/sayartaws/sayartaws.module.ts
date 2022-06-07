import { Module } from '@nestjs/common';
import { SayartawsService } from './sayartaws.service';
import { SayartawsResolver } from './sayartaws.resolver';
import { TayartawsService } from 'src/tayartaws/tayartaws.service';

@Module({
  providers: [SayartawsResolver, SayartawsService, TayartawsService],
})
export class SayartawsModule {}
