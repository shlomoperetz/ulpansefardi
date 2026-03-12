// Nivel elemental — alefato hebreo con pronunciación sefardí
// Sin nombres de letras. Solo forma visual + sonido en transliteración.

export const LETRAS = [
  { he: "א", tr: "—",  es: "silent" },   // alef — silent / glottal
  { he: "בּ", tr: "b",  es: "b" },
  { he: "ב",  tr: "v",  es: "v" },
  { he: "גּ", tr: "g",  es: "g" },
  { he: "דּ", tr: "d",  es: "d" },
  { he: "ה",  tr: "h",  es: "h" },
  { he: "ו",  tr: "v",  es: "v" },
  { he: "ז",  tr: "z",  es: "z" },
  { he: "ח",  tr: "j",  es: "j (jota suave)" },
  { he: "ט",  tr: "t",  es: "t" },
  { he: "י",  tr: "y",  es: "y" },
  { he: "כּ", tr: "k",  es: "k" },
  { he: "כ",  tr: "j",  es: "j (jota suave)" },
  { he: "ל",  tr: "l",  es: "l" },
  { he: "מ",  tr: "m",  es: "m" },
  { he: "נ",  tr: "n",  es: "n" },
  { he: "ס",  tr: "s",  es: "s" },
  { he: "ע",  tr: "—",  es: "silent" },   // ayin — silent
  { he: "פּ", tr: "p",  es: "p" },
  { he: "פ",  tr: "f",  es: "f" },
  { he: "צ",  tr: "ts", es: "ts" },
  { he: "ק",  tr: "k",  es: "k" },
  { he: "ר",  tr: "r",  es: "r" },
  { he: "שׁ", tr: "sh", es: "sh" },
  { he: "שׂ", tr: "s",  es: "s" },
  { he: "תּ", tr: "t",  es: "t" },
  { he: "ת",  tr: "t",  es: "t" },
];

// Para Fase B: letras base sin dagesh/sin-shin (las que se practican con el teclado)
// La comparación ignorará nikud
export const LETRAS_BASICAS = [
  { he: "א", tr: "silenciosa" },
  { he: "ב", tr: "b / v" },
  { he: "ג", tr: "g" },
  { he: "ד", tr: "d" },
  { he: "ה", tr: "h" },
  { he: "ו", tr: "v" },
  { he: "ז", tr: "z" },
  { he: "ח", tr: "j" },
  { he: "ט", tr: "t" },
  { he: "י", tr: "y" },
  { he: "כ", tr: "k / j" },
  { he: "ל", tr: "l" },
  { he: "מ", tr: "m" },
  { he: "נ", tr: "n" },
  { he: "ס", tr: "s" },
  { he: "ע", tr: "silenciosa" },
  { he: "פ", tr: "p / f" },
  { he: "צ", tr: "ts" },
  { he: "ק", tr: "k" },
  { he: "ר", tr: "r" },
  { he: "ש", tr: "sh / s" },
  { he: "ת", tr: "t" },
];

// Fase C — combinaciones letra+nikud → transliteración sefardí
export const NIKUD_COMBOS = [
  // Vocales con alef como soporte visual
  { he: "אָ", tr: "a",  nota: "pataj/kamats → a" },
  { he: "אֶ", tr: "e",  nota: "segol → e" },
  { he: "אֵ", tr: "e",  nota: "tsere → e" },
  { he: "אִ", tr: "i",  nota: "jirik → i" },
  { he: "אוֹ", tr: "o", nota: "jolam → o" },
  { he: "אוּ", tr: "u", nota: "shuruk → u" },
  { he: "אֻ", tr: "u",  nota: "kubuts → u" },
  { he: "אְ", tr: "",   nota: "shva — mudo" },
  // Sílabas concretas con consonantes frecuentes
  { he: "בָּ", tr: "ba",  nota: "" },
  { he: "בֶּ", tr: "be",  nota: "" },
  { he: "בִּ", tr: "bi",  nota: "" },
  { he: "בּוֹ", tr: "bo", nota: "" },
  { he: "בּוּ", tr: "bu", nota: "" },
  { he: "מָ", tr: "ma",  nota: "" },
  { he: "מֶ", tr: "me",  nota: "" },
  { he: "מִ", tr: "mi",  nota: "" },
  { he: "שָׁ", tr: "sha", nota: "" },
  { he: "שֶׁ", tr: "she", nota: "" },
  { he: "לָ", tr: "la",  nota: "" },
  { he: "לֵ", tr: "le",  nota: "" },
  { he: "לִ", tr: "li",  nota: "" },
  { he: "לוֹ", tr: "lo", nota: "" },
];

// Fase D — palabras puente hacia el núcleo
// Primero palabras muy cortas (onomatopeyas, monosílabos), luego las 5 ancla del núcleo
export const PALABRAS_PUENTE = [
  { he: "כֵּן",    tr: "ken",    es: "sí" },
  { he: "לֹא",    tr: "lo",     es: "no" },
  { he: "פֹּה",   tr: "po",     es: "aquí" },
  { he: "שָׁם",   tr: "sham",   es: "allí" },
  { he: "זֶה",    tr: "ze",     es: "esto" },
  { he: "זֹאת",   tr: "zot",    es: "esto (f)" },
  { he: "מָה",    tr: "ma",     es: "¿qué?" },
  { he: "מִי",    tr: "mi",     es: "¿quién?" },
  { he: "שָׁלוֹם", tr: "shalom", es: "paz / hola" },
  { he: "תּוֹדָה", tr: "toda",   es: "gracias" },
];
