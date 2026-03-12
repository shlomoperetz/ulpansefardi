import { fonts } from "../theme";

export default function Landing({ t, onNavigate }) {
  const tools = [
    { id: "anki", he: "חֲזָרָה", tr: "jazara", title: "Tarjetas de repaso", desc: "62 cartas de verbos y adjetivos. Sistema Anki en ambas direcciones.", ready: true },
    { id: "gramatica", he: "דִּקְדּוּק", tr: "dikduk", title: "Gramatica", desc: "Binyanim, conjugaciones, smijut. Proximamente.", ready: false },
    { id: "frases", he: "מִשְׁפָּטִים", tr: "mishpatim", title: "Frases de rutina", desc: "Frases del dia a dia. Proximamente.", ready: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: fonts.serif, color: t.text }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: t.gold, border: "1px solid " + t.gold + "44", borderRadius: 20, padding: "4px 16px", marginBottom: 24 }}>
          recursos de hebreo en espanol
        </div>
        <h1 style={{ fontSize: 56, fontWeight: "bold", color: t.gold, margin: 0, direction: "rtl" }}>אולפן ספרדי</h1>
        <p style={{ fontSize: 28, color: t.text, margin: "8px 0 0", fontWeight: "normal" }}>ulpan sefardi</p>
        <p style={{ fontSize: 15, color: t.muted, marginTop: 16, lineHeight: 1.7, maxWidth: 440, margin: "16px auto 0" }}>
          Estudia hebreo con materiales disenados para hispanohablantes. Pronunciacion sefardi, vocabulario real.
        </p>
        <div style={{ width: 40, height: 1, background: t.gold, margin: "40px auto" }} />
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tools.map(tool => (
          <div key={tool.id} onClick={() => tool.ready && onNavigate(tool.id)}
            style={{ background: t.card, border: "1px solid " + t.border, borderRadius: 14, padding: "24px 28px", cursor: tool.ready ? "pointer" : "default", opacity: tool.ready ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
            onMouseEnter={e => { if (tool.ready) e.currentTarget.style.borderColor = t.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}
          >
            <div>
              <div style={{ fontSize: 22, color: t.gold }}>{tool.he} <span style={{ fontSize: 11, color: t.muted }}>{tool.tr}</span></div>
              <div style={{ fontSize: 16, color: t.text, fontWeight: "bold", marginTop: 4 }}>{tool.title}</div>
              <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>{tool.desc}</div>
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
