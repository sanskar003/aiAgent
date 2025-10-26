import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function verifyToken(req, res, next) {
  console.log("🔐 Checking token...");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  

  try {
    // Wrap jwt.verify in a Promise so we can await it
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
        if (err) reject(err);
        else resolve(decodedPayload);
      });
    });

    console.log("✅ Token decoded:", decoded);

    // Make sure this matches what you signed in authController
    req.userId = decoded.userId;  

    next();
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}