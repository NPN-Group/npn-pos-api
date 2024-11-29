import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { ZodError } from "zod";
import { Response } from "express";
import { MongooseError } from "mongoose";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = ['Something went wrong'];
        let error = 'Internal server error';

        if (exception instanceof HttpException) {
            const res = exception.getResponse() as { message: string; statusCode: number; error: string; };
            statusCode = res.statusCode;
            error = res.error;
            message = [res.message];
        } else if (exception instanceof ZodError) {
            message = exception.errors.map(e => e.message);
            statusCode = HttpStatus.BAD_REQUEST;
            error = 'Bad Request';
        } else if (exception instanceof MongooseError) {
            message = [exception.message];
            statusCode = HttpStatus.BAD_REQUEST;
            error = 'Bad Request';
        } else if (exception instanceof SyntaxError) {
            message = [exception.message];
            statusCode = HttpStatus.BAD_REQUEST;
            error = 'Bad Request';
        } else if (exception instanceof Error) {
            message = [exception.message];
            statusCode = HttpStatus.BAD_REQUEST;
            error = 'Bad Request';
        } else {
            console.log('unknown exception', exception);
        }

        response.status(statusCode).json({
            statusCode,
            error,
            message,
        });
    }

}