import { badRequestHandler } from "./bad-request";
import { genericHandler } from "./generic";
import { notFoundHandler } from "./not-found";
import { validationErrorHandler } from './validation';

export const errorHandlers = [badRequestHandler, notFoundHandler, validationErrorHandler, genericHandler];