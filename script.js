// Voicemail configuration
const voicemails = [
    'recordings/rec_1.m4a',
    'recordings/rec_2.m4a',
    'recordings/rec_3.m4a',
    'recordings/rec_4.m4a',
    'recordings/rec_5.m4a',
    'recordings/rec_6.m4a',
    'recordings/rec_7.m4a',
    'recordings/rec_8.m4a',
    'recordings/rec_9.m4a',
    'recordings/rec_10.m4a',
    'recordings/rec_11.m4a',
    'recordings/rec_12.m4a',
    'recordings/rec_13.m4a',
    'recordings/rec_14.m4a',
    'recordings/rec_15.m4a',
    'recordings/rec_16.m4a',
    'recordings/rec_17.m4a',
    'recordings/rec_18.m4a',
    'recordings/rec_19.m4a',
    'recordings/rec_20.m4a',
    'recordings/rec_21.m4a',
    'recordings/rec_22.m4a',
    'recordings/rec_23.m4a',
    'recordings/rec_24.m4a',
    'recordings/rec_25.m4a',
    'recordings/rec_26.m4a',
];

const photos = [
    { src: 'photos/photo1.jpg', caption: 'Grandma in her garden' },
    { src: 'photos/photo2.jpg', caption: 'Family gathering 1995' },
    { src: 'photos/photo3.jpg', caption: 'Her favorite spot' }
    // Add more photos as needed
];

// State management
let playedIndices = [];      // Tracks all unique recordings heard
let playbackQueue = [];      // Queue of recordings currently accessible
let queuePosition = -1;      // Current position in the queue
let isPlaying = false;

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const newVoicemailBtn = document.getElementById('newVoicemailBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevRecordingBtn = document.getElementById('prevRecordingBtn');
const nextRecordingBtn = document.getElementById('nextRecordingBtn');
const messageText = document.getElementById('messageText');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const playedCount = document.getElementById('playedCount');
const totalCount = document.getElementById('totalCount');
const currentTimeDisplay = document.getElementById('currentTime');
const mainPhoto = document.getElementById('mainPhoto');
const photoCaption = document.getElementById('photoCaption');

// Initialize
totalCount.textContent = voicemails.length;
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
        // All played, reset
        playedIndices = [];
        messageText.textContent = 'Starting fresh! 🌟';
    }
    
    const availableIndices = voicemails
        .map((_, i) => i)
        .filter(i => !playedIndices.includes(i));
    
    return availableIndices[playedIndices.length];
}

// Start a new voicemail (random selection)
function startNewVoicemail() {
    // Pause current if playing
    audioPlayer.pause();
    isPlaying = false;
    updatePlayPauseIcon();

    const newIndex = getNextIndex();
    
    // Add to played list if not already there
    if (!playedIndices.includes(newIndex)) {
        playedIndices.push(newIndex);
        playedCount.textContent = playedIndices.length;
    }

    // Add to playback queue at current position + 1
    // This allows us to go back to previous recordings we've heard
    queuePosition++;
    playbackQueue = playbackQueue.slice(0, queuePosition);
    playbackQueue.push(newIndex);

    loadAndPlayRecording(newIndex);
}

// Load and play a specific recording
function loadAndPlayRecording(index) {
    if (index < 0 || index >= voicemails.length) return;
    
    audioPlayer.src = voicemails[index];
    
    // Update UI
    messageText.textContent = `Message ${playedIndices.indexOf(index) + 1} of ${voicemails.length}`;
    progressBar.style.width = '0%';
    
    // Update photo randomly
    updatePhoto();

    // Auto play
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
    }).catch(error => {
        console.error('Playback error:', error);
        messageText.textContent = 'Error playing audio. Please try again.';
    });
}

// Navigate to next recording in queue
function nextRecording() {
    if (playbackQueue.length === 0) return;
    
    if (queuePosition < playbackQueue.length - 1) {
        queuePosition++;
        const nextIndex = playbackQueue[queuePosition];
        loadAndPlayRecording(nextIndex);
    } else {
        // At end of queue, start a new random one
        startNewVoicemail();
    }
}

// Navigate to previous recording in queue
function prevRecording() {
    if (playbackQueue.length === 0) return;
    
    if (queuePosition > 0) {
        queuePosition--;
        const prevIndex = playbackQueue[queuePosition];
        loadAndPlayRecording(prevIndex);
    } else {
        // At beginning, start a new random one
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
    playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
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

// Update Photo
function updatePhoto() {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    mainPhoto.src = randomPhoto.src;
    photoCaption.textContent = randomPhoto.caption;
}

// Event Listeners
newVoicemailBtn.addEventListener('click', startNewVoicemail);
playPauseBtn.addEventListener('click', togglePlayPause);
prevRecordingBtn.addEventListener('click', prevRecording);
nextRecordingBtn.addEventListener('click', nextRecording);
progressContainer.addEventListener('click', handleProgressClick);

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
    }
});