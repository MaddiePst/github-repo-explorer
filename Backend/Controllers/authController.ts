import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { supabase } from "../Connections/supabaseClient";

// Constants
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10; //Number of bcrypt rounds

// Read the JWT secret and expiry from env.
const RAW_JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ??
  "1h") as SignOptions["expiresIn"];

// Fail if SECRET is missing
if (!RAW_JWT_SECRET) {
  console.error(
    "Missing JWT_SECRET environment variable. Set JWT_SECRET in your .env or environment."
  );
  throw new Error("Missing JWT_SECRET environment variable");
}
const JWT_SECRET: jwt.Secret = RAW_JWT_SECRET as jwt.Secret;

// ---- Controllers ----

// Register: POST /auth/register
export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // check if user exists
    const { data: existing, error: qErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", String(email).toLowerCase())
      .limit(1);

    if (qErr) {
      console.error("DB error checking existing user:", qErr);
      return res.status(500).json({ message: "Database error" });
    }
    if (existing && (existing as any[]).length > 0)
      return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // insert user and return id, email, name
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: String(email).toLowerCase(),
          name: name || null,
          password: hashed,
        },
      ])
      .select("id, email, name")
      .single();

    if (error) {
      console.error("DB insert error:", error);
      return res.status(500).json({ message: "Insert failed" });
    }

    // Sign token with the typed secret and typed options
    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      token,
      user: { id: data.id, email: data.email, name: data.name },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Login: POST /auth/login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // fetch user row including hashed password
    const { data, error } = await supabase
      .from("users")
      .select("id, email, password, name")
      .eq("email", String(email).toLowerCase())
      .limit(1)
      .single();

    if (error) {
      // user not found or other DB error
      console.error("DB error fetching user for login:", error);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = data as {
      id: string;
      email: string;
      password: string;
      name?: string;
    };

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Sign token using the same JWT_SECRET and expiry defined above
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
