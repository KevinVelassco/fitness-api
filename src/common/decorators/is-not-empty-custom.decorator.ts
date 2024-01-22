import {
  registerDecorator,
  ValidationOptions,
  isString,
  buildMessage,
} from 'class-validator';

export function IsNotEmptyCustom(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          return (
            value !== '' &&
            value !== null &&
            value !== undefined &&
            (isString(value) ? value.trim().length > 0 : true)
          );
        },
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property should not be empty',
          validationOptions,
        ),
      },
    });
  };
}
