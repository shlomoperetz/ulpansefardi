import { useState } from "react";
import { dark, light, fonts } from "./theme";
import Landing from "./pages/Landing";
import Anki from "./components/Anki";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState("home");
  const t = isDark ? dark : light;

  const navStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 100,
    background: t.bg + "ee",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid " + t.border,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    fontFamily: fonts.serif,
  };

  return (
    <div style={{ background: t.bg, minHeight: "100vh", paddingTop: 52 }}>
      <nav style={navStyle}>
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", color: t.gold,
          fontSize: 16, fontFamily: fonts.serif, cursor: "pointer",
          fontWeight: "bold", letterSpacing: 1,
        }}>
          אולפן ספרדי
        </button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {page !== "home" && (
            <button onClick={() => setPage("home")} style={{
              background: "none", border: "none", color: t.muted,
              fontSize: 12, fontFamily: fonts.serif, cursor: "pointer",
            }}>
              ← inicio
            </button>
          )}
          <button onClick={() => setIsDark(d => !d)} style={{
            background: "none", border: "1px solid " + t.border,
            borderRadius: 20, padding: "3px 12px", fontSize: 11,
            cursor: "pointer", color: t.muted, fontFamily: fonts.serif,
          }}>
            {isDark ? "☀ claro" : "☾ oscuro"}
          </button>
        </div>
      </nav>
      {page === "home" && <Landing t={t} onNavigate={setPage} />}
      {page === "anki" && <div style={{ paddingTop: 24 }}><Anki t={t} /></div>}
    </div>
  );
}
