"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar quarto por tipo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => onSearch(query)}>Buscar</button>
    </div>
  );
}
