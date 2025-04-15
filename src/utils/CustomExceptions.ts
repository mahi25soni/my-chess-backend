class CustomError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(statusCode: number, message: string, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

class BadRequestException extends CustomError {
  constructor(message: string, errorCode = "bad_request") {
    super(400, message, errorCode);
  }
}

class NotFoundException extends CustomError {
  constructor(message: string, errorCode = "not_found") {
    super(404, message, errorCode);
  }
}

class ForbiddenException extends CustomError {
  constructor(message: string, errorCode = "forbidden") {
    super(403, message, errorCode);
  }
}

class UnauthorizedException extends CustomError {
  constructor(message: string, errorCode = "unauthorized") {
    super(401, message, errorCode);
  }
}

class ConflictException extends CustomError {
  constructor(message: string, errorCode = "conflict") {
    super(409, message, errorCode);
  }
}

class InternalServerErrorException extends CustomError {
  constructor(message: string, errorCode = "internal_server_error") {
    super(500, message, errorCode);
  }
}

class ServiceUnavailableException extends CustomError {
  constructor(message: string, errorCode = "service_unavailable") {
    super(503, message, errorCode);
  }
}

class UnprocessableEntityException extends CustomError {
  constructor(message: string, errorCode = "unprocessable_entity") {
    super(422, message, errorCode);
  }
}

export {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnprocessableEntityException
};
