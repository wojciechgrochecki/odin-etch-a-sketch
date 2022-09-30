let g_rainbowMode = false;
let g_eraseMode = false;
let g_currentColor = "#000000";
let g_backgroundColor = "#f5f5f5";

let sketchBoard = document.querySelector('.sketch-board');
let slider = document.querySelector(".slider");
let sliderValue = document.getElementById("slider-value");
let brushColorPicker = document.getElementById('paint-color');
let bgColorPicker = document.getElementById('bg-color');
let eraserButton = document.getElementById('eraser');
let rainbowButton = document.getElementById('rainbow-mode');


document.getElementById('save-painting').addEventListener('click', () => { storePainting(); })
document.getElementById('paste-painting').addEventListener('click', () => { retrieveItem(); })

bgColorPicker.addEventListener('input', (e) => {
    g_backgroundColor = e.target.value;
    changeBoardBackground();
});

brushColorPicker.addEventListener('change', (e) => {
    g_currentColor = e.target.value;
});

eraserButton.addEventListener('click', (e) => {
    setModeAndClass('eraser', e.target.classList.contains('active'));
});

rainbowButton.addEventListener('click', (e) => {
    setModeAndClass('rainbow', e.target.classList.contains('active'));
});

document.getElementById('clear').addEventListener('click', () => { changeBoardBackground(); });

document.body.ondragstart = () => { return false; };

slider.addEventListener('input', (e) => {
    sliderValue.textContent = ' ' + e.target.value + ' x ' + e.target.value;
});

slider.addEventListener('change', (e) => {
    prepareBoard(e.target.value);
});

function paintDiv(e) {
    if (e.which == 1) {
        if (g_rainbowMode) { e.target.style.backgroundColor = randomRgbColor(); }
        else if (g_eraseMode) {
            e.target.style.backgroundColor = g_backgroundColor;
        }
        else {
            e.target.style.backgroundColor = g_currentColor;
        }
    }
}

function changeBoardBackground() {
    let divs = sketchBoard.childNodes;
    let length = divs.length;
    for (let i = 0; i < length; ++i) {
        divs[i].style.backgroundColor = g_backgroundColor;
    }
}

function randomRgbColor() {
    return `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
}

function setModeAndClass(btnName, deleteClass) {
    if (deleteClass) {
        if (btnName === "rainbow") {
            rainbowButton.classList.remove('active');
            g_rainbowMode = false;
        }
        else {
            g_eraseMode = false;
            eraserButton.classList.remove('active');
        }
    }
    else {
        if (btnName === 'rainbow') {
            rainbowButton.classList.add('active');
            g_rainbowMode = true;
            eraserButton.classList.remove('active');
            g_eraseMode = false;
        }
        else {
            eraserButton.classList.add('active');
            g_eraseMode = true;
            rainbowButton.classList.remove('active');
            g_rainbowMode = false;
        }
    }
}

function storePainting() {
    let clrArray = getBoardState();
    let board = {};
    board.size = document.querySelector('.slider').value;
    board.colorArray = clrArray;
    localStorage.setItem('painting', JSON.stringify(board));
    console.log("DONE!");
}

function getBoardState() {
    let divsArray = Array.from(sketchBoard.childNodes);
    let colorArray = [];
    for (let i = 0; i < divsArray.length; ++i) {
        colorArray.push(divsArray[i].style.backgroundColor);
    }
    console.log(colorArray);
    return colorArray;
}

// function retrieveItem() {
//     let boardState = JSON.parse(localStorage.getItem('painting'));
//     console.log(boardState.colorArray);
//     prepareBoardFromStorage(boardState.size, boardState.colorArray);
// }

function prepareBoard(size) {
    sketchBoard.innerHTML = "";
    sketchBoard.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
    sketchBoard.style.gridTemplateRows = "repeat(" + size + ",1fr)";
    let items = size * size;
    for (let i = 0; i < items; ++i) {
        let div = document.createElement('div');
        div.addEventListener('mouseenter', paintDiv);
        div.addEventListener('mousedown', paintDiv);
        div.style.backgroundColor = g_backgroundColor;
        sketchBoard.appendChild(div);
    }
}

prepareBoard(16);