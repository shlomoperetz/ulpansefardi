export const MILESTONES = [
  { id: "egypt",   words: 0,   label: "יְצִיאַת מִצְרַיִם", sub: "Salida de Egipto",     icon: "🏕" },
  { id: "red-sea", words: 20,  label: "קְרִיעַת יַם סוּף",  sub: "Mar Rojo",              icon: "🌊" },
  { id: "manna",   words: 50,  label: "הַמָּן",              sub: "El Maná",               icon: "✨" },
  { id: "amalek",  words: 120, label: "עֲמָלֵק",             sub: "Batalla de Amalek",     icon: "⚔" },
  { id: "sinai",   words: 150, label: "הַר סִינַי",          sub: "El Sinaí",              icon: "⛰" },
  { id: "mishkan", words: 220, label: "הַמִּשְׁכָּן",         sub: "El Mishkan",            icon: "🕍" },
  { id: "calf",    words: 280, label: "הָעֵגֶל הַזָּהָב",    sub: "El Becerro de Oro",     icon: "🐂" },
  { id: "spies",   words: 400, label: "הַמְּרַגְּלִים",       sub: "Los Espías",            icon: "👁" },
  { id: "israel",  words: 500, label: "אֶרֶץ יִשְׂרָאֵל",    sub: "¡Llegada a Israel!",   icon: "🏙" },
];

export function getCurrentMilestone(masteredCount) {
  let current = MILESTONES[0];
  for (const m of MILESTONES) {
    if (masteredCount >= m.words) current = m;
    else break;
  }
  return current;
}

export function getNextMilestone(masteredCount) {
  for (const m of MILESTONES) {
    if (masteredCount < m.words) return m;
  }
  return null; // already at final milestone
}
