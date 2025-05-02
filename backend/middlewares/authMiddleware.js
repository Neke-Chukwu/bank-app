import jwt from 'jsonwebtoken';
import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/UserModel.js'; 

// Authorize user
const authenticate = asyncHandler(async (req, res, next) =>  {
  console.log("verifyToken middleware executed for:", req.originalUrl);
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing. Please provide a valid token." });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header is malformed. Expected format: 'Bearer <token>'." });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const decoded = jwt.verify(token, jwtSecret); // Automatically checks token expiration

    const user = await UserModel.findById(decoded.userId).select("_id role");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = {
      _id: user._id,
      role: user.role,
      userId: user._id.toString(),
    };

    console.log(`Token verified for user ID: ${req.user.userId}`);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired, please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token, please log in again." });
    }

    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Authentication failed." });
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