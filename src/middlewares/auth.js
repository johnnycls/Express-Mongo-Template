import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

function authMiddleware(req, res, next) {
  // Get token from header
  const token = req.headers.authorization;

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        res.locals.user = decoded.name;
        next();
      }
    });
  } catch (err) {
    console.error(err.msg);
    return res.status(500).json({ msg: "Server Error" });
  }
}

export default authMiddleware;
