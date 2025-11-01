import { useQuery } from "@tanstack/react-query";
import type { GithubRepo } from "../types";

export function useGithubRepos(username: string) {
  return useQuery<GithubRepo[]>({
    queryKey: ["repos", username],
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/users/${username}/repos`);
      return res.json() as Promise<GithubRepo[]>;
    },
    enabled: !!username,
  });
}
