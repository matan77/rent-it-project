import { body, param, validationResult } from "express-validator";
import { NextFunction, Request, Response } from 'express';
import Property, { Services } from '../models/Property';
import propertiesService from '../services/properties'
import { ResError } from "../../types/ResError";
import { bucket } from '../config/firebase';
const { getDownloadURL } = require('firebase-admin/storage');
import multer from 'multer';

const upload = multer({
	storage: multer.memoryStorage(),
});

const propertyValidation = [
	body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a text'),
	body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a text'),
	body('services').isArray().withMessage('Services must be an array')
		.custom((values) => {
			return values.every((value: string) => Services.includes(value));
		}).withMessage('invalid services'),
	body('pricePerNight').notEmpty().withMessage('Price per night is required').isNumeric().withMessage('Price per night must be a number').bail()
		.custom(value => parseInt(value) > 0).withMessage('Price per night must be greater than zero'),
	body('coordinates').notEmpty().withMessage('location is required').isArray().withMessage('Coordinates must be an array with [longitude, latitude] format')
		.custom(values => values.length === 2 && values.every((coord: any) => typeof coord === 'number')).withMessage('Coordinates must be an array of two numbers [longitude, latitude]')
];

export default {
	createProperty: [
		upload.array('images', 5),
		async (req: Request, res: Response, next: NextFunction) => {
			if (req.body.coordinates)
				req.body.coordinates = JSON.parse(req.body?.coordinates);

			if (req.body.services)
				req.body.services = JSON.parse(req.body?.services);


			next();
		}
		,
		...propertyValidation,
		async (req: Request, res: Response) => {



			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const owner = res.locals.userId;
			try {
				const newProperty = await propertiesService.createProperty({ owner, ...req.body });

				const files = req.files;

				if (files instanceof Array) {
					const uploadPromises = files.map(file => {
						const filePath = `${newProperty._id}/${file.originalname}`;
						const fileUpload = bucket.file(filePath);

						return fileUpload.save(file.buffer, {
							metadata: {
								contentType: file.mimetype
							}
						}).then(async () => (await getDownloadURL(fileUpload)));
					});

					const uploadedFiles = await Promise.all(uploadPromises);
					await propertiesService.setImagesById(newProperty._id, uploadedFiles);

				}

				res.status(201).json({ msg: "Property created" });

			} catch (error) {
				if (error instanceof ResError) {
					res.status(error.status).json({ msg: error.message });
				} else {
					console.error('Error creating property:', error);
					res.status(500).json({ msg: 'Internal Server Error' });
				}
			}
		}
	],

	getProperties:
		async (req: Request, res: Response) => {
			const { page = 1, filter = '', isMy } = req.query;

			const owner = res.locals.userId;

			try {
				const result = await propertiesService.getProperties(
					(isMy && typeof isMy === 'string' && isMy.trim().toLowerCase() === 'true') ? true : false,
					owner,
					parseInt(page as string),
					3,
					filter as string
				);
				res.json(result);
			} catch (error) {
				res.status(500).json({ msg: 'An error occurred while fetching properties' });
			}
		},
	getPropertyById: [
		param('id').isMongoId().withMessage('Invalid property ID'),
		async (req: Request, res: Response) => {
			const { id } = req.params;

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			try {
				const property = await propertiesService.getPropertyById(id);

				res.json(property);
			} catch (error) {
				if (error instanceof ResError) {
					res.status(error.status).json({ msg: error.message });
				} else {
					console.error('Error fetching property by ID:', error);
					res.status(500).json({ msg: 'Internal Server Error' });
				}
			}
		}]
};
