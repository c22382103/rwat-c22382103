// game-element.js
// Memory game custom element that uses <shape-card> cards.

import { ShapeCard } from './shapecard.js';

class MemoryGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.rows = 0;
        this.cols = 0;
        this.totalPairs = 0;
        this.foundPairs = 0;
        this.clickCount = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.isChecking = false;
    }

    connectedCallback() {
        this.setupFromSizeAttribute();
        this.startNewGame();
    }

    setupFromSizeAttribute() {
        const sizeAttr = this.getAttribute('size') || '3x4';
        const parts = sizeAttr.split('x');

        const rows = parseInt(parts[0].trim(), 10);
        const cols = parseInt(parts[1].trim(), 10);

        this.rows = Number.isNaN(rows) ? 3 : rows;
        this.cols = Number.isNaN(cols) ? 4 : cols;
        this.totalPairs = (this.rows * this.cols) / 2;
    }

    startNewGame() {
        this.foundPairs = 0;
        this.clickCount = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.isChecking = false;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 20px;
                    box-sizing: border-box;
                }

                .header {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin-bottom: 20px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 1.8rem;
                }

                .clicks {
                    margin: 5px 0 0 0;
                    font-size: 1rem;
                }

                .board {
                    display: grid;
                    grid-template-columns: repeat(${this.cols}, auto);
                    gap: 10px;
                    justify-content: center;
                }

                .message-area {
                    margin-top: 20px;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    font-size: 1.1rem;
                }

                button {
                    margin-top: 10px;
                    padding: 6px 12px;
                    font-size: 1rem;
                    cursor: pointer;
                }
            </style>
            <div class="header">
                <h1>Memory Game</h1>
                <p class="clicks">Clicks: 0</p>
            </div>
            <div class="board"></div>
            <div class="message-area" aria-live="polite"></div>
        `;

        const board = this.shadowRoot.querySelector('.board');
        const messageArea = this.shadowRoot.querySelector('.message-area');
        messageArea.textContent = '';

        // Generate the HTML string for the cards: pairs of random shape-cards.
        const cardsHTML = ShapeCard.getUniqueRandomCardsAsHTML(this.totalPairs, true);
        board.innerHTML = cardsHTML;

        this.updateClickDisplay();
        this.setupCardClickHandling(board);
    }

    setupCardClickHandling(board) {
        board.addEventListener('click', (event) => {
            const card = event.target.closest('shape-card');

            if (!card) {
                return;
            }

            // Ignore clicks while checking or on already matched cards
            if (this.isChecking || card.dataset.matched === 'true') {
                return;
            }

            // Ignore clicks on a card that is already face up
            if (card.isFaceUp && card.isFaceUp()) {
                return;
            }

            card.flip();
            this.clickCount++;
            this.updateClickDisplay();

            if (!this.firstCard) {
                this.firstCard = card;
            } else if (!this.secondCard && card !== this.firstCard) {
                this.secondCard = card;
                this.isChecking = true;
                this.checkForMatch();
            }
        });
    }

    checkForMatch() {
        const first = this.firstCard;
        const second = this.secondCard;

        if (!first || !second) {
            this.resetSelection();
            this.isChecking = false;
            return;
        }

        const sameType = first.getAttribute('type') === second.getAttribute('type');
        const sameColour = first.getAttribute('colour') === second.getAttribute('colour');
        const isMatch = sameType && sameColour;

        if (isMatch) {
            first.dataset.matched = 'true';
            second.dataset.matched = 'true';

            this.foundPairs++;
            this.resetSelection();
            this.isChecking = false;

            if (this.foundPairs === this.totalPairs) {
                this.showGameCompletedMessage();
            }
        } else {
            // Flip the cards back after a short delay
            setTimeout(() => {
                first.flip();
                second.flip();
                this.resetSelection();
                this.isChecking = false;
            }, 800);
        }
    }

    resetSelection() {
        this.firstCard = null;
        this.secondCard = null;
    }

    updateClickDisplay() {
        const clicksElement = this.shadowRoot.querySelector('.clicks');
        if (clicksElement) {
            clicksElement.textContent = `Clicks: ${this.clickCount}`;
        }
    }

    showGameCompletedMessage() {
        const messageArea = this.shadowRoot.querySelector('.message-area');
        messageArea.textContent = `You completed the game in ${this.clickCount} clicks!`;

        const button = document.createElement('button');
        button.textContent = 'Play Again';
        button.addEventListener('click', () => this.startNewGame());
        messageArea.appendChild(document.createElement('br'));
        messageArea.appendChild(button);
    }
}

customElements.define('memory-game', MemoryGame);
