# Fusion API

## Descripción

Fusion API es una aplicación RESTful desarrollada con NestJS (Node.js 20) que integra datos de dos APIs externas: la API de StarWars y la API de Dungeons & Dragons 5e. La aplicación fusiona los datos, los almacena en una tabla DynamoDB (`FUSION_DATA`) y expone tres endpoints:
- **GET /fusionados:** Fusiona y almacena datos.
- **POST /almacenar:** Permite agregar un registro nuevo, validando duplicados.
- **GET /historial:** Retorna el historial de registros (paginado y ordenado cronológicamente).

Se implementa caching con Redis, autenticación con AWS Cognito, documentación Swagger y monitoreo (CloudWatch, X-Ray). La infraestructura se despliega mediante AWS CDK.

## Tecnologías

- **Lenguaje y Framework:** Node.js 20, NestJS
- **Arquitectura:** Hexagonal, Clean Architecture, SOLID
- **Infraestructura:** AWS Lambda, API Gateway, DynamoDB, ElastiCache (Redis), Cognito, VPC
- **Infraestructura como Código:** AWS CDK (TypeScript)
- **Pruebas:** Jest, Gherkin (BDD)
- **Documentación:** Swagger

## Endpoints

- **GET /fusionados:**  
  Fusiona datos de [StarWars](https://swapi.dev/api/planets) y [D&D](https://www.dnd5eapi.co/api/spells), almacena en DynamoDB y devuelve el resultado.
  
- **POST /almacenar:**  
  Permite crear un nuevo registro en `FUSION_DATA` validando duplicados. (Requiere autenticación Cognito)
  
- **GET /historial:**  
  Retorna el historial de registros con paginación y orden cronológico. (Requiere autenticación Cognito)

## Compilación y Pruebas

1. **Instalación de dependencias:**
   ```bash
   npm install
   npm run build
   cdk bootstrap
   cdk synth

## Despliegue

   cdk deploy
