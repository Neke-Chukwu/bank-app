import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for profile images
const profileImageSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // Ensure one profile image per user
        },
        data: {
            type: Buffer, // Store image binary
            required: true,
        },
        contentType: {
            type: String, // e.g., 'image/jpeg', 'image/png'
            required: true,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the model
const ProfileImageModel = mongoose.model('ProfileImage', profileImageSchema);

// Export the model
export default ProfileImageModel;