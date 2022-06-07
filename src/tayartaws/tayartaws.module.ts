import { Module } from '@nestjs/common';
import { TayartawsService } from './tayartaws.service';
import { TayartawsResolver } from './tayartaws.resolver';

@Module({
  providers: [TayartawsResolver, TayartawsService]
})
export class TayartawsModule {}
