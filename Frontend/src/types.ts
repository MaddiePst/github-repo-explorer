export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  repo_id: number | string;
  repo_name?: string | null;
  repo_full_name?: string | null;
  repo_html_url?: string;
  repo_description?: string | null;
  repo_stars?: number | null;
  repo_language?: string | null;
  created_at?: string | null;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
}
