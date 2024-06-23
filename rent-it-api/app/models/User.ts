import { Schema, model } from 'mongoose';

interface IUser {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    createdAt: Date;
    isDeleted: boolean;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const User = model<IUser>('User', userSchema);
export default User;
