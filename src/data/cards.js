// ─── Binyan ───────────────────────────────────────────────────────────────────
export const BINYAN_COLORS = {
  "פָּעַל":     "#3b82f6",
  "פִּיעֵל":    "#8b5cf6",
  "הִפְעִיל":   "#f59e0b",
  "הִתְפַּעֵל": "#10b981",
  "נִפְעַל":    "#f43f5e",
};

const PA = "פָּעַל";
const PI = "פִּיעֵל";
const HI = "הִפְעִיל";
const HT = "הִתְפַּעֵל";
const NI = "נִפְעַל";

// ─── Núcleo ───────────────────────────────────────────────────────────────────
export const PRONOUNS = [
  { he: "אֲנִי",     tr: "ani",    es: "yo" },
  { he: "אַתָּה",    tr: "ata",    es: "tú (m)" },
  { he: "אַתְּ",     tr: "at",     es: "tú (f)" },
  { he: "הוּא",      tr: "hu",     es: "él" },
  { he: "הִיא",      tr: "hi",     es: "ella" },
  { he: "אֲנַחְנוּ", tr: "anajnu", es: "nosotros" },
];

export const DEMONSTRATIVES = [
  { he: "פֹּה",  tr: "po",   es: "aquí" },
  { he: "שָׁם",  tr: "sham", es: "allí" },
  { he: "זֶה",   tr: "ze",   es: "esto (m)" },
  { he: "זֹאת",  tr: "zot",  es: "esto (f)" },
  { he: "כֵּן",  tr: "ken",  es: "sí" },
  { he: "לֹא",   tr: "lo",   es: "no" },
];

export const CORE_VERBS = [
  { he: "לִהְיוֹת",  tr: "lihiot",   es: "ser / estar", binyan: PA },
  { he: "לִרְצוֹת",  tr: "lirtzot",  es: "querer",      binyan: PA },
  { he: "לֶאֱהוֹב",  tr: "leehov",   es: "amar",        binyan: PA },
  { he: "לָדַעַת",   tr: "ladaat",   es: "saber",       binyan: PA },
  { he: "לָלֶכֶת",   tr: "lalechet", es: "ir",          binyan: PA },
];

export const NOUNS = [
  { he: "יוֹם",      tr: "yom",     es: "día" },
  { he: "מַיִם",     tr: "maim",    es: "agua" },
  { he: "אֹכֶל",     tr: "ojel",    es: "comida" },
  { he: "בַּיִת",    tr: "bayt",    es: "casa" },
  { he: "אֲנָשִׁים", tr: "anashim", es: "personas" },
  { he: "זְמַן",     tr: "zman",    es: "tiempo" },
];

export const CONNECTORS = [
  { he: "וְ",    tr: "ve",   es: "y" },
  { he: "אֲבָל", tr: "aval", es: "pero" },
  { he: "כִּי",  tr: "ki",   es: "porque / que" },
  { he: "גַּם",  tr: "gam",  es: "también" },
  { he: "רַק",   tr: "rak",  es: "solo / solamente" },
  { he: "עִם",   tr: "im",   es: "con" },
];

export const NUCLEUS_CARDS = [
  ...PRONOUNS, ...DEMONSTRATIVES, ...CORE_VERBS, ...NOUNS, ...CONNECTORS,
];

// ─── Adjetivos ────────────────────────────────────────────────────────────────
// Lote 11 — emociones (0-7, 8 cartas)
// Lote 12 — estado 1  (8-13, 6 cartas)
// Lote 13 — estado 2  (14-19, 6 cartas)
// Lote 14 — descripción 1 (20-24, 5 cartas)
// Lote 15 — descripción 2 (25-29, 5 cartas)
export const ADJECTIVES = [
  // ── Lote 11: emociones ────────────────────────────────────────────────────
  { he: "חָזָק",      tr: "jazak",    es: "fuerte" },
  { he: "חַלָּשׁ",    tr: "jalash",   es: "débil" },
  { he: "שָׂמֵחַ",    tr: "sameaj",   es: "alegre (m)" },   // par masculino — era שְׂמֵחָה sin este
  { he: "שְׂמֵחָה",   tr: "smeja",    es: "alegre (f)" },
  { he: "עָצוּב",     tr: "atzuv",    es: "triste (m)" },   // par masculino — era עֲצוּבָה sin este
  { he: "עֲצוּבָה",   tr: "atzuba",   es: "triste (f)" },
  { he: "קָרוֹב",     tr: "karov",    es: "cerca" },
  { he: "רָחוֹק",     tr: "rajok",    es: "lejos" },

  // ── Lote 12: estado 1 ─────────────────────────────────────────────────────
  { he: "יָשָׁן",     tr: "yashan",   es: "viejo (objeto)" },
  { he: "חָדָשׁ",     tr: "jadash",   es: "nuevo" },
  { he: "יָשֵׁן",     tr: "yashen",   es: "dormido (m)" },  // antes ×4 formas → solo m/f
  { he: "יְשֵׁנָה",   tr: "yeshena",  es: "dormida (f)" },
  { he: "עֵר",        tr: "er",       es: "despierto (m)" }, // antes ×4 formas → solo m/f
  { he: "עֵרָה",      tr: "era",      es: "despierta (f)" },

  // ── Lote 13: estado 2 ─────────────────────────────────────────────────────
  { he: "פָּנוּי",    tr: "panuy",    es: "libre" },
  { he: "עָסוּק",     tr: "asuk",     es: "ocupado" },
  { he: "מְעַנְיֵן",  tr: "meanyen",  es: "interesante" },
  { he: "מְשַׁעֲמֵם", tr: "meshaamen",es: "aburrido" },
  { he: "נָמוּךְ",    tr: "namuj",    es: "bajo (altura)" },
  { he: "גָּבוֹהַ",   tr: "gavoha",   es: "alto (altura)" },

  // ── Lote 14: descripción 1 ────────────────────────────────────────────────
  { he: "דָּתִי",     tr: "dati",     es: "religioso" },
  { he: "חִילוֹנִי",  tr: "jiloni",   es: "laico" },
  { he: "נָקִי",      tr: "naki",     es: "limpio" },
  { he: "מְלֻכְלָךְ", tr: "meluklak", es: "sucio" },
  { he: "קָצָר",      tr: "katzar",   es: "corto" },

  // ── Lote 15: descripción 2 ────────────────────────────────────────────────
  { he: "אָרוֹךְ",    tr: "arok",     es: "largo" },
  { he: "רָעֵב",      tr: "raev",     es: "hambriento" },
  { he: "שָׂבֵעַ",    tr: "savea",    es: "saciado" },
  { he: "מְבוּגָר",   tr: "mevugar",  es: "mayor / adulto" },
  { he: "צָעִיר",     tr: "tzair",    es: "joven" },
];

// ─── Verbos ───────────────────────────────────────────────────────────────────
export const VERBS = [
  { he: "לֶאֱכוֹל",      tr: "leejol",      es: "comer",       binyan: PA },
  { he: "לִשְׁתּוֹת",    tr: "lishtot",     es: "beber",       binyan: PA },
  { he: "לַעֲבוֹד",      tr: "laavod",      es: "trabajar",    binyan: PA },
  { he: "לִלְמוֹד",      tr: "lilmod",      es: "estudiar",    binyan: PA },
  { he: "לָגוּר",        tr: "lagur",       es: "vivir",       binyan: PA },
  { he: "לָבוֹא",        tr: "lavo",        es: "venir",       binyan: PA },
  { he: "לַחְזוֹר",      tr: "lajzor",      es: "volver",      binyan: PA },
  { he: "לְהַגִּיעַ",    tr: "lehagia",     es: "llegar",      binyan: HI },
  { he: "לִנְסוֹעַ",     tr: "linsoa",      es: "viajar",      binyan: PA },
  { he: "לָקוּם",        tr: "lakum",       es: "levantarse",  binyan: PA },
  { he: "לִקְרוֹא",      tr: "likro",       es: "leer",        binyan: PA },
  { he: "לִכְתּוֹב",     tr: "lichtov",     es: "escribir",    binyan: PA },
  { he: "לְדַבֵּר",      tr: "ledaber",     es: "hablar",      binyan: PI },
  { he: "לִרְאוֹת",      tr: "lirot",       es: "ver",         binyan: PA },
  { he: "לְהִסְתַּכֵּל", tr: "lehistakel",  es: "mirar",       binyan: HT },
  { he: "לִרְצוֹת",      tr: "lirtzot",     es: "querer",      binyan: PA },
  { he: "לַעֲשׂוֹת",     tr: "laasot",      es: "hacer",       binyan: PA },
  { he: "לְהָבִין",      tr: "lehavin",     es: "entender",    binyan: HI },
  { he: "לְהַכִּיר",     tr: "lehakir",     es: "conocer",     binyan: HI },
  { he: "לְהַרְגִּישׁ",  tr: "lehargish",   es: "sentir",      binyan: HI },
  { he: "לְהַתְחִיל",    tr: "lehatchil",   es: "empezar",     binyan: HI },
  { he: "לְהַמְשִׁיךְ",  tr: "lehamshich",  es: "continuar",   binyan: HI },
  { he: "לְהַפְסִיק",    tr: "lehafsik",    es: "parar",       binyan: HI },
  { he: "לְשַׁלֵּם",     tr: "leshalem",    es: "pagar",       binyan: PI },
  { he: "לְחַכּוֹת",     tr: "lechakot",    es: "esperar",     binyan: PI },
  { he: "לְהִתְקַלֵּחַ", tr: "lehitkaleaj", es: "ducharse",    binyan: HT },
  { he: "לְהִתְלַבֵּשׁ", tr: "lehitalbesh", es: "vestirse",    binyan: HT },
  { he: "לְהִתְעוֹרֵר",  tr: "lehitorer",   es: "despertarse", binyan: HT },
  { he: "לְהִירָדֵם",    tr: "lehiradem",   es: "dormirse",    binyan: NI },
  { he: "לְהִתְפַּלֵּל", tr: "lehitpalel",  es: "rezar",       binyan: HT },
];

// ─── ALL_CARDS (deduplicado por clave `he`) ───────────────────────────────────
const _seen = new Set();
export const ALL_CARDS = [
  ...NUCLEUS_CARDS, ...ADJECTIVES, ...VERBS,
].filter(c => {
  if (_seen.has(c.he)) return false;
  _seen.add(c.he);
  return true;
});

// ─── Lotes ────────────────────────────────────────────────────────────────────
export const LOTES = [
  // NIVEL 0 — Núcleo (siempre abierto desde Capa 0)
  { id: 1,  label: "Capa 0 — Pronombres",    nivel: 0, cards: PRONOUNS },
  { id: 2,  label: "Capa 1 — Demostrativos", nivel: 0, cards: DEMONSTRATIVES,  requires: [1] },
  { id: 3,  label: "Capa 2 — Verbos ancla",  nivel: 0, cards: CORE_VERBS,      requires: [2] },
  { id: 4,  label: "Capa 3 — Sustantivos",   nivel: 0, cards: NOUNS,           requires: [3] },
  { id: 5,  label: "Capa 4 — Conectores",    nivel: 0, cards: CONNECTORS,      requires: [4] },

  // NIVEL 1 — Verbos (se desbloquean tras Capa 2)
  { id: 6,  label: "Verbos — vida básica",   nivel: 1, cards: VERBS.slice(0, 6),    requires: [3] },
  { id: 7,  label: "Verbos — movimiento",    nivel: 1, cards: VERBS.slice(6, 12),   requires: [6] },
  { id: 8,  label: "Verbos — comunicación",  nivel: 1, cards: VERBS.slice(12, 18),  requires: [7] },
  { id: 9,  label: "Verbos — cotidiano",     nivel: 1, cards: VERBS.slice(18, 24),  requires: [8] },
  { id: 10, label: "Verbos — rutina",        nivel: 1, cards: VERBS.slice(24),      requires: [9] },

  // NIVEL 1 — Adjetivos (se desbloquean tras Capa 2)
  { id: 11, label: "Adj — emociones",        nivel: 1, cards: ADJECTIVES.slice(0, 8),    requires: [3] },
  { id: 12, label: "Adj — estado 1",         nivel: 1, cards: ADJECTIVES.slice(8, 14),   requires: [11] },
  { id: 13, label: "Adj — estado 2",         nivel: 1, cards: ADJECTIVES.slice(14, 20),  requires: [12] },
  { id: 14, label: "Adj — descripción 1",    nivel: 1, cards: ADJECTIVES.slice(20, 25),  requires: [13] },
  { id: 15, label: "Adj — descripción 2",    nivel: 1, cards: ADJECTIVES.slice(25),      requires: [14] },

  // NIVEL 2 — Repasos por categoría
  { id: 16, label: "Repaso Núcleo",     nivel: 2, cards: NUCLEUS_CARDS, isRepaso: true, requires: [1, 2, 3, 4, 5] },
  { id: 17, label: "Repaso Verbos",     nivel: 2, cards: VERBS,         isRepaso: true, requires: [6, 7, 8, 9, 10] },
  { id: 18, label: "Repaso Adjetivos",  nivel: 2, cards: ADJECTIVES,    isRepaso: true, requires: [11, 12, 13, 14, 15] },

  // NIVEL 3 — Repaso final
  { id: 19, label: "Repaso Final", nivel: 3, cards: ALL_CARDS, isRepaso: true, isFinal: true, requires: [16, 17, 18] },
];
