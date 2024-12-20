export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class AppError extends CustomError {
    constructor(message = 'Application Error', statusCode = 500) {
        super(message, statusCode);
    }
}
export class NotFoundError extends CustomError {
    constructor(message = 'Not Found', statusCode = 404) {
        super(message, statusCode);
    }
}

export class ValidationError extends CustomError {
    constructor(message = 'Validation Error', statusCode = 400) {
        super(message, statusCode);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized', statusCode = 401) {
        super(message, statusCode);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden', statusCode = 403) {
        super(message, statusCode);
    }
}