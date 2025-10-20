import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ClientServiceModule } from './client-service.module';
import { CONFIG } from 'src/config';

async function bootstrap() {
  const app = await NestFactory.create(ClientServiceModule);
  app.enableCors();
  app.setGlobalPrefix('/api/');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      run: {
        autoCommit: false,
      },
      client: {
        clientId: CONFIG.SERVICE_NAME,
        brokers: [CONFIG.KAFKA_BROKER_HOST],
      },
      consumer: {
        groupId: CONFIG.SERVICE_NAME,
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Transaction Service')
    .setDescription('API responsável por gerenciar as transações do banco')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(CONFIG.PORT);
}
bootstrap();
