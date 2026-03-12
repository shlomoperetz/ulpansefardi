export const ADJECTIVES = [
  { he: "חָזָק", tr: "jazak", es: "fuerte" },
  { he: "חַלָּשׁ", tr: "jalash", es: "debil" },
  { he: "שְׂמֵחָה", tr: "smeja", es: "alegre (f)" },
  { he: "עֲצוּבָה", tr: "atzuba", es: "triste (f)" },
  { he: "קָרוֹב", tr: "karov", es: "cerca" },
  { he: "רָחוֹק", tr: "rajok", es: "lejos" },
  { he: "יָשָׁן", tr: "yashan", es: "viejo (objeto)" },
  { he: "חָדָשׁ", tr: "jadash", es: "nuevo" },
  { he: "יָשֵׁן", tr: "yashen", es: "dormido" },
  { he: "יְשֵׁנָה", tr: "yeshena", es: "dormida" },
  { he: "יְשֵׁנִים", tr: "yeshenim", es: "dormidos" },
  { he: "יְשֵׁנוֹת", tr: "yashenot", es: "dormidas" },
  { he: "עֵר", tr: "er", es: "despierto" },
  { he: "עֵרָה", tr: "era", es: "despierta" },
  { he: "עֵרִים", tr: "erim", es: "despiertos" },
  { he: "עֵרוֹת", tr: "erot", es: "despiertas" },
  { he: "פָּנוּי", tr: "panuy", es: "libre" },
  { he: "עָסוּק", tr: "asuk", es: "ocupado" },
  { he: "מְעַנְיֵן", tr: "meanyen", es: "interesante" },
  { he: "מְשַׁעֲמֵם", tr: "meshaamen", es: "aburrido" },
  { he: "נָמוּךְ", tr: "namuj", es: "bajo (altura)" },
  { he: "גָּבוֹהַ", tr: "gavoha", es: "alto (altura)" },
  { he: "דָּתִי", tr: "dati", es: "religioso" },
  { he: "חִילוֹנִי", tr: "jiloni", es: "laico" },
  { he: "נָקִי", tr: "naki", es: "limpio" },
  { he: "מְלֻכְלָךְ", tr: "meluklak", es: "sucio" },
  { he: "קָצָר", tr: "katzar", es: "corto" },
  { he: "אָרוֹךְ", tr: "arok", es: "largo" },
  { he: "רָעֵב", tr: "raev", es: "hambriento" },
  { he: "שָׂבֵעַ", tr: "savea", es: "saciado" },
  { he: "מְבוּגָר", tr: "mevugar", es: "mayor / adulto" },
  { he: "צָעִיר", tr: "tzair", es: "joven" },
];

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

export const VERBS = [
  { he: "לֶאֱכוֹל",    tr: "leejol",      es: "comer",      binyan: PA },
  { he: "לִשְׁתּוֹת",  tr: "lishtot",     es: "beber",      binyan: PA },
  { he: "לַעֲבוֹד",    tr: "laavod",      es: "trabajar",   binyan: PA },
  { he: "לִלְמוֹד",    tr: "lilmod",      es: "estudiar",   binyan: PA },
  { he: "לָגוּר",      tr: "lagur",       es: "vivir",      binyan: PA },
  { he: "לָבוֹא",      tr: "lavo",        es: "venir",      binyan: PA },
  { he: "לַחְזוֹר",    tr: "lajzor",      es: "volver",     binyan: PA },
  { he: "לְהַגִּיעַ",  tr: "lehagia",     es: "llegar",     binyan: HI },
  { he: "לִנְסוֹעַ",   tr: "linsoa",      es: "viajar",     binyan: PA },
  { he: "לָקוּם",      tr: "lakum",       es: "levantarse", binyan: PA },
  { he: "לִקְרוֹא",    tr: "likro",       es: "leer",       binyan: PA },
  { he: "לִכְתּוֹב",   tr: "lichtov",     es: "escribir",   binyan: PA },
  { he: "לְדַבֵּר",    tr: "ledaber",     es: "hablar",     binyan: PI },
  { he: "לִרְאוֹת",    tr: "lirot",       es: "ver",        binyan: PA },
  { he: "לְהִסְתַּכֵּל", tr: "lehistakel", es: "mirar",     binyan: HT },
  { he: "לִרְצוֹת",    tr: "lirtzot",     es: "querer",     binyan: PA },
  { he: "לַעֲשׂוֹת",   tr: "laasot",      es: "hacer",      binyan: PA },
  { he: "לְהָבִין",    tr: "lehavin",     es: "entender",   binyan: HI },
  { he: "לְהַכִּיר",   tr: "lehakir",     es: "conocer",    binyan: HI },
  { he: "לְהַרְגִּישׁ", tr: "lehargish",  es: "sentir",     binyan: HI },
  { he: "לְהַתְחִיל",  tr: "lehatchil",   es: "empezar",    binyan: HI },
  { he: "לְהַמְשִׁיךְ", tr: "lehamshich", es: "continuar",  binyan: HI },
  { he: "לְהַפְסִיק",  tr: "lehafsik",    es: "parar",      binyan: HI },
  { he: "לְשַׁלֵּם",   tr: "leshalem",    es: "pagar",      binyan: PI },
  { he: "לְחַכּוֹת",   tr: "lechakot",    es: "esperar",    binyan: PI },
  { he: "לְהִתְקַלֵּחַ", tr: "lehitkaleaj", es: "ducharse", binyan: HT },
  { he: "לְהִתְלַבֵּשׁ", tr: "lehitalbesh", es: "vestirse", binyan: HT },
  { he: "לְהִתְעוֹרֵר", tr: "lehitorer",  es: "despertarse", binyan: HT },
  { he: "לְהִירָדֵם",  tr: "lehiradem",   es: "dormirse",   binyan: NI },
  { he: "לְהִתְפַּלֵּל", tr: "lehitpalel", es: "rezar",     binyan: HT },
];

export const ALL_CARDS = [...ADJECTIVES, ...VERBS];


export const LOTES = [
  // NIVEL 1 — Verbos (6 por lote)
  { id: 1,  label: "Verbos — vida básica",   nivel: 1, cards: VERBS.slice(0, 6) },
  { id: 2,  label: "Verbos — movimiento",    nivel: 1, cards: VERBS.slice(6, 12),  requires: [1] },
  { id: 3,  label: "Verbos — comunicación",  nivel: 1, cards: VERBS.slice(12, 18), requires: [2] },
  { id: 4,  label: "Verbos — cotidiano",     nivel: 1, cards: VERBS.slice(18, 24), requires: [3] },
  { id: 5,  label: "Verbos — rutina",        nivel: 1, cards: VERBS.slice(24),     requires: [4] },

  // NIVEL 1 — Adjetivos (6-7 por lote)
  { id: 6,  label: "Adj — emociones",        nivel: 1, cards: ADJECTIVES.slice(0, 6) },
  { id: 7,  label: "Adj — estado 1",         nivel: 1, cards: ADJECTIVES.slice(6, 12),  requires: [6] },
  { id: 8,  label: "Adj — estado 2",         nivel: 1, cards: ADJECTIVES.slice(12, 18), requires: [7] },
  { id: 9,  label: "Adj — descripción 1",    nivel: 1, cards: ADJECTIVES.slice(18, 25), requires: [8] },
  { id: 10, label: "Adj — descripción 2",    nivel: 1, cards: ADJECTIVES.slice(25),     requires: [9] },

  // NIVEL 2 — Repasos por categoría
  { id: 11, label: "Repaso Verbos",      nivel: 2, cards: VERBS,      isRepaso: true, requires: [1, 2, 3, 4, 5] },
  { id: 12, label: "Repaso Adjetivos",   nivel: 2, cards: ADJECTIVES, isRepaso: true, requires: [6, 7, 8, 9, 10] },

  // NIVEL 3 — Repaso final
  { id: 13, label: "Repaso Final", nivel: 3, cards: ALL_CARDS, isRepaso: true, isFinal: true, requires: [11, 12] },
];
