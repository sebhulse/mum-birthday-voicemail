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
    { src: 'photo1.jpg', caption: 'Grandma in her garden' },
    { src: 'photo2.jpg', caption: 'Family gathering 1995' },
    { src: 'photo3.jpg', caption: 'Her favorite spot' }
    // Add more photos as needed
];

// State management
let playedIndices = [];
let currentIndex = null;
let audioPlayer = document.getElementById('audioPlayer');
let playButton = document.getElementById('playButton');
let messageText = document.getElementById('messageText');
let progressBar = document.getElementById('progressBar');
let playedCount = document.getElementById('playedCount');
let totalCount = document.getElementById('totalCount');
let currentTime = document.getElementById('currentTime');
let mainPhoto = document.getElementById('mainPhoto');
let photoCaption = document.getElementById('photoCaption');

// Initialize
totalCount.textContent = voicemails.length;
updateTime();
setInterval(updateTime, 1000);

// Update clock
function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Get random unplayed index
function getRandomUnplayedIndex() {
    if (playedIndices.length === voicemails.length) {
        // All played, reset
        playedIndices = [];
        messageText.textContent = 'Starting fresh! 🌟';
    }
    
    const availableIndices = voicemails
        .map((_, i) => i)
        .filter(i => !playedIndices.includes(i));
    
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    return availableIndices[randomIndex];
}

// Play voicemail
function playVoicemail() {
    currentIndex = getRandomUnplayedIndex();
    playedIndices.push(currentIndex);
    
    // Set audio source
    audioPlayer.src = voicemails[currentIndex];
    audioPlayer.play().catch(error => {
        console.error('Playback error:', error);
        messageText.textContent = 'Error playing audio. Please try again.';
    });
    
    // Update UI
    playButton.disabled = true;
    playButton.textContent = '🎵 Playing...';
    messageText.textContent = `Message ${playedIndices.length} of ${voicemails.length}`;
    playedCount.textContent = playedIndices.length;
    
    // Update photo randomly
    updatePhoto();
}

// Update photo
function updatePhoto() {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    mainPhoto.src = randomPhoto.src;
    photoCaption.textContent = randomPhoto.caption;
}

// Event listeners
playButton.addEventListener('click', playVoicemail);

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

audioPlayer.addEventListener('ended', () => {
    playButton.disabled = false;
    playButton.textContent = '🎧 Play Voicemail';
    progressBar.style.width = '0%';
});

audioPlayer.addEventListener('error', () => {
    playButton.disabled = false;
    playButton.textContent = '🎧 Play Voicemail';
    messageText.textContent = 'Audio file not found. Check file paths.';
});

// Keyboard shortcut (Space to play)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !playButton.disabled) {
        e.preventDefault();
        playVoicemail();
    }
});