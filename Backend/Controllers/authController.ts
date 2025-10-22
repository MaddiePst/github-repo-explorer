// Controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { supabase } from "../Connections/supabaseClient";
import dotenv from "dotenv";
dotenv.config();

//Config / constants
const SALT_ROUNDS = 10;

/**
 * Helper: ensure JWT env vars are present and return typed values
 */
function getJwtConfig(): {
  SECRET: jwt.Secret;
  expiresIn: SignOptions["expiresIn"];
} {
  const SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

  if (!SECRET) {
    // fail fast — caller can catch and return a 500
    throw new Error("Missing JWT_SECRET environment variable");
  }

  // typed for SignOptions
  return {
    SECRET: SECRET as jwt.Secret,
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
}

/**
 * Register: POST /auth/register
 * body: { email, password, name }
 */
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
      console.error(qErr);
      return res.status(500).json({ message: "Database error" });
    }
    if (existing && (existing as any[]).length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

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
      console.error(error);
      return res.status(500).json({ message: "Insert failed" });
    }

    // Create token (use helper to validate/cast env vars)
    let SECRET: jwt.Secret;
    let expiresIn: SignOptions["expiresIn"];
    try {
      ({ SECRET, expiresIn } = getJwtConfig());
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server configuration error" });
    }

    const options: SignOptions = { expiresIn };

    const token = jwt.sign({ id: data.id, email: data.email }, SECRET, options);

    return res.status(201).json({
      token,
      user: { id: data.id, email: data.email, name: data.name },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Login: POST /auth/login
 * body: { email, password }
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const { data, error } = await supabase
      .from("users")
      .select("id, email, password, name")
      .eq("email", String(email).toLowerCase())
      .limit(1)
      .single();

    if (error) {
      // not found or other db error
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = data as {
      id: string;
      email: string;
      password: string;
      name?: string;
    };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // ensure env vars
    let SECRET: jwt.Secret;
    let expiresIn: SignOptions["expiresIn"];
    try {
      ({ SECRET, expiresIn } = getJwtConfig());
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server configuration error" });
    }

    const options: SignOptions = { expiresIn };

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, options);
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
