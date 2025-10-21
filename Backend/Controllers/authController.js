import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readJSON, writeJSON } from "./reusableFunc.js";
import { v4 as uuidv4 } from "uuid";
import { SECRET } from "../Middleware/authMiddleware.js";

/// Read data
const rawData = await readJSON("users.json"); // returns { users: [...] }
const users = rawData.users || [];
// console.log(users);

// ******Register (POST) user*****
export const createNewUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Verify for all required fields to be complete
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ message: "Email, password and name required" });

    const normalized = String(email).toLowerCase().trim();

    // Check if the user alredy exists
    if (
      users.find((u) => String(u.email).toLowerCase().trim() === normalized)
    ) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Establish new user
    const newUser = { id: uuidv4(), email, password, name };

    // Add new user to the data
    users.push(newUser);
    await writeJSON("users.json", users);

    return res
      .status(201)
      .json({ id: newUser.id, email: newUser.email, name: newUser.name });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//************Read (GET) user/LogIn**********
export const logInUser = async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const password = String(body.password || "");

    // Check if email and password exists
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    //Read users
    const users = await readJSON("users.json");
    // console.log("Loaded users count:", Array.isArray(users) ? users.length : 0);

    // Find if user exists
    const userIndex = Array.isArray(users)
      ? users.findIndex(
          (u) =>
            String(u.email || "")
              .toLowerCase()
              .trim() === email
        )
      : -1;
    const user = userIndex === -1 ? null : users[userIndex];
    // console.log("Login attempt for:", email, "found user:", !!user);

    // Check for user
    if (!user)
      return res
        .status(401)
        .json({ error: "Invalid credentials", reason: "user_not_found" });

    console.log(
      "Stored password snippet:",
      String(user.password || "").slice(0, 20)
    );

    let match = false;
    let migratedPlaintext = false;

    // If stored password looks like bcrypt ($2), try bcrypt.compare
    if (typeof user.password === "string" && user.password.startsWith("$2")) {
      try {
        match = await bcrypt.compare(password, user.password);
        console.log("bcrypt.compare result:", match);
      } catch (err) {
        console.error("bcrypt.compare error:", err);
      }
    } else {
      // Fallback: maybe password was stored plaintext (unsafe). Try plaintext compare.
      console.log("Password not hashed. Trying plaintext fallback.");
      if (password === user.password) {
        match = true;
        migratedPlaintext = true;
        console.log("Plaintext password matched; will migrate to bcrypt hash.");
      } else {
        console.log("Plaintext compare failed.");
      }
    }

    // When is not a match
    if (!match) {
      return res.status(401).json({
        error: "Invalid credentials",
        reason: "password_mismatch",
        note: "Check the password you typed or re-create the user if needed.",
      });
    }

    // If we matched using plaintext fallback, re-hash and save to users.json
    if (migratedPlaintext) {
      try {
        const newHash = await bcrypt.hash(password, 10);
        users[userIndex].password = newHash;
        await writeJSON("users.json", users);
        console.log(
          "Migrated plaintext password -> bcrypt hash for user:",
          user.email
        );
      } catch (err) {
        console.error("Failed to migrate/hash password:", err);
      }
    }

    // Success — issue token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
