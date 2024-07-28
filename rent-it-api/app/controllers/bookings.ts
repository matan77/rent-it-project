import { body, param, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import bookingsService from '../services/bookings';
import { ResError } from '../../types/ResError';

const bookingValidation = [
	body('property').notEmpty().withMessage('Property is required').isMongoId().withMessage('Property must be a valid ID'),
	body('checkIn').notEmpty().withMessage('Check-in date is required').isISO8601().withMessage('Check-in date must be a valid date'),
	body('checkOut').notEmpty().withMessage('Check-out date is required').isISO8601().withMessage('Check-out date must be a valid date')
		.custom((value, { req }) => {
			if (new Date(value) <= new Date(req.body.checkIn)) {
				throw new Error('Check-out date must be after check-in date');
			}
			return true;
		})
];

export default {
	createBooking: [
		...bookingValidation,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const user = res.locals.userId;
			const { property, checkIn, checkOut } = req.body;

			try {
				const newBooking = await bookingsService.createBooking({ user, property, checkIn, checkOut });
				res.status(201).json(newBooking);
			} catch (error) {
				if (error instanceof ResError) {
					res.status(error.status).json({ msg: error.message });
				} else {
					console.error('Error creating booking:', error);
					res.status(500).json({ msg: 'Internal Server Error' });
				}
			}
		}
	],

	getBookings: async (req: Request, res: Response) => {
		const { page = 1 } = req.query;
		const userId = res.locals.userId;

		try {
			const result = await bookingsService.getBookings(userId, parseInt(page as string), 10);
			res.json(result);
		} catch (error) {
			console.error('Error fetching bookings:', error);
			res.status(500).json({ msg: 'Internal Server Error' });
		}
	},

	getBookingsByOwner: async (req: Request, res: Response) => {
		const { page = 1, limit = 10 } = req.query;

		const errors = validationResult(req);
		const ownerId = res.locals.userId;
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const result = await bookingsService.getBookingsByOwner(
				ownerId,
				parseInt(page as string),
				parseInt(limit as string)
			);
			res.json(result);
		} catch (error) {
			if (error instanceof ResError) {
				res.status(error.status).json({ msg: error.message });
			} else {
				console.error('Error fetching bookings by owner:', error);
				res.status(500).json({ msg: 'Internal Server Error' });
			}
		}
	}

};
