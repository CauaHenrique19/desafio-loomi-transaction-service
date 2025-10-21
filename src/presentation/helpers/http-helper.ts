import { ServerError } from '@transaction-service/presentation/errors/server-error';
import { HttpResponse } from '@transaction-service/presentation/protocols';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message,
  name: error?.name,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error.message,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack!),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const createdSuccess = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const filesTooLarge = (): HttpResponse => ({
  statusCode: 413,
  body: 'Tamanho total de arquivo é muito grande',
});

export const partialSuccess = (body: any): HttpResponse => ({
  statusCode: 207,
  body,
});

export const notFound = (error?: Error): HttpResponse => ({
  statusCode: 404,
  body: error?.message || 'Recurso não encontrado.',
});
