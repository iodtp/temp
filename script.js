// ==UserScript==
// @name         Easy Texture Pack
// @namespace    http://tampermonkey.net/
// @version      2024-08-28
// @description  Convert TP texture packs into easy to use ones
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/playersearch

// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const imgPath = 'https://static.koalabeast.com/images/textures/funko.png';
    texture(imgPath).then(squares => {
        remakeTiles(squares).then(tiles => {
            console.log(tiles);
            /*tiles.forEach(tile => {


                document.body.appendChild(tile)
            });*/



        }).catch(error => {
            console.error("Error changing tiles", error);
        });
    }).catch(error => {
        console.error('Error loading texture:', error);
    });
})();


function texture(imgPath){
    return new Promise((resolve, reject) => {
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
                    const img = new Image();
                    img.src = dataURL;
                    squares.push(img);
                }
            }


            squares.splice(4, 1);
            squares.splice(8, 1);
            squares.splice(9, 3);
            squares.splice(12, 13);
            squares.splice(14, 2);
            squares.splice(15, 3);
            squares.splice(16, 1);
            squares.splice(18, 10);
            squares.splice(19, 2);
            squares.splice(20, 5);
            squares.splice(21, 1);
            squares.splice(23, 1);
            squares.splice(24, 13);
            squares.splice(25, 7);
            squares.splice(26, 3);
            squares.splice(28, 4);
            squares.splice(29, 4);
            squares.splice(32, 1);
            squares.splice(35, 2);
            squares.splice(36, 3);
            squares.splice(37, 7);
            squares.splice(38, 8);
            squares.splice(39, 8);
            squares.splice(41, 17);
            squares.splice(42, 3);
            squares.splice(43, 10);

            /*for(let i = 0; i < squares.length; i++){
            const exampleSquare = new Image();
            exampleSquare.src = squares[i]; // Load the first square
            document.body.appendChild(exampleSquare); // Append to the body to display
        }*/
            const tiles = {
                '1': squares[22],
                '1.1': squares[41],
                '1.2': squares[5],
                '1.3': '45upright',
                '1.4': '45botright',
                '2': squares[6],
                '3': squares[23],
                '3.1': 'red flag taken',
                '4': squares[13],
                '4.1': 'blueflagtaken',
                '5':  squares[27],
                '5.1': 'boos inactive',
                '5.11': 'boost respawn',
                '6.1': 'jj',
                '6.11': squares[12],
                '6.12': 'jj preview',
                '6.2': squares[14],
                '6.21': 'rb respawn',
                '6.22': 'rb preview',
                '6.3':  squares[10],
                '6.31': 'tp respawn',
                '6.32': 'tp preview',
                '7': squares[9],
                '8': squares[19],
                '9': squares[16],
                '9.1': squares[24],
                '9.2': squares[3],
                '9.3': squares[39],
                '10': squares[26],
                '10.1': squares[34],
                '10.11': 'bomb respawn',
                '11': squares[30],
                '12': squares[17],
                '13': squares[40],
                '13.1': squares[20],
                '13.11': 'inactive portal respawn',
                '24': squares[42],
                '24.1': 'inactive blue portal',
                '24.11': 'inactie blue portal respawn',
                '25': squares[8],
                '25.1': 'inactive blue portal',
                '25.11': 'inactie blue portal respawn',
                '14': squares[36],
                '14.1': 'red boost inactive',
                '14.11': 'red boost respawn',
                '15': squares[38],
                '15.1': 'blue boost inactive',
                '15.11': 'blue boost respawn',
                '16': squares[7],
                '16.1': 'yellow flag taken',
                '17': squares[21],
                '18': squares[31],
                '23': squares[23],
                'redball': squares[15],
                'blueball': squares[18]
            };


            resolve(squares); // Resolve the Promise with the squares array
        };

        img.onerror = reject; // Handle errors (e.g., if the image fails to load)
    });
}
function makeTriangleTransparent(img, squareSize = 40) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');


        img.onload = () => {
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.drawImage(img, 0, 0);
            // Access pixel data
            const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
            const data = imageData.data;
            const borderColor = [data[400], data[401], data[402], data[403]];

            // Make triangle part transparent
            for (let i = 0; i < squareSize; i ++) {
                for (let j = 0; j < i; j++) {
                    data[(i+squareSize*j)*4+3] = 0;
                }
            }

            /*for(let i = 0; i < 3; i++){
                for(let j = 0; j < squareSize; j++){
                    for (let k = 0; k < 4; k++){
                        data[(i+squareSize*j)*4+k] = borderColor[k];
                    }
                }
            }*/
            //iterateTrapezoid(data, 40, 40, 35, 3);

            // Put the modified data back on the canvas
            ctx.putImageData(imageData, 0, 0);

            // Convert the modified canvas back to a data URL
            const modifiedDataURL = canvas.toDataURL();
            resolve(modifiedDataURL);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image."));
        };
    });
}

function makeBallTransparent(img, squareSize = 40) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');


        img.onload = () => {
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.drawImage(img, 0, 0);
            // Access pixel data
            const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
            const data = imageData.data;
            //const borderColor = [data[400], data[401], data[402], data[403]];

            // Make triangle part transparent
            for (let i = 0; i < squareSize; i ++) {
                for (let j = 0; j < squareSize; j++) {
                    if (Math.abs(i-j) <= 2){
                        data[(i+squareSize*j)*4+3] = 0;
                    }
                }
            }

            /*for(let i = 0; i < 3; i++){
                for(let j = 0; j < squareSize; j++){
                    for (let k = 0; k < 4; k++){
                        data[(i+squareSize*j)*4+k] = borderColor[k];
                    }
                }
            }*/
            //iterateTrapezoid(data, 40, 40, 35, 3);

            // Put the modified data back on the canvas
            ctx.putImageData(imageData, 0, 0);

            // Convert the modified canvas back to a data URL
            const modifiedDataURL = canvas.toDataURL();
            resolve(modifiedDataURL);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image."));
        };
    });
}

function remakeTiles(tiles){//probably turn this into a promise too
    return new Promise((resolve, reject) => {

        //const walls = [0,1,2,5,41,25];
        const walls = [41];
        //const gates = [3,16,39,24];
        //const backgroundTiles = [6,17,28,30,21,31];
        const fullTiles = [3,16,39,24,17,28,30,21,31, 0];
        const partialTiles = [8,20,42,40,15,18,10,12,14,26,27,34,36,38,9,19];
        const balls = [15,18]
        const allTiles = fullTiles.concat(partialTiles);
        //const partialTiles = [34];
        const result = allTiles.map(num => tiles[num]);

        const promises = walls.map(num => makeTriangleTransparent(tiles[num]));
        //.concat(gates.map(num => makeColorTransparent(tiles[num], [[0,1,1]]))).concat(backgroundTiles.map(num => makeColorTransparent(tiles[num], [dummyColor])))

        Promise.all(promises)
            .then((modifiedDataURLs) => {
            modifiedDataURLs.forEach(modifiedDataURL => {

                const modifiedImage = new Image();
                modifiedImage.src = modifiedDataURL;
                //modifiedImage.style.padding = '5px';
                result.push(modifiedImage);

            });
            const canvas = document.createElement('canvas');
                canvas.width = 40;
                canvas.height = 40 * result.length;
                const ctx = canvas.getContext('2d');
                let currenty = 0;

                result.forEach(tile => {
                    ctx.drawImage(tile, 0, currenty, 40, 40);
                    currenty += 40;
                });
                //ctx.drawImage(modifiedImage, 0, currenty, 40, 40);
                currenty += 40;
                document.body.appendChild(canvas);

        })
            .catch((error) => {
            console.error("An error occurred:", error);
        });

        resolve(result); // Resolve the Promise with the squares array

        //img.onerror = reject; // Handle errors (e.g., if the image fails to load)
    });
}
