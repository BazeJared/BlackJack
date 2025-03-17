// Card and Deck Management
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    toString() {
        return `${this.value} of ${this.suit}`;
    }

    getNumericValue() {
        if (['J', 'Q', 'K'].includes(this.value)) return 10;
        if (this.value === 'A') return 11; // Ace will be handled specially in hand calculation
        return parseInt(this.value);
    }
}

class Deck {
    constructor() {
        this.reset();
    }

    reset() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.cards = [];
        for (const suit of suits) {
            for (const value of values) {
                this.cards.push(new Card(suit, value));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        return this.cards.pop();
    }
}

// Game State Management
class Game {
    constructor() {
        this.deck = new Deck();
        this.playerHand = [];
        this.dealerHand = [];
        this.gameOver = false;
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        document.querySelector('button[type="button"]:nth-child(1)').addEventListener('click', () => this.playerHit());
        document.querySelector('button[type="button"]:nth-child(2)').addEventListener('click', () => this.playerStand());
        document.querySelector('button[type="button"]:nth-child(3)').addEventListener('click', () => this.playerSplit());
        document.querySelector('.new-game').addEventListener('click', () => this.startNewGame());
    }

    startNewGame() {
        this.deck.reset();
        this.playerHand = [];
        this.dealerHand = [];
        this.gameOver = false;
        
        // Deal initial cards
        this.playerHand.push(this.deck.drawCard());
        this.dealerHand.push(this.deck.drawCard());
        this.playerHand.push(this.deck.drawCard());
        this.dealerHand.push(this.deck.drawCard());

        this.updateUI();
        this.updateButtonStates();
    }

    updateButtonStates() {
        const hitButton = document.querySelector('button[type="button"]:nth-child(1)');
        const standButton = document.querySelector('button[type="button"]:nth-child(2)');
        const splitButton = document.querySelector('button[type="button"]:nth-child(3)');
        
        hitButton.disabled = this.gameOver;
        standButton.disabled = this.gameOver;
        splitButton.disabled = this.gameOver;
    }

    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (const card of hand) {
            if (card.value === 'A') {
                aces++;
            } else {
                value += card.getNumericValue();
            }
        }

        // Handle aces
        for (let i = 0; i < aces; i++) {
            if (value + 11 <= 21) {
                value += 11;
            } else {
                value += 1;
            }
        }

        return value;
    }

    playerHit() {
        if (this.gameOver) return;
        
        this.playerHand.push(this.deck.drawCard());
        const playerValue = this.calculateHandValue(this.playerHand);
        
        if (playerValue > 21) {
            this.gameOver = true;
            alert('Bust! You went over 21!');
        }
        
        this.updateUI();
    }

    playerStand() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.dealerPlay();
        this.determineWinner();
    }

    playerSplit() {
        if (this.gameOver) return;
        
        const firstCard = this.playerHand[0];
        const secondCard = this.playerHand[1];
        
        if (firstCard.value === secondCard.value) {
            // Implement split logic here
            alert('Split functionality coming soon!');
        } else {
            alert('You can only split pairs!');
        }
    }

    dealerPlay() {
        while (this.calculateHandValue(this.dealerHand) < 17) {
            this.dealerHand.push(this.deck.drawCard());
        }
    }

    determineWinner() {
        const playerValue = this.calculateHandValue(this.playerHand);
        const dealerValue = this.calculateHandValue(this.dealerHand);
        
        let message = '';
        if (playerValue > 21) {
            message = 'Bust! You lose!';
        } else if (dealerValue > 21) {
            message = 'Dealer busts! You win!';
        } else if (playerValue > dealerValue) {
            message = 'You win!';
        } else if (playerValue < dealerValue) {
            message = 'Dealer wins!';
        } else {
            message = 'Push! It\'s a tie!';
        }
        
        alert(message);
    }

    updateUI() {
        // Update dealer's cards
        const dealerList = document.querySelector('.dealer-cards');
        dealerList.innerHTML = this.dealerHand.map(card => `<li>${card.toString()}</li>`).join('');

        // Update player's cards
        const playerList = document.querySelector('.player-cards');
        playerList.innerHTML = this.playerHand.map(card => `<li>${card.toString()}</li>`).join('');

        this.updateButtonStates();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 