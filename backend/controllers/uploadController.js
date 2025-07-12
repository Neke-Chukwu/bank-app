import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/UserModel.js';
import ProfileImageModel from '../models/UserModel.js';

const uploadProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    console.log('uploadProfilePicture - userId:', userId);
    console.log('uploadProfilePicture - req.file:', req.file);
  
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error('User not found for userId:', userId);
      res.status(404);
      throw new Error('User not found.');
    }
  
    // Check if file was uploaded
    if (!req.file) {
      console.error('No profile picture uploaded for userId:', userId);
      res.status(400);
      throw new Error('No profile picture uploaded.');
    }
  
    // Handle Multer errors
    if (req.fileValidationError) {
      console.error('File validation error:', req.fileValidationError.message);
      res.status(400);
      throw new Error(req.fileValidationError.message);
    }
  
    // Find or create ProfileImage document
    let profileImage = await ProfileImageModel.findOne({ user: userId });
    const contentType = req.file.mimetype;
  
    if (profileImage) {
      console.log('Updating existing ProfileImage for userId:', userId);
      profileImage.data = req.file.buffer;
      profileImage.contentType = contentType;
      await profileImage.save();
    } else {
      console.log('Creating new ProfileImage for userId:', userId);
      profileImage = new ProfileImageModel({
        user: userId,
        data: req.file.buffer,
        contentType: contentType,
      });
      await profileImage.save();
    }
  
    // Update user's profileImage reference
    console.log('Updating user.profileImage with ProfileImage ID:', profileImage._id);
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { profileImage: profileImage._id },
      { new: true }
    );
  
    if (!updatedUser) {
      console.error('Failed to update user.profileImage for userId:', userId);
      res.status(500);
      throw new Error('Failed to update user profile.');
    }
  
    // Fetch updated user for response
    const responseUser = await UserModel.findById(userId)
      .select('-password')
      .populate('profileImage');
  
    console.log('Profile picture uploaded successfully for user:', responseUser.username);
    res.status(200).json({
      message: `Profile picture uploaded successfully for user ${responseUser.username}.`,
      user: {
        _id: responseUser._id,
        username: responseUser.username,
        email: responseUser.email,
        phone: responseUser.phone || '',
        accounts: responseUser.accounts,
        profilePicture: responseUser.profileImage
          ? {
              data: responseUser.profileImage.data.toString('base64'),
              contentType: responseUser.profileImage.contentType,
            }
          : { data: null, contentType: '' },
        idDocument: responseUser.idDocument || { frontUrl: '', backUrl: '' },
        role: responseUser.role,
        status: responseUser.status,
        createdAt: responseUser.createdAt,
        lastLogin: responseUser.lastLogin,
      },
    });
  });

export { uploadProfilePicture };