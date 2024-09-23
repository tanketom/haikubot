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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const keyboardNeighbors = {
    'a': ['q', 'w', 's', 'z'],
    'b': ['v', 'g', 'h', 'n'],
    'c': ['x', 'd', 'f', 'v'],
    'd': ['s', 'e', 'r', 'f', 'c', 'x'],
    'e': ['w', 's', 'd', 'r'],
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
    'p': ['o', 'l'],
    'q': ['a', 'w'],
    'r': ['e', 'd', 'f', 't'],
    's': ['a', 'w', 'e', 'd', 'x', 'z'],
    't': ['r', 'f', 'g', 'y'],
    'u': ['y', 'h', 'j', 'i'],
    'v': ['c', 'f', 'g', 'b'],
    'w': ['q', 'a', 's', 'e'],
    'x': ['z', 's', 'd', 'c'],
    'y': ['t', 'g', 'h', 'u'],
    'z': ['a', 's', 'x']
};

function getNeighboringKey(char) {
    const neighbors = keyboardNeighbors[char.toLowerCase()];
    return neighbors ? getRandomElement(neighbors) : char;
}

async function typeWriterEffect(element, text, speed) {
    element.innerHTML = '';
    let cursor = document.createElement('span');
    cursor.id = 'caret';
    element.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (Math.random() < 0.25) {
            // Mistype a letter with a neighboring key
            let wrongChar = getNeighboringKey(char);
            cursor.insertAdjacentText('beforebegin', wrongChar);
            await sleep(250); // Pause on mistype
            // Backspace
            cursor.previousSibling.remove();
            await sleep(speed);
        }
        cursor.insertAdjacentText('beforebegin', char);
        await sleep(speed);
    }
}

async function backspaceEffect(element, speed) {
    let text = element.innerText;
    while (text.length > 0) {
        text = text.slice(0, -1);
        element.innerText = text;
        await sleep(speed);
    }
}

async function generateHaiku() {
    const haikuElement = document.getElementById('haiku');
    if (haikuElement.innerText.trim() !== '') {
        await backspaceEffect(haikuElement, 2000 / 30); // Backspace existing poem
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
    await typeWriterEffect(haikuElement, haiku, 2000 / 30); // 30 words per minute
}

// Add event listener to generate haiku on button click
document.getElementById('generate-button').addEventListener('click', generateHaiku);