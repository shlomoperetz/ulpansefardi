import { useState, useEffect } from "react";
import { dark, light, fonts } from "./theme";
import Landing from "./pages/Landing";
import Anki from "./components/Anki";
import Lilmod from "./components/Lilmod";
import Elemental from "./components/Elemental";
import { enableDemoMode } from "./utils/storage";
import { LOTES, ALL_CARDS } from "./data/cards";
import { BLOQUES_ALEFATO } from "./data/alefato";

// Activar modo demo antes de cualquier lectura de storage
const isDemo = new URLSearchParams(window.location.search).get("demo") === "1";
if (isDemo) {
  enableDemoMode();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const demo = {
    cards:        {},
    loteDone:     {},
    elementalDone:{},
    streak:       7,
    lastSession:  yesterday,
    currentLote:  1,
  };
  ALL_CARDS.forEach(c => {
    demo.cards[c.he] = { correct: 3, mastered: true, srsReps: 3, srsEf: 2.5, srsInterval: 6, srsNextReview: yesterday };
  });
  LOTES.forEach(l => { demo.loteDone[l.id] = true; });
  BLOQUES_ALEFATO.forEach(b => { demo.elementalDone[b.id] = true; });
  localStorage.setItem("ulpan_progress_demo", JSON.stringify(demo));
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home");
  const [activeLote, setActiveLote] = useState(1);
  const t = isDark ? dark : light;

  function handleNavigate(dest, loteId) {
    if (loteId) setActiveLote(loteId);
    setPage(dest);
  }

  const topbarBg = isDark ? "rgba(6,14,24,0.97)" : "rgba(240,247,255,0.97)";

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
          {isDemo && (
            <span style={{
              fontSize: 10, fontFamily: fonts.ui, letterSpacing: 1, textTransform: "uppercase",
              color: "#f59e0b", border: "1px solid #f59e0b55", borderRadius: 20,
              padding: "2px 10px", marginRight: 4,
            }}>demo</span>
          )}
          {page !== "home" && (
            <button onClick={() => setPage("home")} style={tbarBtn}>←</button>
          )}
          <button onClick={() => setIsDark(d => !d)} style={tbarBtn}>
            {isDark ? "☀" : "☾"}
          </button>
        </div>
      </nav>
      {page === "home" && <Landing t={t} onNavigate={handleNavigate} />}
      {page === "anki" && <div style={{ paddingTop: 24 }}><Anki t={t} loteId={activeLote} onBack={(nextId) => { if (nextId) { setActiveLote(nextId); } else { setPage("home"); } }} /></div>}
      {page === "lilmod" && <div style={{ paddingTop: 24 }}><Lilmod t={t} loteId={activeLote} onBack={() => setPage("home")} /></div>}
      {page === "elemental" && <div style={{ paddingTop: 0 }}><Elemental t={t} onBack={() => setPage("home")} /></div>}
    </div>
  );
}
