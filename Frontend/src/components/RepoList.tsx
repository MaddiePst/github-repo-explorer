// src/components/RepoList.tsx
// import React from "react";
import type { GithubRepo } from "../types";
import RepoCard from "./RepoCard";

interface RepoListProps {
  repos?: GithubRepo[];
}

export default function RepoList({ repos }: RepoListProps) {
  if (!repos) {
    return (
      <div className="p-4 text-gray-600">
        Search for a user to see repositories.
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No repositories found for this user.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
