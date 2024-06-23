import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        if (decoded && typeof decoded === 'object') {
            res.locals.userId = decoded.userId;
        }
        next();
    });
};

export default authenticateJWT;
