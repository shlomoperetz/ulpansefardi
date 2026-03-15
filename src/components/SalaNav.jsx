import { useState, useEffect } from "react";
import { fonts } from "../theme";
import { getStudyQueue } from "../utils/mana";
import { getProgress } from "../utils/storage";
import { WORDS } from "../data/words";

const TABS = [
  { id: "pasos",    icon: "⚡", label: "Pasos" },
  { id: "mishnatot", icon: "✍️", label: "Frases" },
  { id: "dialogos", icon: "💬", label: "Diálogos" },
  { id: "patrones", icon: "🔍", label: "Patrones" },
];

function getNextAction(p) {
  const queue = getStudyQueue(p, WORDS);
  const sentencesOk = (p.sentencesCorrect || 0) >= 5;
  const dialogueOk = Object.values(p.dialogues || {}).some(d => d.passed);
  const maxUnlocked = Math.max(...(p.unlockedGroups || [1]));
  const hasNextGroup = maxUnlocked < 12;

  if (queue.length > 0) return "pasos";
  if (!sentencesOk && !dialogueOk) return "mishnatot";
  if (sentencesOk && !dialogueOk) return "dialogos";
  if (hasNextGroup && (sentencesOk || dialogueOk)) return "pasos";
  return null;
}

export default function SalaNav({ t, page, onNavigate, onBack }) {
  const [nextAction, setNextAction] = useState(null);

  useEffect(() => {
    const p = getProgress();
    setNextAction(getNextAction(p));
  }, [page]);

  const isDark = t.bg === "#060e18";
  const topbarBg = isDark ? "rgba(6,14,24,0.97)" : "rgba(240,247,255,0.97)";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 56,
      zIndex: 150,
      background: topbarBg,
      backdropFilter: "blur(10px)",
      borderTop: "1px solid " + t.border,
      display: "flex",
      alignItems: "stretch",
    }}>
      {/* Home button */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          borderRight: "1px solid " + t.border,
          cursor: "pointer",
          padding: "0 14px",
          color: t.muted,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-label="Inicio"
      >
        ←
      </button>

      {/* Sala tabs */}
      {TABS.map(tab => {
        const isActive = page === tab.id;
        const isNext = nextAction === tab.id && !isActive;

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              position: "relative",
              padding: "4px 0",
            }}
          >
            {/* Pulsing blue dot badge for next recommended */}
            {isNext && (
              <span style={{
                position: "absolute",
                top: 6,
                right: "calc(50% - 14px)",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#0099FF",
                boxShadow: "0 0 6px #0099FF",
                animation: "salaPulse 1.4s ease-in-out infinite",
              }} />
            )}

            <span style={{
              fontSize: 18,
              lineHeight: 1,
              opacity: isActive ? 1 : 0.65,
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: 10,
              fontFamily: fonts.ui,
              color: isActive ? t.gold : t.muted,
              fontWeight: isActive ? 700 : 400,
              lineHeight: 1,
            }}>
              {tab.label}
            </span>

            {/* Active underline */}
            {isActive && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: "20%",
                right: "20%",
                height: 2,
                borderRadius: 2,
                background: t.gold,
              }} />
            )}
          </button>
        );
      })}

      <style>{`
        @keyframes salaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
