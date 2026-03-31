/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import handleDuplicateError from '../errors/handleDuplicateError';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import authenticationError from '../errors/handleAuthenticationError';
import handleCastError from '../errors/handleCastError';
import AppError from '../errors/AppError';

// Global error handler middleware
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';

    // Handle validation errors (e.g., mongoose validation)
    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        message = simplifiedError?.message;
    } else if (error?.name === 'ValidationError') {
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
    }
    // Handle duplicate key errors (e.g., MongoDB unique constraints)
    else if (error?.code === 11000) {
        const simplifiedError = handleDuplicateError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
    }
    // handle token expiry error
    else if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
    ) {
        const simplifiedError = authenticationError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError.message;
    }
    // handle cast error
    else if (error?.name === 'CastError') {
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
    }
    // Handle custom AppError (your own error class)
    else if (error instanceof AppError) {
        statusCode = error?.statusCode;
        message = error.message;
    }
    // Handle general JavaScript errors
    else if (error instanceof Error) {
        message = error.message;
    }

    // Send error response to client
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error: {
            details: error,
        },
        stack: config.node_env === 'development' ? error?.stack : null,
    });

    return;
};

export default globalErrorHandler;