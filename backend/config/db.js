import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(`successfully connected to MongoDB :)`);
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
};

export default connectDB;