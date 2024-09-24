// Configuration variables
const TYPING_SPEED = 2000 / 27; // Speed for typing effect (milliseconds per character)
const BACKSPACE_SPEED = 2000 / 40; // Speed for backspace effect (milliseconds per character)
const MISTYPE_PROBABILITY = 0.25; // Probability of mistyping a character
const VOWEL_MISTYPE_PROBABILITY = 0.35; // Higher probability for vowels
const MISTYPE_PAUSE = 400; // Pause duration on mistype (milliseconds)

// Fetch haiku lines from JSON file
async function fetchHaikuLines() {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';
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
    } finally {
        loadingIndicator.style.display = 'none';
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

// Keyboard neighbors for mistyping effect
const keyboardNeighbors = {
    'a': ['q', 'w', 's', 'z'],
    'b': ['v', 'g', 'h', 'n'],
    'c': ['x', 'd', 'f', 'v'],
    'd': ['s', 'e', 'r', 'f', 'c', 'x'],
    'e': ['w', 's', 'd', 'r', '3', '4'],
    'f': ['d', 'r', 't', 'g', 'v', 'c'],
    'g': ['f', 't', 'y', 'h', 'b', 'v'],
    'h': ['g', 'y', 'u', 'j', 'n', 'b'],
    'i': ['u', 'j', 'k', 'o'],
    'j': ['h', 'u', 'i', 'k', 'm', 'n'],
    'k': ['j', 'i', 'o', 'l', 'm'],
    'l': ['k', 'o', 'p'],
    'm': ['n', 'j', 'k'],
    'n': ['b', 'h', 'j', 'm'],
    'o': ['i', 'k', 'l', 'p'],
    'p': ['o', 'l', 'å', 'ø', 'æ', '0', '+'],
    'q': ['a', 'w', '1'],
    'r': ['e', 'd', 'f', 't', '4', '5'],
    's': ['a', 'w', 'e', 'd', 'x', 'z'],
    't': ['r', 'f', 'g', 'y'],
    'u': ['y', 'h', 'j', 'i'],
    'v': ['c', 'f', 'g', 'b'],
    'w': ['q', 'a', 's', 'e', '2', '3'],
    'x': ['z', 's', 'd', 'c'],
    'y': ['t', 'g', 'h', 'u'],
    'z': ['a', 's', 'x', '<'],
    'å': ['p', '¨', 'ø', 'æ'],
    'ø': ['l', 'p', 'æ', '.'],
    'æ': ['ø', 'å', '@', '-']
};

// Get a neighboring key for mistyping effect
function getNeighboringKey(char) {
    const neighbors = keyboardNeighbors[char.toLowerCase()];
    return neighbors ? getRandomElement(neighbors) : char;
}

// Function to determine if a character is a vowel
function isVowel(char) {
    return 'aeiou'.includes(char.toLowerCase());
}

// Typewriter effect with enhanced mistyping logic
async function typeWriterEffect(element, text, speed) {
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

        let mistypeProbability = isVowel(char) ? VOWEL_MISTYPE_PROBABILITY : MISTYPE_PROBABILITY;

        if (Math.random() < mistypeProbability && char !== ' ' && char !== '\n') {
            // Mistype a letter with a neighboring key
            let wrongChar = getNeighboringKey(char);
            let mistypedSpan = document.createElement('span');
            mistypedSpan.className = 'mistyped';
            mistypedSpan.textContent = wrongChar;
            wordSpan.appendChild(mistypedSpan);
            await sleep(MISTYPE_PAUSE); // Pause on mistype
            // Backspace
            mistypedSpan.remove();
            await sleep(speed);
            word = word.slice(0, -1); // Remove the wrong character from the word
        }

        wordSpan.append(char);
        await sleep(speed);

        if (char === ' ' || char === '\n') {
            word = ''; // Reset word on space or newline
            wordSpan = document.createElement('span');
            element.insertBefore(wordSpan, cursor);
        }
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

    const line1 = getRandomElement(fiveSyllablePhrases);
    const line2 = getRandomElement(sevenSyllablePhrases);
    const line3 = getRandomElement(fiveSyllablePhrases);

    const haiku = `${line1}\n${line2}\n${line3}`;
    await typeWriterEffect(haikuElement, haiku, TYPING_SPEED); // Use configurable typing speed
}

// Add event listener to generate haiku on button click
document.getElementById('generate-button').addEventListener('click', generateHaiku);