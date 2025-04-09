import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Callback, Handler, Context } from 'aws-lambda';
import {  ValidationPipe} from '@nestjs/common';

const serverSubject = new ReplaySubject<Handler>();

async function bootstrap(): Promise<Handler> {
    console.log('Initializing Nest');
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );
    const config = new DocumentBuilder()
      .setTitle('Patients API')
      .setDescription('API RESTful para la gestión de pacientes')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

void bootstrap().then((server) => serverSubject.next(server));

type EventPayload = {
    [key: string]: any;
}


export const handler: Handler = async (
    event: EventPayload,
    context: Context,
    callback: Callback,
) => {
    if (event.path === '' || event.path === undefined) event.path = '/';
    console.log('Event-Fusion: ', event);

    const server = await firstValueFrom(serverSubject);
    return server(event, context, callback);
}
