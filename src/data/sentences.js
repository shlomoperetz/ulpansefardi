// Frases de práctica — se desbloquean según grupos aprendidos
// gender: "ms"=masc.sing | "fs"=fem.sing | "mp"=masc.pl | null=sin género ambiguo

export const SENTENCES = [
  // ── Grupo 2+ ─────────────────────────────────────────────────────────────
  { id: "s01", he: "מִי אַתָּה?",            tr: "Mi ata?",                   es: "¿Quién eres tú?",           unlocksAtGroup: 2,  gender: "ms" },
  { id: "s02", he: "מָה זֶה?",               tr: "Ma ze?",                    es: "¿Qué es esto?",             unlocksAtGroup: 2,  gender: null },
  { id: "s03", he: "כֵּן, אֲנִי פֹּה.",      tr: "Ken, ani po.",               es: "Sí, estoy aquí.",           unlocksAtGroup: 2,  gender: null },

  // ── Grupo 3+ ─────────────────────────────────────────────────────────────
  { id: "s04", he: "אֲנִי רוֹצֶה לָלֶכֶת.", tr: "Ani rotze lalechet.",        es: "Quiero ir.",                unlocksAtGroup: 3,  gender: "ms" },
  { id: "s05", he: "הוּא לֹא רוֹצֶה.",      tr: "Hu lo rotze.",               es: "Él no quiere.",             unlocksAtGroup: 3,  gender: null },
  { id: "s06", he: "אַתָּה בָּא?",           tr: "Ata ba?",                   es: "¿Vienes tú?",               unlocksAtGroup: 3,  gender: "ms" },
  { id: "s07", he: "מִי בָּא?",              tr: "Mi ba?",                    es: "¿Quién viene?",             unlocksAtGroup: 3,  gender: null },
  { id: "s08", he: "יֵשׁ אוֹ אֵין?",         tr: "Yesh o eyn?",               es: "¿Hay o no hay?",            unlocksAtGroup: 3,  gender: null },

  // ── Grupo 4+ ─────────────────────────────────────────────────────────────
  { id: "s09", he: "אֵיפֹה אַתָּה?",         tr: "Eyfo ata?",                 es: "¿Dónde estás tú?",          unlocksAtGroup: 4,  gender: "ms" },
  { id: "s10", he: "הוּא שָׁם.",             tr: "Hu sham.",                  es: "Él está allí.",             unlocksAtGroup: 4,  gender: null },
  { id: "s11", he: "אֲנִי פֹּה.",            tr: "Ani po.",                   es: "Estoy aquí.",               unlocksAtGroup: 4,  gender: null },
  { id: "s12", he: "זֶה מָה?",               tr: "Ze ma?",                    es: "¿Qué es esto?",             unlocksAtGroup: 4,  gender: null },
  { id: "s13", he: "אֲנִי רוֹצֶה לָלֶכֶת שָׁם.", tr: "Ani rotze lalechet sham.", es: "Quiero ir allí.",       unlocksAtGroup: 4,  gender: "ms" },

  // ── Grupo 5+ ─────────────────────────────────────────────────────────────
  { id: "s14", he: "הַיּוֹם אֲנִי פֹּה.",    tr: "Hayom ani po.",              es: "Hoy estoy aquí.",           unlocksAtGroup: 5,  gender: null },
  { id: "s15", he: "מָחָר הוּא בָּא.",       tr: "Maxar hu ba.",               es: "Mañana él viene.",          unlocksAtGroup: 5,  gender: null },
  { id: "s16", he: "מָתַי אַתָּה הוֹלֵךְ?", tr: "Matai ata holej?",          es: "¿Cuándo vas tú?",           unlocksAtGroup: 5,  gender: "ms" },
  { id: "s17", he: "אֲנִי הוֹלֵךְ עַכְשָׁו.", tr: "Ani holej axshav.",         es: "Voy ahora.",                unlocksAtGroup: 5,  gender: "ms" },
  { id: "s18", he: "יֵשׁ זְמַן הַיּוֹם?",    tr: "Yesh zman hayom?",          es: "¿Hay tiempo hoy?",          unlocksAtGroup: 5,  gender: null },

  // ── Grupo 6+ ─────────────────────────────────────────────────────────────
  { id: "s19", he: "יֵשׁ הַרְבֵּה.",         tr: "Yesh harbe.",               es: "Hay mucho.",                unlocksAtGroup: 6,  gender: null },
  { id: "s20", he: "אֲנִי רוֹצֶה יוֹתֵר.",  tr: "Ani rotze yoter.",           es: "Quiero más.",               unlocksAtGroup: 6,  gender: "ms" },
  { id: "s21", he: "כַּמָּה זֶה?",           tr: "Kama ze?",                  es: "¿Cuánto es esto?",          unlocksAtGroup: 6,  gender: null },

  // ── Grupo 7+ ─────────────────────────────────────────────────────────────
  { id: "s22", he: "הוּא בָּא וְהִיא גַּם.",  tr: "Hu ba ve-hi gam.",          es: "Él viene y ella también.",  unlocksAtGroup: 7,  gender: null },
  { id: "s23", he: "אֲנִי פֹּה כִּי אֲנִי רוֹצֶה.", tr: "Ani po ki ani rotze.", es: "Estoy aquí porque quiero.", unlocksAtGroup: 7, gender: "ms" },
  { id: "s24", he: "אֲנִי רוֹצֶה אֲבָל לֹא יָכוֹל.", tr: "Ani rotze aval lo yajol.", es: "Quiero pero no puedo.", unlocksAtGroup: 7, gender: "ms" },
  { id: "s25", he: "הוּא הוֹלֵךְ עִם הִיא.",  tr: "Hu holej im hi.",            es: "Él va con ella.",           unlocksAtGroup: 7,  gender: null },

  // ── Grupo 8+ ─────────────────────────────────────────────────────────────
  { id: "s26", he: "אֲנִי אוֹהֵב אֶת זֶה.",  tr: "Ani ohev et ze.",            es: "Me gusta esto.",            unlocksAtGroup: 8,  gender: "ms" },
  { id: "s27", he: "הוּא יוֹדֵעַ.",           tr: "Hu yodea.",                 es: "Él sabe.",                  unlocksAtGroup: 8,  gender: null },
  { id: "s28", he: "אַתָּה יָכוֹל?",          tr: "Ata yajol?",                es: "¿Puedes tú?",               unlocksAtGroup: 8,  gender: "ms" },
  { id: "s29", he: "אֲנִי לֹא יָכוֹל לָלֶכֶת.", tr: "Ani lo yajol lalechet.", es: "No puedo ir.",              unlocksAtGroup: 8,  gender: "ms" },
  { id: "s30", he: "אַתָּה צָרִיךְ לָבוֹא.",  tr: "Ata tzarich lavo.",          es: "Necesitas venir.",          unlocksAtGroup: 8,  gender: "ms" },

  // ── Grupo 9+ ─────────────────────────────────────────────────────────────
  { id: "s31", he: "שָׁלוֹם! מִי אַתָּה?",   tr: "Shalom! Mi ata?",           es: "¡Hola! ¿Quién eres?",       unlocksAtGroup: 9,  gender: "ms" },
  { id: "s32", he: "תּוֹדָה, בְּסֵדֶר.",     tr: "Toda, beseder.",             es: "Gracias, de acuerdo.",      unlocksAtGroup: 9,  gender: null },
  { id: "s33", he: "סְלִיחָה, אֵיפֹה הוּא?", tr: "Sliha, eyfo hu?",           es: "Perdón, ¿dónde está él?",   unlocksAtGroup: 9,  gender: null },
  { id: "s34", he: "בְּבַקָּשָׁה, אֲנִי רוֹצֶה לָלֶכֶת.", tr: "Bevakasha, ani rotze lalechet.", es: "Por favor, quiero ir.", unlocksAtGroup: 9, gender: "ms" },

  // ── Grupo 10+ ────────────────────────────────────────────────────────────
  { id: "s35", he: "הוּא בְּיִשְׂרָאֵל.",    tr: "Hu be-Yisrael.",            es: "Él está en Israel.",        unlocksAtGroup: 10, gender: null },
  { id: "s36", he: "יֵשׁ בַּיִת שָׁם.",      tr: "Yesh bayt sham.",           es: "Hay una casa allí.",        unlocksAtGroup: 10, gender: null },
  { id: "s37", he: "אֲנִי אוֹהֵב אֶת הַשָּׂפָה.", tr: "Ani ohev et ha-safa.", es: "Me gusta el idioma.",       unlocksAtGroup: 10, gender: "ms" },
  { id: "s38", he: "הָאֲנָשִׁים פֹּה.",       tr: "Ha-anashim po.",            es: "Las personas están aquí.", unlocksAtGroup: 10, gender: null },

  // ── Grupo 11+ ────────────────────────────────────────────────────────────
  { id: "s39", he: "אֲנִי אוֹכֵל הַיּוֹם.",  tr: "Ani ojel hayom.",           es: "Hoy como.",                 unlocksAtGroup: 11, gender: "ms" },
  { id: "s40", he: "אֲנִי לוֹמֵד עִבְרִית.", tr: "Ani lomed ivrit.",           es: "Aprendo hebreo.",           unlocksAtGroup: 11, gender: "ms" },
  { id: "s41", he: "הוּא עוֹבֵד הַרְבֵּה.",  tr: "Hu oved harbe.",             es: "Él trabaja mucho.",         unlocksAtGroup: 11, gender: null },
  { id: "s42", he: "אֲנַחְנוּ מְדַבְּרִים עִבְרִית.", tr: "Anajnu medabrim ivrit.", es: "Hablamos hebreo.",    unlocksAtGroup: 11, gender: "mp" },
  { id: "s43", he: "הִיא שׁוֹתָה עַכְשָׁו.", tr: "Hi shota axshav.",           es: "Ella bebe ahora.",          unlocksAtGroup: 11, gender: null },

  // ── Grupo 12+ ────────────────────────────────────────────────────────────
  { id: "s44", he: "כְּבָר אֲנִי יוֹדֵעַ.",  tr: "Kvar ani yodea.",           es: "Ya lo sé.",                 unlocksAtGroup: 12, gender: "ms" },
  { id: "s45", he: "אֶתְמוֹל הוּא בָּא.",    tr: "Etmol hu ba.",               es: "Ayer vino él.",             unlocksAtGroup: 12, gender: null },
  { id: "s46", he: "יֵשׁ לִי זְמַן הַיּוֹם.", tr: "Yesh li zman hayom.",       es: "Hoy tengo tiempo.",         unlocksAtGroup: 12, gender: null },
];
