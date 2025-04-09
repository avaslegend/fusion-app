import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { FusionService } from './fusion.service';
import { CreateFusionDto } from './fusion.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CognitoAuthGuard } from '../auth/cognito.guard';

@ApiTags('Fusion')
@Controller()
export class FusionController {
  constructor(private readonly fusionService: FusionService) {}

  @Get('fusionados')
  async getFusionados() {
    return await this.fusionService.getFusionados();
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Post('almacenar')
  async almacenar(@Body() dto: CreateFusionDto) {
    return await this.fusionService.almacenarFusion(dto);
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Get('historial')
  async getHistorial(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return await this.fusionService.getHistorial(page, limit);
  }
}
