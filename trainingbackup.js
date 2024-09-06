// ==UserScript==
// @name         TagPro Training Mode
// @version      1.0
// @description  TP practice while waiting for games
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/playersearch
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.2/pixi.min.js
// @require      https://raw.githubusercontent.com/hecht-software/box2dweb/master/Box2d.min.js
// ==/UserScript==

const TPU = 100;
const ACCELERATION = 1.5;
const DRAGCELERATION = 0.5;
const WALL_DAMPING = -0.6;
const WALL_FRICTION = 0.97;
const PIXELS_PER_METER = 40;

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
                //turn all those data urls into image objects for easier times later on
                if(value[0] === 'd' && value[1] === 'a'){
                    const img = new Image();
                    img.src = value;
                    squares[key] = img;
                }
            }
            training(squares);
        }).catch(error => {
            console.error('Error loading texture:', error);
        });
}

function training(tiles){
    //moonbase
    //const map =  [['0','0','0','1','1','1','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','1','5.1','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','1.2','13.1','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','1.2','5.1','2','2','2','2','2','13','1','1','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','1','1','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','3.1','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0'],['1','10.1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','7','1','0','0','0','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','8','1','0','0','0','0','0','0','0','0','0','0'],['1','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','7','1','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0'],['0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0'],['0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0','0','0','0','0'],['0','0','0','1','2','2','9','9','2','2','2','2','2','2','2','2','2','2','5','2','1.1','1','1','1','0','0','0','0','0','0'],['0','0','0','1','23','2','6.22','2','9','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0','0'],['0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0'],['0','0','0','0','1','2','2','8','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','0','0','0','1','2','2','2','2','2','2','2','2','5','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0'],['0','0','0','0','1','2','2','2','2','2','2','2','2','2','1','1.3','2','2','2','2','2','2','2','2','2','1','0','0','0','0'],['0','0','0','0','1','2','2','2','2','2','2','2','2','2','1.1','1','2','2','2','2','2','2','2','2','2','1','0','0','0','0'],['0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','5.1','2','2','2','2','2','2','2','2','1','0','0','0','0'],['0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','8','2','2','1','0','0','0','0'],['0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0'],['0','0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','9','2','6.12','2','23','1','0','0','0'],['0','0','0','0','0','0','1','1','1','1.3','2','5.1','2','2','2','2','2','2','2','2','2','2','9','9','2','2','1','0','0','0'],['0','0','0','0','0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0'],['0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0'],['0','0','0','0','0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0'],['0','0','0','0','0','0','0','0','0','0','1','7','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','1'],['0','0','0','0','0','0','0','0','0','0','1','8','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','1','7','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','10.1','1'],['0','0','0','0','0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','4.1','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','1','1','1','1','2','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1','1','1','13.11','2','2','2','2','2','5.1','1.4','1'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','2','2','13.1','1.4','1','0'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1.3','2','2','5','1','1','0','0'],['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1','1','1','1','1','0','0','0']];
    //bulldog
    const map = [['1.4','1','1','1','1','1','1','1','1','1','1.3','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0','0','0','0'],['1','1.2','2','2','2','2','2','2','2','1.1','1','1','1','1','2','2','2','2','12','12','12','2','2','2','2','1','1','0','0','0','0','0','0','0','0'],['1','2','2','5','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','12','12','2','14','2','2','2','1','1','0','0','0','0','0','0','0'],['1','2','5','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','12','12','2','2','2','2','2','2','1','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','12','12','2','2','2','2','2','2','1','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','12','12','2','2','2','2','2','2','1','0','0','0','0','0','0','0'],['1','2','2','2','2','2','1.4','1','1','1.3','2','2','2','2','2','2','2','2','12','12','12','2','2','2','2','15','2','1','1.3','0','0','0','0','0','0'],['1','2','2','2','2','2','1','13.1','2','2','2','2','2','2','2','2','2','2','12','12','12','2','2','2','2','2','2','1.1','1','1','0','0','0','0','0'],['1','2','2','2','2','2','1','2','2','2','2','2','2','2','2','2','1','1','1','1','1','1.3','2','2','2','2','2','2','2','1','0','0','0','0','0'],['1','1.3','2','2','2','2','1','2','2','2','2','2','2','2','2','2','1','25','25','1','0','1','2','2','2','2','2','2','2','1','0','0','0','0','0'],['1.1','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','9.3','9.3','1','1','1','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','18','18','11','11','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','18','18','11','11','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','18','18','11','11','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','1.3','2','2','2','2','2','2','2','2','2','2','2','2','2','11','18','18','11','11','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1.1','1','2','2','2','2','2','2','2','2','2','1','2','2','2','11','18','18','11','11','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','9.2','2','2','11','18','18','11','11','2','1','1','2','2','2','2','2','1','0','0','0','0','0'],['0','0','1','1','1','2','2','2','2','2','2','2','2','2','9.2','2','11','18','18','11','11','2','2','2','2','2','2','1.4','1','1','0','0','0','0','0'],['0','0','0','0','1','2','5','2','2','2','2','2','2','2','2','1','1','18','18','11','11','2','2','2','2','2','2','1','10','1','0','0','0','0','0'],['0','0','0','1.4','1','2','2','2','2','2','2','2','2','2','2','2','1.1','1.3','18','11','11','2','2','2','8','2','1.4','1','1','1.2','0','0','0','0','0'],['0','0','1.4','1','1.2','2','2','2','2','2','2','2','2','2','2','8','2','1.1','1','1','1','1','1','1','1','1','1','1.2','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','1.3','2','2','2','2','2','2','2','2','2','1','1.3','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1.4','1','2','2','2','2','2','2','1.2','2','2','2','2','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','1.2','2','2','2','2','2','2','2','2','2','2','1.3','2','2','2','2','2','8','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','1','1.3','2','2','2','2','2','1','1.3','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','1','7','2','2','2','2','2','1.1','1','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','16','2','2','2','1','7','2','2','6.22','2','2','10','1','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','1','7','2','2','2','2','2','1.4','1','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','1','1.2','2','2','2','2','2','1','1.2','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1','1.3','2','2','2','2','2','2','2','2','2','2','1.2','2','2','2','2','2','8','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','1.1','1','2','2','2','2','2','2','1.3','2','2','2','2','2','2','2','2','2','1.4','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','1.2','2','2','2','2','2','2','2','2','2','1','1.2','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1.4','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],['0','0','1.1','1','1.3','2','2','2','2','2','2','2','2','2','2','8','2','1.4','1','1','1','1','1','1','1','1','1','1.3','0','0','0','0','0','0','0'],['0','0','0','1.1','1','2','2','2','2','2','2','2','2','2','2','2','1.4','1.2','17','12','12','2','2','2','8','2','1.1','1','1','1.3','0','0','0','0','0'],['0','0','0','0','1','2','5','2','2','2','2','2','2','2','2','1','1','17','17','12','12','2','2','2','2','2','2','1','10','1','0','0','0','0','0'],['0','0','1','1','1','2','2','2','2','2','2','2','2','2','9.3','2','12','17','17','12','12','2','2','2','2','2','2','1.1','1','1','0','0','0','0','0'],['0','0','1','2','2','2','2','2','2','2','2','2','2','9.3','2','2','12','17','17','12','12','2','1','1','2','2','2','2','2','1','0','0','0','0','0'],['0','1.4','1','2','2','2','2','2','2','2','2','2','1','2','2','2','12','17','17','12','12','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','1.2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','17','17','12','12','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','17','17','12','12','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','17','17','12','12','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','12','17','17','12','12','2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['1.4','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','9.2','9.2','1','1','1','2','2','2','2','2','2','2','1','0','0','0','0','0'],['1','1.2','2','2','2','2','1','2','2','2','2','2','2','2','2','2','1','24','24','1','0','1','2','2','2','2','2','2','2','1','0','0','0','0','0'],['1','2','2','2','2','2','1','2','2','2','2','2','2','2','2','2','1','1','1','1','1','1.2','2','2','2','2','2','2','2','1','0','0','0','0','0'],['1','2','2','2','2','2','1','13.1','2','2','2','2','2','2','2','2','2','2','11','11','11','2','2','2','2','2','2','1.4','1','1','0','0','0','0','0'],['1','2','2','2','2','2','1.1','1','1','1.2','2','2','2','2','2','2','2','2','11','11','11','2','2','2','2','14','2','1','1.2','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','11','11','2','2','2','2','2','2','1','0','0','0','0','0','0','0'],['1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','11','11','2','2','2','2','2','2','1','0','0','0','0','0','0','0'],['1','2','5','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','11','11','2','2','2','2','2','2','1','0','0','0','0','0','0','0'],['1','2','2','5','2','2','2','2','2','2','2','2','2','2','2','2','2','2','11','11','11','2','15','2','2','2','1','1','0','0','0','0','0','0','0'],['1','1.3','2','2','2','2','2','2','2','1.4','1','1','1','1','2','2','2','2','11','11','11','2','2','2','2','1','1','0','0','0','0','0','0','0','0'],['1.1','1','1','1','1','1','1','1','1','1','1.2','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0','0','0','0']];
    document.body.innerHTML = '';
    document.body.style.margin = '0'; // Removes default body margin
    document.body.style.height = '99vh'; // Ensure body fills the viewport height minus a bit for the gap at top
    const gameDiv = document.createElement('div');
    gameDiv.style.display = "flex";
    gameDiv.style.justifyContent = "space-evenly";
    gameDiv.style.width = '100%';
    gameDiv.style.height = Math.min(800, window.innerHeight) + 'px';
    gameDiv.style.marginTop = '1vh';
    document.body.appendChild(gameDiv);

    const app = new PIXI.Application({
        width: Math.min(1280, window.innerWidth), // Width of the canvas
        height: Math.min(800, window.innerHeight), // Height of the canvas
        backgroundColor: 0x000000, // Background color
        resolution: window.devicePixelRatio || 1, // Adjust resolution for HiDPI screens
    });

    const gravity = new Box2D.Common.Math.b2Vec2(0, 0); // No gravity
    const world = new Box2D.Dynamics.b2World(gravity, true); // Allow sleep
    //just make full border walls for now
    createWall(640, 10, 1280, 10, world);   // Top wall
    createWall(640, 790, 1280, 10, world);  // Bottom wall
    createWall(10, 400, 10, 800, world);    // Left wall
    createWall(1270, 400, 10, 800, world);  // Right wall

    // Add the pixi canvas to the body of the page
    gameDiv.appendChild(app.view);

    const mapSprites = []
    for(let i = 0; i < map.length; i++){
        mapSprites.push([]);
        for(let j = 0; j < map[i].length; j++){
            if(map[i][j] != '0'){ //blank space
                mapSprites[i].push(addSpriteToLocation(app, tiles, map[i][j], i*40, j*40, map, i, j));
            }
        }
    }
    const playerSprite = addSpriteToLocation(app, tiles, 'redball', 80, 80);
    playerSprite.anchor.set(0.5,0.5);
    const playerCollision = createBall(80, 80, 19, world);

    const keys = {
        up: false,
        down: false,
        left: false,
        right: false
    };

        //gonna change all this to modify object values like velocity and stuff
        //then use those values in loop?
        //also make variables to remember keydown and add another event for up
        //unsure if thats gonna work how i want it to but well see ig
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowRight': // Move right
                keys.left = false;
                keys.right = true;
                break;
            case 'ArrowLeft': // Move left
                keys.left = true;
                keys.right = false;
                break;
            case 'ArrowUp': // Move up
                keys.up = true;
                keys.down = false;
                break;
            case 'ArrowDown': // Move down
                keys.up = false;
                keys.down = true;
                break;
        }
    });
    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowRight': // Move right
                keys.right = false;
                break;
            case 'ArrowLeft': // Move left
                keys.left = false;
                break;
            case 'ArrowUp': // Move up
                keys.up = false;
                break;
            case 'ArrowDown': // Move down
                keys.down = false;
                break;
        }
    });
    app.ticker.add(delta => loop(delta, playerSprite, playerCollision, world, keys));
}

function createWall(x, y, width, height, world) {
    const wallBodyDef = new Box2D.Dynamics.b2BodyDef();
    wallBodyDef.position.Set(x / 40, y / 40);
    wallBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(wallBodyDef);

    const wallShape = new Box2D.Collision.Shapes.b2PolygonShape();
    wallShape.SetAsBox(width / 40, height / 40); //40px per meter

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = wallShape;
    fixtureDef.friction = 0.5;

    wallBody.CreateFixture(fixtureDef);
}

function createBall(x, y, radius, world) {
    const bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.Set(x / 40, y / 40);

    const dynamicBody = world.CreateBody(bodyDef);

    const circleShape = new Box2D.Collision.Shapes.b2CircleShape();
    circleShape.SetRadius(radius / 40);

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = circleShape;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;
    fixtureDef.restitution = 0.3;


    dynamicBody.CreateFixture(fixtureDef);

    return dynamicBody;
}

function applyForceToBall(keys, ball, dt=1/60) {
    const body = ball.body; // Assuming 'ball.body' is the Box2D body

    // Get the body's current position and velocity
    const velocity = ball.GetLinearVelocity();

    // Forces to be applied
    let forceX = 0;
    let forceY = 0;

    // Apply movement forces
    if (keys.up) {
        forceY -= PIXELS_PER_METER * TPU * ACCELERATION * dt * dt;
    }
    if (keys.down) {
        forceY += PIXELS_PER_METER * TPU * ACCELERATION * dt * dt;
    }
    if (keys.left) {
        forceX -= PIXELS_PER_METER * TPU * ACCELERATION * dt * dt;
    }
    if (keys.right) {
        forceX += PIXELS_PER_METER * TPU * ACCELERATION * dt * dt;
    }

    // Apply forces to the body in Box2D world coordinates
    ball.ApplyForce(
        new Box2D.Common.Math.b2Vec2(forceX, forceY), // Force vector
        ball.GetWorldCenter()                         // Point of application (usually the center)
    );

    // Apply drag (deceleration) to simulate friction
    let dragForceX = 0;
    let dragForceY = 0;

    if (velocity.x < 0) {
        dragForceX = PIXELS_PER_METER * TPU * DRAGCELERATION * dt * dt;
        if (velocity.x + dragForceX > 0) {
            dragForceX = -velocity.x;  // Don't overcompensate
        }
    }
    if (velocity.x > 0) {
        dragForceX = PIXELS_PER_METER * -1 * TPU * DRAGCELERATION * dt * dt;
        if (velocity.x + dragForceX < 0) {
            dragForceX = -velocity.x;
        }
    }
    if (velocity.y < 0) {
        dragForceY = PIXELS_PER_METER * TPU * DRAGCELERATION * dt * dt;
        if (velocity.y + dragForceY > 0) {
            dragForceY = -velocity.y;
        }
    }
    if (velocity.y > 0) {
        dragForceY = PIXELS_PER_METER * -1 * TPU * DRAGCELERATION * dt * dt;
        if (velocity.y + dragForceY < 0) {
            dragForceY = -velocity.y;
        }
    }

    // Apply drag forces
    ball.ApplyForce(
        new Box2D.Common.Math.b2Vec2(dragForceX, dragForceY),
        ball.GetWorldCenter()
    );

}

function addSpriteToLocation(app, tiles, tileNum, x, y, map=[], i=0, j=0) {
    const sprite1 = getSpriteFromTileNum(tiles, tileNum, map, i ,j);
    sprite1.position.x += x; //have to add to position currently because of issues when rotating
    sprite1.position.y += y; //will probably adjust this to just be functions, only affects diagonal walls
    app.stage.addChild(sprite1);
    return sprite1;
}

function getSpriteFromTileNum(tiles, tileNum, map, i, j) {
    let sprite1;
    let sprite2;
    let container = new PIXI.Container();
    switch(tileNum) {
        case '1.1': //botleft
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles['1.1']));
            if(i >= map.length-1 || j <= 0 || map[i][j-1] == '0' || map[i+1][j] == '0'){
                return sprite1;
            }
            else if (map[i][j-1] == '17' || map[i+1][j] == '17') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['17']));
            }
            else if (map[i][j-1] == '18' || map[i+1][j] == '18') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['18']));
            }
            else if (map[i][j-1] == '11' || map[i+1][j] == '11') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['11']));
            }
            else if (map[i][j-1] == '12' || map[i+1][j] == '12') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['12']));
            }
            else if (map[i][j-1] == '23' || map[i+1][j] == '23') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['23']));
            }
            else{
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            }

            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '1.2': //topleft
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles['1.1']));
            if(i >= map.length-1 || j >= map.length-1 || map[i][j+1] == '0' || map[i+1][j] == '0'){
                container.pivot.set(0.5,0.5);
                container.rotation = Math.PI/2;
                sprite1.position.x += 20;
                sprite1.position.y += 20;
                return sprite1;
            }
            else if (map[i][j+1] == '17' || map[i+1][j] == '17') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['17']));
            }
            else if (map[i][j+1] == '18' || map[i+1][j] == '18') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['18']));
            }
            else if (map[i][j+1] == '11' || map[i+1][j] == '11') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['11']));
            }
            else if (map[i][j+1] == '12' || map[i+1][j] == '12') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['12']));
            }
            else if (map[i][j+1] == '23' || map[i+1][j] == '23') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['23']));
            }
            else{
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            }

            container.addChild(sprite2);
            container.addChild(sprite1);
            container.pivot.set(0.5,0.5);
            container.rotation = Math.PI/2;
            container.pivot.set(0,0);
            container.position.x += 40;
            return container;
        case '1.3': //topright
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles['1.1']));
            if(i <= 0 || j >= map.length-1 || map[i][j+1] == '0' || map[i-1][j] == '0'){
                sprite1.anchor.set(0.5,0.5);
                sprite1.rotation = Math.PI;
                sprite1.position.x += 20;
                sprite1.position.y += 20;
                return sprite1;
            }
            else if (map[i][j+1] == '17' && map[i-1][j] == '17') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['17']));
            }
            else if (map[i][j+1] == '18' && map[i-1][j] == '18') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['18']));
            }
            else if (map[i][j+1] == '11' && map[i-1][j] == '11') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['11']));
            }
            else if (map[i][j+1] == '12' && map[i-1][j] == '12') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['12']));
            }
            else if (map[i][j+1] == '23' && map[i-1][j] == '23') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['23']));
            }
            else{
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            }

            container.addChild(sprite2);
            container.addChild(sprite1);
            container.pivot.set(0.5,0.5);
            container.rotation = Math.PI;
            container.pivot.set(0,0);
            container.position.x += 40;
            container.position.y += 40;
            return container;
        case '1.4': //botright
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles['1.1']));
            if(i <= 0 || j <= 0 || map[i][j-1] == '0' || map[i-1][j] == '0'){
                sprite1.anchor.set(0.5,0.5);
                sprite1.rotation = Math.PI * 1.5;
                sprite1.position.x += 20;
                sprite1.position.y += 20;
                return sprite1;
            }
            else if (map[i][j-1] == '17' && map[i-1][j] == '17') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['17']));
            }
            else if (map[i][j-1] == '18' && map[i-1][j] == '18') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['18']));
            }
            else if (map[i][j-1] == '11' && map[i-1][j] == '11') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['11']));
            }
            else if (map[i][j-1] == '12' && map[i-1][j] == '12') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['12']));
            }
            else if (map[i][j-1] == '23' && map[i-1][j] == '23') {
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['23']));
            }
            else{
                sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            }

            container.addChild(sprite2);
            container.addChild(sprite1);
            container.pivot.set(0.5,0.5);
            container.rotation = Math.PI * 1.5;
            container.pivot.set(0,0);
            container.position.y += 40;
            return container;
        case '3.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['3']));
        case '4.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['4']));
        case '5.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['5']));
        case '5.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['5']));
        case '6.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['6.1']));
        case '6.12':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['6.1']));
        case '6.21':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['6.2']));
        case '6.22':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['6.2']));
        case '6.31':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['6.3']));
        case '6.32':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['6.3']));
        case '10.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['10.1']));
        case '13.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['13']));
        case '24.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['24']));
        case '24.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['24']));
        case '25.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['25']));
        case '25.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['25']));
        case '14.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['14']));
        case '14.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['14']));
        case '15.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['15']));
        case '15.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['15']));
        case '16.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['16']));
        default:
            return new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
    }
}

function texture(){
    return new Promise((resolve, reject) => {
        const imgPath = 'https://raw.githubusercontent.com/iodtp/temp/main/funko.png';
        const squareSize = 40;
        const squares = []; // Array to store the data URLs of the squares

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const img = new Image();
        img.crossOrigin = "Anonymous"; //deal with CORS
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

            const tiles = {
                '1': squares[9],
                '1.1': squares[30],
                '1.2': '45upleft',
                '1.3': '45upright',
                '1.4': '45botright',
                '2': squares[26],
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
                '7': squares[27],
                '8': squares[25],
                '9': squares[1],
                '9.1': squares[3],
                '9.2': squares[0],
                '9.3': squares[2],
                '10': squares[21],
                '10.1': squares[23],
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
                'redball': squares[28],
                'blueball': squares[29]
            };


            resolve(tiles); // Resolve the promise with the squares array
        };

        img.onerror = reject; // Handle errors
    });
}

function loop(delta, playerSprite, playerCollision, world, keys) {
    applyForceToBall(keys, playerCollision);
    world.Step(1 / 60, 8, 3); // Update Box2D world
    // Update PixiJS sprite position

    const position = playerCollision.GetPosition();
    const angle = playerCollision.GetAngle();

    playerSprite.x = position.x * 40; // Convert from Box2D units to pixels
    playerSprite.y = position.y * 40;
    //playerSprite.rotation = angle;

    world.ClearForces();
}



