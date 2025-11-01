import { useState } from "react";
import { useGithubRepos } from "../hooks/useGithubRepos";
import RepoList from "../components/RepoList";
import SearchForm from "../components/SearchForm";

export default function Home() {
  const [username, setUsername] = useState("");
  const { data, isLoading, isError, error } = useGithubRepos(username);
  return (
    <div>
      <SearchForm onSearch={setUsername} />
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div>Error: {(error as Error)?.message || "Could not load repos"}</div>
      )}
      {data && <RepoList repos={data} />}
    </div>
  );
}
