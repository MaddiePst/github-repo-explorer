import { useFavorites } from "../hooks/useFavorites";
import type { Favorite } from "../types";

export default function Favorites() {
  const { favorites, isLoading, deleteFavorite } = useFavorites();
  if (isLoading) return <div>Loading favorites...</div>;
  if (!favorites || favorites.length === 0) return <div>No favorites yet</div>;

  return (
    <div>
      {" "}
      {favorites.map((f: Favorite) => (
        <div key={f.id} className="border p-2 mb-2">
          <a href={f.repo_html_url} target="_blank" rel="noreferrer">
            {" "}
            {f.repo_full_name}{" "}
          </a>
          <div>{f.repo_description}</div>
          <div>⭐ {f.repo_stars}</div>
          <button onClick={() => deleteFavorite(String(f.id))}>Delete</button>
        </div>
      ))}
    </div>
  );
}
