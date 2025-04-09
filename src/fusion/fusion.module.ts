import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FusionController } from './fusion.controller';
import { FusionService } from './fusion.service';
import { ExternalApiService } from '../infrastructure/external-api.service';
import { RedisService } from '../infrastructure/redis.service';
import { DynamoService } from '../infrastructure/dynamo.service';
@Module({
  imports: [HttpModule],
  controllers: [FusionController],
  providers: [FusionService, ExternalApiService, DynamoService, RedisService],
})
export class FusionModule {}
