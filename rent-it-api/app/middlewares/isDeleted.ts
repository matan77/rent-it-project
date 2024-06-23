import usersService from '../services/users';
import { Request, Response, NextFunction } from 'express';

const isDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await usersService.isUserDeleted(res.locals.userId);
        if (deleted) {
            return res.status(403).json({ message: 'Forbidden, this account has been deleted' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    next();
};

module.exports = isDeleted;
