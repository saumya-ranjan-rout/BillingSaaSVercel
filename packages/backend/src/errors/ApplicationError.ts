export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}
export class BadRequestError extends ApplicationError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, 400, details);
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}
