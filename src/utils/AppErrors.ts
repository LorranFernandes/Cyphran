export class AppError extends Error {
    public readonly statusCode: number;
    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 422); 
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}
