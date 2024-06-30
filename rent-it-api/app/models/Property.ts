import { Schema, model } from "mongoose";

type Longitude = number;
type Latitude = number;


export const Services = ['Wi-Fi', 'Parking', 'Pool', 'Air Conditioning', 'Gym', 'Laundry', 'Kitchen']



interface IProperty {
	owner: Schema.Types.ObjectId;
	title: string;
	description: string;
	services: string[];
	pricePerNight: number;
	location: {
		type: "Point";
		coordinates: [Longitude, Latitude];
	};
	createdAt: Date;
}

const propertySchema = new Schema<IProperty>({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	services: {
		type: [String],
		enum: Services,
		default: []
	},
	pricePerNight: {
		type: Number,
		required: true
	},
	location: {
		type: {
			type: String,
			enum: ['Point'],
			required: true,
			default: 'Point'
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Create a 2dsphere index on the location field for queries
propertySchema.index({ location: '2dsphere' });

const Property = model<IProperty>('Property', propertySchema);

export default Property;
