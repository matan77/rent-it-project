import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { MongooseError } from 'mongoose';


dotenv.config();

export default {
    registerUser: async (name: string, email: string, password: string, phoneNumber: string) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name, email, password: hashedPassword, phoneNumber });
        } catch (error) {
            if (error instanceof MongooseError) {
                console.error(error);
                console.error(typeof error);
                throw new Error("There is already an account with this email");
            }
            throw new Error('Internal Server Error');
        }
    },
    loginUser: async (email: string, password: string) => {
        try {
            const user = await User.findOne({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Invalid email or password');
            }

            if (user.isDeleted) {
                throw new Error('The account deleted');
            }

            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY as string, { expiresIn: '7d' });

            return [user, token];
        } catch (error) {
            throw error;
        }
    },
    getUser: async (id: string) => {
        try {
            const user = await User.findOne({ _id: id });
            if (user) {
                return {
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            }
            else {
                return null
            };
        }
        catch (error) {
            throw new Error('Internal Server Error');
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
            throw new Error('Error update user details');
        }
    },

    deleteUser: async (id: string) => {
        try {
            return User.updateOne({ _id: id }, { $set: { isDeleted: true } });
        }
        catch (error) {
            throw new Error('Error delete failed');
        }
    },

    isUserDeleted: async (id: string) => {
        try {
            const user = await User.findOne({ _id: id });
            return user?.isDeleted;
        }
        catch (error) {
            throw new Error('Error delete failed');
        }
    }

}
