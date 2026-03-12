import { useState } from "react";
import { dark, light, fonts } from "./theme";
import Landing from "./pages/Landing";
import Anki from "./components/Anki";
import Lilmod from "./components/Lilmod";
import Elemental from "./components/Elemental";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home");
  const [activeLote, setActiveLote] = useState(1);
  const t = isDark ? dark : light;

  function handleNavigate(dest, loteId) {
    if (loteId) setActiveLote(loteId);
    setPage(dest);
  }

  const topbarBg = isDark ? "rgba(10,10,10,0.96)" : "rgba(255,255,255,0.96)";

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
    height: 60,
    background: topbarBg,
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid " + t.border,
    display: "flex", alignItems: "center",
    padding: "0 max(20px, calc((100vw - 760px) / 2))",
    boxSizing: "border-box",
  };

  const tbarBtn = {
    appearance: "none", border: "none", background: "transparent",
    width: 44, height: 44,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontFamily: fonts.ui, fontSize: 15, fontWeight: 500,
    color: t.muted, borderRadius: 12, cursor: "pointer",
  };

  return (
    <div style={{ background: t.bg, minHeight: "100vh", paddingTop: 60 }}>
      <nav style={navStyle}>
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.15, padding: 0,
        }}>
          <span style={{ fontSize: 17, fontWeight: 650, color: t.text, fontFamily: fonts.serif }}>
            אולפן ספרדי
          </span>
          <span style={{ fontSize: 12, color: t.muted, fontFamily: fonts.ui }}>
            by Shlomo Peretz
          </span>
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 2, alignItems: "center" }}>
          {page !== "home" && (
            <button onClick={() => setPage("home")} style={tbarBtn}>←</button>
          )}
          <button onClick={() => setIsDark(d => !d)} style={tbarBtn}>
            {isDark ? "☀" : "☾"}
          </button>
        </div>
      </nav>
      {page === "home" && <Landing t={t} onNavigate={handleNavigate} />}
      {page === "anki" && <div style={{ paddingTop: 24 }}><Anki t={t} loteId={activeLote} onBack={() => setPage("home")} /></div>}
      {page === "lilmod" && <div style={{ paddingTop: 24 }}><Lilmod t={t} loteId={activeLote} onBack={() => setPage("home")} /></div>}
      {page === "elemental" && <div style={{ paddingTop: 0 }}><Elemental t={t} onBack={() => setPage("home")} /></div>}
    </div>
  );
}
