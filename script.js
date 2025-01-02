// ==UserScript==
// @name         TagPro Training Mode
// @version      1.0
// @description  TP practice while waiting for games
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/playersearch
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.20.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.2/pixi.min.js
// @require      https://raw.githubusercontent.com/hecht-software/box2dweb/master/Box2d.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

const TPU = 100;
const ACCELERATION = 1.5;
const DRAGCELERATION = 0.5;
const MAINTENANCEDRAG = 0.6;
const SUPERDRAG = 0.7;
const PIXELS_PER_METER = 40;
const WALL_FRICTION = 0.5;
const MAX_SPEED = 6.25;
const BOOST_SPEED = 0.3;

const LEADERBOARD_LENGTH = 5;


const WIDTH = Math.min(1280, window.innerWidth);
const HEIGHT = Math.min(800, window.innerHeight);

let tilesExtracted = {};
let done = false;

const entityCategory = { //who collides with me?
    EVERYONE : 0x0001,
    RED_TEAM : 0x0002,
    BLUE_TEAM : 0x0004,
    NO_ONE : 0x0008,
};

(function() {
    'use strict';
    console.log(tf); // Should log the TensorFlow.js object if successfully imported

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
        tilesExtracted = squares;
        //spikemazeEz
        //const spawn = [80, 680];
        //const map = [["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","7","7","7","7","7","7","7","7","7","2","2","2","7"],["7","2","2","2","2","7","7","7","2","2","2","2","2","2","2","16","2","2","2","7"],["7","2","2","2","7","7","2","2","2","2","7","7","7","7","7","7","2","2","2","7"],["7","2","2","2","7","2","2","2","2","2","7","2","2","2","2","7","7","7","7","7"],["7","2","2","7","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","7"],["7","2","2","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","2","7"],["7","2","7","7","2","2","2","7","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","7","7","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","2","7","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","2","7","2","7","7","7","7","7","7","7","2","2","2","2","2","7"],["7","7","2","2","2","7","7","7","2","2","2","2","2","2","7","2","2","2","2","7"],["7","7","2","2","2","2","2","2","2","2","2","2","2","2","7","2","2","2","2","7"],["7","7","7","2","2","2","2","2","2","2","2","2","2","2","7","7","7","7","7","7"],["7","2","7","7","7","7","7","2","2","2","2","2","2","2","2","17","18","17","18","7"],["7","2","2","2","2","2","7","7","7","7","2","2","2","2","2","18","17","18","17","7"],["7","2","2","2","2","2","2","2","2","7","7","7","7","7","2","17","18","17","18","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
        //snipersEz
        //const map =[["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","5","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
        //const spawn = [620,700];
        //ofm
        const map = [["1.50050050","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.00550500"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","16","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.55000005","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.05505000"]];
        const spawn = [60,700];
        training(tilesExtracted, spawn, map, "OFM (Easy)");
    }).catch(error => {
        console.error('Error loading texture:', error);
    });
}

function training(tiles, spawn, map, value){
    //could switch to regex but could also mess stuff up in future
    const spikeMaze = value === "Spike Maze (Easy)" || value === "Spike Maze (Medium)" || value === "Spike Maze (Hard)";
    const snipers = value === "Snipers (Easy)" || value === "Snipers (Medium)" || value === "Snipers (Hard)";
    const ofm = value === "OFM (Easy)" || value === "OFM (Medium)" || value === "OFM (Hard)";
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
        width: WIDTH, // Width of the canvas
        height: HEIGHT, // Height of the canvas
        backgroundColor: 0x000000, // Background color
        resolution: window.devicePixelRatio || 1, // Adjust resolution for HiDPI screens
        //antialias: false // Disable anti-aliasing for wall gaps
    });
    const select = addSelection(gameDiv, value, app);

    const gravity = new Box2D.Common.Math.b2Vec2(0, 0); // No gravity
    const world = new Box2D.Dynamics.b2World(gravity, true); // Allow sleep

    // Add the pixi canvas to the body of the page
    gameDiv.appendChild(app.view);

    const mapSprites = [];
    for(let i = 0; i < map.length; i++){
        mapSprites.push([]);
        for(let j = 0; j < map[i].length; j++){
            const current_tile = map[i][j];
            if(current_tile != '0'){ //blank space
                const x = i * 40;
                const y = j *40;
                mapSprites[i].push(addSpriteToLocation(app, tiles, current_tile, x, y, map, i, j));
                let vertices = []
                switch(current_tile) {
                    case '1':
                        createWall(x,y,40,40, world);
                        break;
                    case '5':
                        createBoost(x,y,15,world, '5');
                        break;
                    case '14':
                        createBoost(x,y,15,world, '14');
                        break;
                    case '15':
                        createBoost(x,y,15,world, '15');
                        break;
                    case '7':
                        createSpike(x,y,14,world);
                        break;
                    case '9.1':
                        createGate(x,y,40,40, world, '9.1');
                        break;
                    case '9.2':
                        createGate(x,y,40,40, world, '9.2');
                        break;
                    case '9.3':
                        createGate(x,y,40,40, world, '9.3');
                        break;
                    case '16':
                        createFlag(x,y,15, world, '16');
                        break;
                    case '17':
                        createEndzone(x,y,40,40, world, '17');
                        break;
                    default:
                        if(/(^1[.]1.*$)/.test(current_tile)){
                            vertices = [new Box2D.Common.Math.b2Vec2(0, 1), new Box2D.Common.Math.b2Vec2(0, 0), new Box2D.Common.Math.b2Vec2(1, 1)];
                            createNonSquareWall(x, y, vertices, world);
                        }
                        else if(/(^1[.]2.*$)/.test(current_tile)){
                            vertices = [new Box2D.Common.Math.b2Vec2(0, 1), new Box2D.Common.Math.b2Vec2(0, 0), new Box2D.Common.Math.b2Vec2(1, 0)];
                            createNonSquareWall(x, y, vertices, world);
                        }
                        else if(/(^1[.]3.*$)/.test(current_tile)){
                            vertices = [new Box2D.Common.Math.b2Vec2(0, 0), new Box2D.Common.Math.b2Vec2(1, 0), new Box2D.Common.Math.b2Vec2(1, 1)];
                            createNonSquareWall(x, y, vertices, world);
                        }
                        else if(/(^1[.]4.*$)/.test(current_tile)){
                            vertices = [new Box2D.Common.Math.b2Vec2(1, 0), new Box2D.Common.Math.b2Vec2(1, 1), new Box2D.Common.Math.b2Vec2(0, 1)];
                            createNonSquareWall(x, y, vertices, world);
                        }
                        else if(/^1[.](0|5).*$/.test(current_tile)){
                            createWall(x,y,40,40, world);
                        }
                }
            }
            else{
                mapSprites[i].push(null);
            }
        }
    }

    const playerSprite = addSpriteToLocation(app, tiles, 'redball', spawn[0], spawn[1]);
    const playerFlag = new PIXI.Sprite(PIXI.Texture.from(tiles['16']));
    playerFlag.visible = false;
    const playerCollision = createBall(spawn[0], spawn[1], 19, world, "redball");
    const player = {};
    playerSprite.anchor.set(0.5,0.5);
    player.playerSprite = playerSprite;
    player.playerFlagYellow = playerFlag;
    player.playerFlag = playerFlag;
    player.playerCollision = playerCollision;
    player.hasFlag = false;
    player.flagLoc = null;
    player.dead = false;
    player.lost = false; //only set when we hit a spike
    player.hold = 0.0;
    player.tags = 0;
    player.taggable = false;

    const enemy = {};
    if(snipers){
        const enemySpawnY = 420 + (Math.random()*2 -1) * 100;
        const enemySpawnX = 500 + (Math.random()*2 -1) * 300;
        const blueBall = addSpriteToLocation(app, tiles, 'blueball', enemySpawnX, enemySpawnY);
        blueBall.anchor.set(0.5,0.5);
        const flag = new PIXI.Sprite(PIXI.Texture.from(tiles['16']));
        enemy.playerSprite = blueBall;
        enemy.playerFlagYellow = flag;
        enemy.playerFlag = enemy.playerFlagYellow;
        enemy.playerFlag.visible = true;
        const enemyCollision = createBall(enemySpawnX, enemySpawnY, 19, world, "blueball");
        enemy.playerCollision = enemyCollision;
        enemy.hasFlag = true;
    }
    else if (ofm){
        const enemySpawnY = 60;
        const enemySpawnX = 940;
        const blueBall = addSpriteToLocation(app, tiles, 'blueball', enemySpawnX, enemySpawnY);
        blueBall.anchor.set(0.5,0.5);
        const flag = new PIXI.Sprite(PIXI.Texture.from(tiles['16']));
        enemy.playerSprite = blueBall;
        enemy.playerFlagYellow = flag;
        enemy.playerFlag = enemy.playerFlagYellow;
        enemy.playerFlag.visible = false;
        const enemyCollision = createBall(enemySpawnX, enemySpawnY, 19, world, "blueball");
        enemy.playerCollision = enemyCollision;
        enemy.hasFlag = false;
        enemy.taggable = false;
    }

    const keys = {
        up: false,
        down: false,
        left: false,
        right: false
    };


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

    // Implement the contact listener
    let listener = new Box2D.Dynamics.b2ContactListener();

    // Called when two fixtures begin to overlap
    listener.BeginContact = function(contact) {
        let fixtureA = contact.GetFixtureA();
        let fixtureB = contact.GetFixtureB();


        // Check if both of the fixtures are
        let data1 = fixtureA.GetBody().GetUserData();
        let data2 = fixtureB.GetBody().GetUserData();
        let type1 = data1.type;
        let type2 = data2.type;
        if(type1 === 'redball') {
            switch(type2){
                case '5':
                    applyExtraForceToBall(fixtureA.GetBody());
                    break;
                case '14':
                    applyExtraForceToBall(fixtureA.GetBody());
                    break;
                case '7':
                    if(!enemy.dead){
                        playerDeath(player, mapSprites, keys, enemy);
                        player.lost = true;
                    }
                    break;
                case '9.1':
                    playerDeath(player, mapSprites, keys, enemy);
                    break;
                case '9.3':
                    playerDeath(player, mapSprites, keys, enemy);
                    break;
                case '16': //nf
                    if(player.hasFlag || enemy.hasFlag){
                        break;
                    }
                    if(player.flagLoc && !mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible){
                        break;
                    }
                    if(enemy.flagLoc && !mapSprites[enemy.flagLoc[0]][enemy.flagLoc[1]].visible){
                        break;
                    }
                    player.hasFlag = true;
                    player.flagLoc = pixelsToLoc(data2.x, data2.y);
                    player.playerFlag = player.playerFlagYellow;
                    player.playerFlag.visible = true;
                    mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = false;
                    setTimeout(() => {
                        console.log("taggable!");
                        player.taggable = true;
                    }, "250");
                    break;
                case '17': //red endzone
                    if(player.hasFlag){
                        player.hasFlag = false;
                        player.playerFlag.visible = false;
                        mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = true;
                        if(value === "Spike Maze (Easy)"){
                            addWinningText(app, player.hold);
                            let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": []}'));
                            let mazeLeader = leaderboard.spikeMazeEasy;

                            if(mazeLeader.length < LEADERBOARD_LENGTH){
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, LEADERBOARD_LENGTH);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, LEADERBOARD_LENGTH);
                            }
                            leaderboard.spikeMazeEasy = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys, enemy);

                        }
                        else if(value === "Spike Maze (Medium)"){
                            addWinningText(app, player.hold);
                            let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": []}'));
                            let mazeLeader = leaderboard.spikeMazeMed;

                            if(mazeLeader.length < LEADERBOARD_LENGTH){
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, LEADERBOARD_LENGTH);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, LEADERBOARD_LENGTH);
                            }
                            leaderboard.spikeMazeMed = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys, enemy);
                        }
                        else if(value === "Spike Maze (Hard)"){
                            addWinningText(app, player.hold);
                            let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": [], "snipersEasy": [], "snipersMed": [], "snipersHard": []}'));
                            let mazeLeader = leaderboard.spikeMazeHard;

                            if(mazeLeader.length < LEADERBOARD_LENGTH){
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            leaderboard.spikeMazeHard = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys, enemy);
                        }
                    }
                    break;
                case 'blueball':
                    if(enemy.hasFlag && !player.dead){

                        if(!snipers){//yes just ofm atm but general idea too
                            if(!enemy.taggable){
                                break;
                            }
                            player.hasFlag = true;
                            player.playerFlag.visible = true;
                            player.taggable = true;
                            if(enemy.flagLoc){
                                player.flagLoc = enemy.flagLoc;
                                enemy.flagLoc = null;
                            }
                            addPopForceToBall(fixtureA, fixtureB);
                        }
                        playerDeath(enemy, mapSprites, structuredClone(keys), player); //clone because we dont want to actually reset kesy
                    }
                    if(player.hasFlag && !enemy.dead){

                        if(!snipers){//yes just ofm atm but general idea too
                            if(!player.taggable){
                                break;
                            }
                            enemy.hasFlag = true;
                            enemy.playerFlag.visible = true;
                            enemy.taggable = true;
                            if(player.flagLoc){
                                enemy.flagLoc = player.flagLoc;
                                player.flagLoc = null;
                            }
                            addPopForceToBall(fixtureB, fixtureA);
                        }
                        playerDeath(player, mapSprites, keys, enemy);
                    }
                    break;
            }
        }
        else if (type2 === 'redball') {
            switch(type1){
                case '5':
                    applyExtraForceToBall(fixtureB.GetBody());
                    break;
                case '14':
                    applyExtraForceToBall(fixtureB.GetBody());
                    break;
                case '7':
                    if(!enemy.dead){
                        playerDeath(player, mapSprites, keys, enemy);
                        player.lost = true;
                    }
                    break;
                case '9.1':
                    playerDeath(player, mapSprites, keys, enemy);
                    break;
                case '9.3':
                    playerDeath(player, mapSprites, keys, enemy);
                    break;
                case '16':
                    if(player.hasFlag || enemy.hasFlag){
                        break;
                    }
                    if(player.flagLoc && !mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible){
                        break;
                    }
                    if(enemy.flagLoc && !mapSprites[enemy.flagLoc[0]][enemy.flagLoc[1]].visible){
                        break;
                    }
                    player.hasFlag = true;
                    player.flagLoc = pixelsToLoc(data1.x, data1.y);
                    player.playerFlag = player.playerFlagYellow;
                    player.playerFlag.visible = true;
                    mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = false;
                    setTimeout(() => {
                        player.taggable = true;
                    }, "250");
                    break;
                case '17': //red endzone
                    if(player.hasFlag){
                        player.hasFlag = false;
                        player.playerFlag.visible = false;
                        mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = true;
                        if(value === "Spike Maze (Easy)"){
                            addWinningText(app, player.hold);
                            let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": [], "snipersEasy": [], "snipersMed": [], "snipersHard": []}'));
                            let mazeLeader = leaderboard.spikeMazeEasy;

                            if(mazeLeader.length < LEADERBOARD_LENGTH){
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, LEADERBOARD_LENGTH);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, LEADERBOARD_LENGTH);
                            }
                            leaderboard.spikeMazeEasy = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys, enemy);
                        }
                        else if(value === "Spike Maze (Medium)"){
                            addWinningText(app, player.hold);
                            let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": [], "snipersEasy": [], "snipersMed": [], "snipersHard": []}'));
                            let mazeLeader = leaderboard.spikeMazeMed;

                            if(mazeLeader.length < LEADERBOARD_LENGTH){
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            leaderboard.spikeMazeMed = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys, enemy);
                        }
                        else if(value === "Spike Maze (Hard)"){
                            addWinningText(app, player.hold);
                            let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": [], "snipersEasy": [], "snipersMed": [], "snipersHard": []}'));
                            let mazeLeader = leaderboard.spikeMazeHard;

                            if(mazeLeader.length < LEADERBOARD_LENGTH){
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            leaderboard.spikeMazeHard = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys, enemy);
                        }
                    }
                    break;
                case 'blueball':
                    if(enemy.hasFlag && !player.dead){

                        if(!snipers){//yes just ofm atm but general idea too
                            if(!enemy.taggable){
                                break;
                            }
                            if(enemy.flagLoc){
                                player.flagLoc = enemy.flagLoc;
                                enemy.flagLoc = null;
                            }
                            player.hasFlag = true;
                            player.taggable = true;
                            player.playerFlag.visible = true;
                            addPopForceToBall(fixtureB, fixtureA);
                        }
                        playerDeath(enemy, mapSprites, structuredClone(keys), player); //clone because we dont want to actually reset kesy
                    }
                    if(player.hasFlag && !enemy.dead){

                        if(!snipers){//yes just ofm atm but general idea too
                            if(!player.taggable){
                                break;
                            }
                            if(player.flagLoc){
                                enemy.flagLoc = player.flagLoc;
                                player.flagLoc = null;
                            }
                            enemy.hasFlag = true;
                            enemy.taggable = true;
                            enemy.playerFlag.visible = true;
                            addPopForceToBall(fixtureA, fixtureB);
                        }
                        playerDeath(player, mapSprites, keys, enemy);
                    }
                    break;
            }
        }
        if(type1 === 'blueball'){ //dont recheck collisions here
            switch(type2){
                case '16': //nf
                    if(player.hasFlag || enemy.hasFlag){
                        break;
                    }
                    if(player.flagLoc && !mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible){
                        break;
                    }
                    if(enemy.flagLoc && !mapSprites[enemy.flagLoc[0]][enemy.flagLoc[1]].visible){
                        break;
                    }
                    enemy.hasFlag = true;
                    enemy.flagLoc = pixelsToLoc(data2.x, data2.y);
                    enemy.playerFlag = enemy.playerFlagYellow;
                    enemy.playerFlag.visible = true;
                    mapSprites[enemy.flagLoc[0]][enemy.flagLoc[1]].visible = false;
                    setTimeout(() => {
                        enemy.taggable = true;
                    }, "250");
                    break;
            }
        }
        else if(type2 === "blueball"){
            switch(type2){
                case '16': //nf
                    if(player.hasFlag || enemy.hasFlag){
                        break;
                    }
                    if(player.flagLoc && !mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible){
                        break;
                    }
                    if(enemy.flagLoc && !mapSprites[enemy.flagLoc[0]][enemy.flagLoc[1]].visible){
                        break;
                    }
                    enemy.hasFlag = true;
                    enemy.flagLoc = pixelsToLoc(data2.x, data2.y);
                    enemy.playerFlag = enemy.playerFlagYellow;
                    enemy.playerFlag.visible = true;
                    mapSprites[enemy.flagLoc[0]][enemy.flagLoc[1]].visible = false;
                    setTimeout(() => {
                        enemy.taggable = true;
                    }, "250");
                    break;
            }
        }
    };

    // Assign the listener to the world
    world.SetContactListener(listener);

    if(spikeMaze){
        app.ticker.add(delta => spikeLoop(delta, player, world, keys, app, spawn));
    }
    else if(snipers){
        app.ticker.add(delta => snipersLoop(delta, player, enemy, world, keys, app, spawn, value));
    }
    else if(ofm){
        const pretrainedWeights = [
            [
                [
                    -0.255289226770401,
                    0.04052305221557617,
                    0.11353012919425964,
                    0.05128699541091919,
                    0.2670235335826874,
                    -0.18652719259262085,
                    -0.2792620360851288,
                    0.07903069257736206,
                    0.11220061779022217,
                    -0.1832520067691803,
                    0.2351451814174652,
                    0.18755102157592773,
                    0.10349512100219727,
                    0.12412545084953308,
                    -0.1717091053724289,
                    -0.20708847045898438,
                    0.2720441520214081,
                    0.2514423429965973,
                    -0.11800763010978699,
                    0.2098788619041443,
                    0.18107745051383972,
                    -0.006225287914276123,
                    -0.18442553281784058,
                    -0.27629804611206055,
                    0.2717888057231903,
                    0.00913575291633606,
                    -0.0030657947063446045,
                    -0.07636617124080658,
                    0.08953997492790222,
                    -0.055924639105796814,
                    -0.1737622767686844,
                    -0.22244572639465332,
                    0.031560271978378296,
                    0.07959985733032227,
                    -0.13937760889530182,
                    -0.16684940457344055,
                    -0.1599215269088745,
                    -0.00412297248840332,
                    0.006443828344345093,
                    0.16312718391418457,
                    -0.010974466800689697,
                    -0.21152231097221375,
                    -0.10436715185642242,
                    -0.12892799079418182,
                    -0.11403781175613403,
                    -0.10719534754753113,
                    -0.21905291080474854,
                    -0.14570724964141846,
                    -0.008268684148788452,
                    0.10987409949302673,
                    0.1512705683708191,
                    0.06512957811355591,
                    0.05058985948562622,
                    -0.22592395544052124,
                    0.1953488290309906,
                    -0.11731685698032379,
                    -0.023434758186340332,
                    -0.28174418210983276,
                    -0.23308700323104858,
                    -0.17948132753372192,
                    0.20661821961402893,
                    0.22396835684776306,
                    0.03784090280532837,
                    0.04990389943122864
                ],
                [
                    -0.07219493389129639,
                    -0.07137517631053925,
                    0.044236719608306885,
                    -0.03454601764678955,
                    -0.0773167610168457,
                    0.18264034390449524,
                    0.17709806561470032,
                    -0.20988476276397705,
                    0.21141910552978516,
                    -0.0030793845653533936,
                    0.1569139063358307,
                    0.04471588134765625,
                    0.26204392313957214,
                    0.04404208064079285,
                    -0.24094706773757935,
                    0.0716552734375,
                    -0.24246647953987122,
                    0.20851585268974304,
                    -0.057526275515556335,
                    0.09221690893173218,
                    -0.12406869232654572,
                    -0.13266542553901672,
                    0.2745157778263092,
                    -0.2663070261478424,
                    -0.10333585739135742,
                    0.2610304057598114,
                    0.26929590106010437,
                    -0.05455416440963745,
                    -0.21365830302238464,
                    -0.21546252071857452,
                    -0.11660891771316528,
                    -0.0808715671300888,
                    -0.148543119430542,
                    -0.280562162399292,
                    -0.00787287950515747,
                    -0.014245301485061646,
                    0.18823349475860596,
                    -0.13291457295417786,
                    -0.08833399415016174,
                    0.03456348180770874,
                    0.2652338445186615,
                    0.0831727385520935,
                    0.23628994822502136,
                    -0.17400586605072021,
                    0.03012707829475403,
                    0.0939687192440033,
                    0.0726563036441803,
                    -0.2163258045911789,
                    0.04068830609321594,
                    -0.2163270264863968,
                    0.2592705190181732,
                    -0.02907431125640869,
                    0.24085518717765808,
                    -0.19694530963897705,
                    0.14065054059028625,
                    -0.08173172175884247,
                    -0.14183540642261505,
                    -0.08218982815742493,
                    0.046695321798324585,
                    -0.18163584172725677,
                    -0.20585858821868896,
                    -0.09697186946868896,
                    0.22323814034461975,
                    0.2566182315349579
                ],
                [
                    0.25304147601127625,
                    0.1639072299003601,
                    0.16214048862457275,
                    -0.2486652433872223,
                    -0.11420474946498871,
                    0.10879731178283691,
                    0.14763733744621277,
                    0.23778679966926575,
                    0.2719726264476776,
                    -0.06750936806201935,
                    0.11490693688392639,
                    -0.26947885751724243,
                    0.2563704550266266,
                    0.12800389528274536,
                    -0.26369744539260864,
                    -0.20861122012138367,
                    0.04772120714187622,
                    -0.21249495446681976,
                    -0.17416954040527344,
                    0.22900143265724182,
                    -0.23241883516311646,
                    -0.24671593308448792,
                    -0.21590611338615417,
                    -0.23086227476596832,
                    0.26084259152412415,
                    -0.13166800141334534,
                    -0.21231688559055328,
                    -0.006374090909957886,
                    0.27615317702293396,
                    0.11203312873840332,
                    0.22444263100624084,
                    -0.20554359257221222,
                    -0.0822732001543045,
                    -0.1744181513786316,
                    0.057109177112579346,
                    -0.11337250471115112,
                    -0.24921201169490814,
                    0.07082688808441162,
                    0.2722682058811188,
                    0.22126874327659607,
                    -0.04024748504161835,
                    -0.05598655343055725,
                    -0.0808078795671463,
                    0.08599713444709778,
                    0.19169509410858154,
                    0.16088372468948364,
                    -0.10244874656200409,
                    0.16521498560905457,
                    0.09230583906173706,
                    -0.10229097306728363,
                    -0.22714833915233612,
                    -0.10403510928153992,
                    0.1304740309715271,
                    0.23930135369300842,
                    -0.2581532597541809,
                    -0.10635386407375336,
                    -0.1049237847328186,
                    0.22376766800880432,
                    0.16356459259986877,
                    -0.1811847984790802,
                    -0.05496658384799957,
                    -0.1596057116985321,
                    0.07369983196258545,
                    -0.2815794050693512
                ],
                [
                    0.04966384172439575,
                    0.11253651976585388,
                    0.02337929606437683,
                    -0.11925353109836578,
                    -0.08829109370708466,
                    -0.20588067173957825,
                    -0.06873083114624023,
                    -0.10933840274810791,
                    -0.26626166701316833,
                    0.1846013069152832,
                    -0.13104090094566345,
                    -0.15609611570835114,
                    0.1694115400314331,
                    0.21760430932044983,
                    0.22986295819282532,
                    -0.05369061231613159,
                    0.1258859634399414,
                    -0.09589500725269318,
                    0.07717195153236389,
                    0.14364972710609436,
                    0.1279486119747162,
                    -0.24321047961711884,
                    -0.07821471989154816,
                    -0.01883140206336975,
                    0.05061781406402588,
                    -0.035610124468803406,
                    -0.03802540898323059,
                    -0.20145151019096375,
                    0.16567641496658325,
                    -0.15030109882354736,
                    0.27543118596076965,
                    -0.03654101490974426,
                    0.09011507034301758,
                    -0.06484104692935944,
                    0.06131720542907715,
                    0.08924508094787598,
                    -0.10656146705150604,
                    -0.12843355536460876,
                    0.02226334810256958,
                    -0.2171386480331421,
                    -0.20356374979019165,
                    0.17780539393424988,
                    0.0864594578742981,
                    -0.0903858095407486,
                    -0.0766199380159378,
                    0.06439760327339172,
                    -0.11299103498458862,
                    0.02037784457206726,
                    0.22725394368171692,
                    -0.27812692523002625,
                    -0.23495367169380188,
                    -0.21312204003334045,
                    0.23042699694633484,
                    0.16326037049293518,
                    -0.01634681224822998,
                    -0.05186976492404938,
                    -0.20394697785377502,
                    0.05480027198791504,
                    0.07322767376899719,
                    -0.11268213391304016,
                    -0.06830346584320068,
                    -0.2509641647338867,
                    -0.23848886787891388,
                    -0.09001187980175018
                ],
                [
                    83.07157897949219,
                    -0.16087794303894043,
                    -0.005368787329643965,
                    -0.00021982192993164062,
                    82.83268737792969,
                    83.09829711914062,
                    -0.22521647810935974,
                    82.94700622558594,
                    82.71256256103516,
                    83.0669937133789,
                    82.85868072509766,
                    -0.16320884227752686,
                    82.95332336425781,
                    -0.2606607675552368,
                    82.3214111328125,
                    82.55872344970703,
                    -0.0936945229768753,
                    82.68938446044922,
                    82.88329315185547,
                    -0.11873221397399902,
                    82.82579040527344,
                    -0.01006510853767395,
                    82.39955139160156,
                    83.01038360595703,
                    82.88831329345703,
                    82.5381851196289,
                    83.00867462158203,
                    -0.17833447456359863,
                    -0.2623768448829651,
                    82.807373046875,
                    82.72004699707031,
                    82.84532165527344,
                    0.00649259053170681,
                    82.38247680664062,
                    -0.08594851195812225,
                    82.37545776367188,
                    82.98055267333984,
                    82.56969451904297,
                    -0.16441529989242554,
                    82.76663970947266,
                    82.84748840332031,
                    -0.13336841762065887,
                    0.003609061473980546,
                    83.05403900146484,
                    82.93900299072266,
                    -0.08053259551525116,
                    83.05104064941406,
                    82.88053131103516,
                    -0.22267946600914001,
                    82.89988708496094,
                    82.99514770507812,
                    82.43763732910156,
                    83.0185775756836,
                    -0.054152458906173706,
                    82.6507797241211,
                    -0.05973382294178009,
                    82.47013092041016,
                    83.0811996459961,
                    82.72318267822266,
                    82.89276885986328,
                    82.8923568725586,
                    82.93414306640625,
                    -0.25284406542778015,
                    -0.04449056088924408
                ],
                [
                    -0.24802632629871368,
                    0.06171327829360962,
                    0.24964430928230286,
                    0.2529357969760895,
                    -0.07536487281322479,
                    0.2576993405818939,
                    0.04344445466995239,
                    0.10487598180770874,
                    0.2594400942325592,
                    0.1044241189956665,
                    -0.21667781472206116,
                    0.044582873582839966,
                    -0.020394623279571533,
                    -0.17793460190296173,
                    0.2347220480442047,
                    0.002871900796890259,
                    0.15100842714309692,
                    -0.19288098812103271,
                    0.15671736001968384,
                    -0.06092508137226105,
                    -0.09740506112575531,
                    0.18483558297157288,
                    0.026955902576446533,
                    -0.052636370062828064,
                    -0.07297646999359131,
                    0.011162102222442627,
                    0.09078478813171387,
                    0.06540495157241821,
                    0.10854259133338928,
                    -0.012684255838394165,
                    -0.277960866689682,
                    -0.07113884389400482,
                    -0.2375735193490982,
                    0.19564476609230042,
                    0.09818348288536072,
                    0.14477133750915527,
                    0.005683183670043945,
                    -0.245462566614151,
                    -0.12276563048362732,
                    -0.05757713317871094,
                    -0.09598143398761749,
                    -0.06391334533691406,
                    -0.03264215588569641,
                    -0.21372096240520477,
                    -0.09286375343799591,
                    -0.09298717975616455,
                    0.12086772918701172,
                    0.1523241400718689,
                    0.06916707754135132,
                    0.07622075080871582,
                    -0.19172687828540802,
                    -0.24888642132282257,
                    0.12808895111083984,
                    -0.21334722638130188,
                    0.21500250697135925,
                    -0.1872464120388031,
                    -0.04295028746128082,
                    -0.03816206753253937,
                    -0.027988910675048828,
                    -0.06637406349182129,
                    0.04010051488876343,
                    -0.041953206062316895,
                    0.11850124597549438,
                    0.21043437719345093
                ],
                [
                    0.09199586510658264,
                    -0.05563400685787201,
                    0.2552013695240021,
                    -0.22602185606956482,
                    -0.0907084196805954,
                    -0.25720980763435364,
                    0.003588080406188965,
                    0.11753350496292114,
                    0.15595999360084534,
                    -0.2148764431476593,
                    0.2721111476421356,
                    0.0770287811756134,
                    -0.09650397300720215,
                    0.17691680788993835,
                    0.07006090879440308,
                    -0.026010215282440186,
                    -0.0007241666316986084,
                    0.0840311348438263,
                    0.0424785315990448,
                    0.1705150604248047,
                    0.27922675013542175,
                    -0.2649497985839844,
                    -0.02705046534538269,
                    -0.045010045170784,
                    0.15756264328956604,
                    0.08572527766227722,
                    0.07472407817840576,
                    -0.08376696705818176,
                    -0.15384633839130402,
                    0.009692668914794922,
                    -0.220486581325531,
                    -0.15608347952365875,
                    -0.025380730628967285,
                    -0.1781821846961975,
                    -0.17659583687782288,
                    -0.1249278336763382,
                    0.0429423451423645,
                    -0.0964781790971756,
                    -0.22744616866111755,
                    -0.08847473561763763,
                    -0.009276032447814941,
                    0.15721803903579712,
                    0.10616031289100647,
                    -0.21818441152572632,
                    -0.08932620286941528,
                    0.10390713810920715,
                    -0.24342188239097595,
                    -0.14973144233226776,
                    -0.2513327896595001,
                    -0.20577529072761536,
                    0.06553095579147339,
                    0.22681006789207458,
                    0.03721007704734802,
                    0.2658495008945465,
                    0.17813345789909363,
                    -0.10451915860176086,
                    0.2148236334323883,
                    -0.2106996327638626,
                    0.028555572032928467,
                    0.14191964268684387,
                    -0.06720481812953949,
                    0.22159400582313538,
                    0.25721028447151184,
                    0.09556195139884949
                ],
                [
                    -0.27811089158058167,
                    0.0797087550163269,
                    -0.18813826143741608,
                    0.009374856948852539,
                    -0.26456770300865173,
                    -0.1573898047208786,
                    0.01785549521446228,
                    0.1991240680217743,
                    0.061898261308670044,
                    0.041287750005722046,
                    0.15693697333335876,
                    0.26424744725227356,
                    0.08907356858253479,
                    -0.19873906672000885,
                    0.21952053904533386,
                    -0.17533084750175476,
                    0.2708418667316437,
                    0.04759865999221802,
                    0.0046453773975372314,
                    -0.19272884726524353,
                    -0.2669447660446167,
                    0.001579582691192627,
                    -0.2609044015407562,
                    -0.006536692380905151,
                    0.16276350617408752,
                    0.24331125617027283,
                    0.175947904586792,
                    -0.23129405081272125,
                    0.03927525877952576,
                    0.1759990155696869,
                    -0.0033822357654571533,
                    -0.01920926570892334,
                    -0.14013810455799103,
                    0.07076817750930786,
                    0.08706235885620117,
                    -0.05473454296588898,
                    -0.20000126957893372,
                    -0.02908700704574585,
                    -0.2517735958099365,
                    0.17182058095932007,
                    -0.08066585659980774,
                    -0.056316494941711426,
                    -0.06241774559020996,
                    0.10963651537895203,
                    -0.06601892411708832,
                    -0.2490643560886383,
                    0.01546451449394226,
                    0.2756684720516205,
                    -0.09096211194992065,
                    -0.068206787109375,
                    -0.18037718534469604,
                    -0.25956088304519653,
                    -0.07565014064311981,
                    0.005938202142715454,
                    -0.14804868400096893,
                    -0.022602587938308716,
                    -0.24685843288898468,
                    0.06414809823036194,
                    -0.012834697961807251,
                    0.17390227317810059,
                    -0.0376163125038147,
                    -0.2147013545036316,
                    -0.1331416666507721,
                    0.22822007536888123
                ],
                [
                    -0.06184287369251251,
                    -0.1911076009273529,
                    -0.2673480212688446,
                    0.025110065937042236,
                    0.17059144377708435,
                    0.11042571067810059,
                    0.17012417316436768,
                    0.08055967092514038,
                    -0.231247678399086,
                    0.013831168413162231,
                    0.1956774890422821,
                    -0.2454231232404709,
                    -0.2074090540409088,
                    0.05306047201156616,
                    0.09133124351501465,
                    -0.177252858877182,
                    0.24607160687446594,
                    0.17591801285743713,
                    0.17850133776664734,
                    0.02136814594268799,
                    -0.031122982501983643,
                    -0.2140166163444519,
                    0.0867956280708313,
                    0.23866429924964905,
                    0.1299847662448883,
                    0.24369820952415466,
                    -0.20463475584983826,
                    0.1968517005443573,
                    -0.08643290400505066,
                    0.24837109446525574,
                    -0.2258145809173584,
                    0.19563978910446167,
                    -0.15367919206619263,
                    -0.2252519279718399,
                    -0.21182605624198914,
                    -0.2306888848543167,
                    0.10633015632629395,
                    0.06516319513320923,
                    0.1617281138896942,
                    0.17681539058685303,
                    0.19274365901947021,
                    0.034214526414871216,
                    0.006341099739074707,
                    0.23199066519737244,
                    0.16120252013206482,
                    0.1367456316947937,
                    0.09716683626174927,
                    -0.1574556529521942,
                    -0.14078176021575928,
                    0.23085400462150574,
                    -0.2768823802471161,
                    0.0625288188457489,
                    -0.25354117155075073,
                    0.2319175899028778,
                    0.045641422271728516,
                    -0.18328262865543365,
                    -0.09807676076889038,
                    0.12570589780807495,
                    0.06931513547897339,
                    -0.2005271315574646,
                    -0.2639710307121277,
                    0.1775115728378296,
                    0.09227102994918823,
                    0.008153825998306274
                ],
                [
                    82.88878631591797,
                    -0.000321805477142334,
                    -0.03373196721076965,
                    -0.10916610062122345,
                    82.95459747314453,
                    82.56771087646484,
                    -0.05056840181350708,
                    82.50841522216797,
                    82.79634857177734,
                    82.76541900634766,
                    82.73741149902344,
                    -0.21957117319107056,
                    82.86900329589844,
                    -0.14543773233890533,
                    82.7396011352539,
                    82.80389404296875,
                    -0.2270621806383133,
                    82.97301483154297,
                    82.90303039550781,
                    -0.26111847162246704,
                    82.60012817382812,
                    -0.1448035091161728,
                    82.83049011230469,
                    82.19219970703125,
                    82.33775329589844,
                    82.92766571044922,
                    82.25684356689453,
                    0.0016538657946512103,
                    -0.20112672448158264,
                    82.22244262695312,
                    82.82069396972656,
                    82.6324234008789,
                    -0.027681976556777954,
                    82.74015045166016,
                    -0.24529393017292023,
                    82.77643585205078,
                    82.26620483398438,
                    82.8768081665039,
                    -0.02445220947265625,
                    82.8871841430664,
                    82.74871063232422,
                    -0.07510961592197418,
                    0.02969164028763771,
                    82.34394836425781,
                    82.68092346191406,
                    -0.14182141423225403,
                    82.82779693603516,
                    82.14604949951172,
                    -0.11283889412879944,
                    82.41110229492188,
                    82.77131652832031,
                    82.88623809814453,
                    82.96009826660156,
                    -0.24990347027778625,
                    82.83501434326172,
                    -0.07385753095149994,
                    82.71263122558594,
                    82.94338989257812,
                    82.98161315917969,
                    82.5840835571289,
                    82.84201049804688,
                    82.80636596679688,
                    -0.06089608371257782,
                    -0.057821124792099
                ]
            ],
            [
                85.20377349853516,
                0.0,
                -0.01036976370960474,
                0.0,
                85.23658752441406,
                85.2440414428711,
                0.0,
                85.19747161865234,
                85.13783264160156,
                85.19961547851562,
                85.17240142822266,
                0.0,
                85.19409942626953,
                0.0,
                85.1753921508789,
                85.18878936767578,
                0.0,
                85.19708251953125,
                85.1367416381836,
                0.0,
                85.10218811035156,
                0.0,
                85.19524383544922,
                85.2114486694336,
                85.19729614257812,
                85.22457122802734,
                85.2071762084961,
                -0.009961470030248165,
                0.0,
                85.19042205810547,
                85.17557525634766,
                85.14298248291016,
                -0.023057889193296432,
                85.17253112792969,
                0.0,
                85.2121810913086,
                85.1948013305664,
                85.19183349609375,
                0.0,
                85.19251251220703,
                85.17807006835938,
                0.0,
                -0.04544753581285477,
                85.20587921142578,
                85.1395263671875,
                0.0,
                85.19895935058594,
                85.19053649902344,
                0.0,
                85.16570281982422,
                85.17736053466797,
                85.1887435913086,
                85.19437408447266,
                0.0,
                85.17109680175781,
                0.0,
                85.16942596435547,
                85.20712280273438,
                85.23371887207031,
                85.1264419555664,
                85.17442321777344,
                85.20616912841797,
                0.0,
                0.0
            ],
            [
                [
                    84.73238372802734,
                    -0.07366283237934113,
                    84.97753143310547,
                    -0.14690247178077698,
                    85.05032348632812,
                    0.10457228869199753,
                    85.22747802734375,
                    -0.17167022824287415,
                    85.1081771850586,
                    -0.11391491442918777,
                    -0.12279168516397476,
                    0.09085593372583389,
                    0.06232673302292824,
                    84.9164810180664,
                    -0.07401977479457855,
                    0.0016310421051457524,
                    85.08587646484375,
                    0.15356314182281494,
                    85.1346664428711,
                    85.10704803466797,
                    84.86375427246094,
                    85.18925476074219,
                    -0.18258875608444214,
                    85.03193664550781,
                    -0.07172592729330063,
                    -0.2033630758523941,
                    85.12641143798828,
                    84.86434173583984,
                    85.01812744140625,
                    84.93814849853516,
                    -0.08695027232170105,
                    85.18418884277344,
                    85.23666381835938,
                    85.25006103515625,
                    84.94364166259766,
                    -0.04324418306350708,
                    85.06522369384766,
                    84.9720458984375,
                    85.15432739257812,
                    84.96493530273438,
                    85.09262084960938,
                    85.13084411621094,
                    -0.03866139054298401,
                    85.20199584960938,
                    -0.04368181526660919,
                    85.18819427490234,
                    -0.0583341158926487,
                    -0.13608449697494507,
                    0.0525793731212616,
                    -0.20947569608688354,
                    0.05916132032871246,
                    85.04749298095703,
                    -0.12215359508991241,
                    -0.11306484788656235,
                    0.14299742877483368,
                    0.055257491767406464,
                    0.17509393393993378,
                    84.92274475097656,
                    84.89301300048828,
                    -0.04596590995788574,
                    85.07296752929688,
                    85.049560546875,
                    84.92276763916016,
                    85.16085052490234
                ],
                [
                    -0.051637664437294006,
                    0.1069461852312088,
                    0.06091146171092987,
                    0.16327746212482452,
                    -0.08410538733005524,
                    0.15793870389461517,
                    -0.18513265252113342,
                    -0.14850014448165894,
                    0.01591949164867401,
                    0.12042306363582611,
                    -0.14559444785118103,
                    0.17117802798748016,
                    -0.131829172372818,
                    0.13555051386356354,
                    -0.20416468381881714,
                    0.08021165430545807,
                    -0.19733504951000214,
                    0.19793100655078888,
                    0.025256678462028503,
                    0.18761371076107025,
                    -0.13160261511802673,
                    -0.20981888473033905,
                    -0.048394590616226196,
                    0.12497048079967499,
                    0.13262473046779633,
                    -0.02989955246448517,
                    -0.10686776787042618,
                    0.036795929074287415,
                    -0.10278892517089844,
                    -0.008450567722320557,
                    0.05916281044483185,
                    0.2059851735830307,
                    -0.10729104280471802,
                    -0.1684589385986328,
                    0.17630665004253387,
                    0.1704544872045517,
                    0.029014647006988525,
                    -0.05396352708339691,
                    -0.09875556081533432,
                    0.03061521053314209,
                    0.12301217019557953,
                    0.2058226317167282,
                    0.12034164369106293,
                    0.17036734521389008,
                    -0.026524081826210022,
                    -0.1422196924686432,
                    0.07051344215869904,
                    0.11448933184146881,
                    -0.021046102046966553,
                    0.20696888864040375,
                    0.029403552412986755,
                    0.14688508212566376,
                    -0.0551629513502121,
                    -0.20945289731025696,
                    0.015351951122283936,
                    0.046468839049339294,
                    0.17503254115581512,
                    -0.19264978170394897,
                    0.0007382631301879883,
                    -0.08777864277362823,
                    0.2037208527326584,
                    -0.05933113396167755,
                    0.21203665435314178,
                    -0.08700725436210632
                ],
                [
                    0.19409911334514618,
                    0.046515390276908875,
                    -0.2028263509273529,
                    -0.1114380732178688,
                    0.20948918163776398,
                    -0.13617625832557678,
                    -0.037499118596315384,
                    0.004292383790016174,
                    -0.05937838926911354,
                    0.19086851179599762,
                    -0.04831523075699806,
                    -0.021619809791445732,
                    -0.20727361738681793,
                    0.05141200125217438,
                    -0.10748585313558578,
                    -0.1971130073070526,
                    -0.2071424275636673,
                    0.060515712946653366,
                    -0.14296969771385193,
                    -0.12370161712169647,
                    -0.15545448660850525,
                    0.026216289028525352,
                    0.04458232223987579,
                    0.10016614198684692,
                    0.005449429154396057,
                    0.1980104297399521,
                    -0.21243628859519958,
                    -0.0986408144235611,
                    0.01796206831932068,
                    0.07040180265903473,
                    -0.025710195302963257,
                    0.198057621717453,
                    -0.05141562595963478,
                    0.07461514323949814,
                    -0.14293484389781952,
                    0.07535408437252045,
                    0.07488925755023956,
                    0.19101858139038086,
                    -0.13191349804401398,
                    0.018080387264490128,
                    0.08406265825033188,
                    -0.06632400304079056,
                    0.1265975385904312,
                    -0.19008637964725494,
                    0.14463303983211517,
                    0.05691864341497421,
                    0.1209588497877121,
                    -0.09097780287265778,
                    0.018972354009747505,
                    -0.20620203018188477,
                    0.0579632967710495,
                    -0.13198266923427582,
                    0.1560382843017578,
                    0.1496226042509079,
                    0.06467340886592865,
                    -0.09658817946910858,
                    -0.07049424201250076,
                    -0.07909023761749268,
                    0.1171552985906601,
                    -0.06005169451236725,
                    0.016039147973060608,
                    -0.05672772228717804,
                    0.06307126581668854,
                    -0.08637268841266632
                ],
                [
                    -0.2122276872396469,
                    -0.07247017323970795,
                    -0.07647256553173065,
                    -0.10976483672857285,
                    -0.19266027212142944,
                    -0.02513304352760315,
                    -0.10419146716594696,
                    -0.19976961612701416,
                    -0.06316421926021576,
                    -0.12090719491243362,
                    -0.04483209550380707,
                    0.18122367560863495,
                    0.06594593822956085,
                    -0.182743102312088,
                    0.011108845472335815,
                    -0.19289730489253998,
                    0.1577257663011551,
                    -0.19888466596603394,
                    0.0923566073179245,
                    0.1950027495622635,
                    0.04323671758174896,
                    -0.08919699490070343,
                    0.10423953831195831,
                    0.16277749836444855,
                    0.2111927717924118,
                    -0.056341513991355896,
                    -0.20845438539981842,
                    -0.07437677681446075,
                    0.06823800504207611,
                    0.03588418662548065,
                    0.20138265192508698,
                    0.029497504234313965,
                    0.009667173027992249,
                    0.06867353618144989,
                    -0.10693255066871643,
                    0.10580094158649445,
                    0.025149047374725342,
                    -0.05024664103984833,
                    0.1895700842142105,
                    0.02010023593902588,
                    -0.2027229517698288,
                    0.10076560080051422,
                    -0.05537891387939453,
                    0.09139271080493927,
                    0.20638372004032135,
                    0.16370771825313568,
                    0.01780979335308075,
                    0.13767190277576447,
                    -0.19358393549919128,
                    0.15211962163448334,
                    0.1274176687002182,
                    0.1757078319787979,
                    0.10590972006320953,
                    0.09582163393497467,
                    -0.04040627181529999,
                    0.00802960991859436,
                    0.14938779175281525,
                    -0.014215290546417236,
                    0.139848992228508,
                    0.05510269105434418,
                    0.032481029629707336,
                    0.15192584693431854,
                    0.0986129492521286,
                    -0.1573496311903
                ],
                [
                    84.8667984008789,
                    -0.12837591767311096,
                    84.90046691894531,
                    0.09453554451465607,
                    84.98280334472656,
                    0.11495732516050339,
                    85.30010986328125,
                    0.031604841351509094,
                    84.89974975585938,
                    0.20866648852825165,
                    -0.20506498217582703,
                    -0.0941496193408966,
                    -0.06462457776069641,
                    85.06605529785156,
                    0.1446785181760788,
                    0.13828958570957184,
                    85.06140899658203,
                    -0.23447029292583466,
                    85.1610336303711,
                    84.85934448242188,
                    84.97859954833984,
                    84.93470001220703,
                    -0.18983137607574463,
                    84.88917541503906,
                    0.05261729285120964,
                    -0.187505841255188,
                    84.90166473388672,
                    85.18932342529297,
                    84.8298568725586,
                    84.90103149414062,
                    -0.21674808859825134,
                    85.00556182861328,
                    85.00202178955078,
                    84.90116882324219,
                    84.8812255859375,
                    0.15377438068389893,
                    85.27082061767578,
                    85.22742462158203,
                    84.81780242919922,
                    85.12291717529297,
                    85.17570495605469,
                    84.94428253173828,
                    -0.04302629828453064,
                    85.0717544555664,
                    -0.019006729125976562,
                    85.23228454589844,
                    0.07608352601528168,
                    0.0574711412191391,
                    0.032709553837776184,
                    0.09006226807832718,
                    0.1904725879430771,
                    85.07649993896484,
                    0.1391054391860962,
                    0.022175244987010956,
                    0.13363957405090332,
                    -0.1767464578151703,
                    -0.06283655762672424,
                    85.07801055908203,
                    85.29537200927734,
                    -0.20586052536964417,
                    85.20014190673828,
                    85.31333923339844,
                    85.18104553222656,
                    85.08269500732422
                ],
                [
                    84.94276428222656,
                    -0.012075886130332947,
                    85.2885971069336,
                    -0.04140499234199524,
                    84.88903045654297,
                    0.1146806851029396,
                    85.29781341552734,
                    -0.04882870614528656,
                    85.29244995117188,
                    -0.11396855115890503,
                    0.062188521027565,
                    -0.017069490626454353,
                    -0.20177891850471497,
                    84.99620056152344,
                    0.032881900668144226,
                    0.08265040069818497,
                    85.26263427734375,
                    -0.12881003320217133,
                    85.10206604003906,
                    85.11776733398438,
                    84.79239654541016,
                    85.01815795898438,
                    0.0956689864397049,
                    84.86563873291016,
                    -0.1680251806974411,
                    0.19901423156261444,
                    85.00244903564453,
                    85.19080352783203,
                    84.8958969116211,
                    85.06061553955078,
                    -0.0889815241098404,
                    84.88389587402344,
                    85.13265228271484,
                    85.01840209960938,
                    85.0291748046875,
                    0.20303453505039215,
                    85.1700210571289,
                    84.93938446044922,
                    85.05143737792969,
                    85.17711639404297,
                    84.91608428955078,
                    84.8472671508789,
                    -0.01460738480091095,
                    84.98641967773438,
                    0.07100372016429901,
                    85.29110717773438,
                    -0.08307330310344696,
                    -0.18510353565216064,
                    -0.18110746145248413,
                    -0.1380077302455902,
                    0.07715655863285065,
                    85.25264739990234,
                    -0.12667690217494965,
                    -0.1887737512588501,
                    -0.11674389988183975,
                    0.05064382776618004,
                    -0.07505897432565689,
                    85.07501983642578,
                    85.2521743774414,
                    -0.1514967381954193,
                    85.02203369140625,
                    84.97755432128906,
                    84.88406372070312,
                    84.9341812133789
                ],
                [
                    0.1434028595685959,
                    -0.012941956520080566,
                    0.1673785001039505,
                    0.15733526647090912,
                    -0.1479615569114685,
                    0.027600392699241638,
                    -0.04682624340057373,
                    -0.08528941869735718,
                    -0.007885292172431946,
                    -0.09800341725349426,
                    -0.05205991864204407,
                    0.18921737372875214,
                    -0.21267879009246826,
                    -0.2141718715429306,
                    -0.13231295347213745,
                    0.21604745090007782,
                    -0.03611940145492554,
                    -0.15405312180519104,
                    0.03735367953777313,
                    0.02714608609676361,
                    0.0008510500192642212,
                    0.07934527099132538,
                    0.10014180839061737,
                    -0.014456301927566528,
                    0.1603732854127884,
                    -0.14195355772972107,
                    -0.0744239091873169,
                    -0.20060646533966064,
                    -0.00819242000579834,
                    0.1788635104894638,
                    -0.12047028541564941,
                    0.06308673322200775,
                    -0.12422769516706467,
                    0.21240819990634918,
                    -0.045251041650772095,
                    0.026931092143058777,
                    -0.05304098129272461,
                    0.04703529179096222,
                    0.1201198548078537,
                    -0.15518337488174438,
                    -0.13259831070899963,
                    -0.08893249928951263,
                    -0.09194937348365784,
                    0.11394940316677094,
                    -0.08082400262355804,
                    0.11295630037784576,
                    -0.1521051824092865,
                    0.06728945672512054,
                    0.11509047448635101,
                    0.11017851531505585,
                    -0.13301533460617065,
                    0.00013503432273864746,
                    0.2053997665643692,
                    -0.09442611038684845,
                    0.07106442749500275,
                    0.21249182522296906,
                    -0.0980662927031517,
                    -0.03082069754600525,
                    0.04294706881046295,
                    0.04857252538204193,
                    -0.05202755331993103,
                    -0.19342975318431854,
                    -0.020740985870361328,
                    0.20555685460567474
                ],
                [
                    84.82552337646484,
                    -0.1896398812532425,
                    85.07340240478516,
                    0.13286729156970978,
                    85.07904815673828,
                    -0.14207018911838531,
                    85.2267074584961,
                    0.010840490460395813,
                    85.1433334350586,
                    0.014452993869781494,
                    -0.21970447897911072,
                    0.03826245665550232,
                    -0.011780733242630959,
                    84.8874282836914,
                    0.15606637299060822,
                    -0.14072126150131226,
                    85.0996322631836,
                    -0.1092832088470459,
                    85.27253723144531,
                    85.17422485351562,
                    84.99362182617188,
                    85.34979248046875,
                    0.15801449120044708,
                    85.18692779541016,
                    -0.022988837212324142,
                    0.03099249303340912,
                    85.30738067626953,
                    85.19281768798828,
                    85.25920867919922,
                    85.31903839111328,
                    -0.15231382846832275,
                    85.01020812988281,
                    85.1955795288086,
                    85.26689147949219,
                    84.93983459472656,
                    -0.06309252232313156,
                    85.21394348144531,
                    85.22342681884766,
                    85.09563446044922,
                    84.92315673828125,
                    84.93629455566406,
                    84.95592498779297,
                    0.1696263700723648,
                    85.0281982421875,
                    -0.1258409470319748,
                    85.31990051269531,
                    -0.20073282718658447,
                    -0.031186997890472412,
                    -0.10599280148744583,
                    0.11648858338594437,
                    -0.21042685210704803,
                    85.04203796386719,
                    -0.20981313288211823,
                    -0.19430950284004211,
                    0.003115624189376831,
                    -0.06824968010187149,
                    0.1471613198518753,
                    85.13786315917969,
                    85.02542114257812,
                    -0.16914191842079163,
                    85.25953674316406,
                    85.29881286621094,
                    85.20816040039062,
                    85.30570983886719
                ],
                [
                    84.84407043457031,
                    -0.16108277440071106,
                    84.98297119140625,
                    0.056398771703243256,
                    85.1165542602539,
                    -0.20109498500823975,
                    85.3279800415039,
                    0.11734475195407867,
                    85.20214080810547,
                    0.09230302274227142,
                    -0.04949699342250824,
                    -0.03685035929083824,
                    -0.10942910611629486,
                    85.10454559326172,
                    -0.09439700096845627,
                    -0.06519027054309845,
                    85.17093658447266,
                    -0.14096762239933014,
                    84.9996337890625,
                    85.05042266845703,
                    85.08977508544922,
                    85.34403228759766,
                    -0.007426902651786804,
                    85.29721069335938,
                    -0.15574820339679718,
                    -0.009810984134674072,
                    85.20333099365234,
                    85.3650131225586,
                    85.15638732910156,
                    84.96575164794922,
                    0.03899790346622467,
                    85.1775894165039,
                    85.30026245117188,
                    85.34391021728516,
                    85.07526397705078,
                    -0.0015540334861725569,
                    85.15802001953125,
                    84.95557403564453,
                    84.94208526611328,
                    85.00039672851562,
                    85.15734100341797,
                    85.19965362548828,
                    0.03618590533733368,
                    85.1123275756836,
                    -0.14517635107040405,
                    85.20842742919922,
                    -0.006422427948564291,
                    -0.033461689949035645,
                    -0.13071462512016296,
                    -0.20733992755413055,
                    0.025546565651893616,
                    85.14981079101562,
                    0.008610852062702179,
                    -0.1015661209821701,
                    -0.04815457761287689,
                    0.029266582801938057,
                    0.09541238844394684,
                    85.02201080322266,
                    85.36665344238281,
                    -0.12989851832389832,
                    85.28656768798828,
                    85.32839965820312,
                    84.916259765625,
                    84.96582794189453
                ],
                [
                    84.88755798339844,
                    0.010816588997840881,
                    85.09622192382812,
                    -0.17141960561275482,
                    85.29305267333984,
                    0.0682554617524147,
                    85.05998229980469,
                    -0.18466147780418396,
                    85.02222442626953,
                    -0.0003075450658798218,
                    -0.06505042314529419,
                    -0.13815435767173767,
                    0.05138824135065079,
                    84.94242858886719,
                    -0.08807262778282166,
                    0.02561270073056221,
                    84.96963500976562,
                    0.08223459124565125,
                    85.14305877685547,
                    85.15889739990234,
                    85.170166015625,
                    85.20136260986328,
                    0.051919564604759216,
                    84.92298126220703,
                    0.09806186705827713,
                    0.08308692276477814,
                    84.8809814453125,
                    84.87928771972656,
                    84.82936096191406,
                    84.97760772705078,
                    0.17697173357009888,
                    85.1445541381836,
                    85.24263000488281,
                    85.21633911132812,
                    85.15770721435547,
                    -0.17675255239009857,
                    85.24321746826172,
                    85.07395935058594,
                    84.8243179321289,
                    84.97728729248047,
                    85.0853042602539,
                    84.8880386352539,
                    -0.047979265451431274,
                    85.15147399902344,
                    0.15649817883968353,
                    85.06265258789062,
                    -0.21077881753444672,
                    -0.0331314355134964,
                    -0.10877300798892975,
                    -0.031660765409469604,
                    -0.1331503689289093,
                    85.06517791748047,
                    0.04921786114573479,
                    -0.1341097056865692,
                    -0.19272762537002563,
                    -0.2302531599998474,
                    -0.004284664522856474,
                    84.93619537353516,
                    85.11713409423828,
                    -0.1699041724205017,
                    85.0695571899414,
                    85.09542083740234,
                    85.16342163085938,
                    85.12910461425781
                ],
                [
                    85.12916564941406,
                    -0.19317728281021118,
                    85.31017303466797,
                    -0.10696110129356384,
                    85.24375915527344,
                    -0.04135112836956978,
                    85.0661392211914,
                    -0.1810314655303955,
                    85.0372543334961,
                    -0.16620787978172302,
                    -0.1755731701850891,
                    0.01306492742151022,
                    -0.08031255006790161,
                    84.8985824584961,
                    -0.17472055554389954,
                    0.17711086571216583,
                    85.30432891845703,
                    0.047124385833740234,
                    85.0979995727539,
                    85.18512725830078,
                    84.87909698486328,
                    85.24207305908203,
                    -0.05308207869529724,
                    85.20034790039062,
                    0.0058271815069019794,
                    -0.1708330661058426,
                    85.05272674560547,
                    85.21366119384766,
                    85.26261901855469,
                    85.02387237548828,
                    0.111669160425663,
                    85.15768432617188,
                    85.22433471679688,
                    85.2171630859375,
                    84.99114990234375,
                    -0.17082162201404572,
                    84.92513275146484,
                    85.28053283691406,
                    85.21202087402344,
                    85.24629211425781,
                    85.00700378417969,
                    85.24593353271484,
                    0.17726905643939972,
                    85.1329574584961,
                    0.0773656815290451,
                    84.99413299560547,
                    0.09738846123218536,
                    0.11677254736423492,
                    -0.20157065987586975,
                    0.1775379627943039,
                    0.19305123388767242,
                    84.98470306396484,
                    -0.09324038773775101,
                    0.002362431026995182,
                    -0.012883449904620647,
                    0.0033058577682822943,
                    0.15636903047561646,
                    85.18213653564453,
                    85.08418273925781,
                    0.039451614022254944,
                    85.1934814453125,
                    84.96257781982422,
                    85.27783203125,
                    85.33991241455078
                ],
                [
                    0.14495427906513214,
                    0.016528546810150146,
                    -0.06908653676509857,
                    0.013872534036636353,
                    -0.18845966458320618,
                    0.12208084762096405,
                    0.07968394458293915,
                    -0.05000573396682739,
                    0.046511635184288025,
                    0.045737430453300476,
                    0.1873600035905838,
                    0.14642249047756195,
                    0.16957800090312958,
                    0.07602374255657196,
                    -0.12280517816543579,
                    -0.15224744379520416,
                    -0.0452146977186203,
                    0.10657621920108795,
                    -0.009462356567382812,
                    0.06131146848201752,
                    -0.008172854781150818,
                    0.12825347483158112,
                    -0.13291385769844055,
                    0.11580277979373932,
                    0.08931978046894073,
                    0.05980576574802399,
                    0.023956239223480225,
                    0.028131544589996338,
                    0.20419584214687347,
                    -0.18609322607517242,
                    0.1328086107969284,
                    -0.007004827260971069,
                    0.13825778663158417,
                    -0.14061099290847778,
                    -0.2027404010295868,
                    0.15271644294261932,
                    0.02219437062740326,
                    0.19746176898479462,
                    0.21401984989643097,
                    0.21285618841648102,
                    0.15037019550800323,
                    -0.18980826437473297,
                    0.018130391836166382,
                    -0.04301835596561432,
                    0.0909847766160965,
                    0.19756300747394562,
                    0.18486101925373077,
                    -0.004368945956230164,
                    0.06893901526927948,
                    -0.03265911340713501,
                    -0.15305548906326294,
                    -0.1324286311864853,
                    -0.04990197718143463,
                    -0.18910335004329681,
                    -0.033262595534324646,
                    0.045699045062065125,
                    0.015637293457984924,
                    0.0875927060842514,
                    0.07072193920612335,
                    -0.06524085998535156,
                    0.09302873909473419,
                    0.012110725045204163,
                    0.10595767199993134,
                    -0.08520878851413727
                ],
                [
                    84.79055786132812,
                    0.1599588245153427,
                    85.02519989013672,
                    -0.06491760164499283,
                    84.92446899414062,
                    -0.0020814635790884495,
                    85.07644653320312,
                    0.1605052500963211,
                    85.1908950805664,
                    0.16059331595897675,
                    -0.043176159262657166,
                    0.056948695331811905,
                    0.06324464827775955,
                    85.1474380493164,
                    0.1256249099969864,
                    0.17664553225040436,
                    85.12435150146484,
                    0.09322641044855118,
                    84.87462615966797,
                    85.1784439086914,
                    85.17107391357422,
                    85.33841705322266,
                    -0.11231714487075806,
                    85.24886322021484,
                    0.05242754518985748,
                    0.17258156836032867,
                    85.13082885742188,
                    84.99644470214844,
                    85.12020111083984,
                    85.01952362060547,
                    0.17030562460422516,
                    84.90121459960938,
                    84.97425079345703,
                    85.30116271972656,
                    84.96415710449219,
                    -0.13049957156181335,
                    85.0702133178711,
                    85.00873565673828,
                    84.87909698486328,
                    85.05880737304688,
                    84.8560562133789,
                    85.08026123046875,
                    -0.11127392202615738,
                    85.16300964355469,
                    -0.029368862509727478,
                    85.0766372680664,
                    0.0023492942564189434,
                    -0.18828420341014862,
                    0.15771344304084778,
                    -0.21897371113300323,
                    0.04169552028179169,
                    84.88965606689453,
                    -0.03165396302938461,
                    0.16360746324062347,
                    0.026719961315393448,
                    -0.1946861892938614,
                    0.03129443898797035,
                    84.97084045410156,
                    84.94070434570312,
                    -0.20663155615329742,
                    85.2410659790039,
                    84.90625762939453,
                    85.18087768554688,
                    85.25249481201172
                ],
                [
                    0.003233581781387329,
                    -0.0857446938753128,
                    -0.14227916300296783,
                    0.20470555126667023,
                    0.1582532376050949,
                    0.1644783765077591,
                    -0.17543289065361023,
                    -0.18805192410945892,
                    -0.17424044013023376,
                    -0.020594432950019836,
                    -0.0136432945728302,
                    -0.09295187145471573,
                    0.07685191929340363,
                    0.1728973537683487,
                    0.10039128363132477,
                    -0.08898168802261353,
                    -0.09348137676715851,
                    -0.01684693992137909,
                    -0.18559184670448303,
                    0.11018569767475128,
                    0.14579908549785614,
                    0.16945286095142365,
                    0.002369210124015808,
                    -0.1802290380001068,
                    -0.0660257339477539,
                    0.008310064673423767,
                    0.052163705229759216,
                    -0.01750028133392334,
                    0.15230147540569305,
                    -0.11286751180887222,
                    0.1982080489397049,
                    -0.15692758560180664,
                    0.14023758471012115,
                    0.2103492170572281,
                    -0.017931506037712097,
                    -0.10116633027791977,
                    0.19302241504192352,
                    -0.1762429028749466,
                    -0.04545313119888306,
                    -0.02671259641647339,
                    0.17914985120296478,
                    0.1373775154352188,
                    -0.1116027906537056,
                    0.19633497297763824,
                    -0.1490148901939392,
                    0.12006713449954987,
                    0.03421621024608612,
                    0.06941245496273041,
                    -0.11241129785776138,
                    0.18400932848453522,
                    -0.20780877768993378,
                    -0.08987723290920258,
                    -0.04002264142036438,
                    -0.09033772349357605,
                    0.2025366574525833,
                    0.0578392893075943,
                    -0.09712739288806915,
                    0.08412189781665802,
                    0.13417987525463104,
                    -0.16320747137069702,
                    0.017713680863380432,
                    -0.08191528916358948,
                    -0.08214937150478363,
                    -0.18604397773742676
                ],
                [
                    84.988037109375,
                    -0.12139421701431274,
                    85.29789733886719,
                    0.16911831498146057,
                    85.2816390991211,
                    -0.14307111501693726,
                    85.05199432373047,
                    0.08514074981212616,
                    85.36051940917969,
                    -0.04399973154067993,
                    -0.022617246955633163,
                    -0.059926435351371765,
                    0.1793970912694931,
                    85.11478424072266,
                    -0.11445758491754532,
                    -0.0060255080461502075,
                    85.41574096679688,
                    0.09231040626764297,
                    85.35887145996094,
                    85.11476135253906,
                    85.12052917480469,
                    85.33900451660156,
                    0.030187591910362244,
                    84.95813751220703,
                    -0.08267836272716522,
                    0.06879206001758575,
                    85.41036224365234,
                    85.18344116210938,
                    85.16560363769531,
                    85.0098876953125,
                    0.1709168404340744,
                    85.25909423828125,
                    85.2362289428711,
                    85.40665435791016,
                    85.21717071533203,
                    -0.07004071772098541,
                    85.14043426513672,
                    85.25511932373047,
                    85.18914794921875,
                    85.23197937011719,
                    85.00108337402344,
                    85.03820037841797,
                    -0.11932816356420517,
                    85.33173370361328,
                    0.18915022909641266,
                    85.202392578125,
                    0.08941037207841873,
                    0.02909703552722931,
                    0.03653348982334137,
                    0.07415948063135147,
                    0.14920009672641754,
                    85.05281829833984,
                    0.11687647551298141,
                    -0.10252499580383301,
                    -0.03767235949635506,
                    -0.006847792770713568,
                    0.19466371834278107,
                    85.37533569335938,
                    85.30921936035156,
                    -0.16435647010803223,
                    85.19477081298828,
                    85.423095703125,
                    85.08544158935547,
                    85.18269348144531
                ],
                [
                    85.1595230102539,
                    0.011702626943588257,
                    85.00076293945312,
                    0.0808415412902832,
                    85.23880004882812,
                    -0.13742974400520325,
                    85.2188491821289,
                    0.19949845969676971,
                    85.15068054199219,
                    -0.11513864994049072,
                    0.10452360659837723,
                    0.1566271334886551,
                    -0.10517388582229614,
                    84.9062271118164,
                    -0.1684369593858719,
                    -0.1612122356891632,
                    85.05457305908203,
                    0.1138438954949379,
                    85.32144927978516,
                    85.29179382324219,
                    84.8920669555664,
                    85.1736068725586,
                    0.021856993436813354,
                    85.30610656738281,
                    0.044526178389787674,
                    0.19383372366428375,
                    85.2905044555664,
                    85.34236145019531,
                    85.3194808959961,
                    84.95027160644531,
                    -0.11002016067504883,
                    85.05364227294922,
                    84.9826431274414,
                    85.1290283203125,
                    85.27969360351562,
                    -0.20925723016262054,
                    85.0440673828125,
                    85.2940673828125,
                    85.00841522216797,
                    85.08155059814453,
                    85.24185180664062,
                    85.09547424316406,
                    -0.20913194119930267,
                    85.22515106201172,
                    0.14870373904705048,
                    84.99433898925781,
                    -0.01757107302546501,
                    0.051928892731666565,
                    -0.1523755043745041,
                    -0.18645720183849335,
                    -0.01181076467037201,
                    84.92529296875,
                    -0.13493922352790833,
                    0.11542557924985886,
                    0.0616118498146534,
                    -0.10957391560077667,
                    -0.07644675672054291,
                    85.33211517333984,
                    85.24659729003906,
                    -0.0030958056449890137,
                    85.28369903564453,
                    84.97532653808594,
                    85.1986083984375,
                    85.2005844116211
                ],
                [
                    -0.1978791207075119,
                    0.06782414019107819,
                    0.138031467795372,
                    0.11170454323291779,
                    0.19365791976451874,
                    -0.17601299285888672,
                    -0.052598923444747925,
                    0.010724440217018127,
                    -0.12853458523750305,
                    0.020759612321853638,
                    -0.02195759117603302,
                    0.028592616319656372,
                    -0.01696215569972992,
                    0.13790352642536163,
                    0.20410682260990143,
                    -0.028674528002738953,
                    0.20425201952457428,
                    -0.03242972493171692,
                    -0.09441211819648743,
                    -0.06051373481750488,
                    -0.06194218993186951,
                    -0.09567493200302124,
                    0.14585112035274506,
                    0.026275277137756348,
                    -0.011782482266426086,
                    0.03180699050426483,
                    -0.1357908993959427,
                    -0.008437871932983398,
                    0.06012044847011566,
                    -0.1889289766550064,
                    -0.06811794638633728,
                    0.08086313307285309,
                    -0.044470712542533875,
                    0.008558914065361023,
                    0.20433424413204193,
                    -0.12615515291690826,
                    0.1697366088628769,
                    0.11309297382831573,
                    -0.1089547798037529,
                    0.07544265687465668,
                    -0.1784188598394394,
                    0.1539054960012436,
                    0.1992671638727188,
                    0.21032588183879852,
                    -0.09094130992889404,
                    0.14139173924922943,
                    0.1633627563714981,
                    0.16739000380039215,
                    0.18176190555095673,
                    -0.07991892099380493,
                    -0.09185037016868591,
                    0.033051997423172,
                    0.21084465086460114,
                    -0.1988353133201599,
                    -0.19141335785388947,
                    0.0274658203125,
                    -0.07912810146808624,
                    0.0670778900384903,
                    0.04274161159992218,
                    -0.12883274257183075,
                    -0.07924465835094452,
                    0.08504785597324371,
                    0.16928128898143768,
                    -0.1693478226661682
                ],
                [
                    84.732177734375,
                    -0.17827266454696655,
                    85.27079772949219,
                    0.0823434591293335,
                    85.25700378417969,
                    -0.20818942785263062,
                    84.97108459472656,
                    -0.17053274810314178,
                    85.3177719116211,
                    -0.08271527290344238,
                    0.12997107207775116,
                    -0.13718512654304504,
                    -0.05636841058731079,
                    85.25117492675781,
                    -0.008743509650230408,
                    -0.05327931046485901,
                    85.28032684326172,
                    -0.0024180153850466013,
                    85.04972076416016,
                    85.17428588867188,
                    85.07575988769531,
                    85.16571044921875,
                    -0.16278450191020966,
                    85.1838607788086,
                    -0.08503151684999466,
                    0.0077642351388931274,
                    85.24601745605469,
                    84.96565246582031,
                    85.24725341796875,
                    85.29166412353516,
                    0.1323331892490387,
                    85.03681182861328,
                    85.1332778930664,
                    85.22438049316406,
                    84.93849182128906,
                    -0.2035483866930008,
                    85.18003845214844,
                    84.94821166992188,
                    84.9892807006836,
                    85.08566284179688,
                    84.97782135009766,
                    85.2398910522461,
                    -0.08246791362762451,
                    85.0701904296875,
                    -0.20570111274719238,
                    84.96282196044922,
                    -0.19643433392047882,
                    0.17687420547008514,
                    -0.17971087992191315,
                    -0.04230836406350136,
                    0.0791076272726059,
                    85.00872802734375,
                    -0.074470154941082,
                    -0.015294167213141918,
                    -0.03831218555569649,
                    -0.13367345929145813,
                    -0.19761896133422852,
                    85.03936767578125,
                    85.05130004882812,
                    0.0974351018667221,
                    85.07059478759766,
                    84.95751953125,
                    84.96065521240234,
                    85.01789855957031
                ],
                [
                    85.14698791503906,
                    0.12003947794437408,
                    84.90454864501953,
                    0.09574530273675919,
                    85.31379699707031,
                    0.1050325557589531,
                    85.17123413085938,
                    0.09366483986377716,
                    85.27376556396484,
                    -0.08566030859947205,
                    0.030797671526670456,
                    -0.009540972299873829,
                    0.021001996472477913,
                    85.05594635009766,
                    -0.2152421474456787,
                    -0.16558656096458435,
                    85.21420288085938,
                    -0.13654355704784393,
                    85.21204376220703,
                    85.086669921875,
                    84.83544921875,
                    85.0548324584961,
                    0.11687614023685455,
                    85.27223205566406,
                    -0.20175649225711823,
                    -0.1941348761320114,
                    85.03314971923828,
                    84.91058349609375,
                    84.87203216552734,
                    85.00955963134766,
                    0.1742320954799652,
                    84.85196685791016,
                    85.13172149658203,
                    85.30024719238281,
                    84.8714599609375,
                    -0.1778264045715332,
                    85.08050537109375,
                    84.91353607177734,
                    84.91499328613281,
                    84.91586303710938,
                    84.97892761230469,
                    85.28392791748047,
                    -0.0908961296081543,
                    85.04608917236328,
                    -0.09369105100631714,
                    85.1965103149414,
                    0.10495749115943909,
                    -0.11566578596830368,
                    0.08530297130346298,
                    -0.0011762192007154226,
                    -0.14594990015029907,
                    85.31073760986328,
                    0.1070713922381401,
                    -0.17806340754032135,
                    0.0462794229388237,
                    0.020417895168066025,
                    -0.17006896436214447,
                    84.92858123779297,
                    85.22712707519531,
                    0.10809747874736786,
                    85.20446014404297,
                    85.1397705078125,
                    85.12122344970703,
                    85.13758087158203
                ],
                [
                    -0.15877890586853027,
                    -0.17777737975120544,
                    0.19718752801418304,
                    -0.18486686050891876,
                    -0.06674902141094208,
                    -0.12977881729602814,
                    0.1871289759874344,
                    0.10996098816394806,
                    -0.19911730289459229,
                    -0.12982161343097687,
                    -0.01899455487728119,
                    -0.028130263090133667,
                    -0.01902949810028076,
                    -0.08534413576126099,
                    -0.12826189398765564,
                    -0.1137256771326065,
                    -0.2041444480419159,
                    0.2141142040491104,
                    0.18027038872241974,
                    -0.10387752205133438,
                    -0.16015911102294922,
                    0.11624376475811005,
                    -0.18338337540626526,
                    -0.06991387903690338,
                    -0.0407385379076004,
                    -0.06266491115093231,
                    0.2149120420217514,
                    0.16417862474918365,
                    0.205042764544487,
                    -0.176253080368042,
                    -0.0636739581823349,
                    0.16257251799106598,
                    -0.07338258624076843,
                    0.11890147626399994,
                    -0.16338400542736053,
                    -0.13622316718101501,
                    -0.026458054780960083,
                    0.10237018764019012,
                    -0.025478944182395935,
                    0.14075954258441925,
                    0.11158086359500885,
                    -0.2062828689813614,
                    0.17313997447490692,
                    0.07460783421993256,
                    0.21089504659175873,
                    -0.0888892412185669,
                    0.00026135146617889404,
                    -0.20591337978839874,
                    0.21248336136341095,
                    -0.11786016821861267,
                    -0.15379008650779724,
                    -0.21408019959926605,
                    0.10030899941921234,
                    -0.12107763439416885,
                    0.11442331969738007,
                    0.08014066517353058,
                    0.0827292650938034,
                    -0.18750382959842682,
                    -0.10047566890716553,
                    -0.059770822525024414,
                    -0.08210720121860504,
                    -0.10359903424978256,
                    -0.174775630235672,
                    0.19705279171466827
                ],
                [
                    85.03113555908203,
                    -0.09111107885837555,
                    85.02421569824219,
                    0.0479564368724823,
                    85.17596435546875,
                    -0.1608518809080124,
                    85.3062744140625,
                    0.13195772469043732,
                    85.34627532958984,
                    -0.16185308992862701,
                    0.14233282208442688,
                    -0.06531509757041931,
                    0.1639033406972885,
                    85.1941146850586,
                    0.12960655987262726,
                    -0.01926027610898018,
                    85.238037109375,
                    -0.17476129531860352,
                    84.99789428710938,
                    85.14997863769531,
                    85.24200439453125,
                    85.02283477783203,
                    -0.16627003252506256,
                    84.95026397705078,
                    -0.19530564546585083,
                    0.12951616942882538,
                    85.23411560058594,
                    85.36125183105469,
                    85.0362319946289,
                    85.19933319091797,
                    -0.19506613910198212,
                    85.09465789794922,
                    85.13484954833984,
                    85.0973129272461,
                    85.29231262207031,
                    -0.20187464356422424,
                    85.2495346069336,
                    85.02928161621094,
                    85.11951446533203,
                    85.03473663330078,
                    85.08641052246094,
                    85.22567749023438,
                    0.18657495081424713,
                    85.37935638427734,
                    -0.1817205250263214,
                    85.31764221191406,
                    -0.13630090653896332,
                    0.10974816977977753,
                    -0.0021966947242617607,
                    -0.061637844890356064,
                    0.00634099543094635,
                    85.08049774169922,
                    0.16133449971675873,
                    -0.003176853060722351,
                    -0.07000860571861267,
                    0.10672607272863388,
                    0.06515820324420929,
                    85.02153778076172,
                    85.31969451904297,
                    0.17005227506160736,
                    85.1539077758789,
                    85.03915405273438,
                    84.99039459228516,
                    85.16515350341797
                ],
                [
                    0.182800754904747,
                    -0.08435419201850891,
                    0.004765987396240234,
                    -0.042380496859550476,
                    0.1903512328863144,
                    0.21457092463970184,
                    0.0242861807346344,
                    0.03612251579761505,
                    0.08957622945308685,
                    0.030516251921653748,
                    0.01914358139038086,
                    -0.07090362906455994,
                    -0.08796948194503784,
                    -0.0896473079919815,
                    0.0811634510755539,
                    0.099493607878685,
                    0.05914805829524994,
                    -0.16201068460941315,
                    0.19468028843402863,
                    0.06567202508449554,
                    0.11366455256938934,
                    -0.12590226531028748,
                    -0.14455655217170715,
                    0.15238340198993683,
                    -0.029220402240753174,
                    -0.19189108908176422,
                    0.12873147428035736,
                    0.007887303829193115,
                    0.04475192725658417,
                    0.06112004816532135,
                    -0.14326855540275574,
                    -0.16285713016986847,
                    0.0498136430978775,
                    -0.20008604228496552,
                    0.011582717299461365,
                    -0.09013006091117859,
                    0.21079139411449432,
                    0.10007531940937042,
                    -0.1494477242231369,
                    -0.19112728536128998,
                    -0.07736128568649292,
                    -0.05674341320991516,
                    -0.1188046932220459,
                    0.09185563027858734,
                    0.07944674789905548,
                    0.002944245934486389,
                    -0.12345883250236511,
                    -0.0564349889755249,
                    0.18654246628284454,
                    0.07017765939235687,
                    -0.19112280011177063,
                    -0.04853437840938568,
                    0.005511268973350525,
                    -0.1477244645357132,
                    -0.14995627105236053,
                    -0.04688575863838196,
                    -0.20202341675758362,
                    -0.14430418610572815,
                    0.21450723707675934,
                    0.15340556204319,
                    0.15810848772525787,
                    -0.11421528458595276,
                    0.056417688727378845,
                    -0.06668335199356079
                ],
                [
                    84.91986846923828,
                    0.022490039467811584,
                    85.31993865966797,
                    -0.23958741128444672,
                    85.15486907958984,
                    -0.18262308835983276,
                    85.34693908691406,
                    0.1320517510175705,
                    85.1980972290039,
                    -0.20150169730186462,
                    0.15608000755310059,
                    -0.050953567028045654,
                    -0.03576870262622833,
                    85.12066650390625,
                    0.002878233790397644,
                    -0.13571269810199738,
                    85.11663818359375,
                    -0.18929043412208557,
                    85.33489990234375,
                    85.33373260498047,
                    84.8578109741211,
                    85.05168914794922,
                    0.21037183701992035,
                    85.2578125,
                    -0.15458905696868896,
                    0.1877196580171585,
                    85.10230255126953,
                    84.91854095458984,
                    84.97320556640625,
                    85.36617279052734,
                    0.07257557660341263,
                    84.8872299194336,
                    85.0415267944336,
                    85.18387603759766,
                    85.15088653564453,
                    -0.073645681142807,
                    85.34934997558594,
                    84.98526763916016,
                    85.1269760131836,
                    85.22769927978516,
                    84.93655395507812,
                    85.19251251220703,
                    -0.10748213529586792,
                    85.0969467163086,
                    -0.10856562107801437,
                    85.34667205810547,
                    0.11513960361480713,
                    0.03748117387294769,
                    -0.17253077030181885,
                    -0.1654009371995926,
                    -0.2084517478942871,
                    85.20438385009766,
                    -0.10967522114515305,
                    -0.04698306322097778,
                    -0.13377293944358826,
                    -0.1727760136127472,
                    0.1896902173757553,
                    85.27704620361328,
                    85.2757339477539,
                    -0.19661873579025269,
                    85.31224060058594,
                    85.31373596191406,
                    85.27842712402344,
                    85.08979797363281
                ],
                [
                    84.88069915771484,
                    -0.07043451070785522,
                    85.10160064697266,
                    0.14796538650989532,
                    85.25259399414062,
                    0.15251268446445465,
                    85.35899353027344,
                    -0.21649540960788727,
                    85.01981353759766,
                    0.08619900047779083,
                    0.1351201832294464,
                    0.0853501707315445,
                    -0.16532209515571594,
                    85.19896697998047,
                    -0.1017993912100792,
                    -0.0640142410993576,
                    85.29216003417969,
                    0.15838584303855896,
                    85.21757507324219,
                    84.96111297607422,
                    85.20720672607422,
                    85.1746826171875,
                    0.11687301099300385,
                    85.05123138427734,
                    0.02705693058669567,
                    -0.11707514524459839,
                    85.19861602783203,
                    85.09310913085938,
                    85.12203979492188,
                    85.32198333740234,
                    -0.08268766105175018,
                    85.09182739257812,
                    85.38536834716797,
                    85.04161834716797,
                    85.27812957763672,
                    -0.10137124359607697,
                    85.34095764160156,
                    85.1312255859375,
                    85.07720947265625,
                    84.92489624023438,
                    85.16513061523438,
                    84.96886444091797,
                    -0.17244988679885864,
                    85.2915267944336,
                    -0.14498333632946014,
                    85.2704849243164,
                    -0.04347647726535797,
                    -0.02270849049091339,
                    0.08402096480131149,
                    -0.056191351264715195,
                    0.11075438559055328,
                    85.24121856689453,
                    -0.13874566555023193,
                    -0.07175612449645996,
                    0.029997587203979492,
                    0.16820813715457916,
                    -0.1081244945526123,
                    85.11717987060547,
                    85.0172348022461,
                    0.023377731442451477,
                    85.08716583251953,
                    85.06568908691406,
                    85.21234893798828,
                    85.11375427246094
                ],
                [
                    85.09759521484375,
                    -0.02672860026359558,
                    85.26253509521484,
                    0.121251180768013,
                    85.25160217285156,
                    0.06298383325338364,
                    85.27495574951172,
                    -0.11916917562484741,
                    85.22978973388672,
                    0.1936618834733963,
                    0.02173456735908985,
                    0.15050943195819855,
                    0.10428231954574585,
                    85.20360565185547,
                    -0.21435418725013733,
                    0.15971843898296356,
                    85.34398651123047,
                    -0.03322805464267731,
                    85.29308319091797,
                    85.30305480957031,
                    85.20301818847656,
                    85.17720031738281,
                    -0.06923633813858032,
                    85.18878173828125,
                    0.1959850788116455,
                    -0.1355452835559845,
                    85.17643737792969,
                    85.30413055419922,
                    85.25963592529297,
                    85.02181243896484,
                    0.11271889507770538,
                    85.21224212646484,
                    85.03822326660156,
                    85.21295928955078,
                    85.10801696777344,
                    0.16506323218345642,
                    85.06034088134766,
                    85.08197784423828,
                    84.96041107177734,
                    85.07308959960938,
                    85.24974060058594,
                    85.01606750488281,
                    0.1050308495759964,
                    84.98310852050781,
                    0.10596297681331635,
                    84.95940399169922,
                    -0.05602054297924042,
                    -0.1798083484172821,
                    -0.0816105455160141,
                    -0.05177542567253113,
                    -0.1143205389380455,
                    85.06024169921875,
                    -0.21105660498142242,
                    -0.039838921278715134,
                    -0.14975231885910034,
                    0.09177590906620026,
                    -0.008457203395664692,
                    85.30253601074219,
                    85.36544799804688,
                    -0.06774252653121948,
                    85.22874450683594,
                    85.36962890625,
                    84.9451904296875,
                    85.29169464111328
                ],
                [
                    85.14468383789062,
                    0.2114696055650711,
                    85.05899047851562,
                    -0.18370892107486725,
                    84.96875,
                    0.1576283723115921,
                    85.17682647705078,
                    -0.13122648000717163,
                    85.15589141845703,
                    -0.10726683586835861,
                    -0.0789213702082634,
                    0.15435951948165894,
                    -0.14865434169769287,
                    85.11131286621094,
                    -0.09781216830015182,
                    0.03279833495616913,
                    84.94169616699219,
                    0.18949811160564423,
                    84.98456573486328,
                    85.29820251464844,
                    84.96804809570312,
                    85.3163070678711,
                    -0.11959327757358551,
                    85.1950454711914,
                    0.08182185888290405,
                    0.19752593338489532,
                    85.27808380126953,
                    85.23224639892578,
                    85.00271606445312,
                    85.24932861328125,
                    -0.11492536216974258,
                    84.90123748779297,
                    85.05762481689453,
                    84.98065185546875,
                    85.10337829589844,
                    0.13369856774806976,
                    85.04429626464844,
                    84.9129867553711,
                    85.15363311767578,
                    85.00592041015625,
                    85.02095031738281,
                    85.03810119628906,
                    0.16921402513980865,
                    85.12875366210938,
                    0.08817999064922333,
                    85.32099151611328,
                    0.007937110960483551,
                    0.022364139556884766,
                    0.12499631941318512,
                    0.16871792078018188,
                    0.07168014347553253,
                    84.92581176757812,
                    -0.12431444972753525,
                    0.035077616572380066,
                    -0.13858318328857422,
                    0.10407420992851257,
                    -0.1880965679883957,
                    84.94113159179688,
                    85.0291519165039,
                    -0.191855788230896,
                    85.23582458496094,
                    85.22006225585938,
                    85.12382507324219,
                    85.31326293945312
                ],
                [
                    84.81178283691406,
                    -0.1992185264825821,
                    85.19225311279297,
                    0.09456838667392731,
                    85.29244995117188,
                    -0.05415736511349678,
                    85.05899810791016,
                    0.019420310854911804,
                    85.25081634521484,
                    -0.10921241343021393,
                    -0.01372180599719286,
                    0.13755401968955994,
                    0.06779862940311432,
                    85.24513244628906,
                    -0.18601460754871368,
                    -0.00016917320317588747,
                    85.08412170410156,
                    -0.07766775041818619,
                    85.0033950805664,
                    85.20459747314453,
                    84.9002914428711,
                    85.01785278320312,
                    -0.20786385238170624,
                    85.22771453857422,
                    0.12885825335979462,
                    -0.17798593640327454,
                    85.00164031982422,
                    85.14566802978516,
                    84.92086029052734,
                    85.10062408447266,
                    0.04370926320552826,
                    85.02880859375,
                    85.39137268066406,
                    85.15265655517578,
                    85.33025360107422,
                    -0.14369873702526093,
                    85.09334564208984,
                    85.28943634033203,
                    85.05573272705078,
                    85.166259765625,
                    85.1885757446289,
                    85.07897186279297,
                    -0.1683499813079834,
                    85.04518127441406,
                    0.20293407142162323,
                    85.20980834960938,
                    -0.04641282558441162,
                    0.1668587476015091,
                    0.014000266790390015,
                    0.15672996640205383,
                    -0.018960848450660706,
                    85.33177947998047,
                    0.151663139462471,
                    0.04672856628894806,
                    0.19013841450214386,
                    0.09988970309495926,
                    0.07277567684650421,
                    85.25656127929688,
                    85.24750518798828,
                    0.10630775988101959,
                    85.20054626464844,
                    85.28478240966797,
                    84.95769500732422,
                    85.31522369384766
                ],
                [
                    0.07200147211551666,
                    -0.10465501248836517,
                    0.18090547621250153,
                    -0.0722205713391304,
                    -0.18323606252670288,
                    -0.0743519514799118,
                    -0.051685962826013565,
                    -0.05582021176815033,
                    -0.18616141378879547,
                    -0.10867360979318619,
                    -0.03414095565676689,
                    0.017812075093388557,
                    0.029420793056488037,
                    -0.12746210396289825,
                    -0.07891744375228882,
                    0.17731837928295135,
                    -0.13594508171081543,
                    0.0604473352432251,
                    -0.13686196506023407,
                    0.18846768140792847,
                    0.17018301784992218,
                    0.08182106912136078,
                    0.015724629163742065,
                    -0.08861912041902542,
                    -0.028188690543174744,
                    -0.029921755194664,
                    -0.14425498247146606,
                    0.21343128383159637,
                    0.03366348147392273,
                    -0.09447287768125534,
                    0.1146417111158371,
                    -0.21295912563800812,
                    0.08224909007549286,
                    0.1930791437625885,
                    0.19070936739444733,
                    -0.015249326825141907,
                    0.05984136462211609,
                    0.2132026106119156,
                    -0.17916026711463928,
                    0.08406126499176025,
                    -0.01578747294843197,
                    -0.04236794263124466,
                    0.08920891582965851,
                    0.06307269632816315,
                    -0.19269150495529175,
                    -0.1837642341852188,
                    0.18704093992710114,
                    -0.08183377981185913,
                    0.07989774644374847,
                    -0.1432161033153534,
                    -0.011516377329826355,
                    0.12881940603256226,
                    -0.0993424728512764,
                    0.21169917285442352,
                    0.11635824292898178,
                    0.10306896269321442,
                    0.127682164311409,
                    -0.017608147114515305,
                    0.02274574525654316,
                    0.01393263041973114,
                    -0.1595301479101181,
                    -0.06494373083114624,
                    0.08503837138414383,
                    0.12472015619277954
                ],
                [
                    -0.07648216187953949,
                    0.13174928724765778,
                    0.14656774699687958,
                    -0.027394220232963562,
                    -0.041796162724494934,
                    -0.15632009506225586,
                    -0.04791665077209473,
                    0.21127356588840485,
                    0.006431803107261658,
                    0.06612528860569,
                    -0.2107316553592682,
                    0.004477858543395996,
                    0.015086516737937927,
                    -0.06363679468631744,
                    -0.18625877797603607,
                    -0.1887342631816864,
                    -0.15825900435447693,
                    -0.0288526713848114,
                    0.1236293762922287,
                    -0.08326692879199982,
                    0.1851123720407486,
                    0.17583651840686798,
                    -0.06952473521232605,
                    -0.12059912830591202,
                    0.030568793416023254,
                    0.05023945868015289,
                    0.02134503424167633,
                    -0.19069652259349823,
                    0.05367140471935272,
                    -0.046378761529922485,
                    0.09164033830165863,
                    -0.03324344754219055,
                    -0.05881299078464508,
                    -0.17972539365291595,
                    0.21515165269374847,
                    -0.17264485359191895,
                    0.012548089027404785,
                    0.06585343182086945,
                    0.015089154243469238,
                    0.10024864971637726,
                    0.202225461602211,
                    -0.1901489943265915,
                    -0.07638020813465118,
                    0.021289080381393433,
                    0.1284061223268509,
                    -0.21021299064159393,
                    0.04551531374454498,
                    -0.1413085162639618,
                    0.17386455833911896,
                    0.005820110440254211,
                    0.06403292715549469,
                    0.019055932760238647,
                    0.001362130045890808,
                    0.07426904141902924,
                    -0.10249407589435577,
                    -0.20861022174358368,
                    -0.027629345655441284,
                    0.20840658247470856,
                    -0.07502563297748566,
                    0.21096380054950714,
                    -0.1524280607700348,
                    -0.055774420499801636,
                    0.14972420036792755,
                    -0.20092067122459412
                ],
                [
                    85.16437530517578,
                    0.07629479467868805,
                    85.15821838378906,
                    0.1379684954881668,
                    85.0284194946289,
                    -0.15179236233234406,
                    85.23191833496094,
                    0.07580940425395966,
                    85.27379608154297,
                    -0.11319141834974289,
                    0.19209834933280945,
                    -0.21066713333129883,
                    -0.1723121553659439,
                    85.13715362548828,
                    -0.057174742221832275,
                    0.03197983279824257,
                    85.25707244873047,
                    -0.17222528159618378,
                    85.37805938720703,
                    85.22394561767578,
                    84.97933197021484,
                    85.27949523925781,
                    0.10875289142131805,
                    85.03323364257812,
                    0.028969982638955116,
                    0.12896426022052765,
                    85.04289245605469,
                    85.3798599243164,
                    85.30891418457031,
                    85.14877319335938,
                    -0.11429090797901154,
                    85.2254867553711,
                    85.30830383300781,
                    85.42013549804688,
                    85.13706970214844,
                    -0.11957605183124542,
                    85.43402862548828,
                    85.09008026123047,
                    85.13217163085938,
                    85.3187255859375,
                    85.36739349365234,
                    85.0382080078125,
                    -0.022866398096084595,
                    85.07276916503906,
                    0.05237840116024017,
                    85.26922607421875,
                    -0.014044791460037231,
                    -0.2012583613395691,
                    -0.017656566575169563,
                    0.16703128814697266,
                    -0.14633958041667938,
                    85.09262084960938,
                    0.11991744488477707,
                    0.17120665311813354,
                    0.012670695781707764,
                    -0.02936214581131935,
                    -0.13139235973358154,
                    85.06017303466797,
                    85.35279846191406,
                    0.023473381996154785,
                    85.44412994384766,
                    85.24043273925781,
                    85.19345092773438,
                    85.2934341430664
                ],
                [
                    85.0528793334961,
                    -0.11550597101449966,
                    85.07552337646484,
                    -0.2353169471025467,
                    85.03194427490234,
                    -0.16051842272281647,
                    85.2193374633789,
                    -0.2085428088903427,
                    85.09064483642578,
                    0.10599793493747711,
                    -0.16531141102313995,
                    -0.06540761142969131,
                    0.06292130053043365,
                    85.23526000976562,
                    0.1816689521074295,
                    0.09502862393856049,
                    85.17581176757812,
                    0.14760784804821014,
                    85.11202239990234,
                    85.20354461669922,
                    85.15331268310547,
                    85.0910415649414,
                    0.10641063749790192,
                    84.98658752441406,
                    0.2057677060365677,
                    0.05396629869937897,
                    85.11345672607422,
                    85.01824188232422,
                    85.05830383300781,
                    85.28997802734375,
                    -0.047699663788080215,
                    85.23765563964844,
                    85.30644226074219,
                    85.226318359375,
                    84.98097229003906,
                    -0.03983033075928688,
                    85.18960571289062,
                    85.17632293701172,
                    85.03573608398438,
                    84.92772674560547,
                    85.13131713867188,
                    84.96640014648438,
                    -0.05843988060951233,
                    84.98512268066406,
                    -0.1278718113899231,
                    84.96186828613281,
                    0.17342817783355713,
                    0.0997939258813858,
                    0.17111556231975555,
                    -0.21000006794929504,
                    0.07325063645839691,
                    84.99974822998047,
                    -0.04278993979096413,
                    0.20427627861499786,
                    -0.21290960907936096,
                    0.16630327701568604,
                    -0.1456976979970932,
                    85.08617401123047,
                    85.25251007080078,
                    -0.17794039845466614,
                    85.10496520996094,
                    85.37384796142578,
                    85.07415771484375,
                    85.13628387451172
                ],
                [
                    85.19512939453125,
                    -0.1406184732913971,
                    85.01597595214844,
                    -0.0313369482755661,
                    84.99854278564453,
                    0.15687069296836853,
                    85.01191711425781,
                    0.18992970883846283,
                    85.37620544433594,
                    0.19081364572048187,
                    0.1887843757867813,
                    0.15510620176792145,
                    -0.16153116524219513,
                    85.27198791503906,
                    0.10517843067646027,
                    -0.05329075828194618,
                    85.27753448486328,
                    -0.04707721248269081,
                    85.00115203857422,
                    85.00663757324219,
                    85.19428253173828,
                    85.26753234863281,
                    0.06784845888614655,
                    85.06562805175781,
                    0.007705852389335632,
                    0.08803431689739227,
                    85.00043487548828,
                    85.02792358398438,
                    85.12704467773438,
                    85.0614242553711,
                    -0.1744009256362915,
                    85.28263854980469,
                    85.34953308105469,
                    85.2719955444336,
                    85.30632019042969,
                    0.005065355449914932,
                    85.3526611328125,
                    85.26170349121094,
                    84.92472076416016,
                    84.96832275390625,
                    85.23861694335938,
                    85.06107330322266,
                    -0.17143741250038147,
                    85.3543930053711,
                    0.13526339828968048,
                    85.28588104248047,
                    0.08543260395526886,
                    0.1544777899980545,
                    0.04717017710208893,
                    -0.1703656017780304,
                    -0.14336445927619934,
                    85.26814270019531,
                    0.14957645535469055,
                    -0.18785788118839264,
                    -0.1305447518825531,
                    0.0927550420165062,
                    -0.09056907147169113,
                    85.03121185302734,
                    84.96070861816406,
                    0.07390265166759491,
                    85.12714385986328,
                    85.00940704345703,
                    85.14728546142578,
                    85.33204650878906
                ],
                [
                    -0.1548057347536087,
                    -0.13004180788993835,
                    0.14191100001335144,
                    0.0901835709810257,
                    -0.1362735480070114,
                    -0.07146313041448593,
                    0.11018890887498856,
                    -0.04316365718841553,
                    0.22141911089420319,
                    -0.1724827140569687,
                    -0.22915180027484894,
                    -0.20679566264152527,
                    0.013019213452935219,
                    -0.13123226165771484,
                    -0.06988534331321716,
                    0.1266598254442215,
                    0.20786499977111816,
                    -0.19012022018432617,
                    -0.016749808564782143,
                    -0.046287085860967636,
                    -0.2116061896085739,
                    -0.16120824217796326,
                    0.12489767372608185,
                    0.04941543564200401,
                    0.11365528404712677,
                    -0.03145664930343628,
                    -0.09731056541204453,
                    0.14870940148830414,
                    -0.1538778394460678,
                    0.073625348508358,
                    -0.002608940005302429,
                    0.08374989032745361,
                    -0.17101751267910004,
                    -0.17041043937206268,
                    0.003868694882839918,
                    -0.06642583012580872,
                    -0.12306564301252365,
                    0.03830846771597862,
                    0.15893588960170746,
                    -0.14454533159732819,
                    -0.14487908780574799,
                    0.08906225860118866,
                    -0.14389753341674805,
                    0.20554021000862122,
                    -0.0975913479924202,
                    0.11742930114269257,
                    0.14967675507068634,
                    -0.17353397607803345,
                    0.06450100243091583,
                    0.08829151093959808,
                    0.15141411125659943,
                    -0.04070768132805824,
                    -0.19853399693965912,
                    0.08395372331142426,
                    0.0392279177904129,
                    -0.13274557888507843,
                    -0.09645142406225204,
                    0.09662903845310211,
                    -0.14319123327732086,
                    0.11468110978603363,
                    0.17793214321136475,
                    -0.1855587512254715,
                    0.043358173221349716,
                    0.10279975086450577
                ],
                [
                    84.96378326416016,
                    0.0016245543956756592,
                    85.06463623046875,
                    0.1448405683040619,
                    85.02734375,
                    -0.010940104722976685,
                    85.2235107421875,
                    -0.11442909389734268,
                    85.20138549804688,
                    -0.1302289366722107,
                    -0.18660947680473328,
                    0.09198904782533646,
                    0.1499328762292862,
                    85.41752624511719,
                    -0.09176880866289139,
                    -0.06850695610046387,
                    85.17530059814453,
                    -0.19608718156814575,
                    85.11126708984375,
                    85.07736206054688,
                    85.01646423339844,
                    85.1982192993164,
                    -0.2119067758321762,
                    85.06979370117188,
                    -0.12916991114616394,
                    0.07292281091213226,
                    85.08930206298828,
                    85.08497619628906,
                    85.37837982177734,
                    85.18749237060547,
                    0.13777165114879608,
                    85.00421142578125,
                    85.44534301757812,
                    85.18932342529297,
                    85.04243469238281,
                    0.2053486406803131,
                    85.11223602294922,
                    85.13182830810547,
                    84.98564147949219,
                    85.28993225097656,
                    85.30354309082031,
                    85.25533294677734,
                    -0.06373254954814911,
                    85.37846374511719,
                    0.1355149894952774,
                    85.20811462402344,
                    -0.19621185958385468,
                    -0.08697091042995453,
                    -0.17354436218738556,
                    0.19553779065608978,
                    0.1519647091627121,
                    85.04200744628906,
                    0.16745372116565704,
                    0.0758698433637619,
                    0.1267186850309372,
                    0.07175062596797943,
                    -0.15163084864616394,
                    85.15132141113281,
                    85.11140441894531,
                    -0.10606390237808228,
                    85.13775634765625,
                    85.18146514892578,
                    84.994384765625,
                    85.11750030517578
                ],
                [
                    0.053886547684669495,
                    0.07674233615398407,
                    -0.16666962206363678,
                    0.12844307720661163,
                    -0.09191535413265228,
                    0.147268608212471,
                    -0.09222166240215302,
                    0.020376965403556824,
                    -0.09079980850219727,
                    -0.001044154167175293,
                    -0.05413845181465149,
                    -0.1725924015045166,
                    0.08661480247974396,
                    0.13039247691631317,
                    0.15954597294330597,
                    0.16028840839862823,
                    -0.02427704632282257,
                    0.14286644756793976,
                    0.0576009601354599,
                    0.013678759336471558,
                    -0.11044641584157944,
                    -0.03933274745941162,
                    0.024435624480247498,
                    0.151671901345253,
                    -0.12562379240989685,
                    0.2159069925546646,
                    0.18340806663036346,
                    -0.17597319185733795,
                    -0.09562238305807114,
                    0.15566985309123993,
                    -0.03152979910373688,
                    -0.0948253870010376,
                    0.02080695331096649,
                    -0.06530320644378662,
                    -0.11464310437440872,
                    -0.04855373501777649,
                    0.09247536957263947,
                    0.17903028428554535,
                    -0.15674687922000885,
                    0.025239169597625732,
                    -0.018751531839370728,
                    -0.12758004665374756,
                    -0.06497739255428314,
                    0.06416542828083038,
                    0.11613191664218903,
                    0.208319291472435,
                    -0.19641467928886414,
                    0.07904769480228424,
                    0.048053279519081116,
                    0.16072066128253937,
                    0.12741555273532867,
                    0.04619531333446503,
                    -0.13295751810073853,
                    0.20454041659832,
                    -0.14018414914608002,
                    0.14111147820949554,
                    0.10775835812091827,
                    0.15715177357196808,
                    0.0509495884180069,
                    0.08209092915058136,
                    -0.12417086213827133,
                    -0.05177982151508331,
                    -0.12982946634292603,
                    -0.1826305091381073
                ],
                [
                    84.89852142333984,
                    -0.16233102977275848,
                    84.98833465576172,
                    0.02473316341638565,
                    85.24664306640625,
                    0.14164166152477264,
                    85.23638153076172,
                    -0.09100355207920074,
                    85.30923461914062,
                    0.1085674911737442,
                    -0.09722775220870972,
                    -0.09951033443212509,
                    0.18448685109615326,
                    85.1961669921875,
                    0.16983826458454132,
                    -0.052864089608192444,
                    85.31732940673828,
                    0.09164541959762573,
                    85.05845642089844,
                    85.02658081054688,
                    85.22207641601562,
                    85.12570190429688,
                    0.09166346490383148,
                    85.14459228515625,
                    -0.12752769887447357,
                    -0.03143404424190521,
                    85.25724029541016,
                    85.1373291015625,
                    85.27188873291016,
                    85.35741424560547,
                    -0.06871087104082108,
                    85.21683502197266,
                    85.01205444335938,
                    85.02027130126953,
                    85.30541229248047,
                    0.20037966966629028,
                    85.09619140625,
                    85.24467468261719,
                    84.95433807373047,
                    85.20040130615234,
                    84.93830871582031,
                    85.00218200683594,
                    0.12439514696598053,
                    84.98698425292969,
                    -0.13376231491565704,
                    85.21517944335938,
                    0.14068521559238434,
                    -0.008633449673652649,
                    -0.10331843793392181,
                    0.06184544414281845,
                    0.12090672552585602,
                    85.02066040039062,
                    -0.10777559131383896,
                    -0.20452415943145752,
                    -0.05361977219581604,
                    0.16750739514827728,
                    0.13463999330997467,
                    85.28217315673828,
                    85.18016052246094,
                    0.16723309457302094,
                    85.15799713134766,
                    85.353759765625,
                    85.29209899902344,
                    85.35387420654297
                ],
                [
                    85.1092300415039,
                    -0.1755218356847763,
                    85.0433349609375,
                    -0.13479934632778168,
                    84.98787689208984,
                    -0.001111718825995922,
                    84.9653091430664,
                    0.20270462334156036,
                    85.39232635498047,
                    -0.07082930207252502,
                    0.12672176957130432,
                    -0.12078026682138443,
                    0.19389896094799042,
                    85.01091766357422,
                    0.11410291492938995,
                    0.19596382975578308,
                    85.21282196044922,
                    0.002840267028659582,
                    84.99446868896484,
                    85.12808227539062,
                    84.88328552246094,
                    85.38372039794922,
                    0.017390072345733643,
                    85.25476837158203,
                    0.1763720065355301,
                    0.18148089945316315,
                    84.9690933227539,
                    85.35623931884766,
                    84.9619369506836,
                    85.14257049560547,
                    -0.09184680879116058,
                    85.29685974121094,
                    85.05291748046875,
                    85.33517456054688,
                    85.11856079101562,
                    -0.020376086235046387,
                    84.97174835205078,
                    85.05296325683594,
                    85.17869567871094,
                    85.27754974365234,
                    85.22168731689453,
                    85.07733917236328,
                    -0.055103838443756104,
                    85.23915100097656,
                    -0.14561231434345245,
                    85.2036361694336,
                    0.04242752492427826,
                    0.014246165752410889,
                    -0.04682740569114685,
                    0.05194714292883873,
                    -0.017402976751327515,
                    85.23248291015625,
                    0.029300354421138763,
                    -0.10886723548173904,
                    -0.13969644904136658,
                    -0.044052883982658386,
                    -0.11620605736970901,
                    85.11721801757812,
                    85.37675476074219,
                    0.1908763200044632,
                    85.2435302734375,
                    85.35470581054688,
                    84.99430847167969,
                    85.28562927246094
                ],
                [
                    85.18254089355469,
                    0.04021678864955902,
                    85.35006713867188,
                    0.15055063366889954,
                    85.19891357421875,
                    0.16774551570415497,
                    85.02690124511719,
                    -0.12516066431999207,
                    85.22132110595703,
                    -0.20234236121177673,
                    -0.03651706129312515,
                    0.17025874555110931,
                    -0.11317242681980133,
                    85.1251449584961,
                    -0.014080196619033813,
                    -0.13332247734069824,
                    85.01824188232422,
                    0.11863691359758377,
                    85.26410675048828,
                    84.98748779296875,
                    85.11434936523438,
                    85.17173767089844,
                    -0.14669322967529297,
                    85.00188446044922,
                    -0.18520832061767578,
                    0.19328336417675018,
                    85.03746032714844,
                    85.2318344116211,
                    84.88456726074219,
                    85.01593017578125,
                    0.10279876738786697,
                    85.13496398925781,
                    85.12581634521484,
                    85.1803970336914,
                    85.19676208496094,
                    0.032210275530815125,
                    84.93646240234375,
                    85.24564361572266,
                    85.01103210449219,
                    85.04287719726562,
                    85.24822998046875,
                    85.24560546875,
                    -0.08130788803100586,
                    84.97534942626953,
                    0.1720982939004898,
                    85.02889251708984,
                    -0.10330212861299515,
                    0.10583038628101349,
                    0.02475731074810028,
                    0.036585595458745956,
                    -0.16763515770435333,
                    85.26141357421875,
                    0.007835817523300648,
                    -0.03190532326698303,
                    0.07259906083345413,
                    -0.00014551477215718478,
                    0.027303680777549744,
                    85.3069076538086,
                    85.00557708740234,
                    -0.07715965807437897,
                    85.07524871826172,
                    84.9567642211914,
                    85.28440856933594,
                    85.13496398925781
                ],
                [
                    0.17443133890628815,
                    -0.11660163849592209,
                    -0.11321805417537689,
                    0.20379899442195892,
                    0.12005071341991425,
                    0.17711691558361053,
                    0.05692113935947418,
                    -0.19374071061611176,
                    -0.0861274003982544,
                    0.031386345624923706,
                    0.07966576516628265,
                    0.01158761978149414,
                    0.16154296696186066,
                    -0.11174128204584122,
                    -0.11567042768001556,
                    0.0032902508974075317,
                    -0.14697593450546265,
                    0.07446892559528351,
                    0.10696016252040863,
                    0.0050727128982543945,
                    -0.0519879013299942,
                    -0.16963240504264832,
                    0.018049970269203186,
                    -0.07572512328624725,
                    0.05376581847667694,
                    -0.07078935205936432,
                    -0.07304845750331879,
                    0.19063891470432281,
                    0.10183991491794586,
                    0.04015417397022247,
                    0.02913658320903778,
                    -0.05198155343532562,
                    -0.03664214909076691,
                    0.019451066851615906,
                    0.0736173540353775,
                    -0.2134937047958374,
                    -0.15447810292243958,
                    -0.03226727247238159,
                    -0.20464974641799927,
                    0.09622348845005035,
                    0.08100654184818268,
                    -0.18089492619037628,
                    0.06109155714511871,
                    -0.16245295107364655,
                    -0.042011529207229614,
                    -0.05717495083808899,
                    -0.1869851052761078,
                    -0.025485247373580933,
                    -0.11056385189294815,
                    -0.16438718140125275,
                    0.055639222264289856,
                    -0.19472895562648773,
                    0.09005804359912872,
                    0.06806741654872894,
                    -0.0887434184551239,
                    0.0010734200477600098,
                    0.05840633809566498,
                    0.11144448816776276,
                    0.03646354377269745,
                    -0.02072766423225403,
                    0.02414536476135254,
                    -0.1071249321103096,
                    -0.023151129484176636,
                    0.16952084004878998
                ],
                [
                    85.09009552001953,
                    0.1331821233034134,
                    85.22655487060547,
                    0.15649572014808655,
                    85.06240844726562,
                    -0.13723716139793396,
                    85.14891815185547,
                    -0.09380053728818893,
                    85.0580062866211,
                    0.03676731884479523,
                    0.13368090987205505,
                    -0.09777483344078064,
                    0.18790216743946075,
                    85.12606048583984,
                    0.2050921767950058,
                    -0.2053804099559784,
                    85.15017700195312,
                    -0.05112476646900177,
                    85.03773498535156,
                    85.27468872070312,
                    84.86943054199219,
                    85.27265167236328,
                    -0.1082310825586319,
                    85.21833801269531,
                    -0.09052497893571854,
                    -0.16890943050384521,
                    84.96265411376953,
                    85.10768127441406,
                    85.18541717529297,
                    85.06291961669922,
                    -0.13538552820682526,
                    84.9568099975586,
                    85.29869842529297,
                    85.3045883178711,
                    85.07705688476562,
                    -0.09785149991512299,
                    84.94329833984375,
                    85.08868408203125,
                    85.17893981933594,
                    85.2389907836914,
                    85.19273376464844,
                    84.98748779296875,
                    -0.1959185153245926,
                    85.09734344482422,
                    -0.012591719627380371,
                    85.1025619506836,
                    -0.09563286602497101,
                    -0.04701454937458038,
                    -0.09798597544431686,
                    -0.0903717428445816,
                    -0.20283827185630798,
                    85.13453674316406,
                    -0.20611143112182617,
                    0.08643155544996262,
                    -0.05365951731801033,
                    -0.045021504163742065,
                    -0.18066272139549255,
                    84.85037231445312,
                    85.12916564941406,
                    -0.06830063462257385,
                    84.98255157470703,
                    85.11842346191406,
                    84.9886474609375,
                    85.20964050292969
                ],
                [
                    84.9775390625,
                    -0.1698794960975647,
                    85.18814086914062,
                    -0.20081989467144012,
                    85.1305160522461,
                    -0.20261573791503906,
                    85.12919616699219,
                    -0.1280452311038971,
                    85.07539367675781,
                    -0.038912415504455566,
                    -0.04267757385969162,
                    -0.1509857475757599,
                    0.14041416347026825,
                    85.18203735351562,
                    0.0812949389219284,
                    -0.09274478256702423,
                    85.3478775024414,
                    0.044128984212875366,
                    84.91725158691406,
                    85.28641510009766,
                    85.14459228515625,
                    85.01602935791016,
                    0.17948214709758759,
                    85.06624603271484,
                    -0.007622703909873962,
                    0.025651052594184875,
                    85.09185028076172,
                    85.29698181152344,
                    85.29035949707031,
                    85.28202056884766,
                    -0.09267169237136841,
                    84.93852996826172,
                    85.05547332763672,
                    84.94660186767578,
                    85.20215606689453,
                    0.1057511568069458,
                    85.25491333007812,
                    85.20777130126953,
                    84.88872528076172,
                    84.89598846435547,
                    85.06593322753906,
                    85.26026916503906,
                    -0.10656796395778656,
                    85.1585464477539,
                    0.036099955439567566,
                    85.07940673828125,
                    -0.18738515675067902,
                    -0.11812032759189606,
                    -0.07149286568164825,
                    0.1391359269618988,
                    -0.2029423862695694,
                    85.14069366455078,
                    -0.04127085581421852,
                    -0.03530150651931763,
                    0.029840033501386642,
                    0.14821891486644745,
                    -0.08686818182468414,
                    85.11302185058594,
                    85.07469940185547,
                    -0.1872168779373169,
                    85.3631591796875,
                    85.00125122070312,
                    85.01617431640625,
                    85.04783630371094
                ],
                [
                    0.15010638535022736,
                    0.08012811839580536,
                    0.03826068341732025,
                    -0.05353616178035736,
                    0.03387241065502167,
                    -0.1517350673675537,
                    0.0029031187295913696,
                    -0.009290158748626709,
                    0.14330746233463287,
                    -0.1292288601398468,
                    -0.06637890636920929,
                    -0.07235181331634521,
                    0.07199491560459137,
                    -0.11807990819215775,
                    -0.028246819972991943,
                    -0.1613476276397705,
                    -0.07675878703594208,
                    0.10356734693050385,
                    0.17015613615512848,
                    -0.12401890009641647,
                    0.08350978791713715,
                    -0.005985245108604431,
                    -0.12348949164152145,
                    0.1916530877351761,
                    0.0659257024526596,
                    0.14356018602848053,
                    0.033741310238838196,
                    -0.09280526638031006,
                    0.07482956349849701,
                    0.19061125814914703,
                    -0.006646633148193359,
                    0.04117424786090851,
                    0.04190157353878021,
                    0.12391988933086395,
                    -0.20861497521400452,
                    -0.028438791632652283,
                    -0.023957014083862305,
                    -0.1954493522644043,
                    -0.18173198401927948,
                    0.04919309914112091,
                    0.13099490106105804,
                    -0.09078562259674072,
                    -0.05711926519870758,
                    -0.13400280475616455,
                    0.045535311102867126,
                    -0.19478723406791687,
                    0.06937332451343536,
                    -0.1715632677078247,
                    0.13646773993968964,
                    -0.2011866718530655,
                    -0.2027486115694046,
                    -0.09979011118412018,
                    0.09724466502666473,
                    -0.20337897539138794,
                    -0.13698938488960266,
                    -0.10960709303617477,
                    0.005116954445838928,
                    -0.03614361584186554,
                    0.09766753017902374,
                    -0.139601469039917,
                    0.19922266900539398,
                    -0.1988985389471054,
                    -0.09764910489320755,
                    0.05675147473812103
                ],
                [
                    -0.1351984739303589,
                    -0.00465160608291626,
                    0.2076619267463684,
                    -0.1664087325334549,
                    -0.06270863115787506,
                    -0.0315016508102417,
                    0.04523351788520813,
                    0.16330616176128387,
                    -0.008806712925434113,
                    -0.18663141131401062,
                    -0.10210058093070984,
                    0.1447369009256363,
                    0.1987861841917038,
                    -0.07495014369487762,
                    -0.1570347547531128,
                    -0.14956611394882202,
                    -0.01629176177084446,
                    -0.12573446333408356,
                    -0.04442308470606804,
                    0.06984568387269974,
                    -0.08038255572319031,
                    0.09877222031354904,
                    0.18315260112285614,
                    -0.1799040138721466,
                    -0.1808173954486847,
                    0.008598670363426208,
                    -0.14191967248916626,
                    -0.048835933208465576,
                    0.07631287723779678,
                    0.024801889434456825,
                    0.07332048565149307,
                    0.06653425842523575,
                    -0.10298998653888702,
                    0.01825137808918953,
                    0.1831112653017044,
                    -0.028782621026039124,
                    -0.03552424535155296,
                    -0.07007509469985962,
                    -0.0791274905204773,
                    -0.07853221148252487,
                    -0.1301264464855194,
                    0.02045489475131035,
                    -0.00860971212387085,
                    0.029218081384897232,
                    -0.15685181319713593,
                    0.06508889049291611,
                    0.06267159432172775,
                    -0.10752833634614944,
                    0.17971651256084442,
                    0.12104935199022293,
                    -0.1669982224702835,
                    0.1689039021730423,
                    -0.06982698291540146,
                    -0.12773862481117249,
                    0.04826223850250244,
                    -0.07342284917831421,
                    -0.096685990691185,
                    0.06319475173950195,
                    -0.1013016626238823,
                    0.15209592878818512,
                    -0.1834058165550232,
                    -0.028639312833547592,
                    -0.16069069504737854,
                    -0.12396202981472015
                ],
                [
                    85.12224578857422,
                    0.010631173849105835,
                    84.93034362792969,
                    -0.031686246395111084,
                    85.2790298461914,
                    -0.21338410675525665,
                    84.96744537353516,
                    -0.09058642387390137,
                    84.95882415771484,
                    0.03421686589717865,
                    -0.06488890200853348,
                    0.08703470230102539,
                    0.060204580426216125,
                    84.9352798461914,
                    0.07710413634777069,
                    -0.21211552619934082,
                    85.00132751464844,
                    0.16841450333595276,
                    84.920654296875,
                    85.14937591552734,
                    85.016357421875,
                    85.28845977783203,
                    0.11779280006885529,
                    85.28166198730469,
                    0.003530315589159727,
                    -0.1851898431777954,
                    85.30168151855469,
                    84.97883605957031,
                    85.05579376220703,
                    85.15380859375,
                    -0.045634254813194275,
                    85.18294525146484,
                    85.37442779541016,
                    85.34363555908203,
                    84.91287231445312,
                    0.14917859435081482,
                    85.14056396484375,
                    85.3385238647461,
                    85.24696350097656,
                    85.16645812988281,
                    85.24041748046875,
                    85.27801513671875,
                    -0.007477134466171265,
                    85.05564880371094,
                    -0.19996747374534607,
                    85.07776641845703,
                    -0.005188494920730591,
                    0.1341664046049118,
                    -0.04363274201750755,
                    0.0004958121571689844,
                    0.027248814702033997,
                    85.127685546875,
                    0.0737840086221695,
                    0.017474746331572533,
                    -0.19110219180583954,
                    -0.11777442693710327,
                    -0.017191234976053238,
                    85.29346466064453,
                    85.03846740722656,
                    0.19113005697727203,
                    85.2227783203125,
                    85.20404052734375,
                    85.00440216064453,
                    85.12745666503906
                ],
                [
                    84.97127532958984,
                    -0.11269902437925339,
                    84.94735717773438,
                    -0.07530109584331512,
                    85.31961059570312,
                    0.11297937482595444,
                    85.28278350830078,
                    -0.15667429566383362,
                    85.11280059814453,
                    -0.17302750051021576,
                    -0.07417220622301102,
                    -0.010262048803269863,
                    0.03218056261539459,
                    85.06970977783203,
                    0.20966769754886627,
                    0.17965731024742126,
                    85.33665466308594,
                    -0.12360569089651108,
                    84.95328521728516,
                    85.03251647949219,
                    84.97249603271484,
                    85.123291015625,
                    -0.02291528880596161,
                    85.13155364990234,
                    -0.1982744187116623,
                    -0.11350186169147491,
                    85.14746856689453,
                    85.32778930664062,
                    85.10282135009766,
                    85.16442108154297,
                    -0.13646970689296722,
                    84.86183166503906,
                    85.06017303466797,
                    85.10686492919922,
                    85.05130767822266,
                    0.11363239586353302,
                    85.1183853149414,
                    85.23223114013672,
                    84.96633911132812,
                    85.00390625,
                    84.94060516357422,
                    85.13574981689453,
                    -0.01717446744441986,
                    84.94400787353516,
                    -0.043476372957229614,
                    85.08118438720703,
                    0.10879503935575485,
                    0.06251521408557892,
                    -0.21071305871009827,
                    -0.030500397086143494,
                    0.024403929710388184,
                    85.31608581542969,
                    -0.13602904975414276,
                    0.0759555846452713,
                    0.07774706929922104,
                    -0.1009388267993927,
                    -0.23382249474525452,
                    85.1827163696289,
                    85.08074188232422,
                    0.09513510763645172,
                    85.3814697265625,
                    84.99185943603516,
                    85.21516418457031,
                    85.31800842285156
                ],
                [
                    -0.1192852184176445,
                    -0.062252476811409,
                    0.10135726630687714,
                    0.20698954164981842,
                    0.029730916023254395,
                    0.01726752519607544,
                    -0.16924944519996643,
                    0.11950816214084625,
                    0.15183736383914948,
                    0.021238282322883606,
                    -0.04511043429374695,
                    0.15731267631053925,
                    -0.02211529016494751,
                    -0.08417785167694092,
                    0.02958323061466217,
                    -0.08571837842464447,
                    -0.09718567132949829,
                    -0.11054248362779617,
                    -0.007405534386634827,
                    0.014201506972312927,
                    0.035628870129585266,
                    0.01118767261505127,
                    0.07944072782993317,
                    -0.18480847775936127,
                    -0.015490129590034485,
                    0.12964625656604767,
                    -0.12019066512584686,
                    0.03893445432186127,
                    -0.002109721302986145,
                    0.17561115324497223,
                    0.01197853684425354,
                    -0.2074439376592636,
                    -0.10506631433963776,
                    0.17438162863254547,
                    -0.06424155831336975,
                    -0.10886697471141815,
                    0.04456077516078949,
                    -0.033515021204948425,
                    -0.16999328136444092,
                    0.08285553753376007,
                    -0.033318549394607544,
                    -0.15137708187103271,
                    -0.11207371205091476,
                    -0.07255172729492188,
                    -0.00790165364742279,
                    0.13884304463863373,
                    0.174624964594841,
                    -0.0036564916372299194,
                    -0.005050256848335266,
                    0.04048086702823639,
                    -0.05544142425060272,
                    -0.18038493394851685,
                    0.1298884004354477,
                    -0.1274939477443695,
                    -0.08756205439567566,
                    0.0631750077009201,
                    0.13327018916606903,
                    -0.03482040762901306,
                    -0.10084939002990723,
                    0.04660360515117645,
                    0.032918766140937805,
                    0.10467152297496796,
                    0.14061103761196136,
                    -0.04484158754348755
                ],
                [
                    84.77783966064453,
                    -0.05483351647853851,
                    85.05391693115234,
                    -0.11027690768241882,
                    84.99542236328125,
                    -0.03991318121552467,
                    85.18962860107422,
                    0.09267230331897736,
                    85.26090240478516,
                    -0.14736607670783997,
                    -0.00012446018808986992,
                    0.04240218922495842,
                    0.09833168983459473,
                    85.20530700683594,
                    -0.1336207240819931,
                    -0.06430594623088837,
                    85.22756958007812,
                    0.11163369566202164,
                    84.89997100830078,
                    85.12957763671875,
                    85.03616333007812,
                    84.89736938476562,
                    0.1506362408399582,
                    84.8299331665039,
                    -0.1279858946800232,
                    -0.14112506806850433,
                    84.99858093261719,
                    84.99279022216797,
                    85.1217041015625,
                    84.98611450195312,
                    -0.07939570397138596,
                    85.10441589355469,
                    85.04134368896484,
                    85.10087585449219,
                    84.9063720703125,
                    0.19101351499557495,
                    84.92139434814453,
                    85.16600036621094,
                    84.87532043457031,
                    84.87637329101562,
                    85.18820190429688,
                    85.02690887451172,
                    -0.09061284363269806,
                    85.20032501220703,
                    -0.16119325160980225,
                    84.87783813476562,
                    -0.07821281254291534,
                    -0.02147604525089264,
                    0.11286784708499908,
                    0.09638518840074539,
                    -0.14315736293792725,
                    85.24925994873047,
                    -0.034641578793525696,
                    -0.06111447513103485,
                    0.09590819478034973,
                    -0.06141697242856026,
                    -0.09395871311426163,
                    85.19259643554688,
                    85.28280639648438,
                    -0.21436342597007751,
                    85.19745635986328,
                    85.09870910644531,
                    85.01309967041016,
                    85.19886779785156
                ],
                [
                    84.85274505615234,
                    0.035892948508262634,
                    85.12499237060547,
                    -0.11491813510656357,
                    85.33048248291016,
                    0.13243360817432404,
                    85.34233856201172,
                    -0.19591279327869415,
                    85.16536712646484,
                    -0.1454438865184784,
                    -0.09663352370262146,
                    0.1571488231420517,
                    -0.06312505900859833,
                    85.05000305175781,
                    -0.015466079115867615,
                    -0.09194179624319077,
                    85.07282257080078,
                    -0.1611160933971405,
                    85.38636779785156,
                    85.20914459228516,
                    85.12089538574219,
                    85.44692993164062,
                    -0.11358042061328888,
                    85.00757598876953,
                    0.07024866342544556,
                    -0.12796971201896667,
                    85.02891540527344,
                    85.22132110595703,
                    85.3724365234375,
                    85.2354965209961,
                    0.009532809257507324,
                    85.11599731445312,
                    85.20606231689453,
                    85.24913787841797,
                    85.1786880493164,
                    0.16267694532871246,
                    85.0216293334961,
                    85.27689361572266,
                    85.3042221069336,
                    84.98654174804688,
                    85.21991729736328,
                    85.2251968383789,
                    0.05694158375263214,
                    85.14347076416016,
                    -0.059947580099105835,
                    85.29096221923828,
                    0.21123184263706207,
                    0.21034641563892365,
                    -0.13665881752967834,
                    -0.16641011834144592,
                    -0.13869349658489227,
                    85.28019714355469,
                    -0.16899564862251282,
                    0.07023141533136368,
                    -0.13424356281757355,
                    -0.17635664343833923,
                    -0.03914865478873253,
                    85.40340423583984,
                    85.0157470703125,
                    -0.00020772218704223633,
                    85.26582336425781,
                    85.29460144042969,
                    84.99822235107422,
                    85.24063110351562
                ],
                [
                    -0.1746601164340973,
                    -0.1823001503944397,
                    0.21617324650287628,
                    0.07638655602931976,
                    0.18316297233104706,
                    -0.06864917278289795,
                    -0.16086794435977936,
                    -0.1329200565814972,
                    0.17909078299999237,
                    0.1035749763250351,
                    0.007048442959785461,
                    0.16194568574428558,
                    0.2142297774553299,
                    -0.20145374536514282,
                    -0.05580931901931763,
                    0.006500914692878723,
                    -0.11919126659631729,
                    0.012832105159759521,
                    -0.019649654626846313,
                    0.04513643682003021,
                    -0.14355581998825073,
                    0.16277019679546356,
                    0.04955668747425079,
                    0.07370065152645111,
                    0.2045709639787674,
                    0.09057213366031647,
                    0.06443358957767487,
                    0.13059450685977936,
                    -0.18008698523044586,
                    -0.07422259449958801,
                    0.051874592900276184,
                    -0.07305614650249481,
                    -0.05030542612075806,
                    -0.029702678322792053,
                    -0.007963135838508606,
                    0.014761880040168762,
                    0.1005401760339737,
                    0.19825522601604462,
                    0.18008579313755035,
                    0.20571638643741608,
                    -0.1661507487297058,
                    0.06577469408512115,
                    -0.004113420844078064,
                    0.09830249845981598,
                    -0.1777787208557129,
                    0.05209280550479889,
                    -0.1278490424156189,
                    0.11093200743198395,
                    -0.10711745172739029,
                    0.08285985887050629,
                    0.1308400183916092,
                    0.04156140983104706,
                    0.123173788189888,
                    0.009330883622169495,
                    -0.21301142871379852,
                    -0.024991050362586975,
                    -0.0752742737531662,
                    -0.13476547598838806,
                    0.07670681178569794,
                    -0.05128876864910126,
                    0.07182757556438446,
                    -0.168446347117424,
                    0.21266837418079376,
                    -0.017841383814811707
                ],
                [
                    85.10863494873047,
                    -0.0739060640335083,
                    85.32305908203125,
                    -0.04955907166004181,
                    85.23313903808594,
                    -0.13772840797901154,
                    85.18177032470703,
                    0.1358717828989029,
                    85.01721954345703,
                    -0.13336758315563202,
                    0.014089919626712799,
                    -0.22456838190555573,
                    0.1574057787656784,
                    85.16643524169922,
                    -0.16975323855876923,
                    0.17413824796676636,
                    85.39414978027344,
                    -0.18115483224391937,
                    84.9172592163086,
                    85.2545394897461,
                    85.0404052734375,
                    85.39366149902344,
                    -0.04853406548500061,
                    85.31749725341797,
                    0.09645865857601166,
                    0.08467359840869904,
                    85.18698120117188,
                    85.20747375488281,
                    85.29997253417969,
                    85.21672821044922,
                    -0.1335180103778839,
                    85.19873809814453,
                    85.01214599609375,
                    85.11763763427734,
                    85.2540283203125,
                    -0.09550932794809341,
                    85.3388442993164,
                    85.0172119140625,
                    85.185546875,
                    85.14676666259766,
                    85.1966323852539,
                    85.08071899414062,
                    -0.09532665461301804,
                    84.97575378417969,
                    -0.20572616159915924,
                    85.32664489746094,
                    -0.06343929469585419,
                    0.17383898794651031,
                    0.15635451674461365,
                    -0.10103040933609009,
                    -0.0849684476852417,
                    85.13367462158203,
                    0.17393046617507935,
                    0.09808306396007538,
                    -0.05385987460613251,
                    0.0354870930314064,
                    -0.15789003670215607,
                    84.96790313720703,
                    85.03193664550781,
                    -0.11078008264303207,
                    85.16011047363281,
                    85.36383056640625,
                    85.3186264038086,
                    84.99517059326172
                ],
                [
                    84.95256805419922,
                    0.06105475127696991,
                    85.20911407470703,
                    0.04102759435772896,
                    85.2646484375,
                    0.11276356130838394,
                    84.97249603271484,
                    0.19611875712871552,
                    85.12319946289062,
                    0.07911475002765656,
                    -0.10131211578845978,
                    -0.15294675529003143,
                    0.03039790503680706,
                    85.23454284667969,
                    -0.06342050433158875,
                    -0.03953924775123596,
                    85.27011108398438,
                    0.017697574570775032,
                    84.93221282958984,
                    85.15328216552734,
                    85.02262878417969,
                    85.11878967285156,
                    -0.211461141705513,
                    85.12310791015625,
                    0.020727721974253654,
                    -0.2048431634902954,
                    85.19214630126953,
                    84.96036529541016,
                    84.98614501953125,
                    84.99115753173828,
                    -0.17102696001529694,
                    85.2090072631836,
                    85.08818054199219,
                    85.15452575683594,
                    85.24181365966797,
                    0.05868865177035332,
                    85.28748321533203,
                    85.11190032958984,
                    84.79524993896484,
                    85.09223937988281,
                    84.9664535522461,
                    85.09839630126953,
                    -0.1247190609574318,
                    85.06123352050781,
                    0.1503732055425644,
                    85.23634338378906,
                    -0.1566435992717743,
                    -0.10410025715827942,
                    0.10912945866584778,
                    0.0161655992269516,
                    -0.15241886675357819,
                    85.0760726928711,
                    0.13656596839427948,
                    0.20836755633354187,
                    -0.17180462181568146,
                    -0.138691246509552,
                    0.18184395134449005,
                    85.2072525024414,
                    85.16899871826172,
                    -0.07713571190834045,
                    85.3172836303711,
                    85.08230590820312,
                    84.9090347290039,
                    85.11376190185547
                ],
                [
                    84.86692810058594,
                    0.05454717576503754,
                    85.28307342529297,
                    -0.03890907019376755,
                    85.21070861816406,
                    -0.18847550451755524,
                    85.34269714355469,
                    -0.12595930695533752,
                    85.273193359375,
                    -0.14034752547740936,
                    -0.07924507558345795,
                    0.15447576344013214,
                    -0.10732387751340866,
                    84.9351577758789,
                    -0.15411047637462616,
                    0.1320638507604599,
                    85.28196716308594,
                    -0.0037255180068314075,
                    84.91968536376953,
                    84.92430877685547,
                    85.21076202392578,
                    85.26974487304688,
                    0.14444227516651154,
                    85.15869140625,
                    -0.1685594916343689,
                    -0.1909121870994568,
                    85.34535217285156,
                    84.9449691772461,
                    84.92903900146484,
                    85.11611938476562,
                    -0.11003322899341583,
                    84.85485076904297,
                    85.15420532226562,
                    84.9810562133789,
                    85.26683807373047,
                    0.1945570707321167,
                    85.17667388916016,
                    85.21640014648438,
                    84.92581939697266,
                    85.27616882324219,
                    85.09610748291016,
                    85.30816650390625,
                    0.20800982415676117,
                    85.01048278808594,
                    -0.05297011137008667,
                    85.17972564697266,
                    -0.13612481951713562,
                    -0.21470189094543457,
                    -0.1939333975315094,
                    -0.11625123023986816,
                    -0.08894307911396027,
                    85.05471801757812,
                    0.16391250491142273,
                    -0.18735310435295105,
                    -0.1604948341846466,
                    0.17434684932231903,
                    -0.04256467521190643,
                    84.94127655029297,
                    85.08634185791016,
                    0.10950927436351776,
                    85.36937713623047,
                    85.34153747558594,
                    84.93318939208984,
                    85.21363830566406
                ],
                [
                    84.71517944335938,
                    -0.01928010582923889,
                    85.1757583618164,
                    0.1627514660358429,
                    85.24645233154297,
                    0.01725957728922367,
                    85.1739273071289,
                    0.04355631768703461,
                    85.1515884399414,
                    -0.07566322386264801,
                    0.022128408774733543,
                    -0.0468330942094326,
                    -0.12720240652561188,
                    85.13677215576172,
                    -0.12799645960330963,
                    -0.02540590427815914,
                    84.99856567382812,
                    -0.22016136348247528,
                    85.17740631103516,
                    84.86775970458984,
                    84.84111022949219,
                    85.23258209228516,
                    0.025994524359703064,
                    85.03776550292969,
                    -0.05370452627539635,
                    0.12617890536785126,
                    84.9493408203125,
                    85.05117797851562,
                    85.14157104492188,
                    85.10445404052734,
                    0.15187138319015503,
                    84.91555786132812,
                    84.9100341796875,
                    85.16337585449219,
                    85.06510925292969,
                    -0.08180917054414749,
                    85.10428619384766,
                    84.96350860595703,
                    84.84260559082031,
                    85.14789581298828,
                    84.99150085449219,
                    84.96377563476562,
                    0.11867688596248627,
                    84.83378601074219,
                    -0.08553367853164673,
                    85.2201156616211,
                    0.1811598390340805,
                    -0.16486641764640808,
                    0.11016359180212021,
                    -0.05308830365538597,
                    -0.21236395835876465,
                    84.92372131347656,
                    -0.07157476246356964,
                    -0.021121857687830925,
                    -0.024727482348680496,
                    0.05203988403081894,
                    -0.06278379261493683,
                    85.18605041503906,
                    84.89852905273438,
                    0.03674565255641937,
                    84.99961853027344,
                    85.10836029052734,
                    85.11553955078125,
                    85.17022705078125
                ],
                [
                    0.1252606064081192,
                    -0.17748501896858215,
                    -0.0776289850473404,
                    0.16877923905849457,
                    0.041365042328834534,
                    -0.14750678837299347,
                    -0.04249219596385956,
                    -0.059327006340026855,
                    0.10273580253124237,
                    0.13248713314533234,
                    0.11343453824520111,
                    0.10698111355304718,
                    -0.04585890471935272,
                    0.01633039116859436,
                    -0.1342804729938507,
                    0.18010137975215912,
                    -0.19139058887958527,
                    -0.18993307650089264,
                    -0.04427197575569153,
                    0.1733691245317459,
                    -0.20310848951339722,
                    -0.1777603030204773,
                    -0.1668117344379425,
                    -0.20616549253463745,
                    0.08053766191005707,
                    0.14716656506061554,
                    -0.20685599744319916,
                    -0.09028279781341553,
                    0.010976865887641907,
                    -0.0620754212141037,
                    -0.12503641843795776,
                    0.06140948832035065,
                    0.1412954181432724,
                    -0.08744901418685913,
                    0.0892220288515091,
                    0.17869152128696442,
                    0.21337978541851044,
                    0.20605985820293427,
                    0.05005456507205963,
                    0.08473451435565948,
                    0.025353416800498962,
                    -0.009547218680381775,
                    -0.12683802843093872,
                    0.18707548081874847,
                    0.07934330403804779,
                    -0.19657191634178162,
                    -0.18845315277576447,
                    0.11061631143093109,
                    -0.026786983013153076,
                    -0.05519494414329529,
                    -0.10523299127817154,
                    -0.04536108672618866,
                    -0.1725504845380783,
                    0.021256759762763977,
                    0.10767655074596405,
                    -0.04340776801109314,
                    -0.07491356134414673,
                    -0.043791770935058594,
                    -0.19449177384376526,
                    0.13456954061985016,
                    -0.18196675181388855,
                    0.02983492612838745,
                    -0.15672297775745392,
                    0.19221065938472748
                ],
                [
                    85.1587905883789,
                    -0.1070389375090599,
                    85.01663970947266,
                    0.024598771706223488,
                    84.99186706542969,
                    -0.12237348407506943,
                    85.14859008789062,
                    0.027838721871376038,
                    85.28633117675781,
                    0.12045665085315704,
                    -0.06681213527917862,
                    0.18264544010162354,
                    -0.09273362159729004,
                    85.30945587158203,
                    -0.12217129021883011,
                    0.14648257195949554,
                    84.98540496826172,
                    -0.22822290658950806,
                    84.98350524902344,
                    85.26071166992188,
                    85.06494140625,
                    85.2595443725586,
                    0.09608529508113861,
                    85.28874206542969,
                    0.11928540468215942,
                    -0.029469981789588928,
                    85.0273666381836,
                    84.97460174560547,
                    85.07588195800781,
                    85.13792419433594,
                    -0.09785615652799606,
                    85.02201080322266,
                    85.24951934814453,
                    85.06839752197266,
                    84.92411041259766,
                    0.18138717114925385,
                    84.99793243408203,
                    84.95381164550781,
                    85.27388000488281,
                    84.93930053710938,
                    85.03292083740234,
                    85.2972640991211,
                    0.12668462097644806,
                    84.91860961914062,
                    0.00019088387489318848,
                    84.99468994140625,
                    -0.01359548419713974,
                    -0.2092423439025879,
                    -0.21160030364990234,
                    -0.12105116248130798,
                    0.20435111224651337,
                    85.25757598876953,
                    -0.11751188337802887,
                    -0.13683517277240753,
                    0.06001749634742737,
                    -0.10830866545438766,
                    0.06395460665225983,
                    85.24530029296875,
                    85.1181640625,
                    0.06515516340732574,
                    85.37965393066406,
                    85.0570068359375,
                    85.19645690917969,
                    85.25213623046875
                ],
                [
                    0.04879339039325714,
                    0.15970341861248016,
                    -0.052274540066719055,
                    -0.0760612040758133,
                    -0.1399737000465393,
                    0.06420095264911652,
                    -0.1457185447216034,
                    -0.06912732124328613,
                    -0.0004231184720993042,
                    0.1081593781709671,
                    -0.15940222144126892,
                    -0.08888015151023865,
                    0.1161416620016098,
                    0.10680975019931793,
                    0.171617791056633,
                    -0.122543103992939,
                    0.18868078291416168,
                    -0.048590585589408875,
                    -0.19432251155376434,
                    0.0673767477273941,
                    0.17686857283115387,
                    0.14028404653072357,
                    -0.038212865591049194,
                    -0.21172109246253967,
                    0.20216505229473114,
                    0.1924365609884262,
                    0.19795356690883636,
                    -0.20073644816875458,
                    0.11839525401592255,
                    0.2162257581949234,
                    0.037992045283317566,
                    0.043584004044532776,
                    0.20821218192577362,
                    -0.0319843590259552,
                    0.07635144889354706,
                    -0.11036919802427292,
                    -0.20484144985675812,
                    0.1621450036764145,
                    0.08382074534893036,
                    0.025470227003097534,
                    -0.19040372967720032,
                    -0.05586455762386322,
                    0.18989373743534088,
                    -0.012180715799331665,
                    -0.08448384702205658,
                    -0.0428946316242218,
                    0.09220235049724579,
                    -0.20181001722812653,
                    -0.12890076637268066,
                    0.19236551225185394,
                    0.0013962388038635254,
                    0.17525739967823029,
                    0.107073113322258,
                    -0.008234754204750061,
                    0.16583023965358734,
                    0.13072793185710907,
                    0.006367161870002747,
                    -0.059687718749046326,
                    0.019625753164291382,
                    0.05753757059574127,
                    -0.12573197484016418,
                    0.1941274255514145,
                    -0.14900022745132446,
                    0.1048734039068222
                ],
                [
                    85.01515197753906,
                    -0.21288733184337616,
                    85.37842559814453,
                    -0.029329119250178337,
                    85.3519058227539,
                    -0.12733450531959534,
                    85.29068756103516,
                    -0.06173427402973175,
                    85.10613250732422,
                    0.13880012929439545,
                    -0.004813511390239,
                    -0.13530762493610382,
                    -0.07049144804477692,
                    85.33692932128906,
                    -0.09011632204055786,
                    0.07712219655513763,
                    85.2972412109375,
                    0.07993669807910919,
                    85.24229431152344,
                    85.22944641113281,
                    84.97544860839844,
                    85.42166137695312,
                    0.16144756972789764,
                    84.99925994873047,
                    0.02515084110200405,
                    -0.1606416404247284,
                    85.10945129394531,
                    85.08467102050781,
                    85.32726287841797,
                    85.22746276855469,
                    0.13947194814682007,
                    85.2311019897461,
                    85.021484375,
                    85.23092651367188,
                    85.14533233642578,
                    -0.051189981400966644,
                    85.27100372314453,
                    85.09490966796875,
                    85.24822998046875,
                    85.20426940917969,
                    85.28305053710938,
                    85.04537963867188,
                    0.024045437574386597,
                    85.28202056884766,
                    -0.18666455149650574,
                    85.19676971435547,
                    0.04219107702374458,
                    0.1374005526304245,
                    0.022090405225753784,
                    0.046782709658145905,
                    -0.15425635874271393,
                    84.9574966430664,
                    0.058527618646621704,
                    0.1595572531223297,
                    -0.08722711354494095,
                    0.10157947987318039,
                    0.0802522748708725,
                    85.03658294677734,
                    85.35445404052734,
                    -0.12086176872253418,
                    85.1524887084961,
                    85.23369598388672,
                    85.31360626220703,
                    85.32362365722656
                ],
                [
                    85.0826644897461,
                    -0.16605256497859955,
                    85.11138916015625,
                    -0.18064241111278534,
                    84.87244415283203,
                    0.04713870584964752,
                    84.99533081054688,
                    0.17258180677890778,
                    85.15328979492188,
                    0.08225901424884796,
                    0.02486199513077736,
                    0.10235412418842316,
                    -0.058576054871082306,
                    84.83612823486328,
                    0.11329258978366852,
                    -0.09290185570716858,
                    84.89522552490234,
                    0.11118818819522858,
                    84.953857421875,
                    84.82038879394531,
                    84.76441192626953,
                    85.08045196533203,
                    -0.14267699420452118,
                    85.13433074951172,
                    -0.1496155858039856,
                    -0.015565544366836548,
                    85.2354965209961,
                    84.99021911621094,
                    84.89583587646484,
                    85.20025634765625,
                    -0.055337563157081604,
                    84.92703247070312,
                    85.09039306640625,
                    85.13368225097656,
                    85.03033447265625,
                    -0.07071242481470108,
                    85.02499389648438,
                    85.24849700927734,
                    85.1662826538086,
                    84.86070251464844,
                    85.05536651611328,
                    85.1928482055664,
                    -0.008030757308006287,
                    85.01286315917969,
                    -0.05653218924999237,
                    84.98696899414062,
                    -0.1375870555639267,
                    -0.05472913384437561,
                    -0.14949244260787964,
                    0.12869341671466827,
                    0.20645661652088165,
                    85.0953140258789,
                    -0.07225655019283295,
                    0.04060084745287895,
                    -0.02272885851562023,
                    -0.1534564048051834,
                    0.09191136807203293,
                    84.92909240722656,
                    85.25809478759766,
                    0.04933236539363861,
                    84.99356842041016,
                    85.19834899902344,
                    85.08668518066406,
                    85.16881561279297
                ],
                [
                    85.10043334960938,
                    0.2070937603712082,
                    85.05323028564453,
                    0.04880732297897339,
                    84.92276000976562,
                    -0.07970382273197174,
                    85.1416015625,
                    0.10240952670574188,
                    85.04911041259766,
                    -0.10924199223518372,
                    0.03694067522883415,
                    -0.11571499705314636,
                    -0.14581775665283203,
                    85.01927185058594,
                    0.20179866254329681,
                    -0.19762417674064636,
                    85.08128356933594,
                    0.07362788170576096,
                    85.03207397460938,
                    85.11038970947266,
                    85.10905456542969,
                    84.95596313476562,
                    -0.17326292395591736,
                    85.10365295410156,
                    -0.16083641350269318,
                    -0.1814391016960144,
                    85.11769104003906,
                    85.04000091552734,
                    85.10713958740234,
                    85.07846069335938,
                    0.10198003053665161,
                    85.23037719726562,
                    84.9072265625,
                    84.87446594238281,
                    84.9037857055664,
                    0.07343407720327377,
                    85.24788665771484,
                    85.28763580322266,
                    84.90470886230469,
                    85.1640853881836,
                    84.88714599609375,
                    84.93143463134766,
                    -0.1819848120212555,
                    84.99028778076172,
                    0.20256303250789642,
                    84.90141296386719,
                    0.18166513741016388,
                    -0.1008203774690628,
                    0.005031883716583252,
                    0.15935131907463074,
                    0.13966403901576996,
                    84.96007537841797,
                    -0.19790783524513245,
                    -0.17596787214279175,
                    0.03473614528775215,
                    -0.0972498208284378,
                    -0.07071490585803986,
                    85.19538116455078,
                    85.15380096435547,
                    -0.09880202263593674,
                    85.34725189208984,
                    84.93573760986328,
                    84.908203125,
                    85.01074981689453
                ],
                [
                    85.06501770019531,
                    0.17129965126514435,
                    85.10224151611328,
                    -0.19251945614814758,
                    85.30789947509766,
                    0.11896415054798126,
                    85.09800720214844,
                    -0.05118444561958313,
                    85.3959732055664,
                    0.1586119681596756,
                    -0.07616830617189407,
                    -0.12850500643253326,
                    0.0478268563747406,
                    85.12179565429688,
                    -0.06263713538646698,
                    -0.11975544691085815,
                    85.38632202148438,
                    -0.09633202850818634,
                    85.20662689208984,
                    85.02568054199219,
                    85.1258316040039,
                    85.1715087890625,
                    0.19871006906032562,
                    84.92504119873047,
                    0.031666845083236694,
                    0.16943515837192535,
                    85.12747955322266,
                    85.33052825927734,
                    85.01509857177734,
                    85.03074645996094,
                    -0.12753793597221375,
                    85.10231018066406,
                    85.02686309814453,
                    84.97283172607422,
                    85.20521545410156,
                    -0.12913140654563904,
                    85.155517578125,
                    85.18274688720703,
                    84.93035888671875,
                    85.20161437988281,
                    85.08570861816406,
                    85.2997817993164,
                    -0.023334220051765442,
                    84.97444915771484,
                    -0.014461517333984375,
                    85.37387084960938,
                    -0.15174740552902222,
                    -0.0670795887708664,
                    0.19874291121959686,
                    0.059957899153232574,
                    0.09105713665485382,
                    85.27831268310547,
                    0.14614109694957733,
                    -0.18812160193920135,
                    -0.20788002014160156,
                    -0.027430159971117973,
                    0.045039501041173935,
                    85.12117767333984,
                    85.0109634399414,
                    -0.08892495930194855,
                    85.17958068847656,
                    85.33505249023438,
                    85.21072387695312,
                    85.14764404296875
                ],
                [
                    84.76641845703125,
                    -0.20276279747486115,
                    85.02059173583984,
                    0.1585979014635086,
                    85.25640869140625,
                    -0.24280749261379242,
                    84.9026870727539,
                    0.08318112790584564,
                    84.96270751953125,
                    0.03421466052532196,
                    0.17378851771354675,
                    -0.11699841171503067,
                    -0.1496122181415558,
                    85.1312026977539,
                    -0.14198946952819824,
                    0.11397778987884521,
                    85.17593383789062,
                    -0.12990352511405945,
                    85.18495178222656,
                    84.95394897460938,
                    84.94246673583984,
                    84.98381042480469,
                    -0.04236268997192383,
                    84.95948791503906,
                    -0.011667300015687943,
                    -0.12868088483810425,
                    85.25920104980469,
                    85.10033416748047,
                    85.24745178222656,
                    85.06909942626953,
                    -0.13638046383857727,
                    85.12709045410156,
                    85.2938003540039,
                    85.28260803222656,
                    85.253173828125,
                    -0.009248260408639908,
                    85.16499328613281,
                    84.88964080810547,
                    85.03071594238281,
                    85.17340850830078,
                    85.06854248046875,
                    85.10813903808594,
                    -0.040931761264801025,
                    85.11808776855469,
                    -0.09040090441703796,
                    85.2735366821289,
                    0.17217406630516052,
                    -0.14971640706062317,
                    -0.10881245136260986,
                    -0.06258360296487808,
                    0.09661908447742462,
                    85.27921295166016,
                    0.059838179498910904,
                    0.07075797766447067,
                    0.16232791543006897,
                    0.08807077258825302,
                    0.16786377131938934,
                    85.26387786865234,
                    84.99097442626953,
                    -0.09650543332099915,
                    85.08702850341797,
                    85.02519226074219,
                    85.16595458984375,
                    85.189208984375
                ],
                [
                    84.74334716796875,
                    0.09967552125453949,
                    84.89093780517578,
                    0.025444090366363525,
                    84.98441314697266,
                    -0.04528072476387024,
                    85.0653076171875,
                    -0.16711921989917755,
                    85.29601287841797,
                    0.17963550984859467,
                    0.191439688205719,
                    0.05150892212986946,
                    -0.2079223394393921,
                    85.23332214355469,
                    -0.13656911253929138,
                    -0.04775802791118622,
                    85.20110321044922,
                    -0.05914604663848877,
                    85.11702728271484,
                    85.2510757446289,
                    84.7752685546875,
                    85.03521728515625,
                    -0.2089780569076538,
                    85.02197265625,
                    0.12175119668245316,
                    -0.1705750674009323,
                    85.0235595703125,
                    85.22185516357422,
                    85.18017578125,
                    85.0223617553711,
                    -0.2167806774377823,
                    84.91777038574219,
                    85.03313446044922,
                    85.16114807128906,
                    84.94356536865234,
                    -0.0800148993730545,
                    85.05396270751953,
                    84.97399139404297,
                    85.15465545654297,
                    85.19377136230469,
                    85.07202911376953,
                    85.14625549316406,
                    -0.07207410037517548,
                    85.06751251220703,
                    0.18689791858196259,
                    85.12396240234375,
                    -0.2289343774318695,
                    0.06761451065540314,
                    0.03356441855430603,
                    0.02401771955192089,
                    -0.056897908449172974,
                    85.02399444580078,
                    0.1745634824037552,
                    -0.16368608176708221,
                    -0.0329725407063961,
                    -0.10180751234292984,
                    -0.10989203304052353,
                    85.0758056640625,
                    84.99700927734375,
                    -0.1669524908065796,
                    84.99359893798828,
                    85.30680084228516,
                    85.13923645019531,
                    85.21170806884766
                ],
                [
                    0.029711812734603882,
                    -0.021396130323410034,
                    0.0945567637681961,
                    0.038128629326820374,
                    -0.0034661144018173218,
                    -0.11364396661520004,
                    0.1698661893606186,
                    -0.07391509413719177,
                    -0.09474650770425797,
                    -0.1986972838640213,
                    0.1562170535326004,
                    0.17113874852657318,
                    0.1496446579694748,
                    0.20045362412929535,
                    -0.09708882868289948,
                    0.1127554327249527,
                    -0.08170358836650848,
                    -0.07280543446540833,
                    -0.14971458911895752,
                    0.19968099892139435,
                    -0.0678662657737732,
                    0.02525150775909424,
                    -0.04824334383010864,
                    0.132523313164711,
                    0.04585658013820648,
                    -0.009767740964889526,
                    -0.1832323968410492,
                    0.16038177907466888,
                    0.13430292904376984,
                    0.09722886979579926,
                    0.12393118441104889,
                    -0.06974580883979797,
                    -0.15166956186294556,
                    0.07094834744930267,
                    -0.18056373298168182,
                    0.039285942912101746,
                    -0.19225309789180756,
                    0.12196753919124603,
                    0.18114502727985382,
                    -0.11625971645116806,
                    -0.19845296442508698,
                    -0.030663669109344482,
                    0.10360725224018097,
                    -0.15773600339889526,
                    -0.21410569548606873,
                    0.1262729912996292,
                    -0.03599293529987335,
                    -0.13564518094062805,
                    -0.021121621131896973,
                    -0.20277957618236542,
                    0.03700323402881622,
                    -0.20617198944091797,
                    -0.14752134680747986,
                    0.1638433188199997,
                    0.12590794265270233,
                    0.14028681814670563,
                    -0.03706899285316467,
                    -0.07610219717025757,
                    -0.014280647039413452,
                    -0.21550963819026947,
                    0.11953870952129364,
                    -0.18169951438903809,
                    0.019121378660202026,
                    0.04052586853504181
                ],
                [
                    0.13296101987361908,
                    -0.18905973434448242,
                    -0.06709109246730804,
                    0.091721311211586,
                    0.07636688649654388,
                    -0.1864238977432251,
                    -0.007404506206512451,
                    0.20738719403743744,
                    -0.16949307918548584,
                    0.12240751087665558,
                    -0.02717442810535431,
                    0.0031493306159973145,
                    0.06106264889240265,
                    0.1368599385023117,
                    -0.08670192956924438,
                    -0.04234658181667328,
                    -0.14982572197914124,
                    0.21194027364253998,
                    -0.08609220385551453,
                    -0.08069273829460144,
                    -0.210411936044693,
                    0.16774220764636993,
                    0.20708666741847992,
                    0.2110692411661148,
                    -0.06382700800895691,
                    -0.17494097352027893,
                    -0.1365511417388916,
                    -0.02355360984802246,
                    -0.16573412716388702,
                    0.09167490899562836,
                    -0.16585826873779297,
                    0.1353525072336197,
                    -0.16517344117164612,
                    -0.01592022180557251,
                    0.15315712988376617,
                    0.1381509155035019,
                    0.2054874151945114,
                    -0.14870238304138184,
                    -0.12712863087654114,
                    0.07586772739887238,
                    0.07321731746196747,
                    -0.16177715361118317,
                    0.16829098761081696,
                    0.1786775141954422,
                    -0.10637408494949341,
                    0.19102300703525543,
                    -0.1962364912033081,
                    0.11200578510761261,
                    -0.051126688718795776,
                    0.03459860384464264,
                    -0.07019871473312378,
                    -0.04384586215019226,
                    0.1223265677690506,
                    0.055809274315834045,
                    0.18495281040668488,
                    0.12911774218082428,
                    0.20366521179676056,
                    -0.16996726393699646,
                    -0.0670151561498642,
                    0.0009761154651641846,
                    0.20696134865283966,
                    0.14449970424175262,
                    0.16647057235240936,
                    0.19113604724407196
                ]
            ],
            [
                81.52037811279297,
                0.0,
                81.56877899169922,
                -0.0238743107765913,
                81.63026428222656,
                -0.052208155393600464,
                81.60604095458984,
                0.0,
                81.61585235595703,
                0.0,
                -0.013259600847959518,
                -0.041097283363342285,
                -0.0207402091473341,
                81.55330657958984,
                0.0,
                -0.015507996082305908,
                81.67031860351562,
                -0.021951181814074516,
                81.5128402709961,
                81.56076049804688,
                81.48847961425781,
                81.64326477050781,
                0.0,
                81.53814697265625,
                0.001764811691828072,
                0.0,
                81.58636474609375,
                81.69992065429688,
                81.50764465332031,
                81.58610534667969,
                -0.02336549200117588,
                81.58601379394531,
                81.64443969726562,
                81.6407470703125,
                81.54195404052734,
                -0.00950234942138195,
                81.59320831298828,
                81.62154388427734,
                81.57914733886719,
                81.46117401123047,
                81.49214935302734,
                81.58989715576172,
                0.0,
                81.5566177368164,
                0.0,
                81.61253356933594,
                -0.019975733011960983,
                0.0,
                -0.008423911407589912,
                -0.01379245426505804,
                0.0,
                81.62823486328125,
                -0.029193248599767685,
                -0.005556929856538773,
                -0.016128290444612503,
                -0.022948233410716057,
                -0.02520410530269146,
                81.52320098876953,
                81.6030044555664,
                0.0,
                81.6662368774414,
                81.66336822509766,
                81.53680419921875,
                81.60742950439453
            ],
            [
                [
                    41.32252502441406,
                    41.64632797241211,
                    41.59563446044922,
                    41.63550567626953
                ],
                [
                    0.23193371295928955,
                    0.28917622566223145,
                    0.24859565496444702,
                    -0.22287237644195557
                ],
                [
                    41.66670608520508,
                    41.39504623413086,
                    41.65922927856445,
                    41.472023010253906
                ],
                [
                    0.2004711776971817,
                    0.04771403595805168,
                    -0.1356378197669983,
                    -0.09113261848688126
                ],
                [
                    41.67662811279297,
                    41.46372604370117,
                    41.26648712158203,
                    41.47413635253906
                ],
                [
                    -0.07798327505588531,
                    -0.1262000948190689,
                    -0.07466988265514374,
                    0.2574540078639984
                ],
                [
                    41.270809173583984,
                    41.29499435424805,
                    41.7115364074707,
                    41.680118560791016
                ],
                [
                    0.2658844590187073,
                    0.19399091601371765,
                    0.10085183382034302,
                    0.10156974196434021
                ],
                [
                    41.48811340332031,
                    41.55594253540039,
                    41.5850944519043,
                    41.21996307373047
                ],
                [
                    -0.1263919621706009,
                    -0.20194876194000244,
                    -0.2834252715110779,
                    0.19049710035324097
                ],
                [
                    0.04638158902525902,
                    0.20270177721977234,
                    -0.2624283730983734,
                    -0.10155069082975388
                ],
                [
                    -0.10518112778663635,
                    0.03402424976229668,
                    -0.0010341559536755085,
                    7.530994480475783e-05
                ],
                [
                    -0.19582171738147736,
                    0.18695811927318573,
                    0.033924005925655365,
                    -0.2559921443462372
                ],
                [
                    41.33514404296875,
                    41.708465576171875,
                    41.694297790527344,
                    41.238407135009766
                ],
                [
                    0.055769383907318115,
                    0.004755198955535889,
                    -0.07910238206386566,
                    -0.07183977961540222
                ],
                [
                    -0.26315566897392273,
                    0.10774455219507217,
                    0.09713837504386902,
                    -0.06407304108142853
                ],
                [
                    41.39875030517578,
                    41.236637115478516,
                    41.62543487548828,
                    41.535316467285156
                ],
                [
                    -0.22582176327705383,
                    -0.2218349277973175,
                    -0.23518086969852448,
                    0.24119603633880615
                ],
                [
                    41.59992218017578,
                    41.74951171875,
                    41.4409294128418,
                    41.507774353027344
                ],
                [
                    41.53465270996094,
                    41.68073272705078,
                    41.19559860229492,
                    41.68441390991211
                ],
                [
                    41.5059814453125,
                    41.74137496948242,
                    41.61164855957031,
                    41.57387924194336
                ],
                [
                    41.38302993774414,
                    41.34981918334961,
                    41.531700134277344,
                    41.67653274536133
                ],
                [
                    0.25422579050064087,
                    -0.07203991711139679,
                    0.12051922082901001,
                    -0.10254500806331635
                ],
                [
                    41.6822395324707,
                    41.57464599609375,
                    41.652923583984375,
                    41.11004638671875
                ],
                [
                    -0.0842381939291954,
                    -0.2997141480445862,
                    -0.1688271462917328,
                    0.04164743050932884
                ],
                [
                    -0.26721012592315674,
                    0.16078674793243408,
                    0.23750561475753784,
                    -0.1310800164937973
                ],
                [
                    41.583351135253906,
                    41.43654251098633,
                    41.48360824584961,
                    41.689842224121094
                ],
                [
                    41.19321060180664,
                    41.46665573120117,
                    41.55451965332031,
                    41.281959533691406
                ],
                [
                    41.31645584106445,
                    41.764713287353516,
                    41.54955291748047,
                    41.635765075683594
                ],
                [
                    41.66203689575195,
                    41.585472106933594,
                    41.362857818603516,
                    41.55348587036133
                ],
                [
                    -0.19413599371910095,
                    -0.11967360228300095,
                    -0.1865280717611313,
                    0.10742370784282684
                ],
                [
                    41.5382080078125,
                    41.25981521606445,
                    41.446693420410156,
                    41.7171745300293
                ],
                [
                    41.63288879394531,
                    41.542869567871094,
                    41.4416389465332,
                    41.33429718017578
                ],
                [
                    41.7335090637207,
                    41.42405319213867,
                    41.326446533203125,
                    41.2875862121582
                ],
                [
                    41.753028869628906,
                    41.654197692871094,
                    41.40488815307617,
                    41.46070861816406
                ],
                [
                    -0.03170216083526611,
                    -0.04596581310033798,
                    -0.1937342882156372,
                    0.14499440789222717
                ],
                [
                    41.74163818359375,
                    41.24483871459961,
                    41.55325698852539,
                    41.550811767578125
                ],
                [
                    41.6807861328125,
                    41.34078598022461,
                    41.670623779296875,
                    41.26508331298828
                ],
                [
                    41.66576385498047,
                    41.27617263793945,
                    41.39860153198242,
                    41.742557525634766
                ],
                [
                    41.62291717529297,
                    41.57599639892578,
                    41.670902252197266,
                    41.668521881103516
                ],
                [
                    41.63119888305664,
                    41.563297271728516,
                    41.56843948364258,
                    41.69373321533203
                ],
                [
                    41.211341857910156,
                    41.78609085083008,
                    41.445556640625,
                    41.32770538330078
                ],
                [
                    0.20263615250587463,
                    -0.015448451042175293,
                    -0.12066149711608887,
                    -0.19865643978118896
                ],
                [
                    41.670074462890625,
                    41.35578536987305,
                    41.71049499511719,
                    41.5363655090332
                ],
                [
                    -0.011958390474319458,
                    -0.12450437247753143,
                    0.15265241265296936,
                    0.23765218257904053
                ],
                [
                    41.28041076660156,
                    41.73011016845703,
                    41.42439651489258,
                    41.350032806396484
                ],
                [
                    -0.2769431173801422,
                    0.22626955807209015,
                    -0.21499550342559814,
                    0.13002343475818634
                ],
                [
                    0.09234455227851868,
                    0.055303603410720825,
                    0.07391339540481567,
                    0.10915988683700562
                ],
                [
                    -0.23955705761909485,
                    -0.16364452242851257,
                    -0.27787134051322937,
                    -0.11940394341945648
                ],
                [
                    -0.22143933176994324,
                    -0.055644966661930084,
                    -0.268159955739975,
                    0.16503499448299408
                ],
                [
                    0.04340597987174988,
                    0.10592806339263916,
                    0.017857342958450317,
                    -0.2934516668319702
                ],
                [
                    41.20950698852539,
                    41.491111755371094,
                    41.42805099487305,
                    41.71690368652344
                ],
                [
                    -0.26417770981788635,
                    -0.2643929719924927,
                    -0.16874989867210388,
                    -0.11061503738164902
                ],
                [
                    -0.18754415214061737,
                    0.24634699523448944,
                    0.19736117124557495,
                    0.15182346105575562
                ],
                [
                    -0.27205923199653625,
                    0.02106454223394394,
                    0.16000929474830627,
                    -0.1954886019229889
                ],
                [
                    -0.31291186809539795,
                    0.17615559697151184,
                    -0.2041241079568863,
                    -0.008008823730051517
                ],
                [
                    0.051281485706567764,
                    0.06550305336713791,
                    0.057246170938014984,
                    -0.1928873509168625
                ],
                [
                    41.44027328491211,
                    41.7190055847168,
                    41.53874206542969,
                    41.53639602661133
                ],
                [
                    41.54435348510742,
                    41.36847686767578,
                    41.52370834350586,
                    41.69215393066406
                ],
                [
                    0.2827760577201843,
                    0.199700266122818,
                    -0.03776085376739502,
                    0.13897356390953064
                ],
                [
                    41.50482940673828,
                    41.49711608886719,
                    41.36954116821289,
                    41.524986267089844
                ],
                [
                    41.57114791870117,
                    41.44145202636719,
                    41.493404388427734,
                    41.452213287353516
                ],
                [
                    41.675880432128906,
                    41.594276428222656,
                    41.47563934326172,
                    41.58012390136719
                ],
                [
                    41.287330627441406,
                    41.48920822143555,
                    41.58927536010742,
                    41.58906555175781
                ]
            ],
            [
                37.47533416748047,
                37.38447189331055,
                37.45259475708008,
                37.479095458984375
            ]
        ];

        // Training data shape
        const numFeatures = 10;
        const numOutputs = 4;

        // Create a Sequential model
        const model = tf.sequential();

        // Add the input layer (64 units, ReLU activation)
        model.add(tf.layers.dense({
            units: 64,
            activation: 'relu',
            inputShape: [numFeatures]  // inputShape should match the number of features in X_train
        }));

        // Add the hidden layer (64 units, ReLU activation)
        model.add(tf.layers.dense({
            units: 64,
            activation: 'relu'
        }));

        // Add the output layer (softmax activation for classification)
        model.add(tf.layers.dense({
            units: numOutputs,  // Number of classes (y_train.shape[1])
            activation: 'sigmoid'
        }));

        // Compile the model (using categorical crossentropy for multi-class classification)
        model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        console.log('Model created successfully.');
        app.ticker.add(delta => ofmLoop(delta, player, enemy, world, keys, app, spawn, [940,60], model));
    }

}

function addWinningText(app, holdTime){
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',         // Font family similar to the image
        fontSize: 100,               // Large font size to match the "Red Wins!" size
        fill: 'red',                 // Red text color
        fontWeight: 'bold',          // Bold font style
        stroke: 'black',             // Black outline
        strokeThickness: 8,          // Thickness of the outline
        align: 'center',             // Center alignment for the text
    });

    // Create a Text object with the style
    const text = new PIXI.Text(`Time: ${Math.round(holdTime * 100) / 100}`, style);

    // Position and add the styled text to the stage
    text.x = (app.screen.width - text.width) / 2;
    text.y = (app.screen.height - text.height) / 2;
    app.stage.addChild(text);
    setTimeout(() => {
        text.visible = false;
    }, "3000");
}

function gameOver(app, score, player, value){

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',         // Font family similar to the image
        fontSize: 100,               // Large font size to match the "Red Wins!" size
        fill: 'red',                 // Red text color
        fontWeight: 'bold',          // Bold font style
        stroke: 'black',             // Black outline
        strokeThickness: 8,          // Thickness of the outline
        align: 'center',             // Center alignment for the text
    });
    const text = new PIXI.Text(`Score: ${score}`, style);
    text.x = player.playerSprite.x - text.width / 2;
    text.y = player.playerSprite.y - 100;
    app.stage.addChild(text);

    const button = new PIXI.Graphics();
    button.beginFill(0x3498db); // Button color
    button.drawRoundedRect(0, 0, 200, 60, 10); // Draw a rounded rectangle
    button.endFill();

    // Position the button
    button.x = player.playerSprite.x - button.width / 2;
    button.y = player.playerSprite.y + 100;

    // Create text for the button
    const buttonText = new PIXI.Text('Play Again', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
    });
    buttonText.x = button.x + (button.width - buttonText.width) / 2;
    buttonText.y = button.y + (button.height - buttonText.height) / 2;

    // Add button and text to stage
    app.stage.addChild(button);
    app.stage.addChild(buttonText);

    button.interactive = true;
    button.buttonMode = true;

    // Add a click event listener
    button.on('pointerdown', function() {
        playAgain(app, value);
    });
    if(!done){
        done = true;
        let leaderboard = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": [], "snipersEasy": [], "snipersMed": [], "snipersHard": []}'));
        let leader = null;
        if(value === "Snipers (Easy)"){
            leader = leaderboard.snipersEasy;
        }
        else if (value === "Snipers (Medium)"){
            leader = leaderboard.snipersMed;
        }
        else {
            leader = leaderboard.snipersHard;
        }
        if (leader == null){
            leader = [];
        }
        console.log(leader);

        if(leader.length < LEADERBOARD_LENGTH){
            leader.push(player.tags);
            leader.sort(function(a, b) {
                return b - a;
            });
            leader = leader.slice(0, LEADERBOARD_LENGTH);
        }
        else{
            leader.push(player.tags);
            leader.sort(function(a, b) {
                return b - a;
            });
            leader = leader.slice(0, LEADERBOARD_LENGTH);
        }
        console.log(leader);

        if(value === "Snipers (Easy)"){
            leaderboard.snipersEasy = leader;
        }
        else if (value === "Snipers (Medium)"){
            leaderboard.snipersMed = leader;
        }
        else {
            leaderboard.snipersHard = leader;
        }
        GM_setValue('leaderboard', JSON.stringify(leaderboard));
    }

}

function playAgain(app, value) {
    const map =[["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","5","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
    const spawn = [620,700];
    done = false;
    killApp(app);
    if(value === "Snipers (Hard)"){
        map[15][17] = "1.5555";
        spawn[0] = 700;
    }
    training(tilesExtracted, spawn, map, value);

}
function killApp(app){
    app.ticker.stop();
    app.destroy(true, { children: true, texture: true, baseTexture: true });
}
function pixelsToLoc(x,y){
    return [x/40, y/40];
}

function playerDeath(player, mapSprites, keys, otherBall){
    player.dead = true;
    if(player.hasFlag){
        player.hasFlag = false;
        player.playerFlag.visible = false;
        player.taggable = false;
        if(player.flagLoc){
            mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = true;
        }
    }
    keys.up = false;
    keys.down = false;
    keys.right = false;
    keys.left = false;
    if(otherBall.playerCollision){
        const distance = Math.sqrt((otherBall.playerCollision.m_xf.position.x - player.playerCollision.m_xf.position.x) * (otherBall.playerCollision.m_xf.position.x - player.playerCollision.m_xf.position.x) + (otherBall.playerCollision.m_xf.position.y - player.playerCollision.m_xf.position.y) * (otherBall.playerCollision.m_xf.position.y - player.playerCollision.m_xf.position.y))
        console.log(distance);
    }
}

function addSelection(container, val, app){
    // Create the "X" button
    const button = document.createElement('button');
    button.textContent = '✖';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#1a1918';
    button.style.color = 'white';
    button.style.fontSize = '24px';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.textAlign = 'center';
    button.style.lineHeight = '50px';
    button.style.position = 'absolute';
    button.style.top = '20px';
    button.style.left = '15px';

    // Create the dropdown (hidden initially)
    const select = document.createElement('select');
    select.style.padding = '10px';
    select.style.border = '2px solid #007BFF';
    select.style.borderRadius = '5px';
    select.style.backgroundColor = '#f0f8ff';
    select.style.fontSize = '16px';
    select.style.cursor = 'pointer';
    select.style.outline = 'none';
    select.style.width = '200px';
    select.style.color = '#333';
    select.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    select.style.display = 'none'; // Hidden by default
    select.style.position = 'absolute';
    select.style.top = '30px';
    select.style.left = '5px';


    const spikeMazeGroup = document.createElement('optgroup');
    spikeMazeGroup.label = 'Spike Mazes';

    const spikeMazeOptions = ['Easy', 'Medium', 'Hard'];
    spikeMazeOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = `Spike Maze (${optionText})`;
        option.textContent = `Spike Maze (${optionText})`;
        spikeMazeGroup.appendChild(option);
    });

    // Append the optgroup to the select
    select.appendChild(spikeMazeGroup);

    const sniperGroup = document.createElement('optgroup');
    sniperGroup.label = 'Snipers';

    const sniperOptions = ['Easy', 'Medium', 'Hard'];
    sniperOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = `Snipers (${optionText})`;
        option.textContent = `Snipers (${optionText})`;
        sniperGroup.appendChild(option);
    });

    // Append the optgroup to the select
    select.appendChild(sniperGroup);

    const ofmGroup = document.createElement('optgroup');
    ofmGroup.label = 'OFM';

    const ofmOptions = ['Easy', 'Medium', 'Hard'];
    ofmOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = `OFM (${optionText})`;
        option.textContent = `OFM (${optionText})`;
        ofmGroup.appendChild(option);
    });

    // Append the optgroup to the select
    select.appendChild(ofmGroup);

    // Add another option for Leaderboard
    const leaderboardOption = document.createElement('option');
    leaderboardOption.value = 'Leaderboard';
    leaderboardOption.textContent = 'Leaderboard';
    select.appendChild(leaderboardOption);

    // Add the button and select to the document
    document.body.appendChild(button);
    document.body.appendChild(select);


    // Show dropdown on hover over button
    button.addEventListener('mouseover', function() {
        button.style.display = 'none';
        select.style.display = 'block';
    });

    // Hide dropdown and show button again when mouse leaves dropdown
    select.addEventListener('mouseleave', function() {
        select.style.display = 'none';
        button.style.display = 'block';
    });

    // Optionally handle dropdown changes
    select.addEventListener('change', function() {
        done = false;
        let spawn = [];
        let map = [];
        switch(select.value){
            case "Leaderboard":
                leaderboardScreen(app);
                break;
            case "Spike Maze (Easy)":
                spawn = [80, 680];
                map = [["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","7","7","7","7","7","7","7","7","7","2","2","2","7"],["7","2","2","2","2","7","7","7","2","2","2","2","2","2","2","16","2","2","2","7"],["7","2","2","2","7","7","2","2","2","2","7","7","7","7","7","7","2","2","2","7"],["7","2","2","2","7","2","2","2","2","2","7","2","2","2","2","7","7","7","7","7"],["7","2","2","7","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","7"],["7","2","2","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","2","7"],["7","2","7","7","2","2","2","7","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","7","7","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","2","7","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","2","7","2","7","7","7","7","7","7","7","2","2","2","2","2","7"],["7","7","2","2","2","7","7","7","2","2","2","2","2","2","7","2","2","2","2","7"],["7","7","2","2","2","2","2","2","2","2","2","2","2","2","7","2","2","2","2","7"],["7","7","7","2","2","2","2","2","2","2","2","2","2","2","7","7","7","7","7","7"],["7","2","7","7","7","7","7","2","2","2","2","2","2","2","2","17","18","17","18","7"],["7","2","2","2","2","2","7","7","7","7","2","2","2","2","2","18","17","18","17","7"],["7","2","2","2","2","2","2","2","2","7","7","7","7","7","2","17","18","17","18","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
                killApp(app);
                training(tilesExtracted, spawn, map, select.value);
                break;
            case "Spike Maze (Medium)":
                spawn = [80, 1000];
                map = [['7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7'],['7','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','2','7','7','7','2','2','2','2','2','2','7'],['7','2','2','2','2','7','7','7','7','7','7','7','7','2','2','2','2','2','7','2','2','16','2','2','2','2','2','2','7'],['7','2','2','7','7','2','2','2','2','2','2','7','17','2','2','2','2','2','7','2','7','7','2','2','2','2','2','2','7'],['7','2','7','2','2','2','7','7','7','7','2','7','2','2','2','2','2','2','7','2','7','7','7','7','7','7','7','7','7'],['7','7','2','2','7','7','2','2','2','7','2','7','2','7','2','7','7','7','7','2','7','7','11','11','11','11','7','7','7'],['7','7','2','7','2','2','2','7','2','7','2','7','2','7','7','2','2','2','7','2','7','7','7','7','7','7','7','7','7'],['7','7','2','2','2','7','7','2','2','7','2','7','2','7','7','2','7','2','7','2','2','7','7','7','7','7','7','7','0'],['7','2','7','7','7','2','2','2','7','7','2','2','2','7','7','2','7','2','2','7','2','7','2','2','2','2','7','7','0'],['7','2','2','7','2','2','7','7','7','7','7','7','7','7','7','2','2','7','2','2','2','7','2','7','7','2','7','7','0'],['7','2','2','7','2','7','23','23','23','23','23','7','2','2','2','7','2','7','7','7','7','2','2','7','2','2','7','7','0'],['7','2','7','2','2','7','23','11','11','11','23','7','2','7','2','2','2','7','2','2','2','2','7','2','2','7','7','7','0'],['7','2','7','2','7','7','23','23','23','23','23','7','2','2','7','7','7','2','2','7','7','7','7','2','7','7','7','7','0'],['7','2','7','2','7','7','7','7','7','7','7','7','7','2','2','2','7','2','7','2','2','2','7','2','2','2','7','7','0'],['7','2','7','2','7','2','2','2','7','2','2','2','7','7','7','2','7','2','7','2','7','2','2','7','7','2','7','7','0'],['7','2','7','2','7','2','7','2','7','2','7','2','7','2','2','2','7','2','7','2','2','7','2','2','2','2','7','7','0'],['7','2','7','2','7','2','7','2','7','2','7','2','7','2','7','7','7','2','7','7','2','2','7','7','7','7','7','7','0'],['7','2','7','2','7','2','7','2','7','2','7','2','7','2','2','2','2','2','7','7','7','2','2','2','2','2','7','7','0'],['7','2','7','2','2','2','7','2','2','2','7','2','2','7','7','7','7','7','7','7','7','7','7','7','7','2','7','7','0'],['7','2','7','7','7','7','7','7','7','7','7','7','2','2','2','2','2','2','2','2','2','2','2','2','2','2','7','7','0'],['7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','7','0']];    document.body.innerHTML = '';
                killApp(app);
                training(tilesExtracted, spawn, map, select.value);
                break;
            case "Spike Maze (Hard)":
                map = [["1.4000","1.00050050","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.00050500","1.3000","0","0","1.50050050","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.00550500","0","0","0","0","0","0","0","0","0"],["1.50000050","1.2000","2","2","2","2","2","2","2","1.1000","1.05000005","1.0505","1.0505","1.05505000","2","2","2","2","12","12","12","2","2","2","2","1.55000005","1.00550500","0","0","0","0","0","0","0","0"],["1.5050","2","2","5","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","12","12","2","14","2","2","2","1.55000005","1.00550500","0","0","0","0","0","0","0"],["1.5050","2","5","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","12","12","2","2","2","2","2","2","1.5050","0","0","0","0","0","0","0"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","12","12","2","2","2","2","2","2","1.5050","0","0","0","0","0","0","0"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","12","12","2","2","2","2","2","2","1.5050","0","0","0","0","0","0","0"],["1.5050","2","2","2","2","2","1.4005","1.0505","1.0505","1.3055","2","2","2","2","2","2","2","2","12","12","12","2","2","2","2","15","2","1.50000005","1.3000","0","0","0","0","0","0"],["1.5050","2","2","2","2","2","1.5050","13.1","2","2","2","2","2","2","2","2","2","2","12","12","12","2","2","2","2","2","2","1.1000","1.05000005","1.00550500","0","0","0","0","0"],["1.5050","2","2","2","2","2","1.5050","2","2","2","2","2","2","2","2","2","1.50050050","1.0505","1.0505","1.00050550","1.0505","1.3005","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["1.50000005","1.3000","2","2","2","2","1.5550","2","2","2","2","2","2","2","2","2","1.5050","25","25","1.5050","0","1.5050","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["1.1000","1.00500500","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5550","9.3","9.3","1.55000005","1.0505","1.05505000","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","18","18","11","11","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","18","18","11","11","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","18","18","11","11","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.50000005","1.3000","2","2","2","2","2","2","2","2","2","2","2","2","2","11","18","18","11","11","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.1000","1.00500500","2","2","2","2","2","2","2","2","2","1.5555","2","2","2","11","18","18","11","11","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","2","2","2","2","9.2","2","2","11","18","18","11","11","2","1.5505","1.0555","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","0","1.55000005","1.0505","1.00550500","2","2","2","2","2","2","2","2","2","9.2","2","11","18","18","11","11","2","2","2","2","2","2","1.4005","1.0505","1.00505500","0","0","0","0","0"],["0","0","0","0","1.5050","2","5","2","2","2","2","2","2","2","2","1.5505","1.00550500","18","18","11","11","2","2","2","2","2","2","1.5050","10","1.5050","0","0","0","0","0"],["0","0","0","1.4000","1.00505000","2","2","2","2","2","2","2","2","2","2","2","1.1005","1.3005","18","11","11","2","2","2","8","2","1.4000","1.00005055","1.0505","1.2005","0","0","0","0","0"],["0","0","1.4005","1.05005000","1.2000","2","2","2","2","2","2","2","2","2","2","8","2","1.1005","1.00050500","1.00050050","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.05005000","1.2000","0","0","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5000","1.0050","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.1000","1.00500500","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","1.3505","2","2","2","2","2","2","2","2","2","1.50000005","1.3000","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.4000","1.00505000","2","2","2","2","2","2","1.2055","2","2","2","2","2","2","2","2","2","1.1000","1.00500500","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.50000050","1.2000","2","2","2","2","2","2","2","2","2","2","1.3505","2","2","2","2","2","8","1.5050","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","1.50000055","1.3055","2","2","2","2","2","1.50000005","1.3000","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","1.5050","7","2","2","2","2","2","1.1000","1.00500500","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","16","2","2","2","1.5050","7","2","2","6.22","2","2","10","1.5050","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","1.5050","7","2","2","2","2","2","1.4000","1.00505000","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","1.50000055","1.2505","2","2","2","2","2","1.50000050","1.2000","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.50000005","1.3000","2","2","2","2","2","2","2","2","2","2","1.2055","2","2","2","2","2","8","1.5050","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1.1000","1.00500500","2","2","2","2","2","2","1.3505","2","2","2","2","2","2","2","2","2","1.4000","1.00505000","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","1.2055","2","2","2","2","2","2","2","2","2","1.50000050","1.2000","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.4000","1.00505000","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5000","1.0050","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","1.1005","1.00050500","1.3000","2","2","2","2","2","2","2","2","2","2","8","2","1.4005","1.05005000","1.05000005","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.00050500","1.3000","0","0","0","0","0","0","0"],["0","0","0","1.1000","1.00500500","2","2","2","2","2","2","2","2","2","2","2","1.4005","1.2005","17","12","12","2","2","2","8","2","1.1000","1.00000555","1.0505","1.3005","0","0","0","0","0"],["0","0","0","0","1.5050","2","5","2","2","2","2","2","2","2","2","1.5505","1.05505000","17","17","12","12","2","2","2","2","2","2","1.5050","10","1.5050","0","0","0","0","0"],["0","0","1.50050050","1.0505","1.05505000","2","2","2","2","2","2","2","2","2","9.3","2","12","17","17","12","12","2","2","2","2","2","2","1.1005","1.0505","1.00505500","0","0","0","0","0"],["0","0","1.5050","2","2","2","2","2","2","2","2","2","2","9.3","2","2","12","17","17","12","12","2","1.5505","1.0555","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.4000","1.00505000","2","2","2","2","2","2","2","2","2","1.5555","2","2","2","12","17","17","12","12","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.50000050","1.2000","2","2","2","2","2","2","2","2","2","2","2","2","2","12","17","17","12","12","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","17","17","12","12","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","17","17","12","12","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["0","1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","12","17","17","12","12","2","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["1.4000","1.00505000","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5055","9.2","9.2","1.50050050","1.0505","1.00550500","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["1.50000050","1.2000","2","2","2","2","1.5055","2","2","2","2","2","2","2","2","2","1.5050","24","24","1.5050","0","1.5050","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["1.5050","2","2","2","2","2","1.5050","2","2","2","2","2","2","2","2","2","1.55000005","1.0505","1.0505","1.05005005","1.0505","1.2005","2","2","2","2","2","2","2","1.5050","0","0","0","0","0"],["1.5050","2","2","2","2","2","1.5050","13.1","2","2","2","2","2","2","2","2","2","2","11","11","11","2","2","2","2","2","2","1.4000","1.00050050","1.05505000","0","0","0","0","0"],["1.5050","2","2","2","2","2","1.1005","1.0505","1.0505","1.2505","2","2","2","2","2","2","2","2","11","11","11","2","2","2","2","14","2","1.50000050","1.2000","0","0","0","0","0","0"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","11","11","2","2","2","2","2","2","1.5050","0","0","0","0","0","0","0"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","11","11","2","2","2","2","2","2","1.5050","0","0","0","0","0","0","0"],["1.5050","2","5","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","11","11","2","2","2","2","2","2","1.5050","0","0","0","0","0","0","0"],["1.5050","2","2","5","2","2","2","2","2","2","2","2","2","2","2","2","2","2","11","11","11","2","15","2","2","2","1.50050050","1.05505000","0","0","0","0","0","0","0"],["1.50000005","1.3000","2","2","2","2","2","2","2","1.4000","1.00050050","1.0505","1.0505","1.00550500","2","2","2","2","11","11","11","2","2","2","2","1.50050050","1.05505000","0","0","0","0","0","0","0","0"],["1.1000","1.05000005","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.05005000","1.2000","0","0","1.55000005","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.05505000","0","0","0","0","0","0","0","0","0"]];
                spawn = [500,620];
                killApp(app);
                training(tilesExtracted, spawn, map, select.value);
                break;
            case "Snipers (Easy)":
                map =[["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","5","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
                spawn = [620,700];
                killApp(app);
                training(tilesExtracted, spawn, map, select.value);
                break;
            case "Snipers (Medium)":
                map =[["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","5","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
                spawn = [620,700];
                killApp(app);
                training(tilesExtracted, spawn, map, select.value);
                break;
            case "Snipers (Hard)":
                map =[["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","5","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
                spawn = [700,740];
                killApp(app);
                map[15][17] = "1.5555";
                training(tilesExtracted, spawn, map, select.value);
                break;
            case "OFM (Easy)":
                map = [["1.50050050","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.00550500"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","16","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.5050","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","1.5050"],["1.55000005","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.0505","1.05505000"]];
                spawn = [60,700];
                killApp(app);
                training(tilesExtracted, spawn, map, select.value);
        }
    });
    select.value = val;
    return select;
}

function leaderboardScreen(app){
    document.body.innerHTML = '';
    const spikeMazeDiv = document.createElement('div');
    spikeMazeDiv.style.display = 'flex';
    spikeMazeDiv.style.gap = '20px';
    const leaderboardData = JSON.parse(GM_getValue("leaderboard", '{"spikeMazeEasy": [], "spikeMazeMed": [], "spikeMazeHard": [], "snipersEasy": [], "snipersMed": [], "snipersHard": []}'));
    console.log(leaderboardData);
    spikeMazeDiv.appendChild(createLeaderboard('Spike Maze (Easy)', leaderboardData.spikeMazeEasy));
    spikeMazeDiv.appendChild(createLeaderboard('Spike Maze (Medium)', leaderboardData.spikeMazeMed));
    spikeMazeDiv.appendChild(createLeaderboard('Spike Maze (Hard)', leaderboardData.spikeMazeHard));
    document.body.appendChild(spikeMazeDiv);
    const snipersDiv = document.createElement('div');
    snipersDiv.style.display = 'flex';
    snipersDiv.style.gap = '20px';
    snipersDiv.appendChild(createLeaderboard('Snipers (Easy)', leaderboardData.snipersEasy));
    snipersDiv.appendChild(createLeaderboard('Snipers (Medium)', leaderboardData.snipersMed));
    snipersDiv.appendChild(createLeaderboard('Snipers (Hard)', leaderboardData.snipersHard));
    document.body.appendChild(snipersDiv);
    const select = addSelection(document.body, "Leaderboard", app);
}

function createLeaderboard(titleName, leaderboardData){
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.style.width = '300px';
    leaderboardContainer.style.margin = '5px auto';
    leaderboardContainer.style.padding = '20px';
    leaderboardContainer.style.backgroundColor = '#fff';
    leaderboardContainer.style.borderRadius = '10px';
    leaderboardContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';


    // Create a title
    const title = document.createElement('h2');
    title.textContent = `${titleName}`;
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.fontSize = '24px';
    title.style.color = '#333333';
    leaderboardContainer.appendChild(title);

    // Create a list to hold leaderboard items
    const leaderboardList = document.createElement('ul');
    leaderboardList.style.listStyle = 'none';
    leaderboardList.style.padding = '0';
    leaderboardContainer.appendChild(leaderboardList);


    let cnt = 1;

    leaderboardData.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${cnt}: ${player}`;
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        listItem.style.padding = '10px';
        listItem.style.backgroundColor = '#f9f9f9';
        listItem.style.marginBottom = '10px';
        listItem.style.borderRadius = '5px';
        listItem.style.fontSize = '18px';
        listItem.style.color = '#333333';

        // Alternate background color for odd/even rows
        listItem.style.backgroundColor = cnt % 2 === 0 ? '#e9e9e9' : '#f9f9f9';

        leaderboardList.appendChild(listItem);
        cnt++;
    });
    return leaderboardContainer;
}

function createWall(x, y, width, height, world) {
    const wallBodyDef = new Box2D.Dynamics.b2BodyDef();
    wallBodyDef.position.Set((x + width/2) / 40, (y+height/2) / 40); //have to get center point
    wallBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(wallBodyDef);

    const wallShape = new Box2D.Collision.Shapes.b2PolygonShape();
    wallShape.SetAsBox(width / 2 / 40, height / 2 / 40); //40px per meter, starts at center

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = wallShape;
    fixtureDef.friction = WALL_FRICTION;

    fixtureDef.filter.categoryBits = entityCategory.EVERYONE;
    fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;

    wallBody.CreateFixture(fixtureDef);

    wallBody.SetUserData({type: "1"});
}

function createEndzone(x, y, width, height, world, type) {
    const wallBodyDef = new Box2D.Dynamics.b2BodyDef();
    wallBodyDef.position.Set((x + width/2) / 40, (y+height/2) / 40); //have to get center point
    wallBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(wallBodyDef);

    const wallShape = new Box2D.Collision.Shapes.b2PolygonShape();
    wallShape.SetAsBox(width / 2 / 40, height / 2 / 40); //40px per meter, starts at center

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = wallShape;

    fixtureDef.filter.categoryBits = entityCategory.NO_ONE;
    fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM;

    wallBody.CreateFixture(fixtureDef);

    wallBody.SetUserData({type: type});
    return wallBody;
}

function createGate(x, y, width, height, world, type) {
    const wallBodyDef = new Box2D.Dynamics.b2BodyDef();
    wallBodyDef.position.Set((x + width/2) / 40, (y+height/2) / 40); //have to get center point
    wallBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(wallBodyDef);

    const wallShape = new Box2D.Collision.Shapes.b2PolygonShape();
    wallShape.SetAsBox(width / 2 / 40, height / 2 / 40); //40px per meter, starts at center

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = wallShape;
    fixtureDef.friction = WALL_FRICTION;

    if(type === '9.1') {
        fixtureDef.filter.categoryBits = entityCategory.EVERYONE;
        fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;
    }
    else if(type === '9.2') {
        fixtureDef.filter.categoryBits = entityCategory.BLUE_TEAM;
        fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;
    }
    else if(type === '9.3') {
        fixtureDef.filter.categoryBits = entityCategory.RED_TEAM;
        fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;
    }

    wallBody.CreateFixture(fixtureDef);

    wallBody.SetUserData({type: type});
}

function createNonSquareWall(x,y,vertices, world) {
    const wallBodyDef = new Box2D.Dynamics.b2BodyDef();
    wallBodyDef.position.Set((x) / 40, (y) / 40); //have to get center point
    wallBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(wallBodyDef);

    const wallShape = new Box2D.Collision.Shapes.b2PolygonShape();
    wallShape.SetAsArray(vertices, vertices.length);

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = wallShape;
    fixtureDef.friction = WALL_FRICTION;

    fixtureDef.filter.categoryBits = entityCategory.EVERYONE;
    fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;


    wallBody.CreateFixture(fixtureDef);

    wallBody.SetUserData({type: "1"}); //for our purposes all types of walls are 1
}

function createSpike(x, y, radius, world) {
    const bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.Set((x+20) / 40, (y+20) / 40);

    const dynamicBody = world.CreateBody(bodyDef);

    const circleShape = new Box2D.Collision.Shapes.b2CircleShape();
    circleShape.SetRadius(radius / 40);

    const sensorDef = new Box2D.Dynamics.b2FixtureDef();
    sensorDef.shape = circleShape;

    dynamicBody.CreateFixture(sensorDef);

    dynamicBody.SetUserData({type: "7"});
}

function createBoost(x, y, radius, world, type) {
    const bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.Set((x+20) / 40, (y+20) / 40);
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(bodyDef);

    const circleShape = new Box2D.Collision.Shapes.b2CircleShape();
    circleShape.SetRadius(radius / 40);

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = circleShape;

    if(type === '5') {
        fixtureDef.filter.categoryBits = entityCategory.NO_ONE;
        fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;
    }
    else if(type === '14') {
        fixtureDef.filter.categoryBits = entityCategory.NO_ONE;
        fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM;
    }
    else if(type === '15') {
        fixtureDef.filter.categoryBits = entityCategory.NO_ONE;
        fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.BLUE_TEAM;
    }

    wallBody.CreateFixture(fixtureDef);

    wallBody.SetUserData({type: type});
}

function createFlag(x, y, radius, world, type) {
    const bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.Set((x+20) / 40, (y+20) / 40);
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    const wallBody = world.CreateBody(bodyDef);

    const circleShape = new Box2D.Collision.Shapes.b2CircleShape();
    circleShape.SetRadius(radius / 40);

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = circleShape;

    //yellow flag
    fixtureDef.filter.categoryBits = entityCategory.NO_ONE;
    fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM | entityCategory.BLUE_TEAM;


    wallBody.CreateFixture(fixtureDef);

    wallBody.SetUserData({type: type, x: x, y: y});

    return wallBody;
}

function createBall(x, y, radius, world, type) {
    const bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.Set(x / 40, y / 40);

    const dynamicBody = world.CreateBody(bodyDef);
    //dynamicBody.SetAngularDamping(0.5);

    const circleShape = new Box2D.Collision.Shapes.b2CircleShape();
    circleShape.SetRadius(radius / 40);

    const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = circleShape;
    fixtureDef.density = 1.5;
    fixtureDef.friction = 0.1;
    fixtureDef.restitution = 0.25;


    fixtureDef.filter.categoryBits = entityCategory.EVERYONE;
    fixtureDef.filter.maskBits = entityCategory.EVERYONE | entityCategory.RED_TEAM;

    const sensorDef = new Box2D.Dynamics.b2FixtureDef();
    sensorDef.shape = circleShape;
    sensorDef.isSensor = true;


    dynamicBody.CreateFixture(fixtureDef);
    dynamicBody.CreateFixture(sensorDef);
    dynamicBody.SetAngularDamping(0.5); //stop from spinning forever

    dynamicBody.SetUserData({type: type});

    return dynamicBody;
}

function addPopForceToBall(ball, deadBall, dt=1/60){
    const body1 = ball.GetBody();
    const body2 = deadBall.GetBody();

    const bodyPosition = body1.GetWorldCenter();
    const explosionCenter = body2.GetWorldCenter();

    const distance = Math.sqrt(
        Math.pow(bodyPosition.x - explosionCenter.x, 2) +
        Math.pow(bodyPosition.y - explosionCenter.y, 2)
    );

    if (distance > 0) {
        // speedboost = strength * (blastRadius - distance)
        const explosionForce = 12 * (7 - distance);

        const forceDirection = new Box2D.Common.Math.b2Vec2(
            (bodyPosition.x - explosionCenter.x) / distance,
            (bodyPosition.y - explosionCenter.y) / distance
        );

        const impulse = new Box2D.Common.Math.b2Vec2(
            explosionForce * forceDirection.x,
            explosionForce * forceDirection.y
        );

        body1.ApplyForce(impulse, bodyPosition);
    }
}

function applyExtraForceToBall(ball, dt=1/60) {
    //maybe turn velocity into unit vectors first? Always apply set amount of boost
    //were just gonna assume boosts for now

    const body = ball.body; 

    // Get the body's current velocity
    const velocity = ball.GetLinearVelocity();

    let forceX = 0;
    let forceY = 0;
    const totalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const magnitudeX = velocity.x / totalSpeed;
    const magnitudeY = velocity.y / totalSpeed;

    if (velocity.x > 0) {
        forceX += PIXELS_PER_METER * TPU * magnitudeX * BOOST_SPEED;
    }
    else if (velocity.x < 0) {
        forceX += PIXELS_PER_METER * TPU * magnitudeX * BOOST_SPEED;
    }
    if (velocity.y > 0) {
        forceY += PIXELS_PER_METER * TPU * magnitudeY * BOOST_SPEED;
    }
    else if (velocity.y < 0) {
        forceY += PIXELS_PER_METER * TPU * magnitudeY * BOOST_SPEED;
    }


    // Apply accel forces
    ball.ApplyForce(
        new Box2D.Common.Math.b2Vec2(forceX, forceY), // Force vector
        ball.GetWorldCenter()                         // Point of application (usually the center)
    );
    //console.log(ball.GetLinearVelocity());

}

function applyForceToBall(keys, ball, dt=1/60) {
    const body = ball.body; // Assuming 'ball.body' is the Box2D body


    // Key control for movement with acceleration based on velocity
    const velocity = ball.GetLinearVelocity();

    // Forces to be applied
    let forceX = 0;
    let forceY = 0;

    // Apply movement forces
    if (keys.up) {
        forceY -= (TPU/PIXELS_PER_METER) * ACCELERATION;
    }
    if (keys.down) {
        forceY += (TPU/PIXELS_PER_METER) * ACCELERATION;
    }
    if (keys.left) {
        forceX -= (TPU/PIXELS_PER_METER) * ACCELERATION;
    }
    if (keys.right) {
        forceX += (TPU/PIXELS_PER_METER) * ACCELERATION;
    }



    // Apply drag (deceleration) to simulate friction
    let dragForceX = 0;
    let dragForceY = 0;


    if (velocity.x < 0) {
        dragForceX = -1 * velocity.x * DRAGCELERATION;
        if (velocity.x + dragForceX > 0) {
            dragForceX = -velocity.x;  // Don't overcompensate
        }
        else if (velocity.x < -6.25 && velocity.x > -6.3){
            dragForceX = -1 * velocity.x * MAINTENANCEDRAG;
        }
        else if (velocity.x < -6.3) {
            dragForceX = -1 * velocity.x * SUPERDRAG;
        }
    }
    else if (velocity.x > 0) {
        dragForceX =  -1  * velocity.x * DRAGCELERATION;
        if (velocity.x + dragForceX < 0) {
            dragForceX = -velocity.x;
        }
        else if (velocity.x > 6.25 && velocity.x < 6.3){
            dragForceX = -1 * velocity.x * MAINTENANCEDRAG;
        }
        else if (velocity.x > 6.3) {
            dragForceX = -1 * velocity.x * SUPERDRAG;
        }
    }
    if (velocity.y < 0) {
        dragForceY =  -1 * velocity.y * DRAGCELERATION;
        if (velocity.y + dragForceY > 0) {
            dragForceY = -velocity.y;
        }
        else if (velocity.y < -6.25 && velocity.y > -6.3){
            dragForceY = -1 * velocity.y * MAINTENANCEDRAG;
        }
        else if (velocity.y < -6.3) {
            dragForceY = -1 * velocity.y * SUPERDRAG;
        }
    }
    else if (velocity.y > 0) {
        dragForceY =  -1 * velocity.y * DRAGCELERATION;
        if (velocity.y + dragForceY < 0) {
            dragForceY = -velocity.y;
        }
        else if (velocity.y > 6.25 && velocity.y < 6.3){
            dragForceY = -1 * velocity.y * MAINTENANCEDRAG;
        }
        else if (velocity.x > 6.3) {
            dragForceY = -1 * velocity.y * SUPERDRAG;
        }
    }

    // Apply accel forces
    ball.ApplyForce(
        new Box2D.Common.Math.b2Vec2(forceX, forceY), // Force vector
        ball.GetWorldCenter()                         // Point of application (usually the center)
    );
    // Apply drag forces
    ball.ApplyForce(
        new Box2D.Common.Math.b2Vec2(dragForceX, dragForceY),
        ball.GetWorldCenter()
    );

    //console.log(ball.GetLinearVelocity());

}

function addSpriteToLocation(app, tiles, tileNum, x, y, map=[], i=0, j=0) {
    const sprite1 = getSpriteFromTileNum(tiles, tileNum, map, i ,j);
    sprite1.position.x = x;
    sprite1.position.y = y;
    if(tileNum === '16'){
        const sprite2 = getSpriteFromTileNum(tiles, '16.1', map, i ,j);
        sprite2.position.x = x;
        sprite2.position.y = y;
        app.stage.addChild(sprite2);
    }
    app.stage.addChild(sprite1);
    return sprite1;
}

function getSpriteFromTileNum(tiles, tileNum, map, i, j) {
    let sprite1;
    let sprite2;
    let container = new PIXI.Container();
    switch(tileNum) {
        case '1.4': //botright
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles['1.1']));

        case '3.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['3']));
        case '4.1':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['4']));
        case '5':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
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
        case '7':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '8':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '10':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '10.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['10.1']));
        case '13':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '13.1':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '13.11':
            return new PIXI.Sprite(PIXI.Texture.from(tiles['13']));
        case '14':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '15':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
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
        case '16':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;
        case '16.1':
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            sprite2 = new PIXI.Sprite(PIXI.Texture.from(tiles['2']));
            container.addChild(sprite2);
            container.addChild(sprite1);
            return container;

        default:
            sprite1 = new PIXI.Sprite(PIXI.Texture.from(tiles[tileNum]));
            if(/(^1[.]1.*$)/.test(tileNum)){
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
            }
            else if(/(^1[.]2.*$)/.test(tileNum)){
                //sprite1.position.x -= 2;
                //sprite1.position.y -=1;
                if(i >= map.length-1 || j >= map.length-1 || map[i][j+1] == '0' || map[i+1][j] == '0'){
                    //sprite1.position.x += 39; //this is weird...
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
                //weirdness happening with this tile
                //sprite1.scale.x = 1.05;
                //sprite1.x -= 2;
                container.addChild(sprite2);
                container.addChild(sprite1);

                return container;
            }
            else if(/(^1[.]3.*$)/.test(tileNum)){
                if(i <= 0 || j >= map.length-1 || map[i][j+1] == '0' || map[i-1][j] == '0'){
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
                return container;
            }
            else if(/(^1[.]4.*$)/.test(tileNum)){
                if(i <= 0 || j <= 0 || map[i][j-1] == '0' || map[i-1][j] == '0'){
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
                return container;
            }
            else if(/^1[.](0|5).*$/.test(tileNum)){
                //1
            }
            return sprite1;
    }
}

function texture(){
    return new Promise((resolve, reject) => {
        const imgPath = 'https://raw.githubusercontent.com/iodtp/temp/refs/heads/main/mtBad.png';
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
                // diagWalls
                "1.1555": squares[0],
                "1.2555": squares[1],
                "1.3555": squares[2],
                "1.4555": squares[3],
                "1.1055": squares[4],
                "1.2055": squares[5],
                "1.3055": squares[6],
                "1.4055": squares[7],
                "1.1505": squares[8],
                "1.2505": squares[9],
                "1.3505": squares[10],
                "1.4505": squares[11],
                "1.1005": squares[12],
                "1.2005": squares[13],
                "1.3005": squares[14],
                "1.4005": squares[15],
                "1.1000": squares[16],
                "1.2000": squares[17],
                "1.3000": squares[18],
                "1.4000": squares[19],

                // fullWalls
                '1.5555': squares[20],
                '1.5550': squares[21],
                '1.5505': squares[22],
                '1.5055': squares[23],
                '1.0555': squares[24],
                "1.5500": squares[25],
                "1.5050": squares[26],
                "1.5005": squares[27],
                "1.0550": squares[28],
                "1.0055": squares[29],
                "1.0505": squares[30],
                "1.55000005": squares[31],
                "1.50050050": squares[32],
                "1.05505000": squares[33],
                "1.00550500": squares[34],
                "1.5000": squares[35],
                "1.0500": squares[36],
                "1.0050": squares[37],
                "1.0005": squares[38],
                "1.50000055": squares[39],
                "1.50000050": squares[40],
                "1.50000005": squares[41],
                "1.05005005": squares[42],
                "1.05005000": squares[43],
                "1.05000005": squares[44],
                "1.00505500": squares[45],
                "1.00505000": squares[46],
                "1.00500500": squares[47],
                "1.00050550": squares[48],
                "1.00050500": squares[49],
                "1.00050050": squares[50],
                "1.0000": squares[51],
                "1.00005555": squares[52],
                "1.00005550": squares[53],
                "1.00005505": squares[54],
                "1.00005055": squares[55],
                "1.00000555": squares[56],
                "1.00005500": squares[57],
                "1.00005005": squares[58],
                "1.00000550": squares[59],
                "1.00000055": squares[60],
                "1.00005050": squares[61],
                "1.00000505": squares[62],
                "1.00005000": squares[63],
                "1.00000500": squares[64],
                "1.00000050": squares[65],
                "1.00000005": squares[66],

                // nonWalls
                "0": squares[67],
                "2": squares[68],
                "3": squares[69],
                "3.1": squares[100],
                "4": squares[70],
                "4.1": squares[72],
                "5": squares[71], //placeholder
                "6": squares[73],
                "6.1": squares[74],
                "6.11": squares[75],
                "6.12": squares[76],
                "6.2": squares[77],
                "6.21": squares[78],
                "6.22": squares[79],
                "6.3": squares[80],
                "6.31": squares[81],
                "6.32": squares[82],
                "7": squares[73],
                "8": squares[74],
                "9": squares[85],
                "9.1": squares[111],
                "9.2": squares[112],
                "9.3": squares[113],
                "10": squares[115],
                "10.1": squares[90],
                "10.11": squares[91],
                "11": squares[77],
                "12": squares[78],
                "13": squares[99],
                "13.1": squares[94],
                "14": squares[80],
                "15": squares[81],
                "16": squares[82],
                "16.1": squares[116],
                "17": squares[83],
                "18": squares[84],
                "23": squares[85],
                "24": squares[86],
                "25": squares[79],
                "redball": squares[117],
                "blueball": squares[118]
            };



            resolve(tiles); // Resolve the promise with the squares array
        };

        img.onerror = reject; // Handle errors
    });
}

function spikeLoop(delta, player, world, keys, app, spawn) {
    applyForceToBall(keys, player.playerCollision);
    world.Step(1 / 60, 8, 3); // Update Box2D world

    // Update PixiJS sprite positions
    const position = player.playerCollision.GetPosition();
    const angle = player.playerCollision.GetAngle();

    if(player.dead){
        if(player.playerSprite.visible){ //we only want to start the countdown once
            player.playerSprite.visible = false;
            player.hold = 0.0;
            setTimeout(() => {
                player.playerSprite.visible = true;
                player.dead = false;
                player.playerSprite.x = spawn[0];
                player.playerSprite.y = spawn[1];
                player.playerSprite.rotation = 0;
                player.playerCollision.SetPosition(new Box2D.Common.Math.b2Vec2(spawn[0]/40,spawn[1]/40));
                player.playerCollision.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
            }, 3000);
        }
    }
    else{
        player.playerSprite.x = position.x * 40; // Convert from Box2D units to pixels
        player.playerSprite.y = position.y * 40;
        player.playerSprite.rotation = angle;
        if(player.hasFlag){
            player.playerFlag.position.x = position.x * 40 - 5;
            player.playerFlag.position.y = position.y * 40 - 45;
            app.stage.addChild(player.playerFlag);
            player.hold += 1/60;
        }

    }

    //Center view on ball
    app.stage.position.x = WIDTH/2;
    app.stage.position.y = HEIGHT/2;
    //now specify which point INSIDE stage must be (0,0)
    app.stage.pivot.x = player.playerSprite.position.x;
    app.stage.pivot.y = player.playerSprite.position.y;



    world.ClearForces();
}

function snipersLoop(delta, player, enemy, world, keys, app, spawn, value) {
    const keys2 = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    if(value !== "Snipers (Easy)"){
        const seed = Math.random();
        if(seed < 1/3){
            keys2.up = true;
        }
        else if (seed < 2/3) {
            keys2.down = true;
        }
        const seed2 = Math.random();
        if(seed < 1/3){
            keys2.right = true;
        }
        else if (seed < 2/3) {
            keys2.left = true;
        }
    }
    applyForceToBall(keys, player.playerCollision);
    applyForceToBall(keys2, enemy.playerCollision);
    world.Step(1 / 60, 8, 3); // Update Box2D world

    // Update PixiJS sprite positions
    const position = player.playerCollision.GetPosition();
    const angle = player.playerCollision.GetAngle();
    const enemyPos = enemy.playerCollision.GetPosition();
    const enemyAngle = enemy.playerCollision.GetAngle();

    if(player.lost){
        player.playerSprite.visible = false;
        //player.lost = false;
        gameOver(app, player.tags, player, value);
    }
    else if(player.dead){
        if(player.playerSprite.visible){ //we only want to start the countdown once
            player.playerSprite.visible = false;
            setTimeout(() => {
                player.playerSprite.visible = true;
                player.dead = false;
                player.playerSprite.x = spawn[0];
                player.playerSprite.y = spawn[1];
                player.playerSprite.rotation = 0;
                player.playerCollision.SetPosition(new Box2D.Common.Math.b2Vec2(spawn[0]/40,spawn[1]/40));
                player.playerCollision.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
            }, 1000);
        }
    }
    else{
        player.playerSprite.x = position.x * 40; // Convert from Box2D units to pixels
        player.playerSprite.y = position.y * 40;
        player.playerSprite.rotation = angle;
        if(player.hasFlag){
            player.playerFlag.position.x = position.x * 40 - 5;
            player.playerFlag.position.y = position.y * 40 - 45;
            app.stage.addChild(player.playerFlag);
            player.hold += 1/60;
        }
        if(enemy.dead){
            if(enemy.playerSprite.visible){ //we only want to start the countdown once
                enemy.playerSprite.visible = false;
                player.dead = true;
                setTimeout(() => {
                    const enemySpawnY = 420 + (Math.random()*2 -1) * 100;
                    const enemySpawnX = 500 + (Math.random()*2 -1) * 300;
                    enemy.playerSprite.visible = true;
                    enemy.dead = false;
                    enemy.playerSprite.x = enemySpawnX;
                    enemy.playerSprite.y = enemySpawnY;
                    enemy.playerFlag.visible = true;
                    enemy.hasFlag = true;
                    enemy.playerSprite.rotation = 0;
                    enemy.playerCollision.SetPosition(new Box2D.Common.Math.b2Vec2(enemySpawnX/40,enemySpawnY/40));
                    enemy.playerCollision.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
                    player.tags++;
                }, 1000);
            }
        }
        else{
            enemy.playerSprite.x = enemyPos.x * 40; // Convert from Box2D units to pixels
            enemy.playerSprite.y = enemyPos.y * 40;
            enemy.playerSprite.rotation = enemyAngle;
            if(enemy.hasFlag){
                enemy.playerFlagYellow.position.x = enemyPos.x * 40 - 5;
                enemy.playerFlagYellow.position.y = enemyPos.y * 40 - 45;
                app.stage.addChild(enemy.playerFlagYellow);
            }
        }

    }

    //Center view on ball
    app.stage.position.x = WIDTH/2;
    app.stage.position.y = HEIGHT/2;
    //now specify which point INSIDE stage must be (0,0)
    app.stage.pivot.x = player.playerSprite.position.x;
    app.stage.pivot.y = player.playerSprite.position.y;



    world.ClearForces();
}

function ofmLoop(delta, player, enemy, world, keys, app, pspawn, espawn, model) {

    const keys2 = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    //x,y,lx,ly,flag
    const inputFeatures = tf.tensor2d([[enemy.playerCollision.m_xf.position.x*40,enemy.playerCollision.m_xf.position.y*40, enemy.playerCollision.m_linearVelocity.x, enemy.playerCollision.m_linearVelocity.y, Number(enemy.hasFlag),
                                        player.playerCollision.m_xf.position.x*40,player.playerCollision.m_xf.position.y*40, player.playerCollision.m_linearVelocity.x, player.playerCollision.m_linearVelocity.y, Number(player.hasFlag)],
                                       [1, 10]]);

    const predictions = model.predict(inputFeatures)
    predictions.array().then(data => {
        const keys2 = {
            up: data[1][0] >= 0.5,
            down: data[1][1] >= 0.5,
            left: data[1][2] >= 0.5,
            right: data[1][3] >= 0.5
        };
    });
    console.log("Predictions:", predictions);
    /**/

    applyForceToBall(keys, player.playerCollision);
    applyForceToBall(keys2, enemy.playerCollision);
    world.Step(1 / 60, 8, 3); // Update Box2D world

    // Update PixiJS sprite positions
    const position = player.playerCollision.GetPosition();
    const angle = player.playerCollision.GetAngle();
    const enemyPos = enemy.playerCollision.GetPosition();
    const enemyAngle = enemy.playerCollision.GetAngle();

    if(player.dead){
        if(player.playerSprite.visible){ //we only want to start the countdown once
            player.playerSprite.visible = false;
            setTimeout(() => {
                player.playerSprite.visible = true;
                player.dead = false;
                player.playerSprite.x = pspawn[0];
                player.playerSprite.y = pspawn[1];
                player.playerSprite.rotation = 0;
                player.playerCollision.SetPosition(new Box2D.Common.Math.b2Vec2(pspawn[0]/40,pspawn[1]/40));
                player.playerCollision.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
            }, 3000);
        }
    }
    else{
        player.playerSprite.x = position.x * 40; // Convert from Box2D units to pixels
        player.playerSprite.y = position.y * 40;
        player.playerSprite.rotation = angle;
        if(player.hasFlag){
            player.playerFlag.position.x = position.x * 40 - 5;
            player.playerFlag.position.y = position.y * 40 - 45;
            app.stage.addChild(player.playerFlag);
            player.hold += 1/60;
        }

    }
    if(enemy.dead){
        if(enemy.playerSprite.visible){ //we only want to start the countdown once
            enemy.playerSprite.visible = false;
            setTimeout(() => {
                const enemySpawnY = espawn[1];
                const enemySpawnX = espawn[0];
                enemy.playerSprite.visible = true;
                enemy.dead = false;
                enemy.playerSprite.x = enemySpawnX;
                enemy.playerSprite.y = enemySpawnY;
                enemy.playerFlag.visible = false;
                enemy.hasFlag = false;
                enemy.playerSprite.rotation = 0;
                enemy.playerCollision.SetPosition(new Box2D.Common.Math.b2Vec2(enemySpawnX/40,enemySpawnY/40));
                enemy.playerCollision.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
                player.tags++;
            }, 3000);
        }
    }
    else{ //need to move this somehow
        enemy.playerSprite.x = enemyPos.x * 40; // Convert from Box2D units to pixels
        enemy.playerSprite.y = enemyPos.y * 40;
        enemy.playerSprite.rotation = enemyAngle;
        if(enemy.hasFlag){
            enemy.playerFlagYellow.position.x = enemyPos.x * 40 - 5;
            enemy.playerFlagYellow.position.y = enemyPos.y * 40 - 45;
            app.stage.addChild(enemy.playerFlagYellow);
        }
    }

    //Center view on ball
    app.stage.position.x = WIDTH/2;
    app.stage.position.y = HEIGHT/2;
    //now specify which point INSIDE stage must be (0,0)
    app.stage.pivot.x = player.playerSprite.position.x;
    app.stage.pivot.y = player.playerSprite.position.y;



    world.ClearForces();
}
