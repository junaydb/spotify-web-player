let playing = false;
let isSeeking = false;
let rangeHover = false;

const spotifyGreen = '#1D8954';
const darkGrey = '#878787';

const root = document.documentElement;
const body = document.querySelector('body');
const audio = document.querySelector('audio');
const playButton = document.getElementById('play-pause');
const playButtonImg = document.querySelector('#play-pause img');
const forwardButton = document.getElementById('forward');
const rewindButton = document.getElementById('rewind');
const currentTime = document.getElementById('current-time');
const totalDuration = document.getElementById('total-duration');
const rangeArea = document.getElementById('range-container');
const range = document.getElementById('range');
const fileUpload = document.getElementById('file-upload');
const trackName = document.getElementById('track-name');
const nowPlaying = document.getElementById('now-playing');

const getSliderPosition = (rangeInput) => {
    const position =
        ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;

    return position;
};

const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);

    const padSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${padSeconds}`;
};

const updateRangeColour = (colour1, colour2, position) => {
    return `linear-gradient(to right, ${colour1} 0%, ${colour1} ${position}%, ${colour2} ${position}%, ${colour2} 100%)`;
};

// create URL reference to audio file
const createURL = (obj) => {
    return URL.createObjectURL(obj);
};

const play = () => {
    playing = true;
    playButtonImg.src = 'png/pause-button.png';
    audio.play();
};

const pause = () => {
    playing = false;
    playButtonImg.src = 'png/play-button.png';
    audio.pause();
};

const rangeMouseOver = () => {
    rangeHover = true;
    root.style.setProperty('--visibility', 'visible'); // hide slider thumb
    range.style.background = updateRangeColour(spotifyGreen, darkGrey, getSliderPosition(range));
};

const rangeMouseExit = () => {
    rangeHover = false;
    root.style.setProperty('--visibility', 'hidden'); // show slider thumb
    range.style.background = updateRangeColour('white', darkGrey, getSliderPosition(range));
};

// update time in ui and range colour whilst user is seeking (but not audio)
const seeking = () => {
    isSeeking = true;
    currentTime.innerHTML = formatTime(range.value);
    range.style.background = updateRangeColour(spotifyGreen, darkGrey, getSliderPosition(range));
};

// only update audio position once user has finished seeking
const seeked = () => {
    isSeeking = false;
    audio.currentTime = range.value;
};

const fileUploaded = ({ target }) => {
    let trackNum = 0;
    const tracks = target.files;
    const regex = /.mp3|.wav|.aac|.flac|.m4a|.mp4|.wma/;

    audio.src = createURL(tracks.item(trackNum)); // temp URL
    audio.load();
    play();

    trackName.innerHTML = tracks.item(trackNum).name.replace(regex, '');
    nowPlaying.innerHTML = 'Now playing';

    forwardButton.addEventListener('click', () => {
        if (trackNum === tracks.length - 1) {
            trackNum = 0;

            audio.src = createURL(tracks.item(trackNum));
            audio.load();
            play();

            trackName.innerHTML = tracks.item(trackNum).name.replace(regex, '');
        } else {
            trackNum++;

            audio.src = createURL(tracks.item(trackNum));
            audio.load();
            play();

            trackName.innerHTML = tracks.item(trackNum).name.replace(regex, '');
        }
    });

    rewindButton.addEventListener('click', () => {
        if (audio.currentTime > 5 || trackNum === 0) {
            audio.currentTime = 0;
        } else {
            trackNum--;

            audio.src = createURL(tracks.item(trackNum));
            audio.load();
            play();

            trackName.innerHTML = tracks.item(trackNum).name.replace(regex, '');
        }
    });
};

const setTotalDuration = () => {
    range.max = audio.duration;
    totalDuration.innerHTML = formatTime(audio.duration);
};

const updateTime = () => {
    // only update time if user is not seeking
    if (!isSeeking) {
        range.value = audio.currentTime;
        currentTime.innerHTML = formatTime(audio.currentTime);
    }

    // only update range progress if user is not interacting with range
    if (!rangeHover) {
        range.style.background = updateRangeColour('white', darkGrey, getSliderPosition(range));
    } else {
        range.style.background = updateRangeColour(
            spotifyGreen,
            darkGrey,
            getSliderPosition(range)
        );
    }
};

// event listeners
playButton.addEventListener('click', () => {
    playing ? pause() : play();
});
audio.addEventListener('timeupdate', updateTime);
audio.addEventListener('loadedmetadata', setTotalDuration);
rangeArea.addEventListener('mouseenter', rangeMouseOver);
rangeArea.addEventListener('mouseleave', rangeMouseExit);
range.addEventListener('input', seeking);
range.addEventListener('change', seeked);
fileUpload.addEventListener('input', fileUploaded);

range.style.background = updateRangeColour('white', darkGrey, getSliderPosition(range));
