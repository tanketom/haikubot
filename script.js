async function fetchHaikuLines() {
    const response = await fetch('haikuLines.json');
    const data = await response.json();
    return data;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generateHaiku() {
    const haikuLines = await fetchHaikuLines();
    const fiveSyllablePhrases = haikuLines.fiveSyllablePhrases;
    const sevenSyllablePhrases = haikuLines.sevenSyllablePhrases;

    const line1 = getRandomElement(fiveSyllablePhrases);
    const line2 = getRandomElement(sevenSyllablePhrases);
    const line3 = getRandomElement(fiveSyllablePhrases);

    const haiku = `${line1}<br>${line2}<br>${line3}`;
    document.getElementById('haiku').innerHTML = haiku;
}
