// COMP 2132 Final Project
// Erica Baartman
// March 28, 2026

const plantImage = document.getElementById("plant-image");
const gameStatus = document.getElementById("game-status");
const hintText = document.getElementById("hint-text");
const wordDisplay = document.getElementById("word-display");
const playAgainButton = document.getElementById("play-again-button");
const letterButtonsContainer = document.getElementById("letter-buttons");

const game = {
	wordList: [],
	currentWord: "",
	currentHint: "",
	guessedLetters: [],
	wrongGuesses: 0,
	maxWrongGuesses: 6,
	gameOver: false
};

loadWords();
playAgainButton.addEventListener("click", startNewGame);

function animatePlantImage() {
	plantImage.classList.remove("flash-plant-border");

	void plantImage.offsetWidth;

	plantImage.classList.add("flash-plant-border");
}

function loadWords() {
	fetch("json/words.json")
		.then(function(response) {
			if (response.ok !== true) {
				throw new Error("Could not load words.json");
			}
			return response.json();
		})
		.then(function(data) {
			game.wordList = data;
			createLetterButtons();
			startNewGame();
		})
		.catch(function(error) {
			console.log(error);
			hintText.textContent = "Could not load game words.";
			gameStatus.textContent = "Please check the JSON file path or run with Live Server.";
		});
}

function startNewGame() {
	if (game.wordList.length === 0) {
		return;
	}

	const randomIndex = Math.floor(Math.random() * game.wordList.length);
	const selectedWord = game.wordList[randomIndex];

	game.currentWord = selectedWord.word.toLowerCase();
	game.currentHint = selectedWord.hint;
	game.guessedLetters = [];
	game.wrongGuesses = 0;
	game.gameOver = false;

	hintText.textContent = game.currentHint;
	updatePlantImage();
	updateGameStatus();
	updateWordDisplay();
	enableAllLetterButtons();
}

function createLetterButtons() {
	let htmlOutput = "";

	for (let index = 65; index <= 90; index++) {
		const letter = String.fromCharCode(index);

		htmlOutput += `<button type="button" class="letter-button" data-letter="${letter.toLowerCase()}">${letter}</button>`;
	}

	letterButtonsContainer.innerHTML = htmlOutput;

	const letterButtons = document.querySelectorAll(".letter-button");

	letterButtons.forEach(function(button) {
		button.addEventListener("click", handleLetterGuess);
	});
}

function handleLetterGuess(event) {
	if (game.gameOver === true) {
		return;
	}

	const clickedButton = event.target;
	const guessedLetter = clickedButton.getAttribute("data-letter");

	clickedButton.disabled = true;
	game.guessedLetters.push(guessedLetter);

	if (game.currentWord.includes(guessedLetter)) {
		updateWordDisplay();
		checkForWin();

		if (game.gameOver === false) {
			updateGameStatus();
		}
	} else {
		game.wrongGuesses++;
		updateGameStatus();
		updatePlantImage(true);
		checkForLoss();
	}
}

function updateWordDisplay() {
	let displayString = "";

	for (let index = 0; index < game.currentWord.length; index++) {
		const currentLetter = game.currentWord[index];

		if (game.guessedLetters.includes(currentLetter)) {
			displayString += currentLetter.toUpperCase() + " ";
		} else {
			displayString += "_ ";
		}
	}

	wordDisplay.textContent = displayString.trim();
}

function updateGameStatus() {
	gameStatus.textContent = `Wrong guesses: ${game.wrongGuesses} / ${game.maxWrongGuesses}`;
}

function updatePlantImage(shouldAnimate = false) {
	const leavesRemaining = 6 - game.wrongGuesses;
	plantImage.setAttribute("src", `image/${leavesRemaining}_leaves.png`);
	plantImage.setAttribute("alt", `Plant with ${leavesRemaining} leaves remaining`);

	if (shouldAnimate === true) {
	animatePlantImage();
	}
}

function checkForWin() {
	let allLettersGuessed = true;

	for (let index = 0; index < game.currentWord.length; index++) {
		const currentLetter = game.currentWord[index];

		if (game.guessedLetters.includes(currentLetter) === false) {
			allLettersGuessed = false;
		}
	}

	if (allLettersGuessed === true) {
		game.gameOver = true;
		wordDisplay.textContent = game.currentWord.toUpperCase();
		gameStatus.textContent = "You won! You saved the plant.";
		disableAllLetterButtons();
	}
}

function checkForLoss() {
	if (game.wrongGuesses >= game.maxWrongGuesses) {
		game.gameOver = true;
		wordDisplay.textContent = game.currentWord.toUpperCase();
		gameStatus.textContent = `You lost! The word was ${game.currentWord.toUpperCase()}.`;
		disableAllLetterButtons();
	}
}

function disableAllLetterButtons() {
	const letterButtons = document.querySelectorAll(".letter-button");

	letterButtons.forEach(function(button) {
		button.disabled = true;
	});
}

function enableAllLetterButtons() {
	const letterButtons = document.querySelectorAll(".letter-button");

	letterButtons.forEach(function(button) {
		button.disabled = false;
	});
}