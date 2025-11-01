import { useState } from "react";

export default function SearchForm({
  onSearch,
}: {
  onSearch: (u: string) => void;
}) {
  const [val, setVal] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(val.trim());
      }}
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="github username"
      />
      <button type="submit">Search</button>
    </form>
  );
}
