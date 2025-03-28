import jwt from "jsonwebtoken";
import { constants } from "../../../utils/constants.utils.js";

const tokenKey = constants.jwt.tokenSecret;

export function generateAccessToken(userData) {
  return jwt.sign(userData, tokenKey, {
    expiresIn: "39800s"
  });
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({ error: "Authorization token missing" });

  jwt.verify(token, tokenKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Token has expired. Please log in again." });
      } else {
        return res
          .status(403)
          .json({ error: "Forbidden: Invalid or corrupted token" });
      }
    }

    req.user = user;

    next();
  });
}
