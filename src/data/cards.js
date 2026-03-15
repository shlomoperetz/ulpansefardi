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
  { he: "לִרְצוֹת",  tr: "lirtzot",  es: "querer",      binyan: PA, conj: { ms: "רוֹצֶה",   fs: "רוֹצָה",    mp: "רוֹצִים",   fp: "רוֹצוֹת"   } },
  { he: "לֶאֱהוֹב",  tr: "leehov",   es: "amar",        binyan: PA, conj: { ms: "אוֹהֵב",   fs: "אוֹהֶבֶת",  mp: "אוֹהֲבִים", fp: "אוֹהֲבוֹת" } },
  { he: "לָדַעַת",   tr: "ladaat",   es: "saber",       binyan: PA, conj: { ms: "יוֹדֵעַ",  fs: "יוֹדַעַת",  mp: "יוֹדְעִים", fp: "יוֹדְעוֹת" } },
  { he: "לָלֶכֶת",   tr: "lalechet", es: "ir",          binyan: PA, conj: { ms: "הוֹלֵךְ",  fs: "הוֹלֶכֶת",  mp: "הוֹלְכִים", fp: "הוֹלְכוֹת" } },
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

// ─── Números ──────────────────────────────────────────────────────────────────
export const NUMBERS = [
  { he: "אֶחָד",    tr: "ejad",     es: "uno (m)" },
  { he: "אַחַת",    tr: "ajat",     es: "una (f)" },
  { he: "שְׁנַיִם", tr: "shnaim",   es: "dos (m)" },
  { he: "שְׁתַּיִם", tr: "shtaim",   es: "dos (f)" },
  { he: "שָׁלוֹשׁ", tr: "shalosh",  es: "tres" },
  { he: "אַרְבַּע", tr: "arba",     es: "cuatro" },
  { he: "חָמֵשׁ",   tr: "jamesh",   es: "cinco" },
  { he: "שֵׁשׁ",    tr: "shesh",    es: "seis" },
  { he: "שֶׁבַע",   tr: "sheva",    es: "siete" },
  { he: "שְׁמוֹנֶה", tr: "shmone",  es: "ocho" },
  { he: "תֵּשַׁע",  tr: "tesha",    es: "nueve" },
  { he: "עֶשֶׂר",   tr: "eser",     es: "diez" },
];

// ─── Preguntas ────────────────────────────────────────────────────────────────
export const QUESTIONS = [
  { he: "מָה",      tr: "ma",       es: "¿qué?" },
  { he: "מִי",      tr: "mi",       es: "¿quién?" },
  { he: "אֵיפֹה",   tr: "eyfo",     es: "¿dónde?" },
  { he: "מָתַי",    tr: "matai",    es: "¿cuándo?" },
  { he: "לָמָּה",   tr: "lama",     es: "¿por qué?" },
  { he: "כַּמָּה",  tr: "kama",     es: "¿cuánto?" },
  { he: "אֵיךְ",    tr: "ej",       es: "¿cómo?" },
  { he: "אֵיזֶה",   tr: "eyze",     es: "¿cuál?" },
];

// ─── Expresiones ──────────────────────────────────────────────────────────────
export const EXPRESSIONS = [
  { he: "שָׁלוֹם",       tr: "shalom",     es: "hola / adiós / paz" },
  { he: "תּוֹדָה",        tr: "toda",       es: "gracias" },
  { he: "בְּבַקָּשָׁה",  tr: "bevakasha",  es: "por favor / de nada" },
  { he: "סְלִיחָה",      tr: "sliha",      es: "perdón / disculpe" },
  { he: "בְּסֵדֶר",      tr: "beseder",    es: "de acuerdo / bien" },
  { he: "יַלָּה",         tr: "yala",       es: "¡vamos! / ¡venga!" },
  { he: "מַזָּל טוֹב",   tr: "mazal tov",  es: "enhorabuena" },
  { he: "לְהִתְרָאוֹת",  tr: "lehitraot",  es: "hasta luego" },
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
  { he: "לֶאֱכוֹל",      tr: "leejol",      es: "comer",       binyan: PA, conj: { ms: "אוֹכֵל",       fs: "אוֹכֶלֶת",      mp: "אוֹכְלִים",      fp: "אוֹכְלוֹת"      } },
  { he: "לִשְׁתּוֹת",    tr: "lishtot",     es: "beber",       binyan: PA, conj: { ms: "שׁוֹתֶה",       fs: "שׁוֹתָה",        mp: "שׁוֹתִים",        fp: "שׁוֹתוֹת"        } },
  { he: "לַעֲבוֹד",      tr: "laavod",      es: "trabajar",    binyan: PA, conj: { ms: "עוֹבֵד",        fs: "עוֹבֶדֶת",       mp: "עוֹבְדִים",       fp: "עוֹבְדוֹת"       } },
  { he: "לִלְמוֹד",      tr: "lilmod",      es: "estudiar",    binyan: PA, conj: { ms: "לוֹמֵד",        fs: "לוֹמֶדֶת",       mp: "לוֹמְדִים",       fp: "לוֹמְדוֹת"       } },
  { he: "לָגוּר",        tr: "lagur",       es: "vivir",       binyan: PA, conj: { ms: "גָּר",           fs: "גָּרָה",          mp: "גָּרִים",          fp: "גָּרוֹת"          } },
  { he: "לָבוֹא",        tr: "lavo",        es: "venir",       binyan: PA, conj: { ms: "בָּא",           fs: "בָּאָה",          mp: "בָּאִים",          fp: "בָּאוֹת"          } },
  { he: "לַחְזוֹר",      tr: "lajzor",      es: "volver",      binyan: PA, conj: { ms: "חוֹזֵר",        fs: "חוֹזֶרֶת",       mp: "חוֹזְרִים",       fp: "חוֹזְרוֹת"       } },
  { he: "לְהַגִּיעַ",    tr: "lehagia",     es: "llegar",      binyan: HI, conj: { ms: "מַגִּיעַ",      fs: "מַגִּיעָה",       mp: "מַגִּיעִים",       fp: "מַגִּיעוֹת"       } },
  { he: "לִנְסוֹעַ",     tr: "linsoa",      es: "viajar",      binyan: PA, conj: { ms: "נוֹסֵעַ",       fs: "נוֹסַעַת",        mp: "נוֹסְעִים",        fp: "נוֹסְעוֹת"        } },
  { he: "לָקוּם",        tr: "lakum",       es: "levantarse",  binyan: PA, conj: { ms: "קָם",            fs: "קָמָה",           mp: "קָמִים",           fp: "קָמוֹת"           } },
  { he: "לִקְרוֹא",      tr: "likro",       es: "leer",        binyan: PA, conj: { ms: "קוֹרֵא",        fs: "קוֹרֵאת",        mp: "קוֹרְאִים",       fp: "קוֹרְאוֹת"       } },
  { he: "לִכְתּוֹב",     tr: "lichtov",     es: "escribir",    binyan: PA, conj: { ms: "כּוֹתֵב",        fs: "כּוֹתֶבֶת",       mp: "כּוֹתְבִים",       fp: "כּוֹתְבוֹת"       } },
  { he: "לְדַבֵּר",      tr: "ledaber",     es: "hablar",      binyan: PI, conj: { ms: "מְדַבֵּר",      fs: "מְדַבֶּרֶת",     mp: "מְדַבְּרִים",     fp: "מְדַבְּרוֹת"     } },
  { he: "לִרְאוֹת",      tr: "lirot",       es: "ver",         binyan: PA, conj: { ms: "רוֹאֶה",        fs: "רוֹאָה",          mp: "רוֹאִים",          fp: "רוֹאוֹת"          } },
  { he: "לְהִסְתַּכֵּל", tr: "lehistakel",  es: "mirar",       binyan: HT, conj: { ms: "מִסְתַּכֵּל",   fs: "מִסְתַּכֶּלֶת",  mp: "מִסְתַּכְּלִים",  fp: "מִסְתַּכְּלוֹת"  } },
  { he: "לִרְצוֹת",      tr: "lirtzot",     es: "querer",      binyan: PA, conj: { ms: "רוֹצֶה",        fs: "רוֹצָה",          mp: "רוֹצִים",          fp: "רוֹצוֹת"          } },
  { he: "לַעֲשׂוֹת",     tr: "laasot",      es: "hacer",       binyan: PA, conj: { ms: "עוֹשֶׂה",        fs: "עוֹשָׂה",          mp: "עוֹשִׂים",          fp: "עוֹשׂוֹת"          } },
  { he: "לְהָבִין",      tr: "lehavin",     es: "entender",    binyan: HI, conj: { ms: "מֵבִין",         fs: "מְבִינָה",        mp: "מְבִינִים",        fp: "מְבִינוֹת"        } },
  { he: "לְהַכִּיר",     tr: "lehakir",     es: "conocer",     binyan: HI, conj: { ms: "מַכִּיר",        fs: "מַכִּירָה",       mp: "מַכִּירִים",       fp: "מַכִּירוֹת"       } },
  { he: "לְהַרְגִּישׁ",  tr: "lehargish",   es: "sentir",      binyan: HI, conj: { ms: "מַרְגִּישׁ",     fs: "מַרְגִּישָׁה",    mp: "מַרְגִּישִׁים",    fp: "מַרְגִּישׁוֹת"    } },
  { he: "לְהַתְחִיל",    tr: "lehatchil",   es: "empezar",     binyan: HI, conj: { ms: "מַתְחִיל",       fs: "מַתְחִילָה",      mp: "מַתְחִילִים",      fp: "מַתְחִילוֹת"      } },
  { he: "לְהַמְשִׁיךְ",  tr: "lehamshich",  es: "continuar",   binyan: HI, conj: { ms: "מַמְשִׁיךְ",     fs: "מַמְשִׁיכָה",     mp: "מַמְשִׁיכִים",     fp: "מַמְשִׁיכוֹת"     } },
  { he: "לְהַפְסִיק",    tr: "lehafsik",    es: "parar",       binyan: HI, conj: { ms: "מַפְסִיק",       fs: "מַפְסִיקָה",      mp: "מַפְסִיקִים",      fp: "מַפְסִיקוֹת"      } },
  { he: "לְשַׁלֵּם",     tr: "leshalem",    es: "pagar",       binyan: PI, conj: { ms: "מְשַׁלֵּם",      fs: "מְשַׁלֶּמֶת",    mp: "מְשַׁלְּמִים",    fp: "מְשַׁלְּמוֹת"    } },
  { he: "לְחַכּוֹת",     tr: "lechakot",    es: "esperar",     binyan: PI, conj: { ms: "מְחַכֶּה",       fs: "מְחַכָּה",        mp: "מְחַכִּים",        fp: "מְחַכּוֹת"        } },
  { he: "לְהִתְקַלֵּחַ", tr: "lehitkaleaj", es: "ducharse",    binyan: HT, conj: { ms: "מִתְקַלֵּחַ",    fs: "מִתְקַלַּחַת",   mp: "מִתְקַלְּחִים",   fp: "מִתְקַלְּחוֹת"   } },
  { he: "לְהִתְלַבֵּשׁ", tr: "lehitalbesh", es: "vestirse",    binyan: HT, conj: { ms: "מִתְלַבֵּשׁ",    fs: "מִתְלַבֶּשֶׁת",  mp: "מִתְלַבְּשִׁים",  fp: "מִתְלַבְּשׁוֹת"  } },
  { he: "לְהִתְעוֹרֵר",  tr: "lehitorer",   es: "despertarse", binyan: HT, conj: { ms: "מִתְעוֹרֵר",     fs: "מִתְעוֹרֶרֶת",   mp: "מִתְעוֹרְרִים",   fp: "מִתְעוֹרְרוֹת"   } },
  { he: "לְהִירָדֵם",    tr: "lehiradem",   es: "dormirse",    binyan: NI, conj: { ms: "נִרְדָּם",        fs: "נִרְדֶּמֶת",      mp: "נִרְדָּמִים",      fp: "נִרְדָּמוֹת"      } },
  { he: "לְהִתְפַּלֵּל", tr: "lehitpalel",  es: "rezar",       binyan: HT, conj: { ms: "מִתְפַּלֵּל",    fs: "מִתְפַּלֶּלֶת",  mp: "מִתְפַּלְּלִים",  fp: "מִתְפַּלְּלוֹת"  } },
];

// ─── ALL_CARDS (deduplicado por clave `he`) ───────────────────────────────────
const _seen = new Set();
export const ALL_CARDS = [
  ...NUCLEUS_CARDS, ...NUMBERS, ...QUESTIONS, ...EXPRESSIONS, ...ADJECTIVES, ...VERBS,
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

  // NIVEL 1 — Vocabulario extra (se desbloquean tras Capa 4)
  { id: 20, label: "Números 1-10",      nivel: 1, cards: NUMBERS,      requires: [5] },
  { id: 21, label: "Preguntas",         nivel: 1, cards: QUESTIONS,    requires: [5] },
  { id: 22, label: "Expresiones",       nivel: 1, cards: EXPRESSIONS,  requires: [5] },

  // NIVEL 2 — Repasos por categoría
  { id: 16, label: "Repaso Núcleo",     nivel: 2, cards: NUCLEUS_CARDS, isRepaso: true, requires: [1, 2, 3, 4, 5] },
  { id: 17, label: "Repaso Verbos",     nivel: 2, cards: VERBS,         isRepaso: true, requires: [6, 7, 8, 9, 10] },
  { id: 18, label: "Repaso Adjetivos",  nivel: 2, cards: ADJECTIVES,    isRepaso: true, requires: [11, 12, 13, 14, 15] },

  // NIVEL 3 — Repaso final
  { id: 19, label: "Repaso Final", nivel: 3, cards: ALL_CARDS, isRepaso: true, isFinal: true, requires: [16, 17, 18] },
];
