/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';
import { ZodError } from 'zod';

const handleValidationError = (
    err: mongoose.Error.ValidationError | ZodError,
): TGenericErrorResponse => {
    const statusCode = 400;

    return {
        statusCode,
        message: err instanceof ZodError ? (err.issues[0]?.message ?? 'Validation error') : 'Zod error',
    };
};

export default handleValidationError;