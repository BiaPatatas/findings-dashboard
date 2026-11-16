import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FindingsModule } from './findings/findings.module';

@Module({ imports: [PrismaModule, FindingsModule] })
export class AppModule {}