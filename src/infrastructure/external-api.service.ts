import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  async getStarWarsPlanets() {
    const url = 'https://swapi.dev/api/planets';
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getDnDSpells() {
    const url = 'https://www.dnd5eapi.co/api/spells';
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }
}
