export class ResError extends Error {
    status: number;
    constructor(statusCode: number = 500, message: string = 'Internal Server Error') {
        super(message);
        this.name = 'ResError';
        this.status = statusCode;
    }
}