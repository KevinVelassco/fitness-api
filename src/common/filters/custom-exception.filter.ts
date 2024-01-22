import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let error: any;

    if (exceptionResponse) {
      error =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse;
    } else {
      error = this.handleDatabaseException(exception);
      status = error.statusCode ?? status;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url} ${status}`,
        exception.stack,
        CustomExceptionFilter.name,
      );
    } else {
      Logger.error(
        `${request.method} ${request.url} ${status}`,
        JSON.stringify({
          statusCode: status,
          path: request.url,
          method: request.method,
          ...error,
        }),
        CustomExceptionFilter.name,
      );
    }

    response.status(status).json({
      statusCode: status,
      ...error,
    });
  }

  private handleDatabaseException(error: any) {
    const uniqueRestrictionErrorCode = '23505';
    const valueTooLongErrorCode = '22001';

    if (error.code === uniqueRestrictionErrorCode) {
      return {
        statusCode: 409,
        message: error.detail,
        error: 'Conflict',
      };
    }

    if (error.code === valueTooLongErrorCode) {
      return {
        statusCode: 400,
        message: 'some property exceeds the allowed length',
        error: 'Bad Request',
      };
    }

    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }
}
