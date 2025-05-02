import jwt from 'jsonwebtoken';
import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/userModel.js'; 

// Authorize user
const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  // console.log("Cookies:", req.cookies); //check cookies

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      /* console.log("Decoded JWT:", decoded);
      console.log("Decoded userId:", decoded.userId);
      console.log("type of decoded userId:", typeof decoded.userId);*/

      const user = await UserModel.findById(decoded.userId).select('-password');
      console.log("Found User:", user);
      /* if(user){
      console.log("type of user._id:", typeof user._id);
      }*/

      if (user) {
        req.user = user; // Use lowercase 'user' for consistency in the request object
        next();
      } else {
        res.status(401);
        throw new Error('User not found');
      }
    } catch (error) {
      // console.error("Authentication error:", error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token found');
  }
});

// Check if user is an admin
const authorizeAdmin = (req, res, next) => {
  // console.log("req.user in authorizeAdmin:", req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

export { authenticate, authorizeAdmin };