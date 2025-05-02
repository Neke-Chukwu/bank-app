import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Example: token expires in 30 days
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',  // Recommended for security (CSRF protection)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

export default createToken;
