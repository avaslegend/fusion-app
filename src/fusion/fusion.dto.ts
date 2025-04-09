import { IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFusionDto {
  @ApiProperty()
  @IsString()
  readonly namePlanet: string;

  @ApiProperty()
  @IsString()
  readonly climate: string;

  @ApiProperty()
  @IsString()
  readonly terrain: string;

  @ApiProperty()
  @IsString()
  readonly population: string;

  @ApiProperty()
  @IsString()
  readonly monster: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(9)
  readonly threatLevel: number;
}
