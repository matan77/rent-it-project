import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ResError } from './ResError';




dotenv.config();

export default {
    registerUser: async (name: string, email: string, password: string, phoneNumber: string) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name, email, password: hashedPassword, phoneNumber });
        } catch (error) {
            if (error instanceof mongoose.mongo.MongoServerError && error.code == 11000) {
                throw new ResError(409, "There is already an account with this email")
            }
            throw new ResError();
        }
    },
    loginUser: async (email: string, password: string) => {
        try {
            const user = await User.findOne({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new ResError(401, 'Invalid email or password');
            }

            if (user.isDeleted) {
                throw new ResError(403, 'The account is deleted');
            }

            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY as string, { expiresIn: '7d' });

            return [user, token];
        } catch (error) {
            throw new ResError();
        }
    },
    getUser: async (id: string) => {
        let user: null | { name: string, email: string, phoneNumber: string } = null;
        try {
            user = await User.findOne({ _id: id },"id name email phoneNumber");

            if (!user) {
                throw new ResError(404, "User not found");
            }

            return user;
        } catch (error) {
            if (error instanceof ResError) {
                throw error;
            }
            throw new ResError();
        }
    },

    updateUser: async (id: string, name: string, phoneNumber: string) => {
        try {
            return User.updateOne({ _id: id }, {
                $set: {
                    name: name, phoneNumber: phoneNumber,
                }
            });
        }
        catch (error) {
            throw new ResError();
        }
    },

    deleteUser: async (id: string) => {
        try {
            return User.updateOne({ _id: id }, { $set: { isDeleted: true } });
        }
        catch (error) {
            throw new ResError();
        }
    },

    isUserDeleted: async (id: string) => {
        try {
            const user = await User.findOne({ _id: id });
            return user?.isDeleted;
        }
        catch (error) {
            throw new ResError();
        }
    }

}
