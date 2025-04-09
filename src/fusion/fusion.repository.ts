import { Injectable } from '@nestjs/common';
import { DynamoService } from '../infrastructure/dynamo.service';
import { CreateFusionDto } from './fusion.dto';

export interface FusionRecord extends CreateFusionDto {
  created: string;
  updated: string;
}

@Injectable()
export class FusionRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  async createFusionRecord(record: FusionRecord): Promise<FusionRecord> {
    await this.dynamoService.putItem(record);
    return record;
  }

  async existsFusionRecord(namePlanet: string, monster: string): Promise<boolean> {
    return await this.dynamoService.findByNameOrMonster(namePlanet, monster);
  }

  async getFusionRecordsPaginated(page: number, limit: number): Promise<FusionRecord[]> {
    const items = await this.dynamoService.getPaginatedItems(page, limit);
    // Mapeamos los items a nuestro tipo FusionRecord
    const fusionRecords: FusionRecord[] = items.map(item => ({
      namePlanet: item.namePlanet,
      climate: item.climate,
      terrain: item.terrain,
      population: item.population,
      monster: item.monster,
      threatLevel: item.threatLevel,
      created: item.created,
      updated: item.updated,
    }));
    return fusionRecords;
  }
}
