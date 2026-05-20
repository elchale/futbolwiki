/**
 * Career-aggregate stats per player, used when seeding their current
 * PlayerTeamStint so the stats panel and cards have data to display.
 * Approximate, sourced from public records.
 */
export const PLAYER_STINT_STATS: Record<
  string,
  { appearances?: number; goals?: number; assists?: number }
> = {
  // Liga 1 / Selección Peruana
  "paolo-guerrero": { appearances: 380, goals: 178, assists: 65 },
  "hernan-barcos": { appearances: 380, goals: 130, assists: 50 },
  "kevin-quevedo": { appearances: 140, goals: 32, assists: 18 },
  "rodrigo-urena": { appearances: 290, goals: 8, assists: 22 },
  "alex-valera": { appearances: 140, goals: 60, assists: 14 },
  "edison-flores": { appearances: 270, goals: 64, assists: 30 },
  "yoshimar-yotun": { appearances: 380, goals: 24, assists: 60 },
  "martin-cauteruccio": { appearances: 360, goals: 165, assists: 35 },
  "joao-grimaldo": { appearances: 50, goals: 9, assists: 8 },
  "christian-cueva": { appearances: 290, goals: 60, assists: 70 },
  "luis-advincula": { appearances: 350, goals: 25, assists: 30 },
  "andre-carrillo": { appearances: 340, goals: 50, assists: 50 },
  "pedro-gallese": { appearances: 250, goals: 0, assists: 1 },
  "renato-tapia": { appearances: 220, goals: 9, assists: 12 },
  "gianluca-lapadula": { appearances: 320, goals: 110, assists: 30 },
  "oliver-sonne": { appearances: 75, goals: 4, assists: 7 },
  // European stars
  "vinicius-junior": { appearances: 270, goals: 110, assists: 95 },
  "jude-bellingham": { appearances: 230, goals: 60, assists: 50 },
  "kylian-mbappe": { appearances: 460, goals: 320, assists: 130 },
  "lamine-yamal": { appearances: 95, goals: 25, assists: 35 },
  "pedri": { appearances: 175, goals: 22, assists: 28 },
  "robert-lewandowski": { appearances: 720, goals: 565, assists: 130 },
  "antoine-griezmann": { appearances: 700, goals: 290, assists: 180 },
  "julian-alvarez": { appearances: 280, goals: 105, assists: 35 },
  "erling-haaland": { appearances: 290, goals: 280, assists: 50 },
  "phil-foden": { appearances: 305, goals: 75, assists: 60 },
  "rodri": { appearances: 380, goals: 30, assists: 30 },
  "mohamed-salah": { appearances: 620, goals: 340, assists: 130 },
  "virgil-van-dijk": { appearances: 580, goals: 45, assists: 15 },
  "bruno-fernandes": { appearances: 560, goals: 175, assists: 165 },
  "bukayo-saka": { appearances: 270, goals: 70, assists: 70 },
  "martin-odegaard": { appearances: 310, goals: 60, assists: 70 },
  "harry-kane": { appearances: 660, goals: 460, assists: 110 },
  "jamal-musiala": { appearances: 180, goals: 50, assists: 35 },
  "ousmane-dembele": { appearances: 410, goals: 110, assists: 95 },
  "dusan-vlahovic": { appearances: 320, goals: 145, assists: 25 },
};
