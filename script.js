// Voicemail configuration
const voicemails = [
    'recordings/rec-1.m4a',
    'recordings/rec-2.m4a',
    'recordings/rec-3.m4a',
    'recordings/rec-4.m4a',
    'recordings/rec-5.m4a',
    'recordings/rec-6.m4a',
    'recordings/rec-7.m4a',
    'recordings/rec-8.m4a',
    'recordings/rec-9.m4a',
    'recordings/rec-10.m4a',
    'recordings/rec-11.m4a',
    'recordings/rec-12.m4a',
    'recordings/rec-13.m4a',
    'recordings/rec-14.m4a',
    'recordings/rec-15.m4a',
];


const photos = [
    { src: 'photos/photo1.jpg', caption: 'Grandma in her garden' },
    { src: 'photos/photo2.jpg', caption: 'Family gathering 1995' },
    { src: 'photos/photo3.jpg', caption: 'Her favorite spot' }
    // Add more photos as needed
];

// State management
let playedIndices = [];
let playbackQueue = [];
let queuePosition = -1;
let isPlaying = false;

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevRecordingBtn = document.getElementById('prevRecordingBtn');
const nextRecordingBtn = document.getElementById('nextRecordingBtn');
const messageText = document.getElementById('messageText');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const totalCount = document.getElementById('totalCount');
const currentTimeDisplay = document.getElementById('currentTime');
const mainPhoto = document.getElementById('mainPhoto');
const photoCaption = document.getElementById('photoCaption');
const keys = document.querySelectorAll('.key');

// Initialize
updateTime();
setInterval(updateTime, 1000);

// Update clock
function updateTime() {
    const now = new Date();
    currentTimeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Get random unplayed index
function getNextIndex() {
    if (playedIndices.length === voicemails.length) {
        playedIndices = [];
        messageText.textContent = 'Starting fresh!';
    }
    
    return playedIndices.length;
}

// Start a new voicemail
function startNewVoicemail() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayPauseIcon();

    const newIndex = getNextIndex();
    
    if (!playedIndices.includes(newIndex)) {
        playedIndices.push(newIndex);
    }

    queuePosition++;
    playbackQueue = playbackQueue.slice(0, queuePosition);
    playbackQueue.push(newIndex);

    loadAndPlayRecording(newIndex);
}

// Load and play a specific recording
function loadAndPlayRecording(index) {
    if (index < 0 || index >= voicemails.length) return;
    
    audioPlayer.src = voicemails[index];
    console.log("trying to play:", index)
    console.log("trying to play:", voicemails[index])
    
    messageText.textContent = `Message ${index + 1} of ${voicemails.length}`;
    progressBar.style.width = '0%';


    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
    }).catch(error => {
        console.error('Playback error:', error);
        messageText.textContent = 'Error playing audio. Please try again.';
    });
}

// Navigate to next recording
function nextRecording() {
    if (playbackQueue.length === 0) {
        startNewVoicemail();
        return;
    }
    
    if (queuePosition < playbackQueue.length - 1) {
        queuePosition++;
        const nextIndex = playbackQueue[queuePosition];
        loadAndPlayRecording(nextIndex);
    } else {
        startNewVoicemail();
    }
}

// Navigate to previous recording
function prevRecording() {
    if (playbackQueue.length === 0) {
        startNewVoicemail();
        return;
    }
    
    if (queuePosition > 0) {
        queuePosition--;
        const prevIndex = playbackQueue[queuePosition];
        loadAndPlayRecording(prevIndex);
    } else {
        startNewVoicemail();
    }
}

// Toggle Play/Pause
function togglePlayPause() {
    if (!audioPlayer.src) {
        startNewVoicemail();
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
}

// Handle clicking on progress bar
function handleProgressClick(e) {
    if (!audioPlayer.duration) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    audioPlayer.currentTime = percentage * audioPlayer.duration;
}

// Keypad functionality - play specific voicemail by number
function playVoicemailByNumber(number) {
    if (number < 1 || number > voicemails.length) {
        messageText.textContent = `Voicemail ${number} not found.`;
        return;
    }
    
    const index = number - 1;
    
    if (!playedIndices.includes(index)) {
        playedIndices.push(index);
    }

    queuePosition++;
    playbackQueue = playbackQueue.slice(0, queuePosition);
    playbackQueue.push(index);

    loadAndPlayRecording(index);
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
prevRecordingBtn.addEventListener('click', prevRecording);
nextRecordingBtn.addEventListener('click', nextRecording);
progressContainer.addEventListener('click', handleProgressClick);

// Keypad event listeners
keys.forEach(key => {
    key.addEventListener('click', () => {
        const keyNum = key.dataset.key;
        
        // Flash effect
        key.style.background = '#fff';
        setTimeout(() => {
            key.style.background = '';
        }, 100);
        
        // Handle special keys
        if (keyNum === '*') {
            // * = Play random new voicemail
            startNewVoicemail();
        } else if (keyNum === '#') {
            // # = Repeat current voicemail
            if (audioPlayer.src) {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
            }
        } else {
            // Number = Play specific voicemail
            playVoicemailByNumber(parseInt(keyNum));
        }
    });
});

// Audio Events
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayPauseIcon();
    progressBar.style.width = '0%';
    messageText.textContent = 'Message finished. Ready for another?';
});

audioPlayer.addEventListener('error', () => {
    isPlaying = false;
    updatePlayPauseIcon();
    messageText.textContent = 'Audio file not found. Check file paths.';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.code === 'ArrowLeft') {
        prevRecording();
    } else if (e.code === 'ArrowRight') {
        nextRecording();
    } else if (e.key >= '1' && e.key <= '9') {
        playVoicemailByNumber(parseInt(e.key));
    } else if (e.key === '0') {
        playVoicemailByNumber(10);
    } else if (e.key === '*') {
        startNewVoicemail();
    } else if (e.key === '#') {
        if (audioPlayer.src) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }
    }
});