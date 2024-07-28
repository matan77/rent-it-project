import Booking from '../models/Booking';
import Property from '../models/Property';
import mongoose from 'mongoose';
import { ResError } from '../../types/ResError';

interface CreateBookingParams {
	user: string;
	property: string;
	checkIn: Date;
	checkOut: Date;
}

export default {
	createBooking: async ({ user, property, checkIn, checkOut }: CreateBookingParams) => {
		try {
			// Check for overlapping bookings
			const overlappingBookings = await Booking.find({
				property: new mongoose.Types.ObjectId(property),
				$and: [
					{ checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
				]
			}).exec();

			if (overlappingBookings.length > 0) {
				throw new ResError(400, 'The property is already booked for the selected dates');
			}

			// Calculate total price
			const propertyDetails = await Property.findById(property).exec();
			if (!propertyDetails) {
				throw new ResError(404, 'Property not found');
			}

			const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
			const totalPrice = propertyDetails.pricePerNight * nights;

			// Create new booking
			const newBooking = await Booking.create({
				user: new mongoose.Types.ObjectId(user),
				property: new mongoose.Types.ObjectId(property),
				checkIn,
				checkOut,
				totalPrice
			});

			return newBooking;
		} catch (error) {
			if (error instanceof ResError) {
				throw error;
			}
			console.log(JSON.stringify(error));
			console.log(error);

			throw new ResError(500, 'An error occurred while creating the booking');
		}
	},

	getBookings: async (userId: mongoose.Types.ObjectId, page: number = 1, limit: number = 10) => {
		try {
			const skip = (page - 1) * limit;

			const bookings = await Booking.find({ user: userId }, { __v: 0 })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate('user', 'email phoneNumber')
				.populate('property', 'title pricePerNight')
				.exec();

			const totalBookings = await Booking.countDocuments({ user: userId });
			const totalPages = Math.ceil(totalBookings / limit);

			return {
				bookings,
				totalPages
			};
		} catch (error) {
			if (error instanceof ResError) {
				throw error;
			}
			throw new ResError(500, 'An error occurred while fetching bookings');
		}
	},
	getBookingsByOwner: async (ownerId: mongoose.Types.ObjectId, page: number = 1, limit: number = 10) => {
		try {
			const skip = (page - 1) * limit;

			// Get properties owned by the user
			const properties = await Property.find({ owner: ownerId }, { _id: 1 }).exec();
			const propertyIds = properties.map(property => property._id);

			// Find bookings for those properties
			const bookings = await Booking.find({ property: { $in: propertyIds } }, { __v: 0 })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate('user', 'email phoneNumber')
				.populate('property', 'title pricePerNight')
				.exec();

			const totalBookings = await Booking.countDocuments({ property: { $in: propertyIds } });
			const totalPages = Math.ceil(totalBookings / limit);

			return {
				bookings,
				totalPages
			};
		} catch (error) {
			if (error instanceof ResError) {
				throw error;
			}
			throw new ResError(500, 'An error occurred while fetching bookings');
		}
	},

};
