import { Schema, model } from "mongoose";
interface IBooking {
    user: Schema.Types.ObjectId;
    property: Schema.Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Booking = model<IBooking>('Booking', bookingSchema);
export default Booking;
