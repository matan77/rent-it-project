import app from "./app";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  try {
    const port: string | number = process.env.PORT || "3000";
    await mongoose.connect(process.env.CONNECTION_DB as string);
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  }
  catch (err) {
    console.error(`FAILED TO START: ${err}`);
  }
};

run();

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err}`);
    process.exit(1);
  }
});
