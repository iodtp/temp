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
        const botLeft = [squares[0], squares[17], squares[18], squares[19], squares[20], squares[33], squares[35], squares[39],
                        squares[41], squares[54], squares[57], squares[58], squares[66], squares[67], squares[74], squares[75]];
        const botRight = [squares[11], squares[23], squares[24], squares[25], squares[26], squares[34], squares[36],
                         squares[40], squares[49], squares[50], squares[53], squares[64], squares[65], squares[72],squares[73]];
        const otherTiles = squares.filter((square) => !botLeft.includes(square) && !botRight.includes(square));


        const promises = botLeft.map(img => separateHalvesBotLeftTopRight(img)).concat(botRight.map(img => separateHalvesBotRightTopLeft(img)));
        Promise.all(promises).then((images) => {
            const walls = [];
            images.forEach(imgsrc => {
                const img = new Image();
                img.src = imgsrc[0];
                img.style.padding = '5px';
                walls.push(img);
                const img2 = new Image();
                img2.src = imgsrc[1];
                                img2.style.padding = '5px';

                walls.push(img2);
            });
            for(let i = 0; i < otherTiles.length; i++){
                 document.body.appendChild(otherTiles[i]);
                const p = document.createElement('p');
                p.innerText = i;
                document.body.appendChild(p);
            }

            const diagWalls = {
                "1.1555": walls[60].cloneNode(true),
                "1.2555": walls[0].cloneNode(true),
                "1.3555": walls[33].cloneNode(true),
                "1.4555": walls[25].cloneNode(true),
                "1.1055": walls[32].cloneNode(true),
                "1.2055": walls[8].cloneNode(true),
                "1.3055": walls[59].cloneNode(true),
                "1.4055": walls[21].cloneNode(true),
                "1.1505": walls[58].cloneNode(true),
                "1.2505": walls[2].cloneNode(true),
                "1.3505": walls[57].cloneNode(true),
                "1.4505": walls[1].cloneNode(true),
                "1.1005": walls[56].cloneNode(true),
                "1.2005": walls[30].cloneNode(true),
                "1.3005": walls[55].cloneNode(true),
                "1.4005": walls[3].cloneNode(true),
                "1.1000": walls[52].cloneNode(true),
                "1.2000": otherTiles[139].cloneNode(true),
                "1.3000": otherTiles[134].cloneNode(true),
                "1.4000": walls[19].cloneNode(true)
            };
            const fullWalls = {
                '1.5555': null, //gotta make this one myself smh
                '1.5550': otherTiles[92].cloneNode(true),
                '1.5505': otherTiles[92].cloneNode(true),
                '1.5055': otherTiles[81].cloneNode(true),
                '1.0555': otherTiles[92].cloneNode(true),
                "1.5500": otherTiles[34].cloneNode(true),
                "1.5050": otherTiles[132].cloneNode(true),
                "1.5005": otherTiles[33].cloneNode(true),
                "1.0550": otherTiles[34].cloneNode(true),
                "1.0055": otherTiles[34].cloneNode(true),
                "1.0505": otherTiles[60].cloneNode(true)
            };
            doRotations(fullWalls);

            document.body.appendChild(document.createElement('div'));
            for (const [key, value] of Object.entries(fullWalls)) {
                if (value == null){
                    continue;
                }
                //console.log(value);
                document.body.appendChild(value);
            }
        });
    }).catch(error => {
        console.error('Error loading texture:', error);
    });
})();

function doRotations(fullWalls){
    fullWalls['1.5505'].style.transform = 'rotate(' + 90 + 'deg)';
    fullWalls['1.0555'].style.transform = 'rotate(' + 270 + 'deg)';
    fullWalls['1.0550'].style.transform = 'rotate(' + 90 + 'deg)';
    fullWalls['1.0055'].style.transform = 'rotate(' + 180 + 'deg)';
}
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
