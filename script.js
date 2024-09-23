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

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed) {
    let mistypeChance = 0.1; // 10% chance of mistype
    let mistyped = false;

    for (let i = 0; i < text.length; i++) {
        if (Math.random() < mistypeChance && !mistyped && text[i] !== '<' && text[i] !== '>') {
            // Mistype
            let wrongChar = String.fromCharCode(text.charCodeAt(i) + 1);
            element.innerHTML += wrongChar;
            await sleep(speed);
            // Backspace
            element.innerHTML = element.innerHTML.slice(0, -1);
            await sleep(speed);
            mistyped = true;
        }
        element.innerHTML += text[i];
        await sleep(speed);
        mistyped = false;
    }
}

async function backspaceText(element, speed) {
    while (element.innerHTML.length > 0) {
        element.innerHTML = element.innerHTML.slice(0, -1);
        await sleep(speed);
    }
}

async function generateHaiku() {
    const haikuLines = await fetchHaikuLines();
    if (!haikuLines) {
        document.getElementById('haiku').innerHTML = 'Failed to load haiku lines. Please try again later.';
        return;
    }

    const fiveSyllablePhrases = haikuLines.fiveSyllablePhrases;
    const sevenSyllablePhrases = haikuLines.sevenSyllablePhrases;

    const line1 = getRandomElement(fiveSyllablePhrases);
    const line2 = getRandomElement(sevenSyllablePhrases);
    const line3 = getRandomElement(fiveSyllablePhrases);

    const haiku = `${line1}<br>${line2}<br>${line3}`;
    const haikuElement = document.getElementById('haiku');

    // Backspace existing haiku if any
    await backspaceText(haikuElement, 50);

    // Type new haiku
    await typeText(haikuElement, haiku, 1000 / 60);
}