// ==UserScript==
// @name         TagPro Training Mode
// @version      1.0
// @description  TP practice while waiting for games
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/playersearch
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.2/pixi.min.js
// ==/UserScript==

(function() {
    'use strict';
    const nav = document.getElementById('nav-feedback');
    if(nav)
    {
        const newButton = document.createElement('li');
        newButton.id = 'training';

        const link = document.createElement('a');
        link.innerText = 'TRAINING';
        newButton.appendChild(link);
        newButton.onclick = startTraining;
        nav.insertAdjacentElement('afterend',newButton);
    }


})();

function startTraining() {
    texture().then(squares => {
        for (const [key, value] of Object.entries(squares)) {
            if(value[0] === 'd' && value[1] === 'a'){
                const img = new Image();
                img.src = value;
                squares[key] = img;
                //console.log(`${key}: ${squares[key]}`);
            }
        }
        training(squares);
    }).catch(error => {
        console.error('Error loading texture:', error);
    });
}

function training(tiles){
    const map =  [['0','0','0','1','1','1','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','1','5.1','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','1.2','13.1','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','1.2','5.1','2','2','2','2','2','13','1','1','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','1','1','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','3.1','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0'],['1','10.1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','7','1','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','8','1','0','0','0','0','0','0','0','0','0','0'],['1','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','7','1','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0'],['0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0'],['0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0','0','0','0','0'],['0','0','0','1','2','2','9','9','2','2','2','2','2','2','2','2','2','2','5','2','1.1','1','1','1','0','0','0','0','0','0'],['0','0','0','1','23','2','6.22','2','9','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0','0'],['0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0'],['0','0','0','0','1','2','2','8','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','0','0','0','1','2','2','2','2','2','2','2','2','5','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0'],['0','0','0','0','1','2','2','2','2','2','2','2','2','2','1','1.3','2','2','2','2','2','2','2','2','2','1','0','0','0','0'],['0','0','0','0','1','2','2','2','2','2','2','2','2','2','1.1','1','2','2','2','2','2','2','2','2','2','1','0','0','0','0'],['0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','5.1','2','2','2','2','2','2','2','2','1','0','0','0','0'],['0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','8','2','2','1','0','0','0','0'],['0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0'],['0','0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','9','2','6.12','2','23','1','0','0','0'],['0','0','0','0','0','0','1','1','1','1.3','2','5.1','2','2','2','2','2','2','2','2','2','2','9','9','2','2','1','0','0','0'],['0','0','0','0','0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0'],['0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0'],['0','0','0','0','0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0'],['0','0','0','0','0','0','0','0','0','0','1','7','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','1'],['0','0','0','0','0','0','0','0','0','0','1','8','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','1','7','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','10.1','1'],['0','0','0','0','0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','4.1','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','1','1','1','1','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1','1','1','13.11','2','2','2','2','2','5.1','1.4','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','13.1','1.4','1','0'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','5','1','1','0','0'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1','1','1','1','0','0','0']];
    document.body.innerHTML = '';
    document.body.style.margin = '0'; // Removes default body margin
    document.body.style.height = '99vh'; // Ensure body fills the viewport height
    const gameDiv = document.createElement('div');
    gameDiv.style.display = "flex";
    gameDiv.style.justifyContent = "space-evenly";
    gameDiv.style.width = '100%';
    gameDiv.style.height = Math.min(800, window.innerHeight) + 'px';
    gameDiv.style.marginTop = '1vh';
    document.body.appendChild(gameDiv);
    // Create a PixiJS application
    const app = new PIXI.Application({
        width: Math.min(1280, window.innerWidth), // Width of the canvas
        height: Math.min(800, window.innerHeight), // Height of the canvas
        backgroundColor: 0x000000, // Background color
        resolution: window.devicePixelRatio || 1, // Adjust resolution for HiDPI screens
    });

    app.view.style.maxWidth = '1280px';
    app.view.style.maxHeight = '800px';

    // Add the PixiJS canvas to the body of the page
    gameDiv.appendChild(app.view);

    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[i].length; j++){
            if(map[i][j] != '0'){
                console.log(`i:${i} j:${j} map:${map[i][j]}`);
                addSpriteToLocation(app, tiles, map[i][j], i*40, j*40);
            }
        }
    }
    const sprite1 = addSpriteToLocation(app, tiles, '1.2', 40, 40);
    
    document.addEventListener('keydown', function(e) {
        //gonna change all this to modify object values like velocity and stuff
        //then use those values in loop?
        //also make variables to remember keydown and add another event for up
        //unsure if thats gonna work how i want it to but well see ig
        if(e.key === 'ArrowRight'){
            sprite1.x += 1;
        }
        else if (e.key === 'ArrowLeft'){
            sprite1.x -= 1;
        }
        else if (e.key === 'ArrowUp'){
            sprite1.y -= 1;
        }
        else if (e.key === 'ArrowDown'){
            sprite1.y += 1;
        }
    });
    app.ticker.add(delta => loop(delta, sprite1));
}

function addSpriteToLocation(app, tiles, tileNum, x, y) {
    const texture1 = PIXI.Texture.from(getImageFromTileNum(tiles, tileNum));
    const sprite1 = new PIXI.Sprite(texture1);
    sprite1.position.set(x,y);
    app.stage.addChild(sprite1);
    return sprite1;
}
function getImageFromTileNum(tiles, tileNum) {
    switch(tileNum) {
        case '1.2':
            return tiles['1.1']
        case '1.3':
            return tiles['1.1']
        case '1.4':
            return tiles['1.1']
        case '3.1':
            return tiles['3'];
        case '4.1':
            return tiles['4'];
        case '5.1':
            return tiles['5'];
        case '5.11':
            return tiles['5'];
        case '6.11':
            return tiles['6.1'];
        case '6.12':
            return tiles['6.1'];
        case '6.21':
            return tiles['6.2'];
        case '6.22':
            return tiles['6.2'];
        case '6.31':
            return tiles['6.3'];
        case '6.32':
            return tiles['6.3'];
        case '10.11':
            return tiles['10.1'];
        case '13.11':
            return tiles['13'];
        case '24.1':
            return tiles['24'];
        case '24.11':
            return tiles['24'];
        case '25.1':
            return tiles['25'];
        case '25.11':
            return tiles['25'];
        case '14.1':
            return tiles['14'];
        case '14.11':
            return tiles['14'];
        case '15.1':
            return tiles['15'];
        case '15.11':
            return tiles['15'];
        case '16.1':
            return tiles['16'];
        default:
            return tiles[tileNum];
    }
}

function texture(){
    return new Promise((resolve, reject) => {
        const imgPath = 'https://raw.githubusercontent.com/iodtp/temp/main/funko.png';  // Replace with the path to your image
        const squareSize = 40;
        const squares = []; // Array to store the data URLs of squares

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgPath;

        img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;

            canvas.width = imgWidth;
            canvas.height = imgHeight;
            ctx.drawImage(img, 0, 0);

            const cols = Math.floor(imgWidth / squareSize);
            const rows = Math.floor(imgHeight / squareSize);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * squareSize;
                    const y = row * squareSize;

                    // Extracting each 40x40 square

                    const imageData = ctx.getImageData(x, y, squareSize, squareSize);

                    // Creating a new canvas for each square
                    const newCanvas = document.createElement('canvas');
                    newCanvas.width = squareSize;
                    newCanvas.height = squareSize;
                    const newCtx = newCanvas.getContext('2d');
                    newCtx.putImageData(imageData, 0, 0);

                    // Convert the new canvas to a data URL and store it in the array
                    const dataURL = newCanvas.toDataURL();
                    squares.push(dataURL);
                }
            }




            /*for(let i = 0; i < squares.length; i++){
                const exampleSquare = new Image();
                exampleSquare.src = squares[i]; // Load the first square
                document.body.appendChild(exampleSquare); // Append to the body to display
            }*/
            const tiles = {
                '1': squares[9],
                '1.1': squares[28],
                '1.2': '45upleft',
                '1.3': '45upright',
                '1.4': '45botright',
                '2': squares[9],
                '3': squares[16],
                '3.1': 'red flag taken',
                '4': squares[15],
                '4.1': 'blueflagtaken',
                '5':  squares[20],
                '5.1': 'boos inactive',
                '5.11': 'boost respawn',
                '6.1': squares[18],
                '6.11': 'jj respawn',
                '6.12': 'jj preview',
                '6.2': squares[19],
                '6.21': 'rb respawn',
                '6.22': 'rb preview',
                '6.3':  squares[17],
                '6.31': 'tp respawn',
                '6.32': 'tp preview',
                '7': squares[9],
                '8': squares[19],
                '9': squares[1],
                '9.1': squares[3],
                '9.2': squares[0],
                '9.3': squares[2],
                '10': squares[21],
                '10.1': squares[23],//last one here
                '10.11': 'bomb respawn',
                '11': squares[6],
                '12': squares[4],
                '13': squares[12],
                '13.1': squares[11],
                '13.11': 'inactive portal respawn',
                '24': squares[13],
                '24.1': 'inactive blue portal',
                '24.11': 'inactie blue portal respawn',
                '25': squares[10],
                '25.1': 'inactive blue portal',
                '25.11': 'inactie blue portal respawn',
                '14': squares[24],
                '14.1': 'red boost inactive',
                '14.11': 'red boost respawn',
                '15': squares[22],
                '15.1': 'blue boost inactive',
                '15.11': 'blue boost respawn',
                '16': squares[14],
                '16.1': 'yellow flag taken',
                '17': squares[7],
                '18': squares[8],
                '23': squares[5],
                'redball': squares[26],
                'blueball': squares[27]
            };
            //MISSING BUTTON, NEED TO RERUN OTHER SCRIPT


            resolve(tiles); // Resolve the Promise with the squares array
        };

        img.onerror = reject; // Handle errors (e.g., if the image fails to load)
    });
}

function loop(delta, sprite1) {
    //sprite1.position.set(sprite1.x + 1, sprite1.y);
}





