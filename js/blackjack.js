const stand_btn = document.querySelector('#stand_btn');
const hit_btn = document.querySelector('#hit_btn');
const deal_btn = document.querySelector('#deal_btn');
const you_section = document.querySelector('#your-box');
const dealer_section = document.querySelector('#dealer-box');

// sounds
const win_sound = new Audio('./assets/sounds/cash.mp3');
const loss_sound = new Audio('./assets/sounds/aww.mp3');

let blackjack_assets = {
    you: { score: 0, scoreSpan: '#your-score' },
    dealer: { score: 0, scoreSpan: '#dealer-score' },
    cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, 'K', 'J', 'Q', 'A'],
    cardsMap: {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        K: 10,
        J: 10,
        Q: 10,
        A: [1, 11]
    },
    wins: 0,
    losses: 0,
    draws: 0,
    isStand: false,
    turnsOver: false
};

const YOU = blackjack_assets['you'];
const DEALER = blackjack_assets['dealer'];
let my_span = blackjack_assets.you.scoreSpan;
let dealer_span = blackjack_assets.dealer.scoreSpan;
let wins = blackjack_assets['wins'];
let losses = blackjack_assets['losses'];
let draws = blackjack_assets['draws'];

hit_btn.addEventListener('click', () => {
    // Hit btn shd only work when you haven't used stand yet
    if (blackjack_assets['isStand'] === false) {
        let card = randomCard();
        showCard(card, you_section, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
});

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjack_assets['cards'][randomIndex];
}

function showCard(card, section, activePlayer) {
    if (activePlayer['score'] <= 21) {
        const hit_sound = new Audio('./assets/sounds/swish.m4a');
        let cardImg = document.createElement('img');

        cardImg.src = `./assets/images/${card}.png`;
        cardImg.classList.add('card');

        section.appendChild(cardImg);
        hit_sound.play();
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        // If adding 11 keeps me below 21, add 11, otherwise add 1
        if (
            activePlayer['score'] + blackjack_assets['cardsMap'][card][1] <=
            21
        ) {
            activePlayer['score'] += blackjack_assets['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjack_assets['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjack_assets['cardsMap'][card];
    }
    console.log(activePlayer['score']);
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent =
            activePlayer['score'];
    }
}

// DEAL FUNCTION
deal_btn.addEventListener('click', () => {
    if (blackjack_assets.turnsOver === true) {
        //
        blackjack_assets.isStand = false;
        let your_images = you_section.querySelectorAll('img');
        let dealer_images = dealer_section.querySelectorAll('img');

        for (i = 0; i < your_images.length; i++) {
            your_images[i].remove();
        }

        for (i = 0; i < dealer_images.length; i++) {
            dealer_images[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector(my_span).textContent = '0';
        document.querySelector(dealer_span).textContent = '0';

        document.querySelector(my_span).style.color = '#fff'; // #fff : white
        document.querySelector(dealer_span).style.color = '#fff';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = '#000000';

        blackjack_assets.turnsOver = true;
    }
});

// ********Beginning of async await********
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjack_assets['isStand'] = true;

    //
    while (DEALER['score'] < 16 && blackjack_assets['isStand'] === true) {
        let card = randomCard();
        showCard(card, dealer_section, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjack_assets['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}
// ************End of async await **********

stand_btn.addEventListener('click', dealerLogic);

// Compute winner and return who just won
// Update the wins, draws and losses
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        // Condition: You have a higher score than the dealer or when dealer busts and you are 21 or under
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            wins += 1;
            winner = YOU;

            //
        } else if (YOU['score'] < DEALER['score']) {
            losses += 1;
            winner = DEALER;

            //
        } else if (YOU['score'] === DEALER['score']) {
            draws += 1;
        }

        //
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        losses += 1;
        winner = DEALER;

        //
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        draws += 1;
    }
    console.log(wins + ' wins');
    console.log(losses + ' losses');
    console.log(draws + ' draws');

    return winner;
}

function showResult(winner) {
    let message, message_color;
    let result_div = document.querySelector('#blackjack-result');

    if (blackjack_assets.turnsOver === true) {
        // Results_table
        if (winner === YOU) {
            message = 'You Win!';
            message_color = 'green';
            win_sound.play();
            document.querySelector('#wins').textContent = wins;

            //
        } else if (winner === DEALER) {
            message = 'You lose!';
            message_color = 'red';
            loss_sound.play();
            document.querySelector('#losses').textContent = losses;

            //
        } else {
            message = 'DRAW';
            message_color = 'orangered';
            document.querySelector('#draws').textContent = draws;
        }

        result_div.textContent = message;
        result_div.style.color = message_color;
    }
}

//  Stopped at 06:57:00 : JavaScript tutorial
