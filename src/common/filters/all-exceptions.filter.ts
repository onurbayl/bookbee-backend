import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException) //This part handle all exceptions we throw.
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;  // Default to 500 if exception isn't a HttpException

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';  // Default error message

    response.status(status).json({
      statusCode: status,
      message: message,
      date: new Date().toISOString(),
      path: context.getResponse().url,
    });
  }
}