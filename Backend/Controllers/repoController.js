import { v4 as uuidv4 } from "uuid";
import { supabase } from "../Connections/supabaseClient.js";
// import { readJSON, writeJSON } from "./reusableFunc.js";
// import data from "../Data/myJobs.json" with {type: 'json'};

/// Read data
const rawData = await readJSON("favorites.json"); // returns { favorite: [...] }
const favorites = rawData.favorites || [];
// console.log(favorites);

// Save a repository
export const saveARepo = async (req, res) => {
  try {
    // ensure auth middleware ran and attached req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, starCount, repoLink, language } =
      req.body || {};

    if (!title || !repoLink) {
      return res
        .status(400)
        .json({ message: "title and repository link are required" });
    }

    // Read the current file. NOTE: favorites.json is expected to be: { "favorites": [ ... ] }
    const data = await readJSON("favorites.json");
    // normalize to ensure we have an array
    const favorites = Array.isArray(data?.favorites) ? data.favorites : [];

    const favorite = {
      id: uuidv4(),
      userId: String(req.user.id),
      title,
      description,
      starCount,
      repoLink,
      language,
    };

    favorites.push(favorite);

    // write back preserving the { favorite: [...] } shape
    await writeJSON("favorites.json", { favorites });

    return res.status(201).json(favorite);
  } catch (err) {
    console.error("addNewJob error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//**********Read (GET) fav repo**********
// Get all fav repo
export const getFavRepo = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", 1);
    return data;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// **********Delete fav repo*******
export const deleteRepo = async (req, res) => {
  try {
    const repoId = req.params.id;
    // Checking if id exists
    if (!repoId)
      return res.status(400).json({ message: "Missing id in params" });

    // Find the job id if it exists
    const idx = favorites.findIndex((j) => String(j.id) === String(repoId));
    if (idx === -1)
      return res.status(404).json({ message: "Repository not found" });

    favorites.splice(idx, 1);
    await writeJSON("favorites.json", { favorites });

    return res.json({ message: "Repository deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
