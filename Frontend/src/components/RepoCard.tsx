import React from "react";
import type { GithubRepo } from "../types";

interface RepoCardProps {
  repo: GithubRepo;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {repo.full_name}
        </a>
      </h3>
      <p className="text-gray-700 mb-2">
        {repo.language || "Unknown language"}
      </p>
      <p className="text-gray-600 mb-2">⭐ {repo.stargazers_count}</p>
      {repo.description && (
        <p className="text-gray-500 text-sm">{repo.description}</p>
      )}
    </div>
  );
};

export default RepoCard;
