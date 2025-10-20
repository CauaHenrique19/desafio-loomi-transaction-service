import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  BuildCreateTransactionController,
  BuildFindTransactionByClientIdController,
  BuildFindTransactionByIdController,
} from '@transaction-service/main/factories/controllers';
import { controllerAdapter } from '@transaction-service/main/adapters/controller.adpter';
import { CreateTransactionDTO } from '@transaction-service/main/controllers/transaction/dto';
import { IdempotencyInterceptor } from '@transaction-service/main/interceptors';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly buildCreateTransactionController: BuildCreateTransactionController,
    private readonly buildFindTransactionByIdController: BuildFindTransactionByIdController,
    private readonly buildFindTransactionByClientIdController: BuildFindTransactionByClientIdController,
  ) {}

  @ApiHeader({
    name: 'idempotency-key',
    description:
      'Chave única usada para garantir que requisições duplicadas não gerem múltiplas operações.',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      example: {
        senderClientId: 'uuid',
        receiverClientId: 'uuid',
        amout: 10,
        description: 'transferencia blablabla',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiNotFoundResponse({
    description: 'Usuário inexistente na base',
  })
  @ApiCreatedResponse({
    description: 'Transferencia realizada',
    example: {
      statusCode: 201,
      body: {
        id: 'string',
        senderClientId: 'string',
        receiverClientId: 'string',
        amout: 'number',
        description: 'string',
        createdAt: 'Date',
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Header 'idempotency-key' is required for this request.",
  })
  @ApiResponse({
    status: 409,
    description: 'Requisição duplicada com a mesma idempotency-key',
  })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(IdempotencyInterceptor)
  async create(
    @Body() body: CreateTransactionDTO,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildCreateTransactionController.build(),
      body,
    );
    response.status(result.statusCode).json(result);
  }

  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiNotFoundResponse({
    description: 'Nenhuma transação encontrada',
  })
  @ApiOkResponse({
    description: 'Transação encontrada com id',
    example: {
      statusCode: 200,
      body: {
        id: 'string',
        senderClientId: 'string',
        receiverClientId: 'string',
        amout: 'number',
        description: 'string',
        deletedAt: 'Date',
      },
    },
  })
  @Get('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findById(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildFindTransactionByIdController.build(),
      { id },
    );
    response.status(result.statusCode).json(result);
  }

  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  @ApiOkResponse({
    description: 'Transações encontradas',
    isArray: true,
    example: {
      statusCode: 200,
      body: [
        {
          id: 'string',
          senderClientId: 'string',
          receiverClientId: 'string',
          amout: 'number',
          description: 'string',
          deletedAt: 'Date',
        },
      ],
    },
  })
  @Get('user/:clientId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findByClientId(
    @Param('clientId') clientId: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildFindTransactionByClientIdController.build(),
      { clientId },
    );
    response.status(result.statusCode).json(result);
  }
}
