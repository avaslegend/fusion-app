import { Module } from '@nestjs/common';
import { FusionModule } from 'src/fusion/fusion.module';


@Module({
  imports: [FusionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
