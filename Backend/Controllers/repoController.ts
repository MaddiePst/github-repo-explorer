// Controllers/userController.ts
import { Response } from "express";
import { supabase } from "../Connections/supabaseClient";
import { AuthRequest } from "../Middleware/authMiddleware";

/**
 * GET /user/favorites
 */
export async function getFavorites(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "DB error" });
    }
    return res.json(data);
  } catch (err) {
    console.error("getFavorites error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /user/favorites
 * body: { repo_id, repo_name, repo_full_name, repo_html_url, repo_description, repo_stars, repo_language }
 */
export async function addFavorite(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.id;
    const payload = req.body || {};
    const repo_id = payload.repo_id;
    if (!repo_id)
      return res.status(400).json({ message: "repo_id is required" });

    // Insert or ignore duplicate unique constraint
    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: userId,
          repo_id: repo_id,
          repo_name: payload.repo_name || null,
          repo_full_name: payload.repo_full_name || null,
          repo_html_url: payload.repo_html_url || null,
          repo_description: payload.repo_description || null,
          repo_stars: payload.repo_stars || null,
          repo_language: payload.repo_language || null,
        },
      ])
      .select("*")
      .single();

    if (error) {
      // if unique violation you'd get an error; return message
      console.error(error);
      if ((error as any)?.code === "23505") {
        return res.status(409).json({ message: "Already saved" });
      }
      return res.status(500).json({ message: "Insert failed" });
    }
    return res.status(201).json(data);
  } catch (err) {
    console.error("addFavorite error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /user/favorites/:id
 */
export async function deleteFavorite(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing id" });

    // ensure the favorite belongs to the user
    const { data: existing, error: selErr } = await supabase
      .from("favorites")
      .select("id, user_id")
      .eq("id", id)
      .limit(1)
      .single();

    if (selErr || !existing) {
      return res.status(404).json({ message: "Not found" });
    }
    if (existing.user_id !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Delete failed" });
    }
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteFavorite error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
