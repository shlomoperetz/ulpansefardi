import { fonts } from "../theme";
import { MILESTONES, getCurrentMilestone, getNextMilestone } from "../data/milestones";
import { getProgress } from "../utils/storage";
import { getMasteredCount, getActiveMana, getStudyQueue } from "../utils/mana";
import { WORDS } from "../data/words";
import { DIALOGUES } from "../data/dialogues";
import { SENTENCES } from "../data/sentences";

const SALAS = [
  {
    id: "peldanos",
    icon: "⚡",
    label: "Peldaños",
    labelHe: "מַדְרֵגוֹת",
    desc: "Aprende y repasa palabras con el sistema de maná.",
  },
  {
    id: "mishnatot",
    icon: "✍️",
    label: "Frases",
    labelHe: "מִשְׁנָתוֹת",
    desc: "Traduce frases con las palabras que has aprendido.",
  },
  {
    id: "dialogos",
    icon: "💬",
    label: "Diálogos",
    labelHe: "דִּיאָלוֹגִים",
    desc: "Escucha y comprende conversaciones reales.",
  },
  {
    id: "patrones",
    icon: "🔍",
    label: "Sala de Patrones",
    labelHe: "דְּפוּסִים",
    desc: "Explora todo el vocabulario organizado por tipo.",
  },
];

export default function Home({ t, onNavigate, mastered, mana }) {
  const p = getProgress();
  const unlocked = p.unlockedGroups || [1];
  const totalUnlockedWords = WORDS.filter(w => unlocked.includes(w.group)).length;
  const currentMilestone = getCurrentMilestone(mastered);
  const nextMilestone = getNextMilestone(mastered);

  // Dialogue stats
  const groupsUnlocked = unlocked.length;
  const unlockedDialogues = DIALOGUES.filter(d => groupsUnlocked >= d.unlocksAtGroup).length;
  const completedDialogues = Object.values(p.dialogues || {}).filter(d => d.phase >= 3 && d.passed).length;

  // Group stats
  const totalGroups = 12;

  // Next step
  const studyQueue = getStudyQueue(p, WORDS);
  const maxUnlocked = Math.max(...unlocked);
  const canUnlockNext = maxUnlocked < totalGroups;
  const nextGroupNum = maxUnlocked + 1;
  const hasUntriedDialogue = DIALOGUES.some(
    d => groupsUnlocked >= d.unlocksAtGroup && !p.dialogues?.[d.id]
  );
  let nextStep;
  if (studyQueue.length > 0) {
    nextStep = { sala: "peldanos", msg: studyQueue.length + " palabras esperan repaso", icon: "⚡" };
  } else if (canUnlockNext) {
    nextStep = { sala: "peldanos", msg: "Empieza el grupo " + nextGroupNum + " — 5 palabras nuevas", icon: "🔓" };
  } else if (hasUntriedDialogue) {
    nextStep = { sala: "dialogos", msg: "Hay un diálogo nuevo disponible", icon: "💬" };
  } else {
    nextStep = null;
  }

  return (
    <div style={{
      maxWidth: 700,
      margin: "0 auto",
      padding: "0 16px 80px",
      fontFamily: fonts.ui,
    }}>
      {/* ── Siguiente paso ──────────────────────────────────────────────────── */}
      {nextStep ? (
        <button
          onClick={() => onNavigate(nextStep.sala)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 14,
            background: t.gold + "18",
            border: "1px solid " + t.gold + "55",
            borderRadius: 14, padding: "16px 20px",
            cursor: "pointer", textAlign: "left", marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 22 }}>{nextStep.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: t.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
              Siguiente paso
            </div>
            <div style={{ fontSize: 14, color: t.text, fontFamily: fonts.ui }}>
              {nextStep.msg}
            </div>
          </div>
          <span style={{ fontSize: 18, color: t.gold }}>→</span>
        </button>
      ) : (
        <div style={{
          background: t.surface, border: "1px solid " + t.border,
          borderRadius: 14, padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>✦</span>
          <div>
            <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>¡Todo al día!</div>
            <div style={{ fontSize: 12, color: t.muted }}>Vuelve mañana para repasar.</div>
          </div>
        </div>
      )}

      {/* ── Desert Map ──────────────────────────────────────────────────────── */}
      <div style={{
        background: t.card,
        border: "1px solid " + t.border,
        borderRadius: 16,
        padding: "20px 20px 16px",
        marginBottom: 24,
        overflowX: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase" }}>
            Desierto del Sinaí
          </span>
          {nextMilestone ? (
            <span style={{ fontSize: 11, color: t.gold }}>
              Próximo: {nextMilestone.sub} ({nextMilestone.words} palabras)
            </span>
          ) : (
            <span style={{ fontSize: 11, color: t.gold }}>¡Destino alcanzado!</span>
          )}
        </div>

        {/* Progress line with milestones */}
        <div style={{ position: "relative", height: 48, minWidth: 500 }}>
          {/* Track line */}
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0,
            height: 2, background: t.surface, transform: "translateY(-50%)",
            borderRadius: 1,
          }} />
          {/* Filled line */}
          {nextMilestone && (
            <div style={{
              position: "absolute", top: "50%", left: 0,
              height: 2,
              width: Math.min(100, (mastered / nextMilestone.words) * 100) + "%",
              background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")",
              transform: "translateY(-50%)",
              borderRadius: 1,
              transition: "width 0.6s",
            }} />
          )}
          {/* Milestones */}
          {MILESTONES.map((m, i) => {
            const maxWords = MILESTONES[MILESTONES.length - 1].words;
            const pct = (m.words / maxWords) * 100;
            const reached = mastered >= m.words;
            return (
              <div
                key={m.id}
                title={m.sub + " (" + m.words + " palabras)"}
                style={{
                  position: "absolute",
                  left: pct + "%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  cursor: "default",
                }}
              >
                <div style={{
                  width: reached ? 12 : 8,
                  height: reached ? 12 : 8,
                  borderRadius: "50%",
                  background: reached ? t.gold : t.surface,
                  border: "2px solid " + (reached ? t.gold : t.subtle),
                  transition: "all 0.3s",
                  boxShadow: reached ? "0 0 6px " + t.gold + "88" : "none",
                  flexShrink: 0,
                }} />
              </div>
            );
          })}
        </div>

        {/* Current milestone label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <span style={{ fontSize: 18 }}>{currentMilestone.icon}</span>
          <div>
            <div style={{ fontSize: 13, color: t.text, fontFamily: fonts.serif, direction: "rtl" }}>
              {currentMilestone.label}
            </div>
            <div style={{ fontSize: 11, color: t.muted }}>{currentMilestone.sub}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: "bold", color: t.gold, lineHeight: 1 }}>{mastered}</div>
            <div style={{ fontSize: 10, color: t.muted }}>palabras</div>
          </div>
        </div>
      </div>

      {/* ── Active Mana Bar ──────────────────────────────────────────────────── */}
      <div style={{
        background: t.card,
        border: "1px solid " + t.border,
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <span style={{ fontSize: 20 }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: t.muted }}>Maná activo</span>
            <span style={{ fontSize: 12, color: t.gold, fontWeight: "bold" }}>{mana}%</span>
          </div>
          <div style={{ height: 6, background: t.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: mana + "%",
              background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")",
              borderRadius: 3,
              transition: "width 0.5s",
            }} />
          </div>
          {mana < 65 && (
            <div style={{ fontSize: 11, color: t.muted, marginTop: 5 }}>
              Estudia hasta llegar a 65% para desbloquear el siguiente grupo
            </div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: t.text, fontWeight: "bold" }}>
            {groupsUnlocked}/{totalGroups}
          </div>
          <div style={{ fontSize: 10, color: t.muted }}>grupos</div>
        </div>
      </div>

      {/* ── Sala Cards ──────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 14,
      }}>
        {SALAS.map(sala => {
          let stat = null;
          if (sala.id === "peldanos") {
            stat = mastered + " / " + totalUnlockedWords + " dominadas";
          } else if (sala.id === "dialogos") {
            stat = completedDialogues + " / " + DIALOGUES.length + " completados";
          } else if (sala.id === "patrones") {
            stat = WORDS.filter(w => unlocked.includes(w.group)).length + " palabras desbloqueadas";
          } else if (sala.id === "mishnatot") {
            stat = SENTENCES.filter(s => groupsUnlocked >= s.unlocksAtGroup).length + " frases disponibles";
          }

          return (
            <button
              key={sala.id}
              onClick={() => onNavigate(sala.id)}
              style={{
                background: t.card,
                border: "1px solid " + t.border,
                borderRadius: 14,
                padding: "20px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s, box-shadow 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = t.gold;
                e.currentTarget.style.boxShadow = "0 4px 20px " + t.gold + "22";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{sala.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: "bold", color: t.text }}>{sala.label}</div>
                  <div style={{ fontSize: 12, color: t.muted, fontFamily: fonts.serif, direction: "rtl" }}>
                    {sala.labelHe}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.5 }}>{sala.desc}</div>
              {stat && (
                <div style={{
                  fontSize: 11,
                  color: t.gold,
                  paddingTop: 4,
                  borderTop: "1px solid " + t.border,
                  marginTop: 2,
                }}>
                  {stat}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Elemental — sección accesoria ───────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: t.border }} />
          <span style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase" }}>
            Herramientas
          </span>
          <div style={{ flex: 1, height: 1, background: t.border }} />
        </div>
        <button
          onClick={() => onNavigate("elemental")}
          style={{
            width: "100%",
            background: "none",
            border: "1px solid " + t.border,
            borderRadius: 12,
            padding: "14px 18px",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.muted; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}
        >
          <span style={{ fontSize: 20 }}>🔤</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: t.muted, fontWeight: 600 }}>Elemental</div>
            <div style={{ fontSize: 12, color: t.subtle, marginTop: 2 }}>
              Alefato y vocales — consulta cuando lo necesites
            </div>
          </div>
          {(() => {
            const eDone = Object.values(p.elementalDone || {}).filter(Boolean).length;
            return (
              <span style={{ fontSize: 11, color: t.subtle }}>{eDone}/6</span>
            );
          })()}
        </button>
      </div>

      {/* ── Streak ──────────────────────────────────────────────────────────── */}
      {p.streak > 0 && (
        <div style={{
          textAlign: "center",
          marginTop: 24,
          color: t.muted,
          fontSize: 12,
        }}>
          🔥 Racha de {p.streak} {p.streak === 1 ? "día" : "días"}
        </div>
      )}
    </div>
  );
}
