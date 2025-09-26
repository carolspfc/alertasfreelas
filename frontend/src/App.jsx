import React, { useState, useEffect } from "react";

export default function App() {
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState([]);

  async function fetchJobs() {
    const res = await fetch(`/api/jobs?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>AlertaFreelas — Vagas Recentes</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar (ex: geoprocessamento, tradutor)"
      />
      <button onClick={fetchJobs}>Buscar</button>
      <ul>
        {jobs.map((j) => (
          <li key={j.id} style={{ marginBottom: "10px" }}>
            <a href={j.url} target="_blank" rel="noreferrer">
              {j.title}
            </a>{" "}
            — {j.company} ({j.location})
          </li>
        ))}
      </ul>
    </div>
  );
}