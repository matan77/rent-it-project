import { Schema, model, Document } from "mongoose";

type Longitude = number;
type Latitude = number;

enum ServiceType {
    WIFI = 'Wi-Fi',
    PARKING = 'Parking',
    POOL = 'Pool',
    AIR_CONDITIONING = 'Air Conditioning',
    GYM = 'Gym',
    LAUNDRY = 'Laundry',
    KITCHEN = 'Kitchen'
}

interface IProperty {
    owner: Schema.Types.ObjectId;
    title: string;
    description: string;
    images: string[];
    services: ServiceType[];
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
    images: {
        type: [String],
        default: []
    },
    services: {
        type: [String],
        enum: Object.values(ServiceType),
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