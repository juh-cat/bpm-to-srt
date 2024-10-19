let generatedSRTContent = '';

// Theme switcher
const themeToggle = document.getElementById('theme-toggle');

function switchTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'L';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'D';
    }    
}

themeToggle.addEventListener('click', switchTheme);

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? 'L' : 'D';
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

function generateSRT() {
    const bpm = parseFloat(document.getElementById('bpm').value);
    const duration = parseFloat(document.getElementById('duration').value);

    if (isNaN(bpm) || isNaN(duration) || bpm <= 0 || duration <= 0) {
        alert("Please enter valid numbers for BPM and duration.");
        return;
    }

    const beatDuration = 60 / bpm;
    const totalBeats = Math.floor(duration / beatDuration);

    let srtContent = '';

    for (let beat = 1; beat <= totalBeats; beat++) {
        const startTime = (beat - 1) * beatDuration;
        const endTime = beat * beatDuration;

        const startStr = formatTime(startTime);
        const endStr = formatTime(endTime);

        srtContent += `${beat}\n`;
        srtContent += `${startStr} --> ${endStr}\n`;
        srtContent += `beat ${beat}\n`;
        srtContent += `${beat % 4 || 4}/4\n`;
        srtContent += `${beat % 8 || 8}/8\n`;
        srtContent += `${beat % 16 || 16}/16\n\n`;
    }

    generatedSRTContent = srtContent;
    document.getElementById('output').textContent = srtContent;
    document.getElementById('downloadBtn').style.display = 'block';
}

function downloadSRT() {
    const filename = document.getElementById('filename').value || 'output.srt';
    const blob = new Blob([generatedSRTContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}