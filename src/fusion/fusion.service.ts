import { Injectable, BadRequestException } from '@nestjs/common';
import { ExternalApiService } from '../infrastructure/external-api.service';
import { DynamoService } from '../infrastructure/dynamo.service';
import { RedisService } from '../infrastructure/redis.service';
import { CreateFusionDto } from './fusion.dto';

@Injectable()
export class FusionService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly dynamoService: DynamoService,
    private readonly redisService: RedisService,
  ) {}

  async getFusionados() {
    const cacheKey = 'fusionados';
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const starWarsData = await this.externalApiService.getStarWarsPlanets();
    const dndData = await this.externalApiService.getDnDSpells();

    const fusionData = starWarsData.results.map((planet, index) => {
      const spell = dndData.results[index] || { name: 'N/A', level: 0 };
      return {
        namePlanet: planet.name,
        climate: planet.climate,
        terrain: planet.terrain,
        population: planet.population,
        monster: spell.name,
        threatLevel: spell.level,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
    });

    await Promise.all(fusionData.map(item => this.dynamoService.putItem(item)));

    await this.redisService.set(cacheKey, JSON.stringify(fusionData), 1800);

    return fusionData;
  }

  async almacenarFusion(dto: CreateFusionDto) {
    const exists = await this.dynamoService.findByNameOrMonster(dto.namePlanet, dto.monster);
    if (exists) {
      throw new BadRequestException('El planeta o monster ya se encuentra registrado');
    }
    const registro = {
      ...dto,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    await this.dynamoService.putItem(registro);
    return { message: 'Registro almacenado exitosamente' };
  }

  async getHistorial(page: number, limit: number) {
    return await this.dynamoService.getPaginatedItems(page, limit);
  }
}
