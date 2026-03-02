export const storyCatalog = [
  {
    id: "midnight_encounter",
    title: "Midnight Encounter",
    subtitle: "Dark Romance • Psychological • 18+",
    cover: "midnight-cover.svg"
  },
  {
    id: "neon_refrain",
    title: "Neon Refrain",
    subtitle: "Sci-Fi Drama • Slow Burn • 18+",
    cover: "neon-cover.svg"
  },
  {
    id: "winter_letter",
    title: "Winter Letter",
    subtitle: "Mystery • Emotional • 18+",
    cover: "winter-cover.svg"
  },
  {
    id: "ember_afterglow",
    title: "Ember Afterglow",
    subtitle: "Urban Fantasy • Character Study • 18+",
    cover: "ember-cover.svg"
  }
];

export const stories = {
  midnight_encounter: {
    start: "intro",
    characters: ["luna", "mira"],
    names: {
      luna: "Luna",
      mira: "Mira"
    },
    scenes: {
      intro: {
        image: "midnight-cafe.svg",
        caption: "A quiet café humming under rainy midnight lights.",
        text: "Both Luna and Mira glance up as the door chime echoes. The night feels full of unfinished stories.",
        choices: [
          {
            text: "Sit beside Luna.",
            effects: { luna: 1 },
            next: "luna_scene"
          },
          {
            text: "Join Mira at the window.",
            effects: { mira: 1 },
            next: "mira_scene"
          }
        ]
      },
      luna_scene: {
        image: "luna-table.svg",
        caption: "Luna sketches constellations on a napkin.",
        text: "Luna smiles softly. \"You noticed the stars hiding in city lights too, didn't you?\"",
        choices: [
          {
            text: "Tell her her drawing feels alive.",
            effects: { luna: 1 },
            flags: { praisedLuna: true },
            next: "crossroads"
          },
          {
            text: "Ask where Mira went.",
            effects: { luna: -1, mira: 1 },
            next: "crossroads"
          }
        ]
      },
      mira_scene: {
        image: "mira-window.svg",
        caption: "Mira traces raindrops sliding down the glass.",
        text: "Mira keeps her voice calm. \"Most people avoid storms. You walked right into one.\"",
        choices: [
          {
            text: "Say storms make honest conversations.",
            effects: { mira: 1 },
            flags: { trustedMira: true },
            next: "crossroads"
          },
          {
            text: "Joke to lighten the mood.",
            effects: { mira: -1, luna: 1 },
            next: "crossroads"
          }
        ]
      },
      crossroads: {
        image: "crossroads.svg",
        caption: "Outside, neon reflects off the flooded street.",
        text: "The café closes early. Luna and Mira wait for your decision beneath one umbrella.",
        choices: [
          {
            text: "Walk Luna home through the old district.",
            condition: (state) => state.affection.luna >= 2,
            effects: { luna: 1 },
            next: "luna_ending"
          },
          {
            text: "Take the metro with Mira.",
            condition: (state) => state.affection.mira >= 2,
            effects: { mira: 1 },
            next: "mira_ending"
          },
          {
            text: "Invite both for one last rooftop view.",
            condition: (state) => state.flags.praisedLuna && state.flags.trustedMira,
            effects: { luna: 1, mira: 1 },
            next: "shared_ending"
          },
          {
            text: "Say goodnight and disappear into the rain.",
            next: "solo_ending"
          }
        ]
      },
      luna_ending: {
        image: "luna-ending.svg",
        caption: "Streetlights blur into soft gold.",
        text: "Luna hands you the napkin constellation. \"Keep this, so we don't lose tonight.\"",
        ending: true,
        choices: [{ text: "Return to catalog", next: null }]
      },
      mira_ending: {
        image: "mira-ending.svg",
        caption: "The metro car hums like a distant lullaby.",
        text: "Mira leans back and finally smiles. \"I think I can stop running now.\"",
        ending: true,
        choices: [{ text: "Return to catalog", next: null }]
      },
      shared_ending: {
        image: "shared-ending.svg",
        caption: "Three silhouettes framed by dawn.",
        text: "You watch the rain clear with Luna and Mira. Some stories don't choose one path—they grow into many.",
        ending: true,
        choices: [{ text: "Return to catalog", next: null }]
      },
      solo_ending: {
        image: "solo-ending.svg",
        caption: "The city swallows footsteps and secrets.",
        text: "You leave with a quiet heart, knowing the night still keeps names you may meet again.",
        ending: true,
        choices: [{ text: "Return to catalog", next: null }]
      }
    }
  }
};
