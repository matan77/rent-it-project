import Property from '../models/Property';
import mongoose from 'mongoose';
import { ResError } from '../../types/ResError';

interface CreatePropertyParams {
	owner: string;
	title: string;
	description: string;
	services: string[];
	pricePerNight: number;
	coordinates: [number, number];
}

export default {
	createProperty: async ({ owner, title, description, services, pricePerNight, coordinates }: CreatePropertyParams) => {
		try {
			const newProperty = await Property.create({
				owner: new mongoose.Types.ObjectId(owner),
				title,
				description,
				services,
				pricePerNight,
				location: {
					type: 'Point',
					coordinates: coordinates, // should be [longitude, latitude]
				}
			});

			return newProperty;
		} catch (error) {
			throw new ResError(500, 'An error occurred while creating the property');
		}
	},
	
	setImagesById: async (propertyId: mongoose.Types.ObjectId, images: string[]) => {
		try {
			const updatedProperty = await Property.findByIdAndUpdate(
				propertyId,
				{ $push: { images: { $each: images } } },
				{ new: true }
			);

			if (!updatedProperty) {
				throw new ResError(404, 'Property not found');
			}


		} catch (error) {
			throw new ResError(500, 'An error occurred while updating images for the property');
		}
	},
};