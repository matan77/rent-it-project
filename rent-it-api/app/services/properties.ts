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

	getProperties: async (isMy: boolean, userId: mongoose.Types.ObjectId, page: number = 1, limit: number = 10, filter: string = '') => {
		try {
			const skip = (page - 1) * limit;
			console.log(skip);
			console.log(limit);
			console.log(filter === '');

			let sort = {};
			if (filter === 'price_hl') {
				sort = { pricePerNight: -1 };
			} else if (filter === 'price_lh') {
				sort = { pricePerNight: 1 };
			} else {
				sort = { createdAt: -1 };
			}

			const query = isMy ? { owner: userId } : { owner: { $ne: userId } };


			const properties = await Property.find(query, { __v: 0 })
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.populate('owner', 'email phoneNumber')
				.exec();

			const totalProperties = await Property.countDocuments(query);
			const totalPages = Math.ceil(totalProperties / limit);

			return {
				properties,
				totalPages
			};
		} catch (error) {
			throw new ResError(500, 'An error occurred while fetching properties');
		}
	},
	getPropertyById: async (id: string) => {
		try {
			const property = await Property.findById(id, { __v: 0 })
				.populate('owner', 'email phoneNumber')
				.exec();

			if (!property) {
				throw new ResError(404, 'Property not found');
			}

			return property;
		} catch (error) {
			throw new ResError(500, 'An error occurred while fetching the property');
		}
	},

};