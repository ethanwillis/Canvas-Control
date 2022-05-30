// SETTINGS
const PLAYFIELD_SIZE = {width: 600, height: 600};

const FIGURES_SETTINGS = {
    quantity: 5,
    colors: [
        'red', 'blue', 'green', 'yellow', 'black'
    ],
    coordinates: [
        {x: 90, y: 0},
        {x: 30, y: 188},
        {x: 180, y: 68},
        {x: 0, y: 68},
        {x: 150, y: 188},
    ]
};

// INITIALIZATION
const controlCanvas = document.getElementById('playField');
controlCanvas.setAttribute('width', PLAYFIELD_SIZE.width);
controlCanvas.setAttribute('height', PLAYFIELD_SIZE.height);
const resultCanvas = document.getElementById('playStatus');

if (controlCanvas.getContext && resultCanvas.getContext) {
    const controlCtx = controlCanvas.getContext("2d");
    const resultCtx = resultCanvas.getContext("2d");

    fillCanvas(controlCanvas, controlCtx, FIGURES_SETTINGS)

    controlCanvas.addEventListener('click', e => {
        const { data } = controlCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
        const rgba = `rgba(${data.join()})`
        displayResult(resultCanvas, resultCtx, rgba);
    })
}

function calculateFigureSize(coordinates) {;
    const minMax = coordinates.reduce((acc, el) => {
        if (el.x < acc.x.min) acc.x.min = el.x;
        if (el.x > acc.x.max) acc.x.max = el.x;
        if (el.y < acc.y.min) acc.y.min = el.y;
        if (el.y > acc.y.max) acc.y.max = el.y;
        return acc;
    }, {x: {min: Infinity, max: 0}, y: {min: Infinity, max: 0}});
    const size = {
        x: minMax.x.max - minMax.x.min,
        y: minMax.y.max - minMax.y.min,
    }
    return size;
}

function drawPolygon(ctx, style, startX = 0, startY = 0) {
    ctx.fillStyle = style;
    ctx.beginPath();
    FIGURES_SETTINGS.coordinates.forEach(el => {
        ctx.lineTo(
            el.x + startX,
            el.y + startY,
        );
    })
    ctx.closePath();
    ctx.fill();
}

function fillCanvas(canvas, ctx, figures) {
    const figureSize = calculateFigureSize(figures.coordinates);
    const itemsInRow = Math.floor(canvas.width / figureSize.x);
    const itemsInCol = Math.ceil(figures.quantity / itemsInRow);
    const colsWidth = canvas.width / itemsInRow;
    const colsWidthOnLastRow = canvas.width / (FIGURES_SETTINGS.quantity % itemsInRow);
    const rowsHeight = canvas.height / itemsInCol;

    if (itemsInCol * figureSize.y > PLAYFIELD_SIZE.height) {
        alert('Too many figures. Unable to launch, check settings');
        return;
    } 
    
    for (let i=0; i<FIGURES_SETTINGS.quantity; i++) {
        const curRow = Math.floor(i / itemsInRow);
        const curCol = Math.floor(i % itemsInRow);

        const isLastRow = curRow+1 === itemsInCol;
        const cellWidth = isLastRow ? colsWidthOnLastRow : colsWidth;

        const horShift = (cellWidth - figureSize.x) / 2;
        const vertShift = (rowsHeight - figureSize.y) / 2;

        const style = FIGURES_SETTINGS.colors[i%FIGURES_SETTINGS.quantity];
        const startX = curCol * cellWidth + horShift;
        const startY = curRow * rowsHeight + vertShift;

        drawPolygon(ctx, style, startX, startY);   
    }
}

function displayResult(canvas, ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}