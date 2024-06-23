import { ValidationError, body, check, validationResult } from "express-validator";
import { Request, Response } from 'express';
import usersService from '../services/users'

export default {
    registerUser: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('phoneNumber').isMobilePhone("any").withMessage('Invalid phone number'),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
            .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one digit'),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, email, password, phoneNumber } = req.body;
            try {
                await usersService.registerUser(name, email, password, phoneNumber);
                res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
                if (error instanceof Error)
                    res.status(500).json({ message: error.message });
            }
        }
    ],

    loginUser: [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            try {
                const [user, token] = await usersService.loginUser(email, password);
                res.status(200).json({ user, token });
            } catch (error) {
                if (error instanceof Error)
                    res.status(500).json({ message: error.message });
            }
        }
    ],

    getUser: [
        check('id').isMongoId(),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const user = await usersService.getUser(req.params.id);
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: 'User not found' });
                }
            } catch (error) {
                if (error instanceof Error)
                    res.status(500).json({ message: error.message });

            }
        }],

    updateUser: [
        body('name').notEmpty().withMessage('Name is required'),
        body('phoneNumber').isMobilePhone("any").withMessage('Invalid phone number'),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, phoneNumber } = req.body;
            try {
                await usersService.updateUser(res.locals.userId, name, phoneNumber);
                res.status(200).json({ message: 'User updated successfully' });
            } catch (error) {
                if (error instanceof Error)
                    res.status(500).json({ message: error.message });
            }
        }
    ],

    deleteUser: async (req: Request, res: Response) => {
        try {
            await usersService.deleteUser(res.locals.userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ message: error.message });
        }
    }
}