// Strip nikud (Hebrew vowel marks) from a string
export function stripNikud(str) {
  return str.replace(/[\u05B0-\u05C7]/g, "").trim();
}

// Calculate current mana of a word, applying decay for overdue reviews
export function getCardMana(wordData) {
  if (!wordData || wordData.mana === undefined) return 0;
  const today = new Date().toISOString().split("T")[0];
  const baseMana = wordData.mana;
  const dueDate = wordData.srsNextReview;
  if (!dueDate || today <= dueDate) return baseMana;
  const overdueDays = Math.ceil((new Date(today) - new Date(dueDate)) / 86400000);
  let decay = 0;
  if (overdueDays <= 2)       decay = overdueDays * 4;
  else if (overdueDays <= 6)  decay = 8 + (overdueDays - 2) * 8;
  else if (overdueDays <= 14) decay = 40 + (overdueDays - 6) * 14;
  else                        decay = 152 + (overdueDays - 14) * 20;
  return Math.max(5, baseMana - decay);
}

// Calculate active mana: weighted average of all unlocked words
export function getActiveMana(progress, words) {
  const unlocked = words.filter(w => progress.unlockedGroups.includes(w.group));
  if (unlocked.length === 0) return 100;
  const total = unlocked.reduce((sum, w) => sum + getCardMana(progress.words[w.id]), 0);
  return Math.round(total / unlocked.length);
}

// Count mastered words (mana >= 70 at any point, tracked via masteredAt)
export function getMasteredCount(progress) {
  return Object.values(progress.words).filter(w => w.masteredAt).length;
}

// Apply assessment result to a word's mana
// assessment: "know" | "partial" | "dont"
export function applyAssessment(wordData, assessment) {
  const now = new Date().toISOString().split("T")[0];
  const currentMana = getCardMana(wordData);
  let newMana = currentMana;
  let newData = { ...wordData, lastReviewed: now };

  if (assessment === "know") {
    if (currentMana < 25)      newMana = 25;
    else if (currentMana < 50) newMana = 50;
    else if (currentMana < 70) newMana = 70;
    else {
      // SRS review correct
      newMana = Math.min(100, currentMana + 12);
      // Update SRS interval
      const reps = (wordData.srsReps ?? 0) + 1;
      const ef   = wordData.srsEf ?? 2.5;
      const prevInt = wordData.srsInterval ?? 1;
      let interval;
      if (reps === 1)      interval = 1;
      else if (reps === 2) interval = 6;
      else                 interval = Math.round(prevInt * ef);
      const newEf = Math.max(1.3, ef + 0.1);
      const nextReview = new Date(Date.now() + interval * 86400000).toISOString().split("T")[0];
      newData = { ...newData, srsReps: reps, srsEf: newEf, srsInterval: interval, srsNextReview: nextReview };
    }
  } else if (assessment === "partial") {
    const bump = currentMana < 25 ? 15 : currentMana + 8;
    newMana = Math.max(5, Math.min(bump, currentMana + 8));
  } else { // dont
    newMana = Math.max(5, currentMana - 25);
    if (wordData.srsReps) {
      newData = { ...newData, srsReps: 0, srsInterval: 1, srsNextReview: now };
    }
  }

  newData.mana = newMana;
  if (newMana >= 70 && !wordData.masteredAt) {
    newData.masteredAt = now;
  }
  return newData;
}

// Check if a word is due for SRS review
export function isWordDue(wordData) {
  if (!wordData?.srsNextReview) return false;
  const today = new Date().toISOString().split("T")[0];
  return wordData.srsNextReview <= today && wordData.mana >= 70;
}

// Get words that need study today (due for review OR mana < 70 and not recently seen)
export function getStudyQueue(progress, words) {
  const today = new Date().toISOString().split("T")[0];
  return words
    .filter(w => progress.unlockedGroups.includes(w.group))
    .filter(w => {
      const wd = progress.words[w.id];
      if (!wd) return true; // never seen
      if (isWordDue(wd)) return true; // SRS due
      if (getCardMana(wd) < 70) {
        // Show again based on mana level
        const daysSince = wd.lastReviewed
          ? Math.ceil((new Date(today) - new Date(wd.lastReviewed)) / 86400000)
          : 999;
        const mana = getCardMana(wd);
        if (mana < 25)  return daysSince >= 1;
        if (mana < 50)  return daysSince >= 2;
        return daysSince >= 3;
      }
      return false;
    });
}
