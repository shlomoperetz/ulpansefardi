export const BINYAN_COLORS = {
  "פָּעַל":    "#3b82f6",
  "פִּיעֵל":  "#8b5cf6",
  "הִפְעִיל": "#f59e0b",
  "הִתְפַּעֵל":"#10b981",
  "נִפְעַל":  "#f43f5e",
};

export const WORDS = [
  // ── Group 1 — Core pronouns ─────────────────────────────────────────────
  { id: "ani",     he: "אֲנִי",    tr: "ani",     es: "yo",          type: "pronoun",  group: 1 },
  { id: "ata",     he: "אַתָּה",   tr: "ata",     es: "tú (m)",      type: "pronoun",  group: 1 },
  { id: "at",      he: "אַתְּ",    tr: "at",      es: "tú (f)",      type: "pronoun",  group: 1 },
  { id: "hu",      he: "הוּא",     tr: "hu",      es: "él",          type: "pronoun",  group: 1 },
  { id: "hi",      he: "הִיא",     tr: "hi",      es: "ella",        type: "pronoun",  group: 1 },

  // ── Group 2 — More pronouns + basics ────────────────────────────────────
  { id: "anajnu",  he: "אֲנַחְנוּ", tr: "anajnu",  es: "nosotros",    type: "pronoun",  group: 2 },
  { id: "ken",     he: "כֵּן",     tr: "ken",     es: "sí",          type: "adverb",   group: 2 },
  { id: "lo",      he: "לֹא",     tr: "lo",      es: "no",          type: "adverb",   group: 2 },
  { id: "ma",      he: "מָה",     tr: "ma",      es: "¿qué?",       type: "question", group: 2 },
  { id: "mi",      he: "מִי",     tr: "mi",      es: "¿quién?",     type: "question", group: 2 },

  // ── Group 3 — First verbs ────────────────────────────────────────────────
  {
    id: "lirtzot", he: "לִרְצוֹת", tr: "lirtzot", es: "querer",
    type: "verb", group: 3,
    binyan: "פָּעַל", root: "ר-צ-ה",
    formula: "אֲנִי רוֹצֶה + ל...",
    conj: { ms: "רוֹצֶה", fs: "רוֹצָה", mp: "רוֹצִים", fp: "רוֹצוֹת" },
    conjTr: { ms: "rotze", fs: "rotza", mp: "rotzim", fp: "rotzot" },
  },
  { id: "yesh",    he: "יֵשׁ",    tr: "yesh",    es: "hay / tiene",     type: "existential", group: 3 },
  { id: "eyn",     he: "אֵין",    tr: "eyn",     es: "no hay / no tiene", type: "existential", group: 3 },
  {
    id: "lalechet", he: "לָלֶכֶת", tr: "lalechet", es: "ir",
    type: "verb", group: 3,
    binyan: "פָּעַל", root: "ה-ל-כ",
    formula: "אֲנִי הוֹלֵךְ לְ...",
    conj: { ms: "הוֹלֵךְ", fs: "הוֹלֶכֶת", mp: "הוֹלְכִים", fp: "הוֹלְכוֹת" },
    conjTr: { ms: "holej", fs: "holechet", mp: "holchim", fp: "holchot" },
  },
  {
    id: "lavo",    he: "לָבוֹא",   tr: "lavo",    es: "venir",
    type: "verb", group: 3,
    binyan: "פָּעַל", root: "ב-א-ה",
    formula: "אֲנִי בָּא מִ...",
    conj: { ms: "בָּא", fs: "בָּאָה", mp: "בָּאִים", fp: "בָּאוֹת" },
    conjTr: { ms: "ba", fs: "baa", mp: "baim", fp: "baot" },
  },

  // ── Group 4 — Place + demonstratives ────────────────────────────────────
  { id: "po",      he: "פֹּה",    tr: "po",      es: "aquí",        type: "adverb",   group: 4 },
  { id: "sham",    he: "שָׁם",    tr: "sham",    es: "allí",        type: "adverb",   group: 4 },
  { id: "ze",      he: "זֶה",     tr: "ze",      es: "esto (m)",    type: "pronoun",  group: 4 },
  { id: "zot",     he: "זֹאת",    tr: "zot",     es: "esto (f)",    type: "pronoun",  group: 4 },
  { id: "eyfo",    he: "אֵיפֹה",  tr: "eyfo",    es: "¿dónde?",    type: "question", group: 4 },

  // ── Group 5 — Time basics ────────────────────────────────────────────────
  { id: "axshav",  he: "עַכְשָׁו", tr: "axshav",  es: "ahora",       type: "adverb",   group: 5 },
  { id: "hayom",   he: "הַיּוֹם",  tr: "hayom",   es: "hoy",         type: "adverb",   group: 5 },
  { id: "maxar",   he: "מָחָר",    tr: "maxar",   es: "mañana",      type: "adverb",   group: 5 },
  { id: "yom",     he: "יוֹם",    tr: "yom",     es: "día",         type: "noun",     group: 5 },
  { id: "matai",   he: "מָתַי",   tr: "matai",   es: "¿cuándo?",   type: "question", group: 5 },

  // ── Group 6 — Quantity ───────────────────────────────────────────────────
  { id: "harbe",   he: "הַרְבֵּה", tr: "harbe",   es: "mucho",       type: "adverb",   group: 6 },
  { id: "meat",    he: "מְעַט",   tr: "meat",    es: "poco",        type: "adverb",   group: 6 },
  { id: "yoter",   he: "יוֹתֵר",  tr: "yoter",   es: "más",         type: "adverb",   group: 6 },
  { id: "kama",    he: "כַּמָּה",  tr: "kama",    es: "¿cuánto?",   type: "question", group: 6 },
  { id: "rak",     he: "רַק",     tr: "rak",     es: "solo / solamente", type: "connector", group: 6 },

  // ── Group 7 — Key connectors ─────────────────────────────────────────────
  { id: "ve",      he: "וְ",      tr: "ve",      es: "y",           type: "connector",   group: 7 },
  { id: "aval",    he: "אֲבָל",   tr: "aval",    es: "pero",        type: "connector",   group: 7 },
  { id: "ki",      he: "כִּי",    tr: "ki",      es: "porque / que", type: "connector",   group: 7 },
  { id: "gam",     he: "גַּם",    tr: "gam",     es: "también",     type: "connector",   group: 7 },
  { id: "im",      he: "עִם",     tr: "im",      es: "con",         type: "preposition", group: 7 },

  // ── Group 8 — Core verbs 2 ───────────────────────────────────────────────
  {
    id: "leehov",  he: "לֶאֱהוֹב", tr: "leehov",  es: "amar / gustar",
    type: "verb", group: 8,
    binyan: "פָּעַל", root: "א-ה-ב",
    formula: "אֲנִי אוֹהֵב אֶת...",
    conj: { ms: "אוֹהֵב", fs: "אוֹהֶבֶת", mp: "אוֹהֲבִים", fp: "אוֹהֲבוֹת" },
    conjTr: { ms: "ohev", fs: "ohevet", mp: "ohavim", fp: "ohavot" },
  },
  {
    id: "ladaat",  he: "לָדַעַת",  tr: "ladaat",  es: "saber",
    type: "verb", group: 8,
    binyan: "פָּעַל", root: "י-ד-ע",
    formula: "אֲנִי יוֹדֵעַ שֶׁ...",
    conj: { ms: "יוֹדֵעַ", fs: "יוֹדַעַת", mp: "יוֹדְעִים", fp: "יוֹדְעוֹת" },
    conjTr: { ms: "yodea", fs: "yodaat", mp: "yodim", fp: "yodot" },
  },
  {
    id: "lihiot",  he: "לִהְיוֹת", tr: "lihiot",  es: "ser / estar",
    type: "verb", group: 8,
    binyan: "פָּעַל", root: "ה-י-ה",
  },
  {
    id: "lejol",   he: "לְיַכֹּל", tr: "lejol",   es: "poder",
    type: "verb", group: 8,
    binyan: "פָּעַל", root: "י-כ-ל",
    formula: "אֲנִי יָכוֹל + ל...",
    conj: { ms: "יָכוֹל", fs: "יְכוֹלָה", mp: "יְכוֹלִים", fp: "יְכוֹלוֹת" },
    conjTr: { ms: "yajol", fs: "yejola", mp: "yejolim", fp: "yejolot" },
  },
  {
    id: "tzarich", he: "צָרִיךְ",  tr: "tzarich", es: "necesitar / deber",
    type: "adjective", group: 8,
    formula: "אֲנִי צָרִיךְ + ל...",
    conj: { ms: "צָרִיךְ", fs: "צְרִיכָה", mp: "צְרִיכִים", fp: "צְרִיכוֹת" },
    conjTr: { ms: "tzarich", fs: "tzricha", mp: "tzrichim", fp: "tzrichot" },
  },

  // ── Group 9 — Social expressions ────────────────────────────────────────
  { id: "shalom",    he: "שָׁלוֹם",      tr: "shalom",    es: "hola / adiós / paz",    type: "expression", group: 9 },
  { id: "toda",      he: "תּוֹדָה",      tr: "toda",      es: "gracias",               type: "expression", group: 9 },
  { id: "bevakasha", he: "בְּבַקָּשָׁה", tr: "bevakasha", es: "por favor / de nada",   type: "expression", group: 9 },
  { id: "sliha",     he: "סְלִיחָה",     tr: "sliha",     es: "perdón / disculpe",     type: "expression", group: 9 },
  { id: "beseder",   he: "בְּסֵדֶר",     tr: "beseder",   es: "de acuerdo / bien",     type: "expression", group: 9 },

  // ── Group 10 — Key nouns ─────────────────────────────────────────────────
  { id: "bayt",      he: "בַּיִת",   tr: "bayt",    es: "casa",              type: "noun", group: 10 },
  { id: "eretz",     he: "אֶרֶץ",    tr: "eretz",   es: "país / tierra",     type: "noun", group: 10 },
  { id: "anashim",   he: "אֲנָשִׁים", tr: "anashim", es: "personas / gente",  type: "noun", group: 10 },
  { id: "yisrael",   he: "יִשְׂרָאֵל", tr: "yisrael", es: "Israel",            type: "noun", group: 10 },
  { id: "shafa",     he: "שָׂפָה",    tr: "safa",    es: "idioma / lengua",   type: "noun", group: 10 },

  // ── Group 11 — More verbs ────────────────────────────────────────────────
  {
    id: "leejol",  he: "לֶאֱכוֹל", tr: "leejol",  es: "comer",
    type: "verb", group: 11,
    binyan: "פָּעַל", root: "א-כ-ל",
    formula: "אֲנִי אוֹכֵל",
    conj: { ms: "אוֹכֵל", fs: "אוֹכֶלֶת", mp: "אוֹכְלִים", fp: "אוֹכְלוֹת" },
    conjTr: { ms: "ojel", fs: "ojelet", mp: "ojlim", fp: "ojlot" },
  },
  {
    id: "lishtot", he: "לִשְׁתּוֹת", tr: "lishtot", es: "beber",
    type: "verb", group: 11,
    binyan: "פָּעַל", root: "שׁ-ת-ה",
    formula: "אֲנִי שׁוֹתֶה",
    conj: { ms: "שׁוֹתֶה", fs: "שׁוֹתָה", mp: "שׁוֹתִים", fp: "שׁוֹתוֹת" },
    conjTr: { ms: "shote", fs: "shota", mp: "shotim", fp: "shotot" },
  },
  {
    id: "lilmod",  he: "לִלְמוֹד", tr: "lilmod",  es: "estudiar / aprender",
    type: "verb", group: 11,
    binyan: "פָּעַל", root: "ל-מ-ד",
    formula: "אֲנִי לוֹמֵד עִבְרִית",
    conj: { ms: "לוֹמֵד", fs: "לוֹמֶדֶת", mp: "לוֹמְדִים", fp: "לוֹמְדוֹת" },
    conjTr: { ms: "lomed", fs: "lomedet", mp: "lomdim", fp: "lomdot" },
  },
  {
    id: "laavod",  he: "לַעֲבוֹד", tr: "laavod",  es: "trabajar",
    type: "verb", group: 11,
    binyan: "פָּעַל", root: "ע-ב-ד",
    formula: "אֲנִי עוֹבֵד בְּ...",
    conj: { ms: "עוֹבֵד", fs: "עוֹבֶדֶת", mp: "עוֹבְדִים", fp: "עוֹבְדוֹת" },
    conjTr: { ms: "oved", fs: "ovedet", mp: "ovdim", fp: "ovdot" },
  },
  {
    id: "ledaber", he: "לְדַבֵּר", tr: "ledaber", es: "hablar",
    type: "verb", group: 11,
    binyan: "פִּיעֵל", root: "ד-ב-ר",
    formula: "אֲנִי מְדַבֵּר עִם...",
    conj: { ms: "מְדַבֵּר", fs: "מְדַבֶּרֶת", mp: "מְדַבְּרִים", fp: "מְדַבְּרוֹת" },
    conjTr: { ms: "medaber", fs: "medaberet", mp: "medabrim", fp: "medabrot" },
  },

  // ── Group 12 — Time extended + adverbs ──────────────────────────────────
  { id: "shana",   he: "שָׁנָה",   tr: "shana",   es: "año",   type: "noun",   group: 12 },
  { id: "xodesh",  he: "חֹדֶשׁ",   tr: "xodesh",  es: "mes",   type: "noun",   group: 12 },
  { id: "zman",    he: "זְמַן",    tr: "zman",    es: "tiempo", type: "noun",   group: 12 },
  { id: "etmol",   he: "אֶתְמוֹל", tr: "etmol",   es: "ayer",  type: "adverb", group: 12 },
  { id: "kvar",    he: "כְּבָר",   tr: "kvar",    es: "ya",    type: "adverb", group: 12 },
];

export const GROUPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function getWordsForGroup(groupNum) {
  return WORDS.filter(w => w.group === groupNum);
}
