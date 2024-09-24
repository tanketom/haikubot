// Configuration variables
const TYPING_SPEED = 2000 / 27; // Speed for typing effect (milliseconds per character)
const BACKSPACE_SPEED = 2000 / 40; // Speed for backspace effect (milliseconds per character)
const MISTYPE_PROBABILITY = 0.25; // Probability of mistyping a character
const MISTYPE_PAUSE = 400; // Pause duration on mistype (milliseconds)

// Fetch haiku lines from JSON file
async function fetchHaikuLines() {
    try {
        const response = await fetch('haikuLines.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch haiku lines:', error);
        return null;
    }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Get a neighboring key for mistyping effect
function getNeighboringKey(char) {
    const neighbors = keyboardNeighbors[char.toLowerCase()];
    return neighbors ? getRandomElement(neighbors) : char;
}

// Typewriter effect with mistyping
async function typeWriterEffect(element, text, speed, validWords) {
    element.innerHTML = '';
    let cursor = document.createElement('span');
    cursor.id = 'caret';
    element.appendChild(cursor);

    let word = '';
    let wordSpan = document.createElement('span');
    element.insertBefore(wordSpan, cursor);

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        word += char;

        if (Math.random() < MISTYPE_PROBABILITY && char !== ' ' && char !== '\n') {
            // Mistype a letter with a neighboring key
            let wrongChar = getNeighboringKey(char);
            word = word.slice(0, -1) + wrongChar;
            wordSpan.className = 'mistyped';
            wordSpan.textContent = word;
            await sleep(MISTYPE_PAUSE); // Pause on mistype
            // Backspace
            word = word.slice(0, -1); // Remove the wrong character from the word
            wordSpan.textContent = word;
            await sleep(speed);
        }

        wordSpan.append(char);
        await sleep(speed);

        if (char === ' ' || char === '\n') {
            // Check if the word is valid
            if (!validWords.includes(word.trim())) {
                wordSpan.className = 'mistyped';
            } else {
                wordSpan.className = '';
            }
            word = ''; // Reset word on space or newline
            wordSpan = document.createElement('span');
            element.insertBefore(wordSpan, cursor);
        }
    }

    // Final word check
    if (!validWords.includes(word.trim())) {
        wordSpan.className = 'mistyped';
    } else {
        wordSpan.className = '';
    }
}

// Backspace effect
async function backspaceEffect(element, speed) {
    let text = element.innerText;
    const cursor = document.getElementById('caret');
    while (text.length > 0) {
        text = text.slice(0, -1);
        element.innerText = text;
        element.appendChild(cursor); // Ensure caret is visible
        await sleep(speed);
    }
}

// Generate a haiku and display it with typewriter effect
async function generateHaiku() {
    const haikuElement = document.getElementById('haiku');
    const cursor = document.createElement('span');
    cursor.id = 'caret';
    haikuElement.appendChild(cursor); // Ensure caret is visible before generating poem

    if (haikuElement.innerText.trim() !== '') {
        await backspaceEffect(haikuElement, BACKSPACE_SPEED); // Backspace existing poem
    }

    const haikuLines = await fetchHaikuLines();
    if (!haikuLines) {
        haikuElement.innerHTML = 'Failed to load haiku lines. Please try again later.';
        return;
    }

    const fiveSyllablePhrases = haikuLines.fiveSyllablePhrases;
    const sevenSyllablePhrases = haikuLines.sevenSyllablePhrases;

    const validWords = [...fiveSyllablePhrases, ...sevenSyllablePhrases].flatMap(phrase => phrase.split(' '));

    const line1 = getRandomElement(fiveSyllablePhrases);
    const line2 = getRandomElement(sevenSyllablePhrases);
    const line3 = getRandomElement(fiveSyllablePhrases);

    const haiku = `${line1}\n${line2}\n${line3}`;
    await typeWriterEffect(haikuElement, haiku, TYPING_SPEED, validWords); // Use configurable typing speed
}

// Add event listener to generate haiku on button click
document.getElementById('generate-button').addEventListener('click', generateHaiku);
