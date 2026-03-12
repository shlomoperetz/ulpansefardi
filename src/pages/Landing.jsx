import { fonts } from "../theme";
import { getProgress } from "../utils/storage";
import { ALL_CARDS } from "../data/cards";

export default function Landing({ t, onNavigate }) {
  const progress = getProgress();
  const mastered = Object.values(progress.cards).filter(c => c.mastered).length;
  const pct = Math.round((mastered / ALL_CARDS.length) * 100);
  const today = new Date().toISOString().split("T")[0];
  const practicedToday = progress.lastSession === today;

  const tools = [
    { id: "anki", he: "חֲזָרָה", tr: "jazara", title: "Tarjetas de repaso", desc: "Verbos y adjetivos. Hebreo a espanol y espanol a hebreo.", ready: true },
    { id: "gramatica", he: "דִּקְדּוּק", tr: "dikduk", title: "Gramatica", desc: "Binyanim, conjugaciones, smijut. Proximamente.", ready: false },
    { id: "frases", he: "מִשְׁפָּטִים", tr: "mishpatim", title: "Frases de rutina", desc: "Frases del dia a dia. Proximamente.", ready: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: fonts.serif, color: t.text }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: "bold", color: t.gold, margin: 0, direction: "rtl" }}>אולפן ספרדי</h1>
        <p style={{ fontSize: 18, color: t.muted, marginTop: 8 }}>ulpan sefardi</p>

        <div style={{ marginTop: 40, background: t.card, border: "1px solid " + t.border, borderRadius: 16, padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: t.muted }}>Progreso total</span>
            <span style={{ fontSize: 13, color: t.gold }}>{mastered}/{ALL_CARDS.length} palabras</span>
          </div>
          <div style={{ width: "100%", height: 6, background: t.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: t.text }}>{mastered}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>dominadas</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: t.text }}>{ALL_CARDS.length - mastered}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>pendientes</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: practicedToday ? t.correct : t.text }}>
                {progress.streak || 0}
              </div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>dias seguidos</div>
            </div>
          </div>
          {practicedToday && (
            <div style={{ marginTop: 16, fontSize: 12, color: t.correct, textAlign: "center", letterSpacing: 0.5 }}>
              ✓ has practicado hoy
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 12 }}>
        {tools.map(tool => (
          <div key={tool.id} onClick={() => tool.ready && onNavigate(tool.id)}
            style={{ background: t.card, border: "1px solid " + t.border, borderRadius: 14, padding: "20px 24px", cursor: tool.ready ? "pointer" : "default", opacity: tool.ready ? 1 : 0.45, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
            onMouseEnter={e => { if (tool.ready) e.currentTarget.style.borderColor = t.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}
          >
            <div>
              <div style={{ fontSize: 20, color: t.gold }}>{tool.he} <span style={{ fontSize: 11, color: t.muted }}>{tool.tr}</span></div>
              <div style={{ fontSize: 15, color: t.text, fontWeight: "bold", marginTop: 4 }}>{tool.title}</div>
              <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{tool.desc}</div>
            </div>
            {tool.ready && <div style={{ fontSize: 20, color: t.gold }}>→</div>}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: 24, fontSize: 12, color: t.subtle, borderTop: "1px solid " + t.border }}>
        ulpansefardi.com · ecosistema <a href="https://siddursefardi.com" style={{ color: t.gold, textDecoration: "none" }}>siddursefardi</a>
      </div>
    </div>
  );
}
