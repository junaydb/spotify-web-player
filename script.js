const baseURL = window.location.origin

const body = document.querySelector('body')
const playButton = document.getElementById('play-pause')
const playButtonImg = document.querySelector('#play-pause img')
const rangeArea = document.getElementById('range-container')
const range = document.getElementById('range')

const getSliderPosition = (rangeInput) => {
    const position = ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100

    return position
}

const updateRangeColour = (colour1, colour2, position) => {
    return `linear-gradient(to right, ${colour1} 0%, ${colour1} ${position}%, ${colour2} ${position}%, ${colour2} 100%)`
}

const changePlayButton = () => {
    playButtonImg.src === `${baseURL}/png/play-button.png`
        ? (playButtonImg.src = 'png/pause-button.png')
        : (playButtonImg.src = 'png/play-button.png')
}

const rangeMouseOver = () => {
    range.style.overflow = 'visible'
    range.style.background = updateRangeColour('#1D8954', '#878787', getSliderPosition(range))
}

const rangeMouseExit = () => {
    range.style.overflow = 'hidden'
    range.style.background = updateRangeColour('white', '#878787', getSliderPosition(range))
}

const rangeInputColour = ({ target }) => {
    range.style.background = updateRangeColour('#1D8954', '#878787', getSliderPosition(target))
}

playButton.addEventListener('click', changePlayButton)
rangeArea.addEventListener('mouseenter', rangeMouseOver)
rangeArea.addEventListener('mouseleave', rangeMouseExit)
range.addEventListener('input', rangeInputColour)

const position = getSliderPosition(range)
range.style.background = updateRangeColour('white', '#878787', position)
