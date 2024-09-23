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

    let word = '';
    let mistypedSpan = null;
    let mistyped = false;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        word += char;

        if (Math.random() < 0.25 && char !== ' ' && char !== '\n') {
            // Decide whether to fix immediately or delay correction
            if (Math.random() < 0.5) {
                // Immediate correction
                let wrongChar = getNeighboringKey(char);
                cursor.insertAdjacentText('beforebegin', wrongChar);
                await sleep(250); // Pause on mistype
                cursor.previousSibling.remove();
                await sleep(speed);
            } else {
                // Delayed correction
                let wrongChar = getNeighboringKey(char);
                mistypedSpan = document.createElement('span');
                mistypedSpan.className = 'mistyped';
                mistypedSpan.textContent = word.slice(0, -1) + wrongChar;
                cursor.insertAdjacentElement('beforebegin', mistypedSpan);
                mistyped = true;
                word = word.slice(0, -1) + wrongChar;
            }
        } else {
            cursor.insertAdjacentText('beforebegin', char);
            await sleep(speed);
        }

        if (char === ' ' || char === '\n') {
            if (mistyped) {
                // Correct the mistyped word
                await sleep(250); // Pause before correction
                for (let j = 0; j < word.length; j++) {
                    cursor.previousSibling.remove();
                    await sleep(speed);
                }
                for (let j = 0; j < word.length; j++) {
                    cursor.insertAdjacentText('beforebegin', word[j]);
                    await sleep(speed);
                }
                mistyped = false;
            }
            word = ''; // Reset word on space or newline
        }
    }

    // Final correction if the last word was mistyped
    if (mistyped) {
        await sleep(250); // Pause before correction
        for (let j = 0; j < word.length; j++) {
            cursor.previousSibling.remove();
            await sleep(speed);
        }
        for (let j = 0; j < word.length; j++) {
            cursor.insertAdjacentText('beforebegin', word[j]);
            await sleep(speed);
        }
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