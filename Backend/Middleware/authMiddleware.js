import jwt from "jsonwebtoken";

// SECRET = secret key for signing;
export const SECRET = process.env.JWT_SECRET || "jdfhhak";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  // auth doesn't exists
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }
  // Get the token
  const token = auth.split(" ")[1];
  try {
    //verify the token structure
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id, email: payload.email };
    // Calls next() to tell Express: “this middleware is done"
    return next();
  } catch (err) {
    console.error("auth verify error:", err && err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
