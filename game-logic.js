let g_gameMode = "normal";
let g_currentColor = "#000000";
let g_backgroundColor = "whitesmoke";

let sketchBoard = document.querySelector('.sketch-board');
let slider = document.querySelector(".slider");
let sliderValue = document.getElementById("slider-value");
let brushColorPicker = document.getElementById('paint-color');
let bgColorPicker = document.getElementById('bg-color');



bgColorPicker.addEventListener('input', (e) => {
    g_backgroundColor = e.target.value;
    changeBoardBackground();
});

brushColorPicker.addEventListener('change', (e) => {
    g_currentColor = e.target.value;
});

document.getElementById('eraser').addEventListener('click', () => { g_gameMode = "erase" });
document.getElementById('clear').addEventListener('click', () => { changeBoardBackground(); });
document.getElementById('normal-mode').addEventListener('click', () => { g_gameMode = "normal"; });
document.getElementById('rainbow-mode').addEventListener('click', () => { g_gameMode = "rainbow"; });

document.body.ondragstart = () => { return false; };

slider.addEventListener('input', (e) => {
    sliderValue.textContent = ' ' + e.target.value + ' x ' + e.target.value;
});

slider.addEventListener('change', (e) => {
    prepareBoard(e.target.value);
});

function paintDiv(e) {
    if (e.which == 1) {
        if (g_gameMode === "rainbow") { e.target.style.backgroundColor = randomRgbColor(); }
        else if (g_gameMode === "normal") {
            e.target.style.backgroundColor = g_currentColor;
        }
        else if (g_gameMode === "erase") {
            e.target.style.backgroundColor = g_backgroundColor;
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

function prepareBoard(size) {
    sketchBoard.innerHTML = "";
    sketchBoard.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
    sketchBoard.style.gridTemplateRows = "repeat(" + size + ",1fr)";
    let items = size * size;
    for (let i = 0; i < items; ++i) {
        let div = document.createElement('div');
        div.addEventListener('mouseenter', paintDiv);
        div.addEventListener('mousedown', paintDiv);
        sketchBoard.appendChild(div);
    }
}



prepareBoard(16);