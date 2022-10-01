let g_rainbowMode = false;
let g_eraseMode = false;
let g_brushColor = "#000000";
let g_backgroundColor = "#f5f5f5";

let sketchBoard = document.querySelector('.sketch-board');
let slider = document.querySelector(".slider");
let sliderDisplayValue = document.getElementById("slider-display-value");
let brushColor = document.getElementById('brush-color');
let bgColor = document.getElementById('bg-color');
let eraserButton = document.getElementById('eraser');
let rainbowButton = document.getElementById('rainbow-mode');
let paintingNameInput = document.getElementById('painting-name');
let inputMessage = document.getElementById('input-message');
let storageDiv = document.getElementById('storage-div');


document.getElementById('save-painting').addEventListener('click', () => { savePainting(); })
document.getElementById('paste-painting').addEventListener('click', () => { retrieveItem(); })



// working on local storage here
let nameOkButton = document.getElementById('name-ok');
nameOkButton.addEventListener('click', () => {
    let name = paintingNameInput.value.trim();
    resetSaveModal();
    storePainting(name);

});
document.getElementById('name-cancel').addEventListener('click', resetSaveModal);
paintingNameInput.addEventListener('input', validateInput);

bgColor.addEventListener('input', (e) => {
    g_backgroundColor = e.target.value;
    changeBoardBackground();
});

brushColor.addEventListener('input', (e) => {
    g_brushColor = e.target.value;
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
    sliderDisplayValue.textContent = ' ' + e.target.value + ' x ' + e.target.value;
});

slider.addEventListener('change', (e) => {
    createBoard(e.target.value);
});

function paintDiv(e) {
    if (e.which == 1) {
        if (g_rainbowMode) { e.target.style.backgroundColor = randomRgbColor(); }
        else if (g_eraseMode) {
            e.target.style.backgroundColor = g_backgroundColor;
        }
        else {
            e.target.style.backgroundColor = g_brushColor;
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

function savePainting() {
    storageDiv.style.display = "flex";
}

function storePainting(name) {
    let boardState = getBoardState();
    localStorage.setItem(name, JSON.stringify(boardState));
}

function getBoardState() {
    let boardState = {};
    boardState.colorArray = [];
    let divsArray = Array.from(sketchBoard.childNodes);
    for (let i = 0; i < divsArray.length; ++i) {
        boardState.colorArray.push(divsArray[i].style.backgroundColor);
    }
    boardState.size = Math.sqrt(divsArray.length);
    return boardState;
}

function retrieveItem(key = 'painting') {
    let boardState = JSON.parse(localStorage.getItem(key));
    createBoard(boardState.size, boardState.colorArray);
}



function createBoard(size, colorArray) {
    sketchBoard.innerHTML = "";
    sketchBoard.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
    sketchBoard.style.gridTemplateRows = "repeat(" + size + ",1fr)";
    sliderDisplayValue.textContent = ' ' + size + ' x ' + size;
    slider.value = size;

    let length = size * size;
    if (colorArray === undefined)
        for (let i = 0; i < length; ++i) {
            let div = document.createElement('div');
            div.addEventListener('mouseenter', paintDiv);
            div.addEventListener('mousedown', paintDiv);
            div.style.backgroundColor = g_backgroundColor;
            sketchBoard.appendChild(div);
        }
    else {
        for (let i = 0; i < length; ++i) {
            let div = document.createElement('div');
            div.addEventListener('mouseenter', paintDiv);
            div.addEventListener('mousedown', paintDiv);
            div.style.backgroundColor = colorArray[i];
            sketchBoard.appendChild(div);
        }
    }
}

function validateInput() {
    let name = paintingNameInput.value.trim();
    if (name !== "") {
        for (let i = 0; i < localStorage.length; i++) {
            if (name === localStorage.key(i)) {
                inputMessage.textContent = "Provided name is taken"
                paintingNameInput.style.border = "2px solid red";
                inputMessage.style.opacity = 0.8;
                nameOkButton.disabled = true;
                return;
            }
        }
        inputMessage.textContent = "";
        paintingNameInput.style.border = "2px solid green";
        inputMessage.style.opacity = 0;
        nameOkButton.disabled = false;
        return;
    }
    inputMessage.textContent = "Name cannot be empty";
    paintingNameInput.style.border = "2px solid red";
    inputMessage.style.opacity = 1;
    nameOkButton.disabled = true;
}

function resetSaveModal() {
    inputMessage.textContent = "";
    inputMessage.style.opacity = 0;
    paintingNameInput.style.border = "2px solid black";
    paintingNameInput.value = "";
    nameOkButton.disabled = true;
    storageDiv.style.display = "none";
}


createBoard(16);


