// Frases de ejemplo que aparecen al completar cada lote clave.
// Solo se muestran para leer — no para escribir.
// Usan únicamente vocabulario de las capas ya completadas.

export const FRASES_POR_LOTE = {

  // ── Lote 2 — Demostrativos (פֹּה שָׁם זֶה זֹאת כֵּן לֹא) ─────────────────
  // Solo conocen pronombres + demostrativos → frases locativas muy simples
  2: [
    { he: "הוּא פֹּה",    tr: "hu po",      es: "él está aquí" },
    { he: "הִיא שָׁם",    tr: "hi sham",    es: "ella está allí" },
    { he: "זֶה כֵּן",     tr: "ze ken",     es: "esto sí" },
    { he: "זֹאת לֹא",     tr: "zot lo",     es: "esto no" },
    { he: "אֲנִי פֹּה",   tr: "ani po",     es: "yo estoy aquí" },
  ],

  // ── Lote 3 — Verbos ancla ────────────────────────────────────────────────
  3: [
    { he: "אֲנִי רוֹצֶה לִלְמֹד",       tr: "ani rotze lilmod",       es: "yo quiero estudiar" },
    { he: "הוּא יוֹדֵעַ",               tr: "hu yodea",               es: "él sabe" },
    { he: "אַתָּה הוֹלֵךְ שָׁם",         tr: "ata holex sham",         es: "tú vas allí" },
    { he: "אֲנִי אוֹהֵב לִהְיוֹת פֹּה", tr: "ani ohev lihiot po",     es: "me gusta estar aquí" },
  ],

  // ── Lote 4 — Sustantivos ─────────────────────────────────────────────────
  4: [
    { he: "אֲנִי רוֹצֶה מַיִם",              tr: "ani rotze maim",              es: "yo quiero agua" },
    { he: "הוּא אוֹהֵב אֹכֶל",              tr: "hu ohev ojel",                es: "él ama la comida" },
    { he: "הַבַּיִת שָׁם",                   tr: "habayt sham",                 es: "la casa está allí" },
    { he: "יֵשׁ זְמַן",                      tr: "yesh zman",                   es: "hay tiempo" },
    { he: "אֲנִי רוֹצֶה לָלֶכֶת לַבַּיִת", tr: "ani rotze lalechet labayt",   es: "quiero ir a casa" },
  ],

  // ── Lote 5 — Conectores ──────────────────────────────────────────────────
  5: [
    { he: "אֲנִי רוֹצֶה אֹכֶל וּמַיִם",      tr: "ani rotze ojel umaim",       es: "quiero comida y agua" },
    { he: "הוּא הוֹלֵךְ אֲבָל אֲנִי לֹא",   tr: "hu holex aval ani lo",       es: "él va pero yo no" },
    { he: "אֲנִי רוֹצֶה רַק מַיִם",          tr: "ani rotze rak maim",         es: "solo quiero agua" },
    { he: "הִיא יוֹדַעַת כִּי הוּא שָׁם",   tr: "hi yodaat ki hu sham",       es: "ella sabe que él está allí" },
    { he: "אֲנִי לוֹמֵד גַּם עִם אֲנַחְנוּ", tr: "ani lomed gam im anajnu",   es: "yo también estudio con nosotros" },
  ],

  // ── Lote 6 — Verbos vida básica ──────────────────────────────────────────
  6: [
    { he: "אֲנִי אוֹכֵל פֹּה",        tr: "ani ojel po",        es: "yo como aquí" },
    { he: "הִיא שׁוֹתָה מַיִם",       tr: "hi shota maim",      es: "ella bebe agua" },
    { he: "אֲנַחְנוּ גָּרִים שָׁם",   tr: "anajnu garim sham",  es: "nosotros vivimos allí" },
    { he: "הוּא בָּא",                tr: "hu ba",               es: "él viene" },
    { he: "אַתָּה לוֹמֵד",            tr: "ata lomed",           es: "tú estudias" },
  ],

  // ── Lote 7 — Verbos movimiento ───────────────────────────────────────────
  7: [
    { he: "הִיא חוֹזֶרֶת",        tr: "hi jozeret",     es: "ella vuelve" },
    { he: "הוּא קָם",             tr: "hu kam",         es: "él se levanta" },
    { he: "אֲנִי קוֹרֵא",         tr: "ani kore",       es: "yo leo" },
    { he: "הִיא כּוֹתֶבֶת",       tr: "hi kotevet",     es: "ella escribe" },
    { he: "הוּא מַגִּיעַ שָׁם",   tr: "hu magia sham",  es: "él llega allí" },
  ],

  // ── Lote 8 — Verbos comunicación ─────────────────────────────────────────
  8: [
    { he: "הוּא מְדַבֵּר",              tr: "hu medaber",          es: "él habla" },
    { he: "אֲנִי רוֹאֶה זֶה",          tr: "ani roe ze",           es: "yo veo esto" },
    { he: "אַתָּה מֵבִין",              tr: "ata mevin",            es: "tú entiendes" },
    { he: "אֲנִי רוֹצֶה לַעֲשׂוֹת זֶה", tr: "ani rotze laasot ze",  es: "yo quiero hacer esto" },
    { he: "הוּא מִסְתַּכֵּל שָׁם",     tr: "hu mistakel sham",     es: "él mira allí" },
  ],

  // ── Lote 9 — Verbos cotidiano (conocer, sentir, empezar, continuar, parar, pagar) ──
  9: [
    { he: "אֲנִי מַכִּיר אוֹתְךָ",      tr: "ani makir otja",        es: "yo te conozco" },
    { he: "הִיא מַרְגִּישָׁה טוֹב",     tr: "hi margisha tov",        es: "ella se siente bien" },
    { he: "הוּא מַתְחִיל לִלְמוֹד",     tr: "hu matchil lilmod",      es: "él empieza a estudiar" },
    { he: "אֲנִי מַמְשִׁיךְ לִקְרוֹא",  tr: "ani mamshij likro",      es: "yo continúo leyendo" },
    { he: "הִיא מַפְסִיקָה",            tr: "hi mafsika",             es: "ella para" },
    { he: "אֲנִי מְשַׁלֵּם פֹּה",       tr: "ani meshalam po",        es: "yo pago aquí" },
  ],

  // ── Lote 10 — Verbos rutina (ducharse, vestirse, despertarse, dormirse, rezar, esperar) ──
  10: [
    { he: "הוּא מִתְעוֹרֵר",                  tr: "hu mitorer",                  es: "él se despierta" },
    { he: "הִיא מִתְלַבֶּשֶׁת",               tr: "hi mitlabéshet",              es: "ella se viste" },
    { he: "אֲנִי מִתְפַּלֵּל פֹּה",           tr: "ani mitpalel po",             es: "yo rezo aquí" },
    { he: "הוּא נִרְדָּם",                     tr: "hu nirdam",                   es: "él se duerme" },
    { he: "אֲנִי מְחַכֶּה",                    tr: "ani mejake",                  es: "yo espero" },
    { he: "הִיא מִתְקַלַּחַת בַּבַּיִת",      tr: "hi mitkalajet babayt",        es: "ella se ducha en casa" },
  ],

  // ── Lote 11 — Adj emociones ──────────────────────────────────────────────
  11: [
    { he: "הִיא שְׂמֵחָה",        tr: "hi smeja",       es: "ella está feliz" },
    { he: "הוּא חָזָק",           tr: "hu jazak",       es: "él es fuerte" },
    { he: "הַבַּיִת קָרוֹב",      tr: "habayt karov",   es: "la casa está cerca" },
    { he: "הִיא עֲצוּבָה",        tr: "hi atzuba",      es: "ella está triste" },
  ],

  // ── Lote 12 — Adj estado 1 (viejo, nuevo, dormido/a/os/as) ───────────────
  12: [
    { he: "הַבַּיִת חָדָשׁ",      tr: "habayt jadash",   es: "la casa es nueva" },
    { he: "הוּא יָשֵׁן",          tr: "hu yashen",       es: "él está dormido" },
    { he: "הִיא יְשֵׁנָה",        tr: "hi yeshena",      es: "ella está dormida" },
    { he: "הַבַּיִת יָשָׁן",      tr: "habayt yashan",   es: "la casa es vieja" },
    { he: "אֲנַחְנוּ יְשֵׁנִים",  tr: "anajnu yeshenim", es: "nosotros estamos dormidos" },
  ],

  // ── Lote 13 — Adj estado 2 (despierto/a, libre, ocupado) ─────────────────
  13: [
    { he: "הוּא עֵר",           tr: "hu er",          es: "él está despierto" },
    { he: "הִיא עֵרָה",         tr: "hi era",         es: "ella está despierta" },
    { he: "אֲנִי פָּנוּי",       tr: "ani panuy",      es: "yo estoy libre" },
    { he: "הוּא עָסוּק",         tr: "hu asuk",        es: "él está ocupado" },
    { he: "אַתָּה עֵר וְאֲנִי עָסוּק", tr: "ata er veani asuk", es: "tú estás despierto y yo ocupado" },
  ],

  // ── Lote 14 — Adj descripción 1 (interesante, aburrido, bajo, alto, religioso, laico, limpio) ──
  14: [
    { he: "זֶה מְעַנְיֵן",        tr: "ze meanyen",      es: "esto es interesante" },
    { he: "הוּא גָּבוֹהַ",        tr: "hu gavoha",       es: "él es alto" },
    { he: "הַבַּיִת נָקִי",       tr: "habayt naki",     es: "la casa está limpia" },
    { he: "הוּא דָּתִי",          tr: "hu dati",         es: "él es religioso" },
    { he: "זֶה מְשַׁעֲמֵם",       tr: "ze meshaamen",    es: "esto es aburrido" },
    { he: "הִיא חִילוֹנִית",      tr: "hi jilonet",      es: "ella es laica" },
  ],

  // ── Lote 15 — Adj descripción 2 (sucio, corto, largo, hambriento, saciado, mayor, joven) ──
  15: [
    { he: "אֲנִי רָעֵב",          tr: "ani raev",          es: "yo tengo hambre" },
    { he: "הוּא צָעִיר",          tr: "hu tzair",          es: "él es joven" },
    { he: "אֲנִי שָׂבֵעַ",        tr: "ani savea",         es: "yo estoy saciado" },
    { he: "הַיּוֹם אָרוֹךְ",      tr: "hayom arok",        es: "el día es largo" },
    { he: "הַזְּמַן קָצָר",       tr: "hazman katzar",     es: "el tiempo es corto" },
    { he: "הוּא מְבוּגָר אֲבָל הִיא צָעִירָה", tr: "hu mevugar aval hi tzeira", es: "él es mayor pero ella es joven" },
  ],

};
