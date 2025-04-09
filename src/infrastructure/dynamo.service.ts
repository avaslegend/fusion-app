import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

@Injectable()
export class DynamoService {
  private client = new DynamoDB.DocumentClient();
  private tableName = process.env.DYNAMO_TABLE || 'FUSION_DATA';

  async putItem(item: any) {
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    return await this.client.put(params).promise();
  }

  async findByNameOrMonster(namePlanet: string, monster: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      FilterExpression: 'namePlanet = :np OR monster = :m',
      ExpressionAttributeValues: { ':np': namePlanet, ':m': monster },
    };
    const result = await this.client.scan(params).promise();
    const items = result.Items || [];
    return items.length > 0;
  }

  async getPaginatedItems(page: number, limit: number) {
    const params = {
      TableName: this.tableName,
    };
    const result = await this.client.scan(params).promise();
    const items = result.Items || [];
    const sortedItems = items.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    const start = (page - 1) * limit;
    const paginated = sortedItems.slice(start, start + limit);
    return paginated;
  }
}
