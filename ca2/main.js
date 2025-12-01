import {ShapeCard} from './shapecard.js';

/* Memory game custom element.
   Uses ShapeCard to build a board of flippable cards.
   The element has a single attribute:
      size="rows x columns"  e.g. size="3 x 4"
*/

class ShapeMemoryGame extends HTMLElement {

   static get observedAttributes() {
      return ["size"];
   }

   constructor() {
      super();
      this.firstCard = null;
      this.secondCard = null;
      this.clickCount = 0;
      this.matchedCards = 0;
      this.totalCards = 0;
      this.locked = false;
      this.infoElement = null;
      this.handleCardClick = this.handleCardClick.bind(this);
   }

   connectedCallback() {
      this.setupGame();
   }

   attributeChangedCallback(name, oldValue, newValue) {
      if (name === "size" && oldValue !== newValue && this.isConnected) {
         this.setupGame();
      }
   }

   setupGame() {
      const size = this.getAttribute("size") || "";
      const parts = size.split("x");
      const rows = parseInt(parts[0]);
      const cols = parts.length > 1 ? parseInt(parts[1]) : 0;

      if (!rows || !cols || (rows * cols) % 2 === 1) {
         this.innerHTML = "<p>Board size must be rows x columns with an even number of cards.</p>";
         return;
      }

      this.totalCards = rows * cols;
      const numPairs = this.totalCards / 2;

      // clear previous content
      this.innerHTML = "";

      // information area
      this.infoElement = document.createElement("p");
      this.infoElement.textContent = "Clicks: 0";
      this.appendChild(this.infoElement);

      // board container
      const board = document.createElement("div");
      board.className = "board";
      board.style.display = "grid";
      board.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      board.style.gap = "1em";
      this.appendChild(board);

      // fill board with pairs of random shape cards
      board.innerHTML = ShapeCard.getUniqueRandomCardsAsHTML(numPairs, true);

      // set up game state
      const cards = board.querySelectorAll("shape-card");
      cards.forEach(card => {
         card.matched = false;
         card.addEventListener("click", this.handleCardClick);
      });

      this.firstCard = null;
      this.secondCard = null;
      this.clickCount = 0;
      this.matchedCards = 0;
      this.locked = false;
   }

   handleCardClick(e) {
      const card = e.currentTarget;

      // ignore clicks while checking, or on the same card, or on matched/face-up cards
      if (this.locked || card === this.firstCard || card.matched || card.isFaceUp()) {
         return;
      }

      this.clickCount += 1;
      if (this.infoElement) {
         this.infoElement.textContent = "Clicks: " + this.clickCount;
      }

      card.flip();

      if (!this.firstCard) {
         this.firstCard = card;
         return;
      }

      this.secondCard = card;
      this.checkForMatch();
   }

   checkForMatch() {
      const first = this.firstCard;
      const second = this.secondCard;

      if (!first || !second) {
         return;
      }

      const sameType = first.getAttribute("type") === second.getAttribute("type");
      const sameColour = first.getAttribute("colour") === second.getAttribute("colour");

      if (sameType && sameColour) {
         // mark as matched; they will stay face up
         first.matched = true;
         second.matched = true;

         this.matchedCards += 2;
         this.firstCard = null;
         this.secondCard = null;

         if (this.matchedCards === this.totalCards && this.infoElement) {
            this.infoElement.textContent += " – Game completed!";
         }
      } else {
         // not a match: briefly show both, then flip them back
         this.locked = true;
         window.setTimeout(() => {
            first.flip();
            second.flip();
            this.firstCard = null;
            this.secondCard = null;
            this.locked = false;
         }, 1000);
      }
   }
}

customElements.define("shape-memory-game", ShapeMemoryGame);

