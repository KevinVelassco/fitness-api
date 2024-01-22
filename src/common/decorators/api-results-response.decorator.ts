import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResultsResponse = <Model extends Type<any>>(model: Model) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          //{ $ref: getSchemaPath(ResultsOutputDto) },
          {
            properties: {
              count: { type: 'number' },
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
