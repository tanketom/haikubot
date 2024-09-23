// Fetch haiku lines from the JSON file
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

// Get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random haiku and display it
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
    document.getElementById('haiku').innerHTML = haiku;
}