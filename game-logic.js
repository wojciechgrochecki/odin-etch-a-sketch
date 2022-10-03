let g_rainbowMode = false;
let g_eraseMode = false;
let g_brushColor = "#8ABCBC";
let g_backgroundColor = "#f5f5f5";
let g_localStorageIndex = 0;

let sketchBoard = document.querySelector('.sketch-board');
let slider = document.querySelector(".slider");
let sliderDisplayValue = document.getElementById("slider-display-value");
let brushColor = document.getElementById('brush-color');
let bgColor = document.getElementById('bg-color');
let eraserButton = document.getElementById('eraser');
let rainbowButton = document.getElementById('rainbow-mode');
let paintingNameInput = document.getElementById('painting-name');
let inputMessage = document.getElementById('input-message');
let saveDiv = document.getElementById('save-div');
let smallBoard = document.getElementById('small-board');
let pasteDiv = document.getElementById('paste-div');
let smallBoardName = document.getElementById('small-board-name');
let galleryEmptyModal = document.getElementById('gallery-empty-modal');

document.getElementById('close-icon').addEventListener('click', () => {
    pasteDiv.style.display = "none";
    sketchBoard.style.filter = "blur(0)";
});

document.getElementById('save-painting').addEventListener('click', () => {
    preventModalStacking();
    saveDiv.style.display = "flex";
    sketchBoard.style.filter = "blur(2px)";
});
document.getElementById('gallery').addEventListener('click', () => {
    preventModalStacking();
    showPaintingGallery();
});

document.getElementById('empty-ok').addEventListener('click', () => {
    galleryEmptyModal.style.display = "none";
    sketchBoard.style.filter = "blur(0)";
});

document.getElementById('paste-board').addEventListener('click', () => {
    let painting = JSON.parse(localStorage.getItem('paintingsArray'))[g_localStorageIndex];
    createBoard(painting.size, painting.colorArray);
    pasteDiv.style.display = "none";
    sketchBoard.style.filter = "blur(0)";
});

document.getElementById('delete-board').addEventListener('click', () => {
    let paintingsArray = JSON.parse(localStorage.getItem('paintingsArray'));
    paintingsArray.splice(g_localStorageIndex, 1);
    localStorage.setItem('paintingsArray', JSON.stringify(paintingsArray));
    if (g_localStorageIndex != 0)
        --g_localStorageIndex;

    try { loadStorageBoard(paintingsArray[g_localStorageIndex]); }
    catch (error) {
        emptyGalleryHandling();
    }
});

document.getElementById('next').addEventListener('click', () => {
    let paintingsNumber = JSON.parse(localStorage.getItem('paintingsArray')).length - 1;
    if (g_localStorageIndex < paintingsNumber) {
        ++g_localStorageIndex;
        retrieveItem();
        return;
    }

});

document.getElementById('previous').addEventListener('click', () => {
    if (g_localStorageIndex > 0) {
        --g_localStorageIndex;
        retrieveItem();
    }
});


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


function storePainting(name) {
    let boardState = getBoardState(name);
    let paintingsArray = JSON.parse(localStorage.getItem('paintingsArray'));
    if (paintingsArray == null) {
        paintingsArray = [];
    }
    paintingsArray.push(boardState);
    localStorage.setItem('paintingsArray', JSON.stringify(paintingsArray));
}

function getBoardState(name) {
    let boardState = {};
    boardState.name = name;
    boardState.colorArray = [];
    let divsArray = Array.from(sketchBoard.childNodes);
    for (let i = 0; i < divsArray.length; ++i) {
        boardState.colorArray.push(divsArray[i].style.backgroundColor);
    }
    boardState.size = Math.sqrt(divsArray.length);
    return boardState;
}


function showPaintingGallery() {
    pasteDiv.style.display = "flex";
    sketchBoard.style.filter = "blur(2px)";
    retrieveItem();
}

function retrieveItem() {
    let boardState;
    try {
        boardState = JSON.parse(localStorage.getItem('paintingsArray'))[g_localStorageIndex];
        loadStorageBoard(boardState);
    }
    catch (e) {
        emptyGalleryHandling();
    }
}

function loadStorageBoard(boardState) {
    let size = boardState.size;
    smallBoard.innerHTML = "";
    smallBoard.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
    smallBoard.style.gridTemplateRows = "repeat(" + size + ",1fr)";

    let length = size * size;
    for (let i = 0; i < length; ++i) {
        let div = document.createElement('div');
        div.style.backgroundColor = boardState.colorArray[i];
        smallBoard.appendChild(div);
    }
    smallBoardName.textContent = boardState.name;
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
    let paintingsArray = JSON.parse(localStorage.getItem('paintingsArray'));
    if (name !== "") {
        try {
            for (let i = 0; i < paintingsArray.length; i++) {
                if (name === paintingsArray[i].name) {
                    inputMessage.textContent = "Name already taken";
                    paintingNameInput.style.border = "2px solid rgb(192, 49, 49);";
                    inputMessage.style.opacity = 0.8;
                    nameOkButton.disabled = true;
                    return;
                }
            }
        }
        catch (e) {

        }

        inputMessage.textContent = "";
        paintingNameInput.style.border = "2px solid green";
        inputMessage.style.opacity = 0;
        nameOkButton.disabled = false;
        return;
    }
    inputMessage.textContent = "name cannot be empty";
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
    saveDiv.style.display = "none";
    sketchBoard.style.filter = "blur(0)";
}

function emptyGalleryHandling() {
    pasteDiv.style.display = "none";
    galleryEmptyModal.style.display = "flex";
}

function preventModalStacking() {
    let modalArray = Array.from(document.getElementsByClassName('storage-div'));
    for (let i = 0; i < modalArray.length; ++i) {
        modalArray[i].style.display = "none";
    }

}

createBoard(16);
