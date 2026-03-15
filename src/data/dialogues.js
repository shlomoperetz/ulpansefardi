export const DIALOGUES = [
  {
    id: "intro",
    title: "הִתְכַּנְּסוּת",
    titleEs: "Presentación",
    unlocksAtGroup: 1,
    lines: [
      {
        speaker: "א",
        he: "שָׁלוֹם! מִי אַתָּה?",
        tr: "Shalom! Mi ata?",
        es: "¡Hola! ¿Quién eres?",
      },
      {
        speaker: "ב",
        he: "שָׁלוֹם! אֲנִי יוֹסֵף. אַתָּה מִי?",
        tr: "Shalom! Ani Yosef. Ata mi?",
        es: "¡Hola! Soy Yosef. ¿Y tú?",
      },
      {
        speaker: "א",
        he: "אֲנִי רָחֵל. אֵיפֹה אַתָּה?",
        tr: "Ani Rajel. Eyfo ata?",
        es: "Soy Rajel. ¿Dónde estás?",
      },
      {
        speaker: "ב",
        he: "אֲנִי פֹּה, בְּיִשְׂרָאֵל.",
        tr: "Ani po, be-Yisrael.",
        es: "Estoy aquí, en Israel.",
      },
    ],
    questions: [
      {
        q: "¿Cómo se llama el segundo hablante?",
        options: ["יוֹסֵף", "רָחֵל", "שָׁלוֹם", "יִשְׂרָאֵל"],
        answer: 0,
      },
      {
        q: "¿Dónde está el segundo hablante?",
        options: ["בְּמִצְרַיִם", "שָׁם", "בְּיִשְׂרָאֵל", "פֹּה וְשָׁם"],
        answer: 2,
      },
    ],
  },

  {
    id: "want-go",
    title: "לְאָן אַתָּה הוֹלֵךְ?",
    titleEs: "¿Adónde vas?",
    unlocksAtGroup: 3,
    lines: [
      {
        speaker: "א",
        he: "הַיּוֹם אֲנִי רוֹצֶה לָלֶכֶת לַשּׁוּק.",
        tr: "Hayom ani rotze lalechet la-shuk.",
        es: "Hoy quiero ir al mercado.",
      },
      {
        speaker: "ב",
        he: "גַּם אֲנִי רוֹצֶה לָלֶכֶת! אֵיפֹה הַשּׁוּק?",
        tr: "Gam ani rotze lalechet! Eyfo ha-shuk?",
        es: "¡Yo también quiero ir! ¿Dónde está el mercado?",
      },
      {
        speaker: "א",
        he: "הַשּׁוּק שָׁם, לֹא פֹּה.",
        tr: "Ha-shuk sham, lo po.",
        es: "El mercado está allí, no aquí.",
      },
      {
        speaker: "ב",
        he: "בְּסֵדֶר. מָתַי אַתָּה הוֹלֵךְ?",
        tr: "Beseder. Matai ata holej?",
        es: "De acuerdo. ¿Cuándo vas?",
      },
      {
        speaker: "א",
        he: "אֲנִי הוֹלֵךְ עַכְשָׁו. אַתָּה בָּא?",
        tr: "Ani holej axshav. Ata ba?",
        es: "Voy ahora. ¿Vienes tú?",
      },
      {
        speaker: "ב",
        he: "כֵּן! אֲנִי בָּא עִמְּךָ.",
        tr: "Ken! Ani ba imja.",
        es: "¡Sí! Voy contigo.",
      },
    ],
    questions: [
      {
        q: "¿Adónde quiere ir el primer hablante?",
        options: ["לַבַּיִת", "לַשּׁוּק", "לְיִשְׂרָאֵל", "לַעֲבוֹדָה"],
        answer: 1,
      },
      {
        q: "¿Cuándo va el primer hablante?",
        options: ["מָחָר", "הַיּוֹם בָּעֶרֶב", "עַכְשָׁו", "אֶתְמוֹל"],
        answer: 2,
      },
    ],
  },

  {
    id: "israel-talk",
    title: "עַל יִשְׂרָאֵל",
    titleEs: "Hablando de Israel",
    unlocksAtGroup: 6,
    lines: [
      {
        speaker: "א",
        he: "אַתָּה אוֹהֵב אֶת יִשְׂרָאֵל?",
        tr: "Ata ohev et Yisrael?",
        es: "¿Te gusta Israel?",
      },
      {
        speaker: "ב",
        he: "כֵּן, אֲנִי אוֹהֵב אֶת יִשְׂרָאֵל הַרְבֵּה.",
        tr: "Ken, ani ohev et Yisrael harbe.",
        es: "Sí, me gusta mucho Israel.",
      },
      {
        speaker: "א",
        he: "כַּמָּה זְמַן אַתָּה כָּאן?",
        tr: "Kama zman ata kan?",
        es: "¿Cuánto tiempo llevas aquí?",
      },
      {
        speaker: "ב",
        he: "אֲנִי כָּאן שָׁנָה. אֲנִי לוֹמֵד עִבְרִית.",
        tr: "Ani kan shana. Ani lomed ivrit.",
        es: "Llevo un año aquí. Estoy aprendiendo hebreo.",
      },
      {
        speaker: "א",
        he: "הָאֲנָשִׁים כָּאן מְדַבְּרִים הַרְבֵּה שָׂפוֹת.",
        tr: "Ha-anashim kan medabrim harbe safot.",
        es: "La gente aquí habla muchos idiomas.",
      },
      {
        speaker: "ב",
        he: "כֵּן, זֶה נֶחְמָד. אֲנִי אוֹהֵב אֶת הַשָּׂפָה הָעִבְרִית.",
        tr: "Ken, ze nejmad. Ani ohev et ha-safa ha-ivrit.",
        es: "Sí, eso es bonito. Me gusta el idioma hebreo.",
      },
    ],
    questions: [
      {
        q: "¿Cuánto tiempo lleva el segundo hablante en Israel?",
        options: ["חֹדֶשׁ", "שְׁנָתַיִם", "שָׁנָה", "יוֹם"],
        answer: 2,
      },
      {
        q: "¿Qué está haciendo el segundo hablante?",
        options: ["עוֹבֵד", "לוֹמֵד עִבְרִית", "הוֹלֵךְ לַשּׁוּק", "אוֹכֵל"],
        answer: 1,
      },
    ],
  },

  {
    id: "daily",
    title: "הַיּוֹם שֶׁלִּי",
    titleEs: "Mi día",
    unlocksAtGroup: 9,
    lines: [
      {
        speaker: "א",
        he: "מָה אַתָּה עוֹשֶׂה הַיּוֹם?",
        tr: "Ma ata ose hayom?",
        es: "¿Qué haces hoy?",
      },
      {
        speaker: "ב",
        he: "בַּבֹּקֶר אֲנִי שׁוֹתֶה קָפֶה וְאוֹכֵל.",
        tr: "Ba-boker ani shote kafe ve-ojel.",
        es: "Por la mañana bebo café y como.",
      },
      {
        speaker: "א",
        he: "אַתָּה עוֹבֵד הַיּוֹם?",
        tr: "Ata oved hayom?",
        es: "¿Trabajas hoy?",
      },
      {
        speaker: "ב",
        he: "כֵּן, אֲנִי עוֹבֵד כָּל הַיּוֹם.",
        tr: "Ken, ani oved kol ha-yom.",
        es: "Sí, trabajo todo el día.",
      },
      {
        speaker: "א",
        he: "אַתָּה לוֹמֵד עִבְרִית בָּעֶרֶב?",
        tr: "Ata lomed ivrit ba-erev?",
        es: "¿Estudias hebreo por la tarde?",
      },
      {
        speaker: "ב",
        he: "כֵּן! אֲנִי אוֹהֵב אֶת הַשָּׂפָה הָעִבְרִית.",
        tr: "Ken! Ani ohev et ha-safa ha-ivrit.",
        es: "¡Sí! Me gusta el idioma hebreo.",
      },
    ],
    questions: [
      {
        q: "¿Qué hace el segundo hablante por la mañana?",
        options: ["שׁוֹתֶה קָפֶה", "הוֹלֵךְ לַשּׁוּק", "לוֹמֵד עִבְרִית", "הוֹלֵךְ לִישׁוֹן"],
        answer: 0,
      },
      {
        q: "¿Por qué estudia hebreo el segundo hablante?",
        options: ["כִּי הוּא עוֹבֵד", "כִּי הוּא רוֹצֶה לָלֶכֶת", "כִּי הוּא אוֹהֵב אֶת הַשָּׂפָה", "כִּי יֵשׁ זְמַן"],
        answer: 2,
      },
    ],
  },
];
