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
    const imgPath = 'https://tagpro.koalabeast.com/textures/mtbad/tiles.png';
    texture(imgPath).then(squares => {
        const tiles = new Array(2);
        for(let i = 0; i < squares.length; i++){
            document.body.appendChild(squares[i]); // Append to the body to display
        }
        /*separateHalvesBotRightTopLeft(squares[11]).then(tiles => {
            const img = new Image();
            img.src = tiles[0];
            document.body.appendChild(img);
            const img2 = new Image();
            img2.src = tiles[1];
            document.body.appendChild(img2);
        });*/
    }).catch(error => {
        console.error('Error loading texture:', error);
    });
})();

function separateHalvesBotLeftTopRight(img, squareSize = 40){
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const canvas2 = document.createElement('canvas');
        const ctx2 = canvas2.getContext('2d');


        img.onload = () => {
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.drawImage(img, 0, 0);

            canvas2.width = squareSize;
            canvas2.height = squareSize;
            ctx2.drawImage(img, 0, 0);
            // Access pixel data
            const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
            const data = imageData.data;

            const imageData2 = ctx2.getImageData(0, 0, squareSize, squareSize);
            const data2 = imageData2.data;

            for (let i = 0; i < squareSize; i ++) {
                for (let j = squareSize; j > squareSize-i; j--) {
                    data[(j+squareSize*i)*4+3] = 0;
                }
            }

            for (let i = 0; i < squareSize; i ++) {
                for (let j = 0; j < squareSize-i; j++) {
                    data2[(i+squareSize*j)*4+3] = 0;
                }
            }

            // Put the modified data back on the canvas
            ctx.putImageData(imageData, 0, 0);
            ctx2.putImageData(imageData2, 0, 0);

            // Convert the modified canvas back to a data URL
            const modifiedDataURL = canvas.toDataURL();
            const modifiedDataURL2 = canvas2.toDataURL();
            resolve([modifiedDataURL, modifiedDataURL2]);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image."));
        };
    });
}
function separateHalvesBotRightTopLeft(img, squareSize = 40){
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const canvas2 = document.createElement('canvas');
        const ctx2 = canvas2.getContext('2d');


        img.onload = () => {
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.drawImage(img, 0, 0);

            canvas2.width = squareSize;
            canvas2.height = squareSize;
            ctx2.drawImage(img, 0, 0);
            // Access pixel data
            const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
            const data = imageData.data;

            const imageData2 = ctx2.getImageData(0, 0, squareSize, squareSize);
            const data2 = imageData2.data;

            for (let i = 0; i < squareSize; i ++) {
                for (let j = 0; j < i; j++) {
                    data[(i+squareSize*j)*4+3] = 0;
                }
            }

            for (let i = 0; i < squareSize; i ++) {
                for (let j = 0; j < i; j++) {
                    data2[(j+squareSize*i)*4+3] = 0;
                }
            }

            // Put the modified data back on the canvas
            ctx.putImageData(imageData, 0, 0);
            ctx2.putImageData(imageData2, 0, 0);

            // Convert the modified canvas back to a data URL
            const modifiedDataURL = canvas.toDataURL();
            const modifiedDataURL2 = canvas2.toDataURL();
            resolve([modifiedDataURL, modifiedDataURL2]);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image."));
        };
    });
}
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
                    img.style.padding = '5px';
                    squares.push(img);
                }
            }



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
            document.body.appendChild(img);
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.drawImage(img, 0, 0);
            // Access pixel data
            const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
            const data = imageData.data;
            //const borderColor = [data[400], data[401], data[402], data[403]];

            // Make triangle part transparent
            for (let i = 0; i < squareSize; i++) {
                for (let j = 0; j < squareSize; j++) {
                    //i+j <= 12 || i+j >= 68 ||

                    if ((i-19.5) * (i-19.5) + (j-19.5) * (j-19.5) > 324){
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
function make30pxTransparent(img, squareSize = 40) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');


        img.onload = () => {
            document.body.appendChild(img);
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.drawImage(img, 0, 0);
            // Access pixel data
            const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
            const data = imageData.data;

            // Make triangle part transparent
            for (let i = 0; i < squareSize; i++) {
                for (let j = 0; j < squareSize; j++) {
                    //i+j <= 12 || i+j >= 68 ||

                    if ((i-19.5) * (i-19.5) + (j-19.5) * (j-19.5) > 225){
                        data[(i+squareSize*j)*4+3] = 0;
                        //console.log("test");
                    }
                }
            }

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
        console.log(tiles.length);
        const fullTiles = [3,16,39,24,17,28,30,21,31, 0, 8,20,40,42,7,13,23,10,12,14,27,26,38,34,36,19, 43, 9];
        const balls = [15,18]
        const bombsBoosts30px = [8,20,40,42,7,13,23,10,12,14,26,27,26,38,34];
        //const allTiles = fullTiles.concat(partialTiles);
        //const partialTiles = [34];
        const result = fullTiles.map(num => tiles[num]);

        const promises = balls.map(num => makeBallTransparent(tiles[num])).concat(walls.map(num => makeTriangleTransparent(tiles[num])));
        //.concat(gates.map(num => makeColorTransparent(tiles[num], [[0,1,1]]))).concat(backgroundTiles.map(num => makeColorTransparent(tiles[num], [dummyColor])))

        Promise.all(promises)
            .then((modifiedDataURLs) => {
            console.log("test");

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
            console.log(currenty);
            document.body.appendChild(canvas);

        })
            .catch((error) => {
            console.error("An error occurred:", error);
        });

        resolve(result); // Resolve the Promise with the squares array

        //img.onerror = reject; // Handle errors (e.g., if the image fails to load)
    });
}
