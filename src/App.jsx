import { useState, useEffect } from "react";
import { dark, light, fonts } from "./theme";
import Home from "./pages/Home";
import Pasos from "./components/Pasos";
import Patrones from "./components/Patrones";
import Dialogos from "./components/Dialogos";
import Elemental from "./components/Elemental";
import Mishnatot from "./components/Mishnatot";
import SalaNav from "./components/SalaNav";
import { enableDemoMode, getProgress, markTodayDone } from "./utils/storage";
import { getActiveMana, getMasteredCount } from "./utils/mana";
import { WORDS } from "./data/words";
import { BLOQUES_ALEFATO } from "./data/alefato";

// Activar modo demo antes de cualquier lectura de storage
const isDemo = new URLSearchParams(window.location.search).get("demo") === "1";
if (isDemo) {
  enableDemoMode();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const demo = {
    words: {},
    unlockedGroups: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    dialogues: {},
    elementalDone: {},
    streak: 7,
    lastSession: yesterday,
    sentencesCorrect: 20,
    frasesComp: 10,
    frasesEsc: 10,
  };
  WORDS.forEach(w => {
    demo.words[w.id] = {
      mana: 85,
      lastReviewed: yesterday,
      masteredAt: yesterday,
      srsReps: 3,
      srsEf: 2.5,
      srsInterval: 6,
      srsNextReview: yesterday,
    };
  });
  BLOQUES_ALEFATO.forEach(b => { demo.elementalDone[b.id] = true; });
  localStorage.setItem("ulpan_8belts_demo", JSON.stringify(demo));
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home");
  const [mana, setMana] = useState(0);
  const [mastered, setMastered] = useState(0);
  const t = isDark ? dark : light;

  function refreshMana() {
    const p = getProgress();
    setMana(getActiveMana(p, WORDS));
    setMastered(getMasteredCount(p));
  }

  useEffect(() => { refreshMana(); }, [page]);

  function goHome() {
    setPage("home");
    refreshMana();
  }

  const topbarBg = isDark ? "rgba(6,14,24,0.97)" : "rgba(240,247,255,0.97)";

  return (
    <div style={{ background: t.bg, minHeight: "100vh", paddingTop: 60 }}>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 60, background: topbarBg, backdropFilter: "blur(10px)",
        borderBottom: "1px solid " + t.border,
        display: "flex", alignItems: "center",
        padding: "0 max(16px, calc((100vw - 760px) / 2))",
        gap: 12,
      }}>
        <button
          onClick={goHome}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 2,
            lineHeight: 1.15, padding: 0, flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 650, color: t.text, fontFamily: fonts.serif }}>
            אולפן ספרדי
          </span>
          <span style={{ fontSize: 11, color: t.muted, fontFamily: fonts.ui }}>
            by Shlomo Peretz
          </span>
        </button>

        {/* Mana bar — center */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 11, color: t.gold, fontFamily: fonts.ui, flexShrink: 0 }}>
            ⚡ {mana}%
          </span>
          <div style={{
            flex: 1, height: 5, background: t.surface, borderRadius: 3,
            overflow: "hidden", maxWidth: 200,
          }}>
            <div style={{
              height: "100%",
              width: mana + "%",
              background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")",
              borderRadius: 3,
              transition: "width 0.5s",
            }} />
          </div>
          <span style={{ fontSize: 11, color: t.subtle, fontFamily: fonts.ui, flexShrink: 0 }}>
            {mastered} palabras
          </span>
        </div>

        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {isDemo && (
            <span style={{
              fontSize: 10, fontFamily: fonts.ui, letterSpacing: 1,
              textTransform: "uppercase", color: "#f59e0b",
              border: "1px solid #f59e0b55", borderRadius: 20, padding: "2px 8px",
            }}>
              demo
            </span>
          )}
          {page !== "home" && (
            <button
              onClick={goHome}
              style={{
                appearance: "none", border: "none", background: "transparent",
                width: 44, height: 44, display: "inline-flex",
                alignItems: "center", justifyContent: "center",
                color: t.muted, borderRadius: 12, cursor: "pointer", fontSize: 16,
              }}
            >
              ←
            </button>
          )}
          <button
            onClick={() => setIsDark(d => !d)}
            style={{
              appearance: "none", border: "none", background: "transparent",
              width: 44, height: 44, display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              color: t.muted, borderRadius: 12, cursor: "pointer", fontSize: 16,
            }}
          >
            {isDark ? "☀" : "☾"}
          </button>
        </div>
      </nav>

      {/* Page content — add bottom padding when SalaNav is visible */}
      <div style={{
        paddingTop: 16,
        paddingBottom: (page !== "home" && page !== "elemental") ? 70 : 0,
      }}>
        {page === "home"      && <Home t={t} onNavigate={setPage} mastered={mastered} mana={mana} />}
        {page === "pasos"     && <Pasos t={t} onBack={goHome} onManaChange={refreshMana} onNavigate={setPage} />}
        {page === "patrones"  && <Patrones t={t} onBack={goHome} onNavigate={setPage} />}
        {page === "dialogos"  && <Dialogos t={t} onBack={goHome} onNavigate={setPage} />}
        {page === "elemental" && <Elemental t={t} onBack={goHome} />}
        {page === "mishnatot" && <Mishnatot t={t} onBack={goHome} onNavigate={setPage} />}
      </div>

      {/* Bottom navigation — shown in all salas except home and elemental */}
      {page !== "home" && page !== "elemental" && (
        <SalaNav
          t={t}
          page={page}
          onNavigate={setPage}
          onBack={goHome}
        />
      )}
    </div>
  );
}
