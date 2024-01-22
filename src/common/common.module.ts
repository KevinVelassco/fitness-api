import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { CustomExceptionFilter } from './filters';
import { FileUploadFactory } from './providers';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    FileUploadFactory,
  ],
  exports: [FileUploadFactory],
})
export class CommonModule {}
