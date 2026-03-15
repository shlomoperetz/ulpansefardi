import { useState } from "react";
import { fonts } from "../theme";
import { WORDS, BINYAN_COLORS } from "../data/words";
import { getProgress } from "../utils/storage";
import { getCardMana } from "../utils/mana";

const CATEGORIES = [
  { id: "all",        label: "Todos" },
  { id: "verb",       label: "Verbos" },
  { id: "noun",       label: "Sustantivos" },
  { id: "pronoun",    label: "Pronombres" },
  { id: "connector",  label: "Conectores" },
  { id: "question",   label: "Preguntas" },
  { id: "expression", label: "Expresiones" },
  { id: "other",      label: "Otros" },
];

const OTHER_TYPES = ["adverb", "preposition", "existential", "adjective"];

function matchesCategory(word, cat) {
  if (cat === "all") return true;
  if (cat === "other") return OTHER_TYPES.includes(word.type);
  return word.type === cat;
}

function ManaBar({ t, mana }) {
  const color = mana >= 70 ? t.correct : mana >= 40 ? t.gold : t.wrong;
  return (
    <div style={{ height: 3, background: t.surface, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: mana + "%", borderRadius: 2,
        background: color, transition: "width 0.4s",
      }} />
    </div>
  );
}

export default function Patrones({ t, onBack }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const progress = getProgress();
  const unlocked = progress.unlockedGroups || [1];

  const filtered = WORDS.filter(w => {
    if (!matchesCategory(w, category)) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      w.he.includes(search.trim()) ||
      w.tr.toLowerCase().includes(q) ||
      w.es.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{
      maxWidth: 700, margin: "0 auto", padding: "0 16px 80px",
      fontFamily: fonts.ui, color: t.text,
    }}>
      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por hebreo, español o transliteración..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: t.card, border: "1px solid " + t.border,
            borderRadius: 10, padding: "12px 16px",
            color: t.text, fontSize: 14, fontFamily: fonts.ui,
            outline: "none",
          }}
        />
      </div>

      {/* Category tabs */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20,
      }}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            style={{
              background: category === c.id ? t.gold : t.card,
              border: "1px solid " + (category === c.id ? t.gold : t.border),
              borderRadius: 20, padding: "6px 14px",
              color: category === c.id ? t.bg : t.muted,
              fontSize: 12, cursor: "pointer", fontFamily: fonts.ui,
              transition: "all 0.15s",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 14 }}>
        {filtered.length} palabras · {unlocked.length} grupos desbloqueados
      </div>

      {/* Word grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 10,
      }}>
        {filtered.map(w => {
          const isUnlocked = unlocked.includes(w.group);
          const wordData = (progress.words || {})[w.id] || {};
          const mana = isUnlocked ? getCardMana(wordData) : 0;
          const mastered = wordData.masteredAt ? true : false;

          return (
            <div
              key={w.id}
              style={{
                background: t.card,
                border: "1px solid " + (mastered ? t.gold + "66" : t.border),
                borderRadius: 12,
                padding: "14px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                opacity: isUnlocked ? 1 : 0.3,
                filter: isUnlocked ? "none" : "blur(1px)",
                transition: "opacity 0.2s",
              }}
            >
              {/* Type indicator */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {w.type === "verb" && w.binyan ? (
                  <span style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 20,
                    background: (BINYAN_COLORS[w.binyan] || "#666") + "22",
                    color: BINYAN_COLORS[w.binyan] || "#666",
                    border: "1px solid " + (BINYAN_COLORS[w.binyan] || "#666") + "44",
                    fontFamily: fonts.serif, direction: "rtl",
                  }}>
                    {w.binyan}
                  </span>
                ) : (
                  <span style={{ fontSize: 9, color: t.subtle }}>{w.type}</span>
                )}
                {mastered && <span style={{ fontSize: 10, color: t.gold }}>✦</span>}
              </div>

              {/* Hebrew */}
              <div style={{
                fontSize: 28, fontWeight: "bold",
                fontFamily: fonts.serif, direction: "rtl",
                color: t.text, lineHeight: 1.2,
              }}>
                {isUnlocked ? w.he : "???"}
              </div>

              {/* Spanish */}
              <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.4 }}>
                {isUnlocked ? w.es : "—"}
              </div>

              {/* Verb root */}
              {w.type === "verb" && w.root && isUnlocked && (
                <div style={{ fontSize: 11, color: t.gold, fontFamily: fonts.serif, direction: "rtl" }}>
                  {w.root}
                </div>
              )}

              {/* Transliteration */}
              {isUnlocked && (
                <div style={{ fontSize: 10, color: t.subtle }}>
                  [{w.tr}]
                </div>
              )}

              {/* Group badge */}
              <div style={{ fontSize: 9, color: t.subtle }}>
                Grupo {w.group}
              </div>

              {/* Mana bar */}
              {isUnlocked && <ManaBar t={t} mana={mana} />}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: t.muted, paddingTop: 40, fontSize: 14 }}>
          No hay palabras que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
