let playing = false;
const darkGrey = '#878787';

const root = document.documentElement;
const body = document.querySelector('body');
const audio = document.querySelector('audio');
const playButton = document.getElementById('play-pause');
const playButtonImg = document.querySelector('#play-pause img');
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
    root.style.setProperty('--visibility', 'visible');
    range.style.background = updateRangeColour('#1D8954', darkGrey, getSliderPosition(range));
};

const rangeMouseExit = () => {
    root.style.setProperty('--visibility', 'hidden');
    range.style.background = updateRangeColour('white', darkGrey, getSliderPosition(range));
};

const seek = () => {
    audio.currentTime = range.value;
    currentTime.innerHTML = formatTime(range.value);
    range.style.background = updateRangeColour('#1D8954', darkGrey, getSliderPosition(range));
};

const fileUploaded = ({ target }) => {
    const regex = /.mp3|.wav|.aac|.flac|.m4a|.mp4|.wma/;

    const audioFile = target.files.item(0);
    audio.src = URL.createObjectURL(audioFile); // temp URL
    audio.load();

    trackName.innerHTML = audioFile.name.replace(regex, '');
    nowPlaying.innerHTML = 'Now playing';
};

const setTotalDuration = () => {
    range.max = audio.duration;
    totalDuration.innerHTML = formatTime(audio.duration);
};

const updateTime = () => {
    range.value = audio.currentTime;
    updateRangeColour('white', darkGrey, audio.currentTime);
    currentTime.innerHTML = formatTime(audio.currentTime);

    console.log(range.value);
};

playButton.addEventListener('click', () => {
    playing ? pause() : play();
});
audio.addEventListener('timeupdate', updateTime);
audio.addEventListener('loadedmetadata', setTotalDuration);
rangeArea.addEventListener('mouseenter', rangeMouseOver);
rangeArea.addEventListener('mouseleave', rangeMouseExit);
range.addEventListener('input', seek);
fileUpload.addEventListener('input', fileUploaded);

range.style.background = updateRangeColour('white', '#878787', getSliderPosition(range));
