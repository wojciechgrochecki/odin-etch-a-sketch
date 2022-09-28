document.body.ondragstart = () => { return false; };

let sketchBoard = document.querySelector('.sketch-board');
let slider = document.querySelector(".slider");
let sliderValue = document.getElementById("slider-value");

slider.addEventListener('input', (e) => {
    sliderValue.textContent = ' ' + e.target.value + ' x ' + e.target.value;
});

slider.addEventListener('change', (e) => {
    prepareBoard(e.target.value);
});

function paintDiv(e) {
    if (e.which == 1) {
        console.log(randomRgbColor());
        e.target.style.backgroundColor = randomRgbColor();
    }

}

function randomRgbColor() {
    return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
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