import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your_jwt_secret', { // Add a default secret
    expiresIn: '30d',
  });

  // Set the JWT as an HTTP-only cookie (RECOMMENDED)
  res.header('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  // Also send the token in the response body (LESS SECURE - USE WITH CAUTION)
  return token;
};

export default createToken;
