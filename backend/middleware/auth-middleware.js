import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      // The `select('-password')` is to exclude the password from the user object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };