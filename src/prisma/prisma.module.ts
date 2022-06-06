import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
