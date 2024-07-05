import { body, validationResult } from "express-validator";
import { Request, Response } from 'express';
import Property, { Services } from '../models/Property';
import propertiesService from '../services/properties'
import { ResError } from "../../types/ResError";

const propertyValidation = [
	body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a text'),
	body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a text'),
	body('services').notEmpty().withMessage('Services are required').isArray().withMessage('Services must be an array')
		.custom((values) => {
			return values.every((value: string) => Services.includes(value));
		}),
	body('pricePerNight').notEmpty().withMessage('Price per night is required').isNumeric().withMessage('Price per night must be a number').bail()
		.custom(value => parseInt(value) > 0).withMessage('Price per night must be greater than zero'),
	body('coordinates').notEmpty().withMessage('location is required').isArray().withMessage('Coordinates must be an array with [longitude, latitude] format')
		.custom(values => values.length === 2 && values.every((coord: any) => typeof coord === 'number')).withMessage('Coordinates must be an array of two numbers [longitude, latitude]')

];
export default {
	createProperty: [...propertyValidation,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const owner = res.locals.userId;
		try {
			await propertiesService.createProperty({ owner, ...req.body });
			res.status(201).json({ msg: "property created" });
		} catch (error) {
			if (error instanceof ResError)
				res.status(error.status).json({ msg: error.message });
		}
	}
	],
}
