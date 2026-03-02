import { storyCatalog, stories } from "./scenes.js";

const MAX_HEARTS = 5;
const DEFAULT_TYPE_SPEED = 24;

const state = {
  storyId: null,
  story: null,
  sceneId: null,
  scene: null,
  affection: {},
  flags: {},
  isTyping: false,
  typingTimer: null,
  typeSpeed: DEFAULT_TYPE_SPEED,
  textBuffer: ""
};

const elements = {};

function setupCatalogPage() {
  const storyGrid = document.getElementById("story-grid");
  if (!storyGrid) return;

  storyGrid.innerHTML = "";

  storyCatalog.forEach((story) => {
    const card = document.createElement("article");
    card.className = "story-card";
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="story-cover-wrap">
        <img class="story-cover" src="assets/images/${story.cover}" alt="${story.title} cover">
      </div>
      <div class="story-meta">
        <h2>${story.title}</h2>
        <p>${story.subtitle}</p>
      </div>
    `;

    const openStory = () => {
      window.location.href = `game.html?story=${encodeURIComponent(story.id)}`;
    };

    card.addEventListener("click", openStory);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openStory();
      }
    });

    storyGrid.appendChild(card);
  });
}

function setupGamePage() {
  elements.imageContainer = document.getElementById("scene-image-container");
  elements.sceneImage = document.getElementById("scene-image");
  elements.sceneCaption = document.getElementById("scene-caption");
  elements.dialogueBox = document.getElementById("dialogue-box");
  elements.choiceContainer = document.getElementById("choice-container");
  elements.hud = document.getElementById("hud");

  if (!elements.sceneImage || !elements.choiceContainer) return;

  const params = new URLSearchParams(window.location.search);
  const requestedStoryId = params.get("story") || storyCatalog[0]?.id;
  const selectedStory = stories[requestedStoryId];

  if (!selectedStory) {
    elements.dialogueBox.textContent = "Story not found. Returning to catalog...";
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
    return;
  }

  state.storyId = requestedStoryId;
  state.story = selectedStory;
  state.sceneId = selectedStory.start;
  state.flags = {};
  state.affection = Object.fromEntries(selectedStory.characters.map((name) => [name, 0]));

  elements.imageContainer.addEventListener("click", () => {
    if (state.isTyping) {
      finishTypingImmediately();
    }
  });

  renderScene();
}

function finishTypingImmediately() {
  cleanupTyping();
  elements.dialogueBox.textContent = state.textBuffer;
  renderChoices();
}

function cleanupTyping() {
  state.isTyping = false;
  if (state.typingTimer) {
    window.clearInterval(state.typingTimer);
    state.typingTimer = null;
  }
}

function renderScene() {
  cleanupTyping();

  const currentScene = state.story.scenes[state.sceneId];
  state.scene = currentScene;

  if (!currentScene) {
    elements.dialogueBox.textContent = "Missing scene data.";
    elements.choiceContainer.innerHTML = "";
    return;
  }

  elements.choiceContainer.innerHTML = "";
  elements.dialogueBox.textContent = "";
  elements.sceneCaption.textContent = currentScene.caption || "";

  elements.sceneImage.classList.remove("is-visible");
  const source = `assets/images/${currentScene.image}`;
  elements.sceneImage.src = source;
  elements.sceneImage.alt = currentScene.caption || "Visual novel scene";

  window.requestAnimationFrame(() => {
    elements.sceneImage.classList.add("is-visible");
  });

  updateHearts();
  typeText(currentScene.text || "", state.typeSpeed);
}

function typeText(text, speed) {
  state.textBuffer = text;
  elements.dialogueBox.textContent = "";
  state.isTyping = true;

  let index = 0;
  state.typingTimer = window.setInterval(() => {
    index += 1;
    elements.dialogueBox.textContent = text.slice(0, index);

    if (index >= text.length) {
      cleanupTyping();
      renderChoices();
    }
  }, speed);
}

function getAvailableChoices() {
  const rawChoices = state.scene?.choices || [];
  return rawChoices.filter((choice) => {
    if (typeof choice.condition === "function") {
      return Boolean(choice.condition(state));
    }
    return true;
  });
}

function renderChoices() {
  elements.choiceContainer.innerHTML = "";

  const choices = getAvailableChoices();
  if (!choices.length) {
    const fallbackButton = document.createElement("button");
    fallbackButton.className = "choice-button";
    fallbackButton.textContent = "Return to catalog";
    fallbackButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
    elements.choiceContainer.appendChild(fallbackButton);
    return;
  }

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = choice.text;
    button.disabled = state.isTyping;

    button.addEventListener("click", () => {
      if (state.isTyping) return;
      applyChoice(choice);
    });

    elements.choiceContainer.appendChild(button);
  });
}

function applyChoice(choice) {
  if (choice.effects) {
    Object.entries(choice.effects).forEach(([character, amount]) => {
      const current = state.affection[character] || 0;
      state.affection[character] = Math.max(0, Math.min(MAX_HEARTS, current + amount));
    });
  }

  if (choice.flags) {
    Object.entries(choice.flags).forEach(([key, value]) => {
      state.flags[key] = value;
    });
  }

  updateHearts();

  if (!choice.next) {
    window.location.href = "index.html";
    return;
  }

  state.sceneId = choice.next;
  renderScene();
}

function updateHearts() {
  if (!elements.hud || !state.story) return;

  const rows = state.story.characters
    .map((characterKey) => {
      const displayName = state.story.names?.[characterKey] || characterKey;
      const filledCount = Math.max(0, Math.min(MAX_HEARTS, state.affection[characterKey] || 0));
      const emptyCount = MAX_HEARTS - filledCount;
      const hearts = "❤️".repeat(filledCount) + "🖤".repeat(emptyCount);
      return `<div class="hud-row"><span class="hud-name">${displayName}</span><span class="hud-hearts">${hearts}</span></div>`;
    })
    .join("");

  elements.hud.innerHTML = `
    <h3 class="hud-title">Affection HUD</h3>
    <div class="hud-rows">${rows}</div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "catalog") {
    setupCatalogPage();
  }

  if (page === "game") {
    setupGamePage();
  }
});
