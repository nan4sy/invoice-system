import { useEffect, useState } from "react";

type Health = { status: string };

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as Health;
      })
      .then(setHealth)
      .catch((e: unknown) =>
        setErr(e instanceof Error ? e.message : String(e)),
      );
  }, []);

  return (
    <main style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1>Invoice System</h1>
      <p>
        API Health:{" "}
        {err ? <span>{err}</span> : health ? <b>{health.status}</b> : "loading..."}
      </p>
    </main>
  );
}
