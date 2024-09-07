import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
    validate(date: any, args: ValidationArguments) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return date >= new Date();
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Due date ($value) cannot be in the past!';
    }
  }
  
  export function IsNotPastDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsNotPastDateConstraint,
      });
    };
  }
  
































// // custom-decorators.ts
// import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// export function IsPastDate(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isPastDate',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           if (!(value instanceof Date) || (typeof value === 'string')) {
//             value = new Date(value);
//           }
//           return value < new Date();
//         },
//         defaultMessage(args: ValidationArguments) {
//           return 'Date ($value) must be in the past!';
//         },
//       },
//     });
//   };
// }
