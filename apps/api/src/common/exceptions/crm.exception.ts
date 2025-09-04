import { HttpException, HttpStatus } from "@nestjs/common";

export class CrmException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string,
    details?: any,
  ) {
    super(
      {
        message,
        code: code || "CRM_ERROR",
        details,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class ValidationException extends CrmException {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      "VALIDATION_ERROR",
      details,
    );
  }
}

export class NotFoundException extends CrmException {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND, "NOT_FOUND");
  }
}

export class UnauthorizedException extends CrmException {
  constructor(message: string = "Unauthorized access") {
    super(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class ForbiddenException extends CrmException {
  constructor(message: string = "Forbidden access") {
    super(message, HttpStatus.FORBIDDEN, "FORBIDDEN");
  }
}

export class ConflictException extends CrmException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.CONFLICT, "CONFLICT", details);
  }
}

export class RateLimitException extends CrmException {
  constructor(message: string = "Rate limit exceeded") {
    super(message, HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED");
  }
}
