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
        app.ticker.add(delta => ofmLoop(delta, player, enemy, world, keys, app, spawn, [940,60]));
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

function ofmLoop(delta, player, enemy, world, keys, app, pspawn, espawn) {
    const pretrainedWeights = [
        [
            [
                -0.2502182722091675,
                0.07022765278816223,
                -0.08653920888900757,
                -0.014330089092254639,
                0.10168573260307312,
                0.013440936803817749,
                0.026605576276779175,
                -0.017188072204589844,
                -0.14544139802455902,
                -0.1700899600982666,
                -0.11888903379440308,
                -0.21462953090667725,
                -0.029655158519744873,
                0.20671087503433228,
                -0.1480301469564438,
                -0.21350562572479248,
                -0.05916382372379303,
                -0.20780415832996368,
                -0.2582439184188843,
                0.011217236518859863,
                0.16458964347839355,
                0.16635000705718994,
                0.2723086178302765,
                0.15005576610565186,
                -0.104322150349617,
                -0.2563718557357788,
                0.2662831246852875,
                -0.2625892162322998,
                -0.1531403660774231,
                -0.21753478050231934,
                -0.18201608955860138,
                -0.05760598182678223,
                0.12181457877159119,
                -0.26443952322006226,
                0.07086837291717529,
                -0.12927742302417755,
                -0.1765371710062027,
                -0.10359852015972137,
                0.008944988250732422,
                -0.04669030010700226,
                0.044014185667037964,
                -0.018893331289291382,
                0.15646883845329285,
                0.05653136968612671,
                0.09532317519187927,
                0.2663070261478424,
                -0.2710238993167877,
                -0.2041129618883133,
                -0.05366984009742737,
                -0.19635175168514252,
                0.1984442174434662,
                0.14927971363067627,
                -0.1857263743877411,
                -0.05496828258037567,
                0.037813931703567505,
                -0.1366008222103119,
                0.13760647177696228,
                -0.056778132915496826,
                0.15937021374702454,
                -0.10923019051551819,
                0.244951993227005,
                -0.09599766135215759,
                -0.24925336241722107,
                0.2343445122241974
            ],
            [
                0.2242649495601654,
                -0.1513446867465973,
                -0.22895880043506622,
                -0.14216412603855133,
                -0.0103682279586792,
                -0.2815329134464264,
                0.21415701508522034,
                -0.16275739669799805,
                -0.19404162466526031,
                -0.14380934834480286,
                0.19947165250778198,
                -0.08867642283439636,
                0.07152256369590759,
                -0.15378937125205994,
                -0.14062289893627167,
                -0.19350415468215942,
                0.05167749524116516,
                0.27101531624794006,
                0.018977701663970947,
                0.25145676732063293,
                -0.1922433078289032,
                0.08001261949539185,
                0.18852820992469788,
                0.07481789588928223,
                0.19253095984458923,
                -0.1486375480890274,
                -0.22525423765182495,
                0.11874231696128845,
                -0.13714691996574402,
                0.12721982598304749,
                0.04471534490585327,
                -0.13274213671684265,
                0.08826127648353577,
                0.25527384877204895,
                -0.16630426049232483,
                -0.12424969673156738,
                -0.12807564437389374,
                -0.14592143893241882,
                -0.20266854763031006,
                -0.11693695187568665,
                -0.18846555054187775,
                -0.0561305433511734,
                -0.19065064191818237,
                0.22315189242362976,
                0.13178443908691406,
                0.0861591100692749,
                -0.03156644105911255,
                -0.2009716033935547,
                -0.015940815210342407,
                0.19219788908958435,
                0.1934121549129486,
                0.2242881953716278,
                -0.11829425394535065,
                0.14706149697303772,
                -0.1685456782579422,
                -0.022526055574417114,
                0.2519628703594208,
                -0.16902205348014832,
                -0.2370830923318863,
                0.25936344265937805,
                0.1567791998386383,
                0.0038745105266571045,
                0.2132830023765564,
                0.2843785583972931
            ],
            [
                0.014031529426574707,
                0.10340067744255066,
                0.23611143231391907,
                0.19298458099365234,
                -0.032295167446136475,
                0.18368807435035706,
                0.2815970480442047,
                0.07166105508804321,
                -0.14080946147441864,
                -0.17681884765625,
                0.15893495082855225,
                0.2628110349178314,
                0.11230263113975525,
                0.27300509810447693,
                0.10424259305000305,
                -0.03383272886276245,
                -0.1086239367723465,
                -0.25634947419166565,
                -0.009237408638000488,
                -0.022557497024536133,
                0.2628609240055084,
                0.28052225708961487,
                0.17574402689933777,
                0.09976869821548462,
                -0.007442682981491089,
                0.23233386874198914,
                0.027776271104812622,
                0.12947994470596313,
                0.19491800665855408,
                0.1599099040031433,
                0.12102964520454407,
                0.24034938216209412,
                0.19487625360488892,
                -0.1379879266023636,
                -0.1749861091375351,
                0.19784966111183167,
                0.1149027943611145,
                -0.02907729148864746,
                -0.17155282199382782,
                0.18717485666275024,
                -0.00826108455657959,
                -0.15147876739501953,
                0.1775856614112854,
                0.058955878019332886,
                0.2714512050151825,
                0.19802963733673096,
                0.12102067470550537,
                0.2835586369037628,
                0.1241132915019989,
                0.12447366118431091,
                -0.11843879520893097,
                0.24001982808113098,
                0.05979648232460022,
                0.045862674713134766,
                -0.07847419381141663,
                0.190230131149292,
                0.11444011330604553,
                -0.09906400740146637,
                -0.24677670001983643,
                0.25410476326942444,
                0.14591947197914124,
                0.011029332876205444,
                0.1856328248977661,
                0.23864731192588806
            ],
            [
                -0.06707541644573212,
                -0.23159947991371155,
                -0.2193339765071869,
                -0.28235360980033875,
                -0.023692399263381958,
                -0.14602382481098175,
                -0.20160311460494995,
                0.20027145743370056,
                -0.22930292785167694,
                -0.23740169405937195,
                0.08270525932312012,
                0.19471222162246704,
                -0.1851814091205597,
                0.11211520433425903,
                0.07602137327194214,
                0.11351370811462402,
                0.11740431189537048,
                -0.02462857961654663,
                -0.21787136793136597,
                -0.07971520721912384,
                0.2735043466091156,
                0.27014127373695374,
                -0.06720378994941711,
                0.11722955107688904,
                -0.03875453770160675,
                -0.188237726688385,
                -0.1175622045993805,
                -0.11308960616588593,
                -0.1905343383550644,
                -0.14101503789424896,
                -0.13039615750312805,
                -0.05147777497768402,
                -0.17333009839057922,
                -0.19198845326900482,
                -0.19148701429367065,
                0.009805768728256226,
                -0.00307658314704895,
                0.0040025413036346436,
                0.21377214789390564,
                -0.240401029586792,
                -0.1892954260110855,
                -0.2557031512260437,
                -0.05146107077598572,
                -0.08819849789142609,
                -0.24995139241218567,
                -0.07936292886734009,
                0.11245763301849365,
                -0.1812845766544342,
                -0.12740497291088104,
                0.17688754200935364,
                -0.0617014616727829,
                -0.04500475525856018,
                0.2251773178577423,
                -0.04776681959629059,
                -0.20130324363708496,
                -0.0626513659954071,
                0.2505126893520355,
                -0.2336522489786148,
                0.2210715115070343,
                -0.15114855766296387,
                -0.20409125089645386,
                0.26080527901649475,
                -0.05600278079509735,
                -0.11659349501132965
            ],
            [
                82.74372863769531,
                83.07794189453125,
                82.8427963256836,
                82.8880844116211,
                82.36358642578125,
                82.99851989746094,
                82.44573974609375,
                83.10299682617188,
                82.8695068359375,
                82.41287994384766,
                -0.04619193077087402,
                82.96214294433594,
                -0.23118509352207184,
                -0.2670157849788666,
                82.48873138427734,
                82.85294342041016,
                -0.17361053824424744,
                82.89030456542969,
                82.37893676757812,
                82.78033447265625,
                82.99092864990234,
                82.98091125488281,
                82.82682800292969,
                83.09673309326172,
                82.35787200927734,
                82.47405242919922,
                82.85232543945312,
                83.02193450927734,
                82.5455322265625,
                82.90769958496094,
                -0.1063956767320633,
                -0.2517120838165283,
                82.94921875,
                82.83539581298828,
                83.0727310180664,
                82.78255462646484,
                -0.23058536648750305,
                82.38607025146484,
                82.44277954101562,
                82.31917572021484,
                -0.23516963422298431,
                82.8200454711914,
                0.00027693985612131655,
                82.62872314453125,
                82.94816589355469,
                -0.08980318903923035,
                82.85216522216797,
                83.0123062133789,
                83.00395965576172,
                82.27191925048828,
                -0.020709216594696045,
                83.00983428955078,
                83.10908508300781,
                82.33175659179688,
                -0.0036857021041214466,
                82.38062286376953,
                -0.10982903838157654,
                82.9726333618164,
                82.56974792480469,
                82.95465850830078,
                -0.060241907835006714,
                82.86901092529297,
                -0.0043405755423009396,
                82.9551773071289
            ],
            [
                -0.19493477046489716,
                0.003569483757019043,
                0.021558910608291626,
                0.20917925238609314,
                -0.11202232539653778,
                -0.24268284440040588,
                0.025052547454833984,
                0.10111072659492493,
                -0.1032780110836029,
                0.02752751111984253,
                0.08360451459884644,
                -0.13664135336875916,
                0.19896507263183594,
                -0.08699122071266174,
                -0.15718260407447815,
                -0.032576560974121094,
                0.2807755172252655,
                -0.2409535050392151,
                -0.022840797901153564,
                -0.1554727554321289,
                0.031910449266433716,
                -0.18875917792320251,
                -0.21107573807239532,
                -0.27666595578193665,
                -0.07205644249916077,
                -0.040986254811286926,
                -0.2710481882095337,
                -0.2112669050693512,
                -0.12671704590320587,
                0.2538648545742035,
                0.0016268789768218994,
                0.013046324253082275,
                0.25595882534980774,
                -0.23359902203083038,
                -0.09481285512447357,
                0.07200056314468384,
                0.27448394894599915,
                0.016474992036819458,
                -0.16515231132507324,
                0.267915815114975,
                0.20677027106285095,
                0.022559940814971924,
                0.18372341990470886,
                -0.20265810191631317,
                0.05480140447616577,
                -0.1276135891675949,
                0.07256907224655151,
                -0.07084868848323822,
                0.15064170956611633,
                -0.07806883752346039,
                0.2289169728755951,
                0.2155282199382782,
                -0.0008050203323364258,
                0.019925981760025024,
                -0.1762269139289856,
                0.12723565101623535,
                -0.2687273919582367,
                0.0010949969291687012,
                0.24553343653678894,
                -0.22273045778274536,
                -0.032638877630233765,
                -0.12751366198062897,
                0.2034338116645813,
                -0.0069716572761535645
            ],
            [
                0.1056486964225769,
                0.1373220682144165,
                -0.03047335147857666,
                -0.22571805119514465,
                -0.17040835320949554,
                -0.08358128368854523,
                -0.11279992759227753,
                0.2194620668888092,
                0.11626490950584412,
                0.011032730340957642,
                0.08850648999214172,
                -0.23370838165283203,
                -0.16591715812683105,
                -0.24881139397621155,
                0.23450323939323425,
                0.07152554392814636,
                0.010189414024353027,
                0.0515342652797699,
                0.1798180341720581,
                0.12767556309700012,
                0.012783318758010864,
                -0.2086760699748993,
                0.2672707140445709,
                0.23797127604484558,
                0.10148939490318298,
                0.05120310187339783,
                0.16370952129364014,
                -0.2532486319541931,
                0.2662576138973236,
                0.10929501056671143,
                0.013520121574401855,
                0.2829078137874603,
                -0.029878050088882446,
                -0.09401047229766846,
                0.08435419201850891,
                0.18641510605812073,
                0.12083113193511963,
                -0.07587933540344238,
                0.11702263355255127,
                -0.14711275696754456,
                -0.2607773244380951,
                0.08697012066841125,
                -0.14386366307735443,
                -0.1169552206993103,
                -0.19606322050094604,
                0.2150917947292328,
                0.030244916677474976,
                -0.07237111032009125,
                -0.20517665147781372,
                0.18795162439346313,
                -0.25064602494239807,
                0.018197327852249146,
                -0.1437402367591858,
                0.18768033385276794,
                0.2381819188594818,
                0.08068981766700745,
                0.2039562165737152,
                0.18746784329414368,
                0.25756707787513733,
                0.0053601861000061035,
                0.048165321350097656,
                -0.11520259082317352,
                0.13509991765022278,
                0.19144019484519958
            ],
            [
                0.09135431051254272,
                0.09872633218765259,
                0.1071195900440216,
                0.09174230694770813,
                0.15128278732299805,
                0.24907764792442322,
                0.1135808527469635,
                -0.2562028169631958,
                0.17721232771873474,
                -0.17167454957962036,
                -0.21471118927001953,
                0.09572753310203552,
                0.11756065487861633,
                -0.21971991658210754,
                -0.28116992115974426,
                -0.11180970072746277,
                -0.14534296095371246,
                0.2192877233028412,
                0.17330598831176758,
                -0.16503295302391052,
                0.26744577288627625,
                0.04399952292442322,
                -0.25174808502197266,
                -0.23849904537200928,
                -0.16326166689395905,
                0.23621168732643127,
                -0.11561699211597443,
                0.23171618580818176,
                -0.13749878108501434,
                0.2606770098209381,
                0.05382192134857178,
                -0.08894221484661102,
                0.003093242645263672,
                -0.13565994799137115,
                0.1598144769668579,
                -0.16002628207206726,
                0.14978310465812683,
                0.2108290195465088,
                0.21185925602912903,
                0.2170242965221405,
                -0.14239473640918732,
                -0.21786260604858398,
                -0.012058645486831665,
                -0.13489578664302826,
                0.12976416945457458,
                -0.059448957443237305,
                0.0058796703815460205,
                0.04553115367889404,
                -0.08124494552612305,
                0.2721727192401886,
                -0.25095921754837036,
                0.018971681594848633,
                0.2748779356479645,
                0.15125718712806702,
                -0.27598774433135986,
                0.10485047101974487,
                -0.25893548130989075,
                0.14850646257400513,
                0.002793431282043457,
                -0.16268983483314514,
                0.22891512513160706,
                0.10600998997688293,
                -0.2557946741580963,
                -0.02443253993988037
            ],
            [
                0.0964670479297638,
                -0.18912333250045776,
                0.27968689799308777,
                0.1022995114326477,
                -0.1443859338760376,
                -0.016486793756484985,
                0.2750079333782196,
                -0.021601974964141846,
                0.11150467395782471,
                0.28056415915489197,
                -0.14706510305404663,
                0.17023542523384094,
                -0.15473663806915283,
                0.2664046585559845,
                -0.04684889316558838,
                0.14713218808174133,
                0.006054878234863281,
                -0.057530418038368225,
                -0.15525394678115845,
                0.14507555961608887,
                0.07150125503540039,
                0.23308178782463074,
                0.15361252427101135,
                0.20109006762504578,
                -0.049634575843811035,
                0.26561716198921204,
                0.251483291387558,
                0.039205729961395264,
                0.198154479265213,
                -0.05337052047252655,
                -0.18666750192642212,
                0.1690712869167328,
                -0.10486246645450592,
                -0.20155443251132965,
                -0.2664758563041687,
                -0.09573505818843842,
                0.16080909967422485,
                0.05127668380737305,
                0.2610277831554413,
                0.08714491128921509,
                -0.27096813917160034,
                0.07839259505271912,
                -0.2717514634132385,
                0.13429000973701477,
                -0.020368635654449463,
                -0.039331868290901184,
                0.16939613223075867,
                0.2636773884296417,
                -0.06892810761928558,
                0.17791911959648132,
                0.1078157126903534,
                -0.06986749172210693,
                0.18413057923316956,
                -0.18578475713729858,
                -0.2353551685810089,
                0.09548944234848022,
                -0.220312237739563,
                0.0919821560382843,
                -0.08324244618415833,
                -0.2162029892206192,
                0.2713318169116974,
                -0.27773913741111755,
                -0.10838828980922699,
                -0.24023470282554626
            ],
            [
                82.79000091552734,
                82.77274322509766,
                82.790283203125,
                82.73634338378906,
                82.82530975341797,
                82.88687133789062,
                82.72156524658203,
                82.79204559326172,
                82.21892547607422,
                82.74668884277344,
                -0.28173887729644775,
                82.73081970214844,
                -0.0038448108825832605,
                -0.12107431888580322,
                82.73806762695312,
                82.86991882324219,
                -0.28456273674964905,
                82.5039291381836,
                82.7967300415039,
                82.68109893798828,
                82.36229705810547,
                82.86595153808594,
                82.79644012451172,
                82.21273803710938,
                82.88713073730469,
                82.67239379882812,
                82.3089370727539,
                82.1570053100586,
                82.71693420410156,
                82.8744125366211,
                -0.10126502811908722,
                -0.1622793823480606,
                82.468017578125,
                82.83269500732422,
                82.84527587890625,
                82.59317016601562,
                -0.1830441951751709,
                82.79204559326172,
                82.72181701660156,
                82.65377044677734,
                -0.10740531980991364,
                82.28155517578125,
                0.004264650400727987,
                82.65838623046875,
                82.2508544921875,
                -0.11592933535575867,
                82.66519165039062,
                82.73066711425781,
                82.7796401977539,
                82.81547546386719,
                -0.1187766045331955,
                82.27088928222656,
                82.76778411865234,
                82.8213119506836,
                -0.16728857159614563,
                82.96635437011719,
                -0.03096848726272583,
                82.45806884765625,
                82.85565185546875,
                82.84791564941406,
                -0.22152487933635712,
                82.30432891845703,
                -0.04125523567199707,
                82.63311004638672
            ]
        ],
        [
            85.17778015136719,
            85.19316864013672,
            85.17013549804688,
            85.19886016845703,
            85.15248107910156,
            85.14804077148438,
            85.1948013305664,
            85.20767211914062,
            85.19486236572266,
            85.18126678466797,
            0.0,
            85.17144012451172,
            -0.012526402249932289,
            0.0,
            85.08206939697266,
            85.12694549560547,
            0.0,
            85.1918716430664,
            85.18536376953125,
            85.18441772460938,
            85.15818786621094,
            85.15811920166016,
            85.17747497558594,
            85.21996307373047,
            85.18026733398438,
            85.16227722167969,
            85.17509460449219,
            85.22185516357422,
            85.14750671386719,
            85.1816177368164,
            0.0,
            0.0,
            85.19998931884766,
            85.1743392944336,
            85.19556427001953,
            85.12467193603516,
            0.0,
            85.17977142333984,
            85.16399383544922,
            85.1141128540039,
            0.0,
            85.15357208251953,
            -0.021852919831871986,
            85.12236022949219,
            85.1801986694336,
            0.0,
            85.1591796875,
            85.17344665527344,
            85.18451690673828,
            85.13959503173828,
            0.0,
            85.2064208984375,
            85.19161987304688,
            85.2113265991211,
            -0.013085560873150826,
            85.22412109375,
            0.0,
            85.14498901367188,
            85.1443099975586,
            85.16471099853516,
            0.0,
            85.16975402832031,
            -0.011709103360772133,
            85.2017593383789
        ],
        [
            [
                85.19367218017578,
                0.14390400052070618,
                84.87184143066406,
                85.28097534179688,
                -0.16803309321403503,
                85.25504302978516,
                -0.045316338539123535,
                85.03751373291016,
                84.97454833984375,
                -0.00022098966292105615,
                0.09654275327920914,
                -0.1142980307340622,
                85.26675415039062,
                85.0562515258789,
                85.27454376220703,
                85.20478057861328,
                85.12293243408203,
                0.17946211993694305,
                -0.1215188279747963,
                84.98084259033203,
                0.12202879041433334,
                85.15420532226562,
                -0.06807644665241241,
                85.13843536376953,
                84.95172119140625,
                0.1678604632616043,
                85.10781860351562,
                -0.1767292022705078,
                -0.028134435415267944,
                85.202880859375,
                0.17783136665821075,
                -0.21609468758106232,
                85.31269073486328,
                0.0024654269218444824,
                0.09658776223659515,
                85.16661834716797,
                85.22769927978516,
                0.20338791608810425,
                85.04475402832031,
                85.36641693115234,
                84.99181365966797,
                0.0009216881007887423,
                -0.11358572542667389,
                85.0932388305664,
                -0.04018682241439819,
                -0.09821140766143799,
                0.14767888188362122,
                -0.00782227236777544,
                85.1611328125,
                -0.07303090393543243,
                0.12659744918346405,
                0.0894491896033287,
                84.90746307373047,
                0.09873481094837189,
                -0.07168395072221756,
                -0.13222149014472961,
                0.1306075006723404,
                85.00633239746094,
                85.20591735839844,
                85.04496765136719,
                85.2052230834961,
                85.10930633544922,
                -0.024133235216140747,
                0.019989773631095886
            ],
            [
                85.05552673339844,
                0.019330743700265884,
                85.16240692138672,
                85.01237487792969,
                0.12455431371927261,
                85.1548843383789,
                -0.12516148388385773,
                85.14097595214844,
                85.27115631103516,
                0.024635856971144676,
                0.04645479470491409,
                -0.01807009056210518,
                85.02559661865234,
                84.97877502441406,
                84.85037994384766,
                85.14089965820312,
                85.08679962158203,
                0.17826710641384125,
                0.08982788771390915,
                84.91195678710938,
                0.0001166611909866333,
                85.08997344970703,
                -0.11601132154464722,
                84.87002563476562,
                84.9549789428711,
                -0.08290554583072662,
                84.94500732421875,
                0.12534582614898682,
                0.011071741580963135,
                84.88008117675781,
                0.03458408638834953,
                -0.013039624318480492,
                84.99703979492188,
                0.1580241173505783,
                -0.08366063237190247,
                85.09081268310547,
                84.92289733886719,
                0.022449424490332603,
                85.28287506103516,
                85.01097869873047,
                85.11083221435547,
                0.1319209188222885,
                0.15741030871868134,
                84.90263366699219,
                -0.15131190419197083,
                -0.1354738026857376,
                0.12890128791332245,
                0.027696052566170692,
                84.96295928955078,
                -0.02847084403038025,
                -0.11703427881002426,
                0.08826587349176407,
                84.96930694580078,
                0.14950774610042572,
                -0.19043606519699097,
                0.0996633917093277,
                -0.019935984164476395,
                85.23556518554688,
                85.049560546875,
                85.24900817871094,
                84.95159149169922,
                84.8694076538086,
                0.04071832820773125,
                0.09992902725934982
            ],
            [
                85.09163665771484,
                0.03422313183546066,
                84.88920593261719,
                85.32814025878906,
                -0.14654728770256042,
                85.16439056396484,
                -0.13244830071926117,
                85.25055694580078,
                85.02411651611328,
                -0.21752165257930756,
                0.05573656037449837,
                -0.041658516973257065,
                85.05640411376953,
                85.26780700683594,
                85.13384246826172,
                85.21977996826172,
                85.05291748046875,
                -0.14907106757164001,
                -0.12057024985551834,
                85.1901626586914,
                -0.10008398443460464,
                85.24032592773438,
                0.029949113726615906,
                85.12647247314453,
                85.24925994873047,
                0.1710960865020752,
                85.07748413085938,
                -0.06259439885616302,
                0.17589648067951202,
                84.94075012207031,
                -0.24064598977565765,
                -0.025130394846200943,
                85.06084442138672,
                0.034015461802482605,
                -0.02025160752236843,
                85.31571960449219,
                85.00516510009766,
                0.04085209593176842,
                85.17327880859375,
                85.06806182861328,
                85.27131652832031,
                -0.0060722436755895615,
                -0.02393586002290249,
                85.04900360107422,
                -0.10092354565858841,
                0.037681806832551956,
                0.11911945790052414,
                -0.2203129529953003,
                84.85649871826172,
                0.0416383296251297,
                0.11838801950216293,
                0.02782159484922886,
                85.03363037109375,
                0.05539719760417938,
                -0.03631635382771492,
                0.00650380551815033,
                -0.15687599778175354,
                85.04080200195312,
                85.06391143798828,
                85.03146362304688,
                85.08076477050781,
                84.97421264648438,
                -0.08003956824541092,
                -0.05124830827116966
            ],
            [
                84.93954467773438,
                -0.102787084877491,
                85.29743957519531,
                85.18762969970703,
                -0.05530891194939613,
                85.02839660644531,
                0.12132374942302704,
                84.90667724609375,
                85.34510803222656,
                0.07929299771785736,
                -0.028532162308692932,
                0.11943399906158447,
                85.26338958740234,
                85.07228088378906,
                85.002685546875,
                85.11180877685547,
                85.25056457519531,
                -0.15227964520454407,
                -0.052811842411756516,
                85.27778625488281,
                -0.096241295337677,
                85.30774688720703,
                -0.1037716493010521,
                84.85924530029297,
                85.04035949707031,
                -0.07587625086307526,
                84.89356231689453,
                -0.027150489389896393,
                -0.15740589797496796,
                85.23987579345703,
                -0.030280282720923424,
                0.042905885726213455,
                84.93058776855469,
                -0.14305444061756134,
                -0.03539140522480011,
                85.17594909667969,
                85.01490783691406,
                0.13113705813884735,
                85.2040023803711,
                85.16552734375,
                85.0848388671875,
                0.17929358780384064,
                -0.1226201131939888,
                85.22355651855469,
                -0.030887741595506668,
                -0.22167469561100006,
                -0.04456482082605362,
                0.19286224246025085,
                85.10867309570312,
                0.04853297770023346,
                -0.13910910487174988,
                0.11501730233430862,
                85.31688690185547,
                0.14663030207157135,
                -0.007500168867409229,
                0.006360143423080444,
                0.03133649006485939,
                84.95834350585938,
                85.02748107910156,
                84.88394927978516,
                84.86359405517578,
                84.97052764892578,
                0.13503672182559967,
                -0.14124591648578644
            ],
            [
                85.17335510253906,
                0.01731790415942669,
                85.3489990234375,
                85.26972961425781,
                0.1801239252090454,
                85.33406829833984,
                0.1880888193845749,
                85.19966888427734,
                85.3990707397461,
                0.17659872770309448,
                -0.10434436053037643,
                -0.19482816755771637,
                85.0628662109375,
                84.98554992675781,
                84.97627258300781,
                85.01537322998047,
                85.26782989501953,
                0.1809220165014267,
                0.09310032427310944,
                85.33548736572266,
                -0.15210109949111938,
                85.23094177246094,
                -0.07510010898113251,
                85.29080963134766,
                85.21632385253906,
                0.10145660489797592,
                84.9202651977539,
                0.1578504592180252,
                -0.017214059829711914,
                85.3207778930664,
                -0.219095841050148,
                0.12055578082799911,
                85.30998229980469,
                -0.127886101603508,
                -0.04111866652965546,
                85.18783569335938,
                85.18413543701172,
                -0.024786273017525673,
                85.2147216796875,
                85.36193084716797,
                85.29551696777344,
                -0.09974168986082077,
                -0.17856624722480774,
                85.25553894042969,
                -0.0742398127913475,
                0.1839151382446289,
                0.12371806800365448,
                0.1484505981206894,
                85.29913330078125,
                -0.15439024567604065,
                -0.018171194940805435,
                -0.03498944267630577,
                85.232177734375,
                -0.044962286949157715,
                0.07345728576183319,
                -0.10850270092487335,
                0.11645714938640594,
                85.14295196533203,
                85.15150451660156,
                84.95893859863281,
                84.90473175048828,
                85.05774688720703,
                0.01399889588356018,
                -0.13167834281921387
            ],
            [
                84.93204498291016,
                -0.20409034192562103,
                84.90995788574219,
                85.02794647216797,
                -0.21873317658901215,
                84.89324188232422,
                -0.14592111110687256,
                84.90872955322266,
                84.96710968017578,
                0.04278293997049332,
                -0.06927061825990677,
                0.13066717982292175,
                85.31636047363281,
                85.04854583740234,
                85.02163696289062,
                85.20050048828125,
                85.26256561279297,
                0.11979128420352936,
                0.054582156240940094,
                85.267822265625,
                -0.105186328291893,
                84.91633605957031,
                -0.21622894704341888,
                84.89356231689453,
                85.0854721069336,
                -0.24370162189006805,
                84.91349792480469,
                -0.05389248952269554,
                -0.137373685836792,
                85.26765441894531,
                0.15916888415813446,
                0.07190293818712234,
                84.95938873291016,
                -0.11423423141241074,
                0.009332175366580486,
                85.30158233642578,
                84.89933013916016,
                -0.17328523099422455,
                85.12112426757812,
                84.96517181396484,
                85.17656707763672,
                -0.16634014248847961,
                -0.011838416568934917,
                85.1294937133789,
                -0.05539213493466377,
                0.1057824045419693,
                -0.13231977820396423,
                0.1703353375196457,
                84.8837661743164,
                -0.09402621537446976,
                -0.1840324103832245,
                0.09924006462097168,
                84.97632598876953,
                -0.20830045640468597,
                -0.05440325289964676,
                -0.0569147914648056,
                0.16281816363334656,
                85.2046890258789,
                85.17146301269531,
                84.98371887207031,
                84.822265625,
                84.94403076171875,
                -0.2081804722547531,
                -0.04759039729833603
            ],
            [
                85.16492462158203,
                0.07603400945663452,
                85.00347137451172,
                85.33660888671875,
                0.13136540353298187,
                85.05335998535156,
                0.21295572817325592,
                85.28589630126953,
                85.08922576904297,
                -0.19246700406074524,
                -0.0818806141614914,
                0.06880594044923782,
                85.07793426513672,
                85.12142944335938,
                85.24485778808594,
                85.02107238769531,
                85.25045776367188,
                -0.013434544205665588,
                -0.20202402770519257,
                85.23454284667969,
                0.10670672357082367,
                85.05174255371094,
                -0.17263540625572205,
                85.2480239868164,
                85.15266418457031,
                0.09299677610397339,
                85.31066131591797,
                0.049761928617954254,
                -0.1201307401061058,
                85.36579895019531,
                -0.18494312465190887,
                -0.043110206723213196,
                85.095947265625,
                -0.1754402220249176,
                -0.07404857873916626,
                85.14328002929688,
                85.0177230834961,
                -0.08778779953718185,
                84.99727630615234,
                85.30406188964844,
                85.18437194824219,
                0.11839153617620468,
                0.0026458525098860264,
                85.05590057373047,
                -0.12817949056625366,
                -0.1255941390991211,
                0.13439057767391205,
                -0.0725417360663414,
                85.34153747558594,
                -0.006649523973464966,
                -0.05679696798324585,
                -0.010502608492970467,
                85.10521697998047,
                -0.07592105865478516,
                -0.07083410769701004,
                0.19405733048915863,
                0.026410043239593506,
                85.04374694824219,
                85.01768493652344,
                85.31354522705078,
                85.0135269165039,
                85.31451416015625,
                -0.20098653435707092,
                -0.08648517727851868
            ],
            [
                85.1955337524414,
                0.16435295343399048,
                84.83309936523438,
                85.01603698730469,
                -0.07633724063634872,
                84.94760131835938,
                -0.20841433107852936,
                85.14356231689453,
                84.91512298583984,
                0.16795097291469574,
                -0.07165509462356567,
                -0.15025374293327332,
                84.88463592529297,
                85.17900848388672,
                84.94670104980469,
                85.21849060058594,
                85.22262573242188,
                -0.03747725486755371,
                -0.17316854000091553,
                85.08617401123047,
                0.135602667927742,
                85.04853057861328,
                -0.1335431933403015,
                84.93151092529297,
                85.21774291992188,
                -0.04443804547190666,
                85.01377868652344,
                -0.2173290103673935,
                0.03717361390590668,
                84.83007049560547,
                0.1758803129196167,
                -0.02116813138127327,
                85.10535430908203,
                -0.11242986470460892,
                -0.006293899845331907,
                85.18978881835938,
                84.97565460205078,
                -0.22378166019916534,
                85.1319351196289,
                85.23092651367188,
                84.91278839111328,
                0.08558673411607742,
                -0.12477794289588928,
                85.2115478515625,
                -0.13969208300113678,
                0.1526837944984436,
                -0.18839097023010254,
                0.027957318350672722,
                85.00165557861328,
                -0.20084835588932037,
                -0.10198499262332916,
                -0.14511483907699585,
                85.01140594482422,
                -0.1280062198638916,
                0.06789740920066833,
                0.15893696248531342,
                -0.07244336605072021,
                84.95558166503906,
                85.02906799316406,
                84.87047576904297,
                84.83684539794922,
                85.0617446899414,
                -0.16751012206077576,
                -0.11020171642303467
            ],
            [
                84.9551773071289,
                0.08142495155334473,
                85.11112976074219,
                85.01809692382812,
                0.040515437722206116,
                85.01345825195312,
                0.039885178208351135,
                85.16740417480469,
                85.03836059570312,
                -0.03559986129403114,
                0.13729935884475708,
                0.11052535474300385,
                84.9782485961914,
                85.08858489990234,
                85.36341857910156,
                84.94728088378906,
                85.14288330078125,
                0.16832612454891205,
                -0.2088584154844284,
                85.28685760498047,
                -0.08323556929826736,
                85.40684509277344,
                0.06453604996204376,
                85.25855255126953,
                85.22026824951172,
                0.08362604677677155,
                85.20083618164062,
                -0.019121386110782623,
                0.06556724011898041,
                85.40139770507812,
                -0.12883827090263367,
                -0.12966382503509521,
                85.30281829833984,
                -0.2047615647315979,
                0.1418466717004776,
                85.25755310058594,
                85.21144104003906,
                -0.19558188319206238,
                85.33914184570312,
                85.30841827392578,
                85.20931243896484,
                -0.1041245236992836,
                -0.004768931772559881,
                85.09540557861328,
                -0.17127348482608795,
                -0.13359613716602325,
                0.19934402406215668,
                -0.17127332091331482,
                85.31758880615234,
                0.12817351520061493,
                -0.0280842836946249,
                -0.10221897065639496,
                85.27123260498047,
                -0.053371965885162354,
                -0.09242607653141022,
                -0.015288352966308594,
                -0.09311746060848236,
                85.03572845458984,
                85.07917785644531,
                84.98002624511719,
                85.0825424194336,
                85.33362579345703,
                0.13245126605033875,
                -0.15206895768642426
            ],
            [
                85.08683776855469,
                0.0736047625541687,
                85.11651611328125,
                85.38184356689453,
                0.12359925359487534,
                85.21530151367188,
                -0.183437317609787,
                84.96083068847656,
                85.2269058227539,
                -0.02933465503156185,
                0.17717348039150238,
                -0.18517732620239258,
                85.15390014648438,
                84.96422576904297,
                85.28387451171875,
                85.18267059326172,
                85.29135131835938,
                0.033344462513923645,
                -0.02009078860282898,
                85.29427337646484,
                0.11784727871417999,
                85.3614273071289,
                -0.11761141568422318,
                84.98096466064453,
                85.33675384521484,
                0.05304204672574997,
                84.93621826171875,
                0.18807463347911835,
                -0.11159200221300125,
                85.3314208984375,
                0.16892848908901215,
                -0.17685054242610931,
                85.30343627929688,
                -0.19790147244930267,
                -0.01788148283958435,
                85.21588134765625,
                85.15019989013672,
                0.19506993889808655,
                85.2706069946289,
                85.14041137695312,
                85.19159698486328,
                -0.015819650143384933,
                -0.038511503487825394,
                85.29611206054688,
                -0.007362954784184694,
                -0.04400744289159775,
                -0.14836964011192322,
                0.14448067545890808,
                85.21912384033203,
                0.12127538025379181,
                -0.19811075925827026,
                -0.16379918158054352,
                85.31595611572266,
                0.08019910752773285,
                -0.23868946731090546,
                -0.11808672547340393,
                -0.16156060993671417,
                85.06460571289062,
                85.03746032714844,
                85.0862808227539,
                85.15035247802734,
                85.31700897216797,
                -0.14942625164985657,
                -0.09977452456951141
            ],
            [
                -0.14805519580841064,
                0.03679446876049042,
                -0.19444489479064941,
                0.1146361380815506,
                0.10539869964122772,
                0.16661883890628815,
                -0.018611431121826172,
                0.005401015281677246,
                0.1630844622850418,
                0.16036377847194672,
                -0.027643650770187378,
                0.04874978959560394,
                0.1330977827310562,
                0.013211965560913086,
                -0.0992077961564064,
                -0.0010657310485839844,
                -0.09787865728139877,
                0.007650524377822876,
                -0.033515989780426025,
                -0.05366082489490509,
                0.17808111011981964,
                -0.005712538957595825,
                0.15823645889759064,
                0.09059570729732513,
                0.19447262585163116,
                -0.022944867610931396,
                -0.1296485811471939,
                -0.1663184016942978,
                0.15893574059009552,
                0.10041160881519318,
                -0.08671018481254578,
                -0.11851108074188232,
                -0.04794380068778992,
                -0.058188438415527344,
                0.14162741601467133,
                -0.2079620361328125,
                0.017777428030967712,
                0.04163198173046112,
                -0.06408949196338654,
                -0.10102412104606628,
                0.10209785401821136,
                0.197840616106987,
                -0.07606317102909088,
                0.01752711832523346,
                -0.044987618923187256,
                -0.1983444094657898,
                -0.09803283959627151,
                0.02532036602497101,
                -0.1389198899269104,
                0.16043521463871002,
                0.034329816699028015,
                -0.20791345834732056,
                0.15128691494464874,
                0.18102417886257172,
                0.02440713346004486,
                0.004389330744743347,
                -0.1449783742427826,
                0.07428286969661713,
                -0.1668972671031952,
                -0.04288487136363983,
                0.052312418818473816,
                0.15332038700580597,
                0.1335056573152542,
                0.16180358827114105
            ],
            [
                84.86663818359375,
                0.15265010297298431,
                85.1214599609375,
                85.04200744628906,
                -0.18001124262809753,
                85.1034927368164,
                -0.024422764778137207,
                85.11592102050781,
                85.01927947998047,
                -0.22168968617916107,
                0.04578699544072151,
                -0.21089519560337067,
                84.969970703125,
                85.15640258789062,
                85.1624526977539,
                85.17536926269531,
                84.95626068115234,
                0.029514014720916748,
                -0.04089586064219475,
                85.03284454345703,
                0.13137979805469513,
                85.04751586914062,
                0.10165445506572723,
                84.85090637207031,
                85.03119659423828,
                -0.028221426531672478,
                85.002197265625,
                -0.18915016949176788,
                -0.07825016975402832,
                85.19182586669922,
                -0.05463075265288353,
                -0.13183198869228363,
                85.09757995605469,
                0.04045062139630318,
                -0.02759745344519615,
                85.17375946044922,
                85.23978424072266,
                -0.05932256951928139,
                85.19612884521484,
                84.9524917602539,
                84.99436950683594,
                -0.20974743366241455,
                -0.22979730367660522,
                85.21480560302734,
                0.1821182668209076,
                0.18137623369693756,
                0.0384945422410965,
                0.05661403387784958,
                85.03973388671875,
                0.01615390181541443,
                0.19066670536994934,
                0.01100704912096262,
                85.1454086303711,
                0.1295800358057022,
                -0.1940397471189499,
                -0.1955818086862564,
                0.15478168427944183,
                85.07442474365234,
                85.13695526123047,
                85.09288787841797,
                84.89364624023438,
                85.08964538574219,
                0.10404427349567413,
                0.18111884593963623
            ],
            [
                0.0626472681760788,
                0.14350037276744843,
                -0.18306416273117065,
                -0.05336417257785797,
                -0.01752537116408348,
                0.2176947444677353,
                0.18547756969928741,
                -0.0765828788280487,
                -0.19754810631275177,
                0.1514713317155838,
                -0.20925478637218475,
                0.0032414202578365803,
                -0.11976823955774307,
                0.09385475516319275,
                0.015180930495262146,
                0.11838661134243011,
                -0.10354873538017273,
                -0.023580700159072876,
                0.10202489793300629,
                -0.10588720440864563,
                0.1643630713224411,
                -0.15863943099975586,
                -0.0960078239440918,
                -0.07464142143726349,
                -0.19362331926822662,
                0.09491568058729172,
                -0.20174528658390045,
                -0.17288804054260254,
                -0.13884401321411133,
                -0.12185241281986237,
                -0.1310938596725464,
                0.09029176086187363,
                -0.03589160740375519,
                0.10076235234737396,
                -0.010977745056152344,
                0.13483208417892456,
                -0.0715634822845459,
                0.07916770875453949,
                -0.0735836923122406,
                -0.07460514456033707,
                0.033419787883758545,
                -0.18285953998565674,
                0.1684032827615738,
                -0.1812267005443573,
                0.09298941493034363,
                -0.025378037244081497,
                -0.045342523604631424,
                0.1859341710805893,
                0.10155075788497925,
                0.17655335366725922,
                -0.059955038130283356,
                0.07834005355834961,
                0.004671615548431873,
                -0.04770423471927643,
                0.04626360163092613,
                0.11943639814853668,
                0.18103480339050293,
                0.1743760108947754,
                -0.2118658572435379,
                -0.18564574420452118,
                -0.14425437152385712,
                -0.08621207624673843,
                -0.2038765847682953,
                0.16903851926326752
            ],
            [
                -0.05515572428703308,
                -0.019063979387283325,
                -0.08880917727947235,
                0.06436146795749664,
                -0.19285714626312256,
                -0.07094502449035645,
                0.1267303079366684,
                0.1956227868795395,
                0.1132187694311142,
                -0.08727382123470306,
                -0.01691843569278717,
                0.013024598360061646,
                -0.15435416996479034,
                0.19271977245807648,
                0.07423456013202667,
                0.12566111981868744,
                -0.05343644320964813,
                -0.09450612217187881,
                -0.1841336190700531,
                0.12344525754451752,
                0.1856548935174942,
                -0.050419554114341736,
                0.047475919127464294,
                0.20404599606990814,
                0.08355467021465302,
                -0.0858316719532013,
                -0.11679015308618546,
                0.19184066355228424,
                -0.11500753462314606,
                -0.08758264780044556,
                0.13256724178791046,
                -0.08077584207057953,
                -0.181194469332695,
                -0.014062494039535522,
                0.1936531513929367,
                0.14002089202404022,
                0.057011380791664124,
                -0.21482175588607788,
                -0.014553189277648926,
                -0.17714948952198029,
                0.10389579832553864,
                0.03356574475765228,
                -0.09534606337547302,
                0.14973364770412445,
                -0.1423528790473938,
                -0.13777095079421997,
                -0.14579087495803833,
                0.18886451423168182,
                0.12753163278102875,
                -0.05790640413761139,
                -0.05111832916736603,
                -0.16733978688716888,
                0.11579595506191254,
                -0.11343506723642349,
                0.01889023184776306,
                0.1957850307226181,
                0.0540287047624588,
                -0.18116292357444763,
                0.15214420855045319,
                0.13301755487918854,
                -0.028548330068588257,
                -0.09620475023984909,
                -0.20421820878982544,
                -0.060391247272491455
            ],
            [
                85.15453338623047,
                -0.07077861577272415,
                84.97254943847656,
                85.25376892089844,
                0.055882398039102554,
                85.21900939941406,
                -0.1850157380104065,
                85.02290344238281,
                85.36830139160156,
                0.14422112703323364,
                -0.12908117473125458,
                -0.1438593566417694,
                85.36344909667969,
                85.17178344726562,
                85.29127502441406,
                85.07041931152344,
                85.36331176757812,
                -0.10983158648014069,
                -0.08195017278194427,
                85.0565414428711,
                -0.10535217821598053,
                85.1106948852539,
                0.12228019535541534,
                85.20368194580078,
                85.01231384277344,
                -0.04735106974840164,
                84.947509765625,
                -0.16930308938026428,
                0.09358297288417816,
                85.1965103149414,
                -0.1730775386095047,
                -0.17454411089420319,
                84.99021911621094,
                -0.023027971386909485,
                -0.154652938246727,
                85.419189453125,
                85.37335968017578,
                -0.1294892579317093,
                85.01655578613281,
                85.1219711303711,
                85.32880401611328,
                -0.11454369127750397,
                0.15298260748386383,
                85.133544921875,
                0.019414156675338745,
                0.11533140391111374,
                -0.013617812655866146,
                -0.008700083009898663,
                85.3155746459961,
                -0.15211984515190125,
                0.03916918486356735,
                0.04263441637158394,
                85.3748779296875,
                -0.15126579999923706,
                0.019525712355971336,
                -0.1474359631538391,
                -0.06940071284770966,
                85.36602020263672,
                85.24751281738281,
                84.96719360351562,
                85.0293960571289,
                85.34850311279297,
                -0.18585382401943207,
                -0.16534243524074554
            ],
            [
                85.14389038085938,
                0.08298433572053909,
                84.99300384521484,
                85.2636489868164,
                0.14456000924110413,
                85.25540161132812,
                0.07445068657398224,
                85.19376373291016,
                85.16879272460938,
                -0.09841837733983994,
                -0.22457237541675568,
                0.1661110818386078,
                85.34070587158203,
                85.13745880126953,
                85.12251281738281,
                84.94981384277344,
                85.10731506347656,
                -0.021629244089126587,
                -0.12875662744045258,
                84.92626190185547,
                -0.06978447735309601,
                85.05396270751953,
                0.08421160280704498,
                85.09259033203125,
                85.29711151123047,
                0.14746704697608948,
                84.93692016601562,
                -0.0820252075791359,
                0.1170945018529892,
                85.01760864257812,
                -0.09310872107744217,
                0.1156657487154007,
                84.95113372802734,
                0.038479238748550415,
                -0.1387668401002884,
                85.36029815673828,
                85.09127807617188,
                0.16378135979175568,
                84.94098663330078,
                85.18592071533203,
                85.17723846435547,
                -0.046458303928375244,
                0.010739902034401894,
                85.00299835205078,
                0.08225888013839722,
                0.0010815230198204517,
                -0.16774792969226837,
                0.17362269759178162,
                84.95785522460938,
                0.0645156055688858,
                -0.1469046026468277,
                0.07058043032884598,
                85.07395935058594,
                0.0674295574426651,
                0.13776448369026184,
                -0.0929989442229271,
                0.12065885215997696,
                85.0911636352539,
                84.99681091308594,
                84.86961364746094,
                84.85441589355469,
                85.2347183227539,
                -0.03652187064290047,
                0.03687742352485657
            ],
            [
                -0.09171311557292938,
                0.014708876609802246,
                0.05125759541988373,
                -0.08556553721427917,
                -0.1160542219877243,
                -0.16166147589683533,
                0.07333479821681976,
                0.11767826974391937,
                0.0950513631105423,
                -0.04535117745399475,
                -0.12645253539085388,
                -0.015911132097244263,
                0.13993240892887115,
                -0.19484318792819977,
                0.04531086981296539,
                0.16838063299655914,
                0.03957046568393707,
                -0.07646450400352478,
                -0.0828397274017334,
                0.02684958279132843,
                -0.16767391562461853,
                0.17315338551998138,
                0.053671255707740784,
                0.11196304857730865,
                -0.1556885838508606,
                -0.15160685777664185,
                -0.1559683084487915,
                -0.06083118915557861,
                0.009520068764686584,
                0.08720643818378448,
                0.03643117845058441,
                0.21276040375232697,
                0.10769002139568329,
                0.2066716104745865,
                -0.08216036856174469,
                -0.03517012298107147,
                0.022142186760902405,
                -0.10512572526931763,
                0.062349364161491394,
                0.20726604759693146,
                -0.06783750653266907,
                -0.10278722643852234,
                0.04846872389316559,
                -0.11980419605970383,
                -0.09670793265104294,
                0.12837432324886322,
                -0.20245546102523804,
                -0.1636664718389511,
                -0.17282283306121826,
                0.10534004867076874,
                0.034029439091682434,
                -0.08691805601119995,
                -0.12582552433013916,
                -0.16365346312522888,
                -0.165386363863945,
                0.062355294823646545,
                -0.011629998683929443,
                -0.07884745299816132,
                0.19769059121608734,
                -0.17146416008472443,
                -0.21426932513713837,
                -0.006857246160507202,
                -0.1526995301246643,
                0.043995246291160583
            ],
            [
                85.27201080322266,
                -0.18597441911697388,
                84.9879150390625,
                85.1488037109375,
                -0.1989024132490158,
                85.28829956054688,
                0.13258637487888336,
                84.8924331665039,
                85.07951354980469,
                0.15932457149028778,
                -0.04436270892620087,
                -0.14900751411914825,
                85.14564514160156,
                84.98410034179688,
                85.36067199707031,
                85.0458755493164,
                85.01116943359375,
                -0.11680744588375092,
                -0.16871142387390137,
                85.0357666015625,
                -0.11201821267604828,
                85.33269500732422,
                -0.018167510628700256,
                84.98817443847656,
                85.04291534423828,
                0.12404254823923111,
                84.99478149414062,
                -0.23033416271209717,
                0.11065538227558136,
                84.99108123779297,
                -0.02735516056418419,
                0.013203952461481094,
                85.3165054321289,
                -0.04521694406867027,
                -0.09413440525531769,
                85.07061767578125,
                85.07237243652344,
                0.03247709944844246,
                85.20804595947266,
                85.12860107421875,
                85.34691619873047,
                -0.08021442592144012,
                0.03933943063020706,
                85.14640045166016,
                -0.027768101543188095,
                -0.0009034410468302667,
                -0.03600037097930908,
                0.1737247258424759,
                85.25579833984375,
                0.14477433264255524,
                0.12374725192785263,
                -0.07648509740829468,
                84.9103012084961,
                -0.17011606693267822,
                0.0696926862001419,
                -0.08724801242351532,
                -0.16581037640571594,
                85.29710388183594,
                85.14694213867188,
                85.26399993896484,
                85.11865997314453,
                85.06755828857422,
                0.08833970129489899,
                -0.09026575833559036
            ],
            [
                85.06668090820312,
                0.14655277132987976,
                85.09774017333984,
                85.23426818847656,
                0.19303588569164276,
                85.23805236816406,
                0.20102359354496002,
                84.98210144042969,
                85.18559265136719,
                -0.18600277602672577,
                0.06798549741506577,
                -0.13850434124469757,
                85.36370849609375,
                85.27093505859375,
                84.95703125,
                85.26358032226562,
                85.15708923339844,
                -0.10044164955615997,
                0.058617815375328064,
                85.1458969116211,
                0.10735328495502472,
                85.16704559326172,
                0.05177713930606842,
                85.22473907470703,
                85.010009765625,
                0.098192498087883,
                85.21920013427734,
                0.1510968953371048,
                0.01958899199962616,
                85.09605407714844,
                -0.1934916079044342,
                -0.1965106576681137,
                85.13825225830078,
                0.13705138862133026,
                -0.06626132130622864,
                85.1689453125,
                85.28845977783203,
                -0.08869122713804245,
                85.26844024658203,
                85.11962127685547,
                85.0177001953125,
                0.16983728110790253,
                0.19917277991771698,
                85.26353454589844,
                0.1548933982849121,
                0.047243282198905945,
                0.10893557220697403,
                0.0380190871655941,
                85.14849090576172,
                -0.04906785488128662,
                0.17434361577033997,
                0.13269951939582825,
                85.09622192382812,
                -0.021278753876686096,
                0.11793439835309982,
                0.20050100982189178,
                0.07516134530305862,
                85.05081176757812,
                85.09580993652344,
                85.2374267578125,
                85.1872787475586,
                85.1435775756836,
                -0.033450379967689514,
                -0.18462565541267395
            ],
            [
                85.16963195800781,
                0.14420251548290253,
                85.28194427490234,
                85.15680694580078,
                -0.1630972921848297,
                85.09566497802734,
                -0.09664361923933029,
                84.99945831298828,
                85.1206283569336,
                0.1417936235666275,
                0.02835041843354702,
                -0.05559838190674782,
                85.16228485107422,
                85.15201568603516,
                85.16891479492188,
                85.12337493896484,
                85.24102020263672,
                0.10122992098331451,
                0.11349822580814362,
                84.966796875,
                0.06340054422616959,
                85.14723205566406,
                -0.08459065854549408,
                85.07621765136719,
                85.10240173339844,
                0.036428302526474,
                85.08609771728516,
                -0.17823846638202667,
                0.08632154762744904,
                85.14141845703125,
                -0.22182752192020416,
                -0.0685625821352005,
                85.2728271484375,
                0.013680264353752136,
                0.15463079512119293,
                85.15968322753906,
                85.26655578613281,
                -0.04584898427128792,
                85.18238830566406,
                85.17505645751953,
                84.97791290283203,
                0.09579453617334366,
                0.12809671461582184,
                85.1016616821289,
                0.16539767384529114,
                -0.01875176467001438,
                -0.17483580112457275,
                -0.152614027261734,
                84.88833618164062,
                -0.17743639647960663,
                -0.08661707490682602,
                -0.09698469191789627,
                85.2435531616211,
                -0.06501233577728271,
                -0.2072019726037979,
                -0.0758594274520874,
                -0.0476628802716732,
                85.10152435302734,
                85.15181732177734,
                85.17284393310547,
                85.18608093261719,
                85.2216796875,
                -0.08332738280296326,
                0.10047290474176407
            ],
            [
                84.96595001220703,
                0.0256793349981308,
                85.27804565429688,
                85.34370422363281,
                0.19836793839931488,
                85.12828826904297,
                -0.0636453628540039,
                85.17768859863281,
                84.96142578125,
                0.0633338913321495,
                -0.15269362926483154,
                0.05562369525432587,
                85.10861206054688,
                85.2245101928711,
                85.21692657470703,
                85.32341766357422,
                85.06165313720703,
                -0.15127509832382202,
                0.1559053361415863,
                85.15606689453125,
                -0.1558777093887329,
                85.18257141113281,
                0.1895146518945694,
                85.11750030517578,
                84.98124694824219,
                -0.07329711318016052,
                85.01055145263672,
                0.09916938096284866,
                -0.18668252229690552,
                85.03727722167969,
                -0.0024428998585790396,
                -0.13895468413829803,
                85.2441177368164,
                -0.00837136059999466,
                0.04296449199318886,
                85.02996826171875,
                85.20753479003906,
                -0.17364832758903503,
                85.21675872802734,
                85.0338363647461,
                84.9844741821289,
                -0.16522406041622162,
                -0.010470411740243435,
                84.97251892089844,
                0.07992616295814514,
                0.0034702548291534185,
                -0.20483118295669556,
                0.006367996335029602,
                85.05697631835938,
                -0.07710252702236176,
                -0.06043101102113724,
                0.09403674304485321,
                85.20889282226562,
                0.042439237236976624,
                0.09487582743167877,
                0.009160488843917847,
                -0.10973784327507019,
                85.31352233886719,
                85.36495208740234,
                85.04346466064453,
                85.09634399414062,
                85.1444091796875,
                0.1696959286928177,
                0.13523247838020325
            ],
            [
                85.07477569580078,
                -0.013590965420007706,
                85.14935302734375,
                84.99018096923828,
                -0.21157948672771454,
                85.13876342773438,
                0.14569903910160065,
                85.1707992553711,
                85.05039978027344,
                -0.06772378832101822,
                0.11139213293790817,
                0.14808470010757446,
                85.05307006835938,
                84.88093566894531,
                85.02214050292969,
                84.88451385498047,
                85.2900161743164,
                0.007493749260902405,
                0.1671641319990158,
                85.27615356445312,
                -0.12988099455833435,
                85.10294342041016,
                0.029266715049743652,
                85.06635284423828,
                84.9389419555664,
                0.12344490736722946,
                85.0931625366211,
                -0.047072168439626694,
                -0.20535686612129211,
                85.10691833496094,
                -0.2145332247018814,
                0.1399611234664917,
                84.99502563476562,
                0.10699755698442459,
                0.06934086233377457,
                85.28047180175781,
                85.24310302734375,
                0.04562423750758171,
                85.23992919921875,
                84.95479583740234,
                85.2640380859375,
                -0.06704673916101456,
                -0.00670081889256835,
                85.16923522949219,
                0.15240727365016937,
                -0.16454103589057922,
                -0.18455387651920319,
                -0.0017387643456459045,
                84.84323120117188,
                -0.18921205401420593,
                -0.02153400145471096,
                0.09595022350549698,
                85.23519897460938,
                0.12438715994358063,
                0.10177065432071686,
                -0.0960473120212555,
                -0.1250375211238861,
                85.12918853759766,
                85.0012435913086,
                85.18262481689453,
                85.1612548828125,
                85.15191650390625,
                0.024471767246723175,
                -0.10431843250989914
            ],
            [
                85.09503173828125,
                0.04702061042189598,
                85.08429718017578,
                85.13752746582031,
                -0.18445350229740143,
                84.8887939453125,
                -0.011357814073562622,
                84.85054779052734,
                85.33296203613281,
                -0.16201947629451752,
                0.18675117194652557,
                0.2013121247291565,
                85.10150909423828,
                84.97974395751953,
                85.02360534667969,
                84.91112518310547,
                85.23753356933594,
                -0.20278958976268768,
                0.12946036458015442,
                85.3045425415039,
                -0.1317061483860016,
                85.20341491699219,
                0.11397872865200043,
                84.94981384277344,
                85.275390625,
                -0.04579444229602814,
                85.07788848876953,
                0.03482264652848244,
                0.14974142611026764,
                85.16629028320312,
                0.025268085300922394,
                0.017483556643128395,
                85.04046630859375,
                0.08542511612176895,
                -0.13255997002124786,
                85.11448669433594,
                85.32701110839844,
                0.07394024729728699,
                85.20508575439453,
                85.26644134521484,
                85.13291931152344,
                0.035116422921419144,
                -0.04386548697948456,
                84.91194915771484,
                -0.04185042902827263,
                0.13832679390907288,
                -0.19876471161842346,
                -0.19585655629634857,
                85.21395111083984,
                -0.115091472864151,
                0.009867521934211254,
                -0.12112449109554291,
                85.03622436523438,
                0.03596888482570648,
                0.11879473179578781,
                -0.06064753234386444,
                -0.1404958814382553,
                85.2636947631836,
                85.07315063476562,
                85.06484985351562,
                85.18294525146484,
                85.21697998046875,
                -0.0815863087773323,
                -0.12487605959177017
            ],
            [
                85.08049011230469,
                0.02041119709610939,
                85.26892852783203,
                85.09724426269531,
                -0.12892380356788635,
                84.969482421875,
                -0.02019438147544861,
                84.8743896484375,
                85.294921875,
                -0.010492230765521526,
                -0.19062329828739166,
                0.10520295798778534,
                85.29118347167969,
                84.98104095458984,
                85.27726745605469,
                85.26151275634766,
                84.99214935302734,
                0.052701011300086975,
                0.13974571228027344,
                85.28795623779297,
                0.02105170302093029,
                85.26283264160156,
                0.1839665323495865,
                84.97029876708984,
                85.0098876953125,
                0.0668502002954483,
                85.16521453857422,
                -0.008354716002941132,
                -0.023917317390441895,
                84.97356414794922,
                -0.11982271820306778,
                -0.14887475967407227,
                85.00286865234375,
                0.0777917131781578,
                -0.22264637053012848,
                85.0926284790039,
                85.22830963134766,
                -0.13993020355701447,
                85.1220703125,
                85.02679443359375,
                85.25987243652344,
                0.11985191702842712,
                0.1677171289920807,
                85.19125366210938,
                -0.026306692510843277,
                -0.168674498796463,
                0.0020347684621810913,
                0.07946614921092987,
                85.09176635742188,
                -0.15904279053211212,
                0.02036796137690544,
                0.11511698365211487,
                84.9574203491211,
                0.16632770001888275,
                -0.13514013588428497,
                0.017322659492492676,
                -0.12696069478988647,
                85.2838134765625,
                85.34004974365234,
                85.13892364501953,
                84.8874740600586,
                85.18706512451172,
                -0.15908783674240112,
                -0.14773696660995483
            ],
            [
                84.99203491210938,
                0.07699155807495117,
                85.32810974121094,
                85.00389862060547,
                0.19751165807247162,
                85.02546691894531,
                0.03215360641479492,
                85.07788848876953,
                85.05313110351562,
                -0.02490062452852726,
                -0.07223968952894211,
                -0.1112862154841423,
                85.15670776367188,
                85.32305145263672,
                85.19702911376953,
                84.9428939819336,
                85.17354583740234,
                -0.18741756677627563,
                -0.18343138694763184,
                84.94175720214844,
                -0.04896064102649689,
                85.19742584228516,
                -0.15872129797935486,
                85.07076263427734,
                85.01322174072266,
                0.04407724738121033,
                85.1915283203125,
                -0.08597362786531448,
                0.051130518317222595,
                85.23009490966797,
                0.0844138115644455,
                -0.003546854481101036,
                85.0660171508789,
                -0.007596999406814575,
                0.19007961452007294,
                85.39234924316406,
                85.16239166259766,
                -0.07708735018968582,
                85.18536376953125,
                85.12284088134766,
                85.28319549560547,
                -0.16337546706199646,
                -0.10682810097932816,
                85.26238250732422,
                -0.1595047563314438,
                -0.08875638246536255,
                -0.0026795663870871067,
                -0.13476943969726562,
                85.08419036865234,
                -0.21174892783164978,
                0.12034797668457031,
                0.06731128692626953,
                85.26211547851562,
                0.12962467968463898,
                0.11263125389814377,
                -0.14285212755203247,
                0.052538298070430756,
                85.04740142822266,
                85.24005889892578,
                84.94889068603516,
                85.09725952148438,
                85.10073852539062,
                0.1879512220621109,
                0.07667677104473114
            ],
            [
                85.33476257324219,
                0.04384838789701462,
                85.387451171875,
                85.35289764404297,
                0.10725069791078568,
                85.23725128173828,
                0.09766246378421783,
                85.2752456665039,
                85.30589294433594,
                -0.007611675653606653,
                0.05830743908882141,
                0.18143288791179657,
                85.05008697509766,
                85.07483673095703,
                85.071533203125,
                85.3097152709961,
                85.22119903564453,
                -0.12315654754638672,
                -0.017543017864227295,
                84.98534393310547,
                -0.20055145025253296,
                85.05239868164062,
                0.09688667953014374,
                85.12835693359375,
                85.09121704101562,
                -0.011204872280359268,
                84.91458129882812,
                0.029015371575951576,
                -0.20759916305541992,
                85.19815063476562,
                -0.034603290259838104,
                0.08660492300987244,
                85.08302307128906,
                0.027818113565444946,
                -0.06609350442886353,
                85.44121551513672,
                85.03563690185547,
                0.11464349180459976,
                85.22576904296875,
                85.36311340332031,
                85.20477294921875,
                -0.12707959115505219,
                -0.2137250304222107,
                85.06924438476562,
                -0.0074308873154222965,
                -0.0482659786939621,
                0.02314494550228119,
                0.1644992232322693,
                85.36862182617188,
                0.06531347334384918,
                0.04798337072134018,
                -0.14034415781497955,
                85.40673065185547,
                0.13612668216228485,
                -0.11755853146314621,
                -0.14099173247814178,
                -0.17895330488681793,
                85.3037338256836,
                85.18534851074219,
                84.93478393554688,
                85.16327667236328,
                85.29823303222656,
                -0.026968061923980713,
                -0.20631833374500275
            ],
            [
                85.27598571777344,
                -0.20858165621757507,
                85.2541732788086,
                85.33624267578125,
                0.1819678694009781,
                85.0693588256836,
                0.0836336761713028,
                85.19517517089844,
                85.21513366699219,
                -0.04196644201874733,
                -0.15443077683448792,
                0.2098991423845291,
                84.99961853027344,
                85.0307846069336,
                85.33544158935547,
                85.1126480102539,
                85.39244842529297,
                0.006496012210845947,
                -0.1186889186501503,
                85.22016143798828,
                0.06616362184286118,
                85.1686782836914,
                -0.0507144033908844,
                85.01956176757812,
                85.28379821777344,
                -0.027509227395057678,
                85.043701171875,
                -0.23691068589687347,
                -0.14517635107040405,
                85.29105377197266,
                -0.20635035634040833,
                -0.14008210599422455,
                85.02352905273438,
                -0.03006499633193016,
                -0.03443785756826401,
                85.13489532470703,
                85.35458374023438,
                0.14504356682300568,
                85.11135864257812,
                85.10539245605469,
                85.15448760986328,
                0.15735317766666412,
                -0.14242149889469147,
                85.05315399169922,
                0.11525150388479233,
                -0.1486111730337143,
                -0.16591081023216248,
                0.16720707714557648,
                85.34074401855469,
                0.013108208775520325,
                -0.09165040403604507,
                -0.07416657358407974,
                85.22895812988281,
                -0.16310103237628937,
                -0.03884550929069519,
                -0.045008584856987,
                0.19175174832344055,
                85.34817504882812,
                85.33157348632812,
                85.03764343261719,
                84.98040008544922,
                85.31712341308594,
                0.15270841121673584,
                -0.14009203016757965
            ],
            [
                85.28241729736328,
                -0.11597060412168503,
                85.18402099609375,
                85.13373565673828,
                -0.09021764993667603,
                85.18328094482422,
                -0.06312169134616852,
                85.29447937011719,
                85.14696502685547,
                0.004076870158314705,
                0.013924811966717243,
                -0.14071489870548248,
                85.0501708984375,
                84.95249938964844,
                85.10440063476562,
                85.07689666748047,
                85.35030364990234,
                -0.1795838475227356,
                0.1321130096912384,
                85.09083557128906,
                -0.11809536069631577,
                85.06614685058594,
                -0.14052242040634155,
                84.9548568725586,
                84.89207458496094,
                -0.14591175317764282,
                84.99120330810547,
                -0.13287174701690674,
                -0.11368660628795624,
                85.35928344726562,
                -0.15054653584957123,
                0.12329449504613876,
                84.97518920898438,
                -0.1593696027994156,
                -0.0049429056234657764,
                85.1054458618164,
                85.19557189941406,
                -0.20656178891658783,
                84.97410583496094,
                85.32637786865234,
                85.33980560302734,
                -0.04974653571844101,
                0.0506729930639267,
                85.31006622314453,
                -0.2079828828573227,
                -0.06737247854471207,
                0.08300243318080902,
                -0.1275504231452942,
                85.0094985961914,
                -0.17498984932899475,
                -0.11075504124164581,
                -0.04301057010889053,
                85.26422119140625,
                -0.028678759932518005,
                -0.11410291492938995,
                -0.09329074621200562,
                0.11909891664981842,
                85.34478759765625,
                85.04542541503906,
                85.16555786132812,
                84.98416137695312,
                85.0746078491211,
                0.10490608215332031,
                0.15586282312870026
            ],
            [
                85.18600463867188,
                -0.05009409785270691,
                85.35271453857422,
                85.29200744628906,
                -0.21398907899856567,
                85.26668548583984,
                0.10883910953998566,
                85.04585266113281,
                85.37592315673828,
                0.04313718527555466,
                -0.07811850309371948,
                0.1660413295030594,
                85.28984832763672,
                85.2552719116211,
                85.04117584228516,
                85.16708374023438,
                85.06718444824219,
                0.0688321441411972,
                -0.15491041541099548,
                84.9538803100586,
                0.041895076632499695,
                85.24552154541016,
                0.17966841161251068,
                85.18335723876953,
                85.32057189941406,
                0.038420647382736206,
                84.93867492675781,
                -0.2202884554862976,
                -0.06552419066429138,
                85.03028106689453,
                0.17292727530002594,
                -0.16119065880775452,
                85.27903747558594,
                0.12607251107692719,
                -0.10337217152118683,
                85.08370208740234,
                85.22599029541016,
                0.2034342885017395,
                85.30016326904297,
                85.11779022216797,
                85.20285034179688,
                0.0513806976377964,
                0.07114043831825256,
                84.99900817871094,
                0.10535984486341476,
                0.13152331113815308,
                -0.07303991168737411,
                -0.18465262651443481,
                84.99698638916016,
                0.21155627071857452,
                0.030160311609506607,
                0.18195877969264984,
                85.2752685546875,
                0.030764907598495483,
                -0.09844716638326645,
                -0.05858132243156433,
                0.06208305060863495,
                85.14073181152344,
                85.28208923339844,
                85.23918914794922,
                85.24127960205078,
                85.35041046142578,
                0.07439438998699188,
                0.07904495298862457
            ],
            [
                85.06016540527344,
                0.14000792801380157,
                85.16065979003906,
                84.92925262451172,
                -0.2066178172826767,
                84.88878631591797,
                0.014051869511604309,
                84.88314819335938,
                85.08348846435547,
                0.02200447767972946,
                0.07105865329504013,
                -0.07654494047164917,
                85.10238647460938,
                85.06187438964844,
                84.89641571044922,
                84.87401580810547,
                85.18508911132812,
                0.04513980448246002,
                -0.012281867675483227,
                85.08419036865234,
                -0.11687697470188141,
                85.27481842041016,
                0.014307171106338501,
                85.03080749511719,
                85.15081024169922,
                -0.00810016319155693,
                84.8310775756836,
                0.0050489287823438644,
                -0.09031175076961517,
                84.96356201171875,
                -0.2159951776266098,
                0.03577525541186333,
                85.1310806274414,
                0.10825616866350174,
                0.1764800101518631,
                85.16030883789062,
                85.04837036132812,
                -0.12071029841899872,
                85.062744140625,
                85.10050201416016,
                85.0359115600586,
                -0.11584090441465378,
                -0.050235647708177567,
                85.19329071044922,
                0.043080706149339676,
                -0.07935480773448944,
                0.18145237863063812,
                -0.120484858751297,
                85.19820404052734,
                0.11299298703670502,
                0.027381733059883118,
                0.03642115369439125,
                85.1567153930664,
                -0.06708315014839172,
                0.07472258061170578,
                0.15459679067134857,
                -0.12543287873268127,
                85.01737213134766,
                85.04069519042969,
                85.12490844726562,
                85.1820068359375,
                85.00823974609375,
                0.17292837798595428,
                0.10746556520462036
            ],
            [
                0.09987063705921173,
                0.12141026556491852,
                0.04247407615184784,
                -0.1017371341586113,
                0.08557848632335663,
                0.02620166540145874,
                -0.19375883042812347,
                -0.20149365067481995,
                -0.07271309196949005,
                -0.11264204233884811,
                0.16551081836223602,
                0.08510436117649078,
                -0.09624733775854111,
                -0.010364651679992676,
                -0.14720186591148376,
                0.032355546951293945,
                0.079286590218544,
                -0.0993400439620018,
                0.15407516062259674,
                0.2025860995054245,
                0.14562316238880157,
                -0.02270694077014923,
                -0.08265219628810883,
                -0.13499890267848969,
                -0.1503380984067917,
                0.12017922103404999,
                -0.14984048902988434,
                -0.12826451659202576,
                -0.11625491082668304,
                -0.022655025124549866,
                -0.16212362051010132,
                0.18260593712329865,
                0.08999837934970856,
                0.06933648884296417,
                -0.13626517355442047,
                0.1323888748884201,
                0.0391564816236496,
                0.19434423744678497,
                0.1803605705499649,
                0.20818142592906952,
                -0.18276947736740112,
                0.11335773766040802,
                0.04107452929019928,
                0.028480544686317444,
                0.08909828960895538,
                0.05663962662220001,
                0.14421404898166656,
                0.025126799941062927,
                0.038002923130989075,
                -0.08535930514335632,
                -0.0892132967710495,
                -0.11454854160547256,
                -0.15084469318389893,
                0.06954650580883026,
                0.16675697267055511,
                -0.11830739676952362,
                0.10369999706745148,
                0.12356109917163849,
                0.06341023743152618,
                0.18037156760692596,
                -0.08961820602416992,
                -0.1646633893251419,
                -0.16331221163272858,
                0.0025970637798309326
            ],
            [
                0.05508159101009369,
                -0.1622699648141861,
                -0.19786693155765533,
                -0.049060165882110596,
                0.07693465054035187,
                -0.16536855697631836,
                -0.0025237053632736206,
                0.12515126168727875,
                -0.0570281445980072,
                0.1898689717054367,
                0.13535352051258087,
                0.18177910149097443,
                -0.06142646074295044,
                -0.009795039892196655,
                0.104018434882164,
                -0.07565145194530487,
                0.030109956860542297,
                0.19541533291339874,
                0.02032250165939331,
                -0.14328806102275848,
                0.017585083842277527,
                0.10319925844669342,
                -0.1310780644416809,
                0.16650427877902985,
                -0.04406106472015381,
                0.1998893767595291,
                0.18328504264354706,
                -0.18576885759830475,
                0.11120118200778961,
                -0.05236631631851196,
                -0.019467532634735107,
                0.04879210889339447,
                0.07775695621967316,
                -0.0053806304931640625,
                -0.07762686908245087,
                0.06702114641666412,
                -0.05096718668937683,
                -0.12261201441287994,
                0.14840196073055267,
                -0.20980654656887054,
                -0.15446412563323975,
                -0.17278984189033508,
                -0.0487806499004364,
                -0.05885428190231323,
                0.19494636356830597,
                0.08896665275096893,
                0.1530996710062027,
                -0.01018775999546051,
                0.11914677917957306,
                -0.09269986301660538,
                0.010025307536125183,
                0.00160999596118927,
                -0.05039864778518677,
                -0.0121375173330307,
                0.16138045489788055,
                -0.09451964497566223,
                -0.19081167876720428,
                -0.17454086244106293,
                0.12313438951969147,
                -0.08845135569572449,
                -0.07541447877883911,
                0.011484012007713318,
                -0.09484490007162094,
                -0.10285504907369614
            ],
            [
                85.26691436767578,
                -0.09717561304569244,
                85.00553131103516,
                84.94878387451172,
                0.1706404834985733,
                85.22547912597656,
                -0.15215282142162323,
                85.25604248046875,
                85.3211669921875,
                -0.18666818737983704,
                0.1203162744641304,
                0.19019721448421478,
                85.0799560546875,
                85.25641632080078,
                85.33853149414062,
                84.88909149169922,
                85.0577392578125,
                0.17468534409999847,
                0.023508571088314056,
                85.0050277709961,
                -0.10708864033222198,
                84.99492645263672,
                0.0667233020067215,
                85.21880340576172,
                85.07588195800781,
                0.0953342393040657,
                84.97517395019531,
                0.029659492895007133,
                -0.08603572845458984,
                85.15019226074219,
                0.1400139331817627,
                -0.14570432901382446,
                85.29774475097656,
                0.10545045137405396,
                -0.05433085560798645,
                84.97721099853516,
                85.1743392944336,
                0.09123227745294571,
                85.08053588867188,
                85.22405242919922,
                85.19984436035156,
                0.150905579328537,
                0.1159115582704544,
                85.06930541992188,
                -0.05621025711297989,
                -0.0818757489323616,
                0.21347881853580475,
                -0.16433338820934296,
                85.16460418701172,
                0.1152881532907486,
                -0.028870124369859695,
                -0.10386565327644348,
                85.25564575195312,
                0.06362439692020416,
                0.11793257296085358,
                -0.0030147135257720947,
                -0.19508227705955505,
                85.11119842529297,
                85.03551483154297,
                85.00536346435547,
                85.08088684082031,
                84.95125579833984,
                -0.039533499628305435,
                -0.1195480227470398
            ],
            [
                84.90377807617188,
                -0.13843291997909546,
                85.04500579833984,
                85.13611602783203,
                0.028994087129831314,
                84.88597106933594,
                0.0285608172416687,
                85.11593627929688,
                85.26202392578125,
                0.12173248827457428,
                -0.05873854458332062,
                0.13259249925613403,
                85.13819885253906,
                85.0582046508789,
                84.9511489868164,
                85.23339080810547,
                85.27255249023438,
                0.1979123204946518,
                0.17921903729438782,
                84.9014892578125,
                -0.038620203733444214,
                85.04137420654297,
                -0.06627969443798065,
                85.16954040527344,
                85.12706756591797,
                -0.19672845304012299,
                85.20838928222656,
                -0.09260997921228409,
                -0.08039478957653046,
                84.9335708618164,
                0.08243931829929352,
                0.14430418610572815,
                85.07197570800781,
                -0.1618904322385788,
                0.06322287768125534,
                85.26961517333984,
                85.03467559814453,
                0.10653627663850784,
                85.14987182617188,
                85.28976440429688,
                84.96207427978516,
                0.19294601678848267,
                -0.08600560575723648,
                85.12982940673828,
                -0.15941691398620605,
                0.15999412536621094,
                -0.05852906405925751,
                -0.0946512445807457,
                85.19811248779297,
                -0.19846370816230774,
                0.05457320436835289,
                0.162644624710083,
                85.09305572509766,
                -0.075040802359581,
                -0.02447679080069065,
                -0.013311028480529785,
                -0.07034911960363388,
                85.10818481445312,
                85.22647857666016,
                84.99273681640625,
                84.90673065185547,
                85.25203704833984,
                0.194830983877182,
                -0.11232999712228775
            ],
            [
                85.0564193725586,
                -0.13185977935791016,
                85.14763641357422,
                85.03018951416016,
                0.05538481846451759,
                84.9575424194336,
                -0.19299595057964325,
                84.88337707519531,
                85.04487609863281,
                -0.046232257038354874,
                0.037281859666109085,
                -0.1361742913722992,
                85.19234466552734,
                85.20015716552734,
                85.20512390136719,
                84.94945526123047,
                85.10493469238281,
                -0.19802427291870117,
                -0.23569819331169128,
                85.2030029296875,
                0.0818382054567337,
                85.27266693115234,
                -0.026307225227355957,
                84.98359680175781,
                85.12368774414062,
                -0.24095723032951355,
                85.0385971069336,
                -0.061600178480148315,
                0.0774788111448288,
                85.03119659423828,
                -0.10935705155134201,
                0.1450733095407486,
                84.96566009521484,
                -0.013479004614055157,
                -0.21275904774665833,
                85.06763458251953,
                85.01339721679688,
                -0.10806028544902802,
                84.88297271728516,
                85.26089477539062,
                85.1928482055664,
                -0.08271286636590958,
                0.08185936510562897,
                84.95743560791016,
                0.004705182276666164,
                -0.15717609226703644,
                -0.19846783578395844,
                -0.18346016108989716,
                84.76831817626953,
                -0.03764738142490387,
                -0.1457793116569519,
                -0.23760338127613068,
                85.04886627197266,
                -0.16558252274990082,
                -0.21212871372699738,
                0.193614199757576,
                0.11416357010602951,
                85.146484375,
                85.21541595458984,
                84.95625305175781,
                85.09463500976562,
                84.86280822753906,
                0.13436248898506165,
                0.04320722818374634
            ],
            [
                85.16316223144531,
                -0.050880882889032364,
                85.00020599365234,
                85.24981689453125,
                0.0025138556957244873,
                84.95503234863281,
                -0.1572590470314026,
                85.2408676147461,
                85.24693298339844,
                0.14846409857273102,
                -0.03775698319077492,
                -0.19591717422008514,
                85.12020874023438,
                85.17588806152344,
                85.31279754638672,
                85.30552673339844,
                85.20020294189453,
                0.11106254160404205,
                0.12048168480396271,
                85.21498107910156,
                0.05756880342960358,
                85.25450134277344,
                -0.013974592089653015,
                85.19536590576172,
                85.23152923583984,
                -0.042399875819683075,
                85.24662780761719,
                -0.00020615923858713359,
                -0.07845617830753326,
                85.30174255371094,
                0.13364246487617493,
                -0.2315342277288437,
                84.98944091796875,
                0.11528467386960983,
                -0.01698904111981392,
                85.41787719726562,
                85.24705505371094,
                0.12005056440830231,
                85.3567123413086,
                85.26631164550781,
                85.26687622070312,
                0.054242055863142014,
                -0.10933700948953629,
                84.98014068603516,
                0.12662452459335327,
                0.047695498913526535,
                -0.003196820616722107,
                0.1616896539926529,
                85.12297821044922,
                0.14474739134311676,
                0.058880772441625595,
                -0.03172510862350464,
                85.03852081298828,
                0.0020728707313537598,
                0.11652330309152603,
                -0.02162165939807892,
                -0.18133996427059174,
                85.35308837890625,
                85.2132797241211,
                85.26119995117188,
                85.17005920410156,
                84.9806900024414,
                -0.057060934603214264,
                0.17448069155216217
            ],
            [
                -0.059877991676330566,
                -0.030398666858673096,
                0.12077252566814423,
                -0.14747214317321777,
                -0.07360243797302246,
                -0.00974130630493164,
                0.015329122543334961,
                -0.14094749093055725,
                -0.09267431497573853,
                0.05881984531879425,
                0.06553126871585846,
                -0.06725132465362549,
                -0.015930235385894775,
                -0.2005552053451538,
                0.052934810519218445,
                -0.00772269070148468,
                0.008671090006828308,
                0.19298313558101654,
                0.06418628990650177,
                0.09885941445827484,
                -0.07424235343933105,
                0.20732881128787994,
                -0.1139054149389267,
                0.10264207422733307,
                -0.04592853784561157,
                -0.09160414338111877,
                0.01598721742630005,
                0.18600012362003326,
                0.14552219212055206,
                0.03840537369251251,
                -0.05979256331920624,
                0.07380060851573944,
                0.17746539413928986,
                -0.14499278366565704,
                -0.14486131072044373,
                0.14749093353748322,
                -0.05526071786880493,
                0.14986903965473175,
                -0.19646935164928436,
                0.04182557761669159,
                0.21623803675174713,
                0.1811446100473404,
                0.039837852120399475,
                -0.14671386778354645,
                -0.057604119181632996,
                0.04066230356693268,
                -0.16811242699623108,
                0.01854659616947174,
                -0.045637816190719604,
                -0.18865683674812317,
                -0.06474252045154572,
                0.1741146594285965,
                -0.045528024435043335,
                0.08788524568080902,
                -0.20445048809051514,
                -0.04283970594406128,
                0.08535207808017731,
                -0.15828992426395416,
                0.12832723557949066,
                -0.13321122527122498,
                -0.19764626026153564,
                -0.16955605149269104,
                0.1499951332807541,
                -0.015408053994178772
            ],
            [
                85.08773803710938,
                -0.1005953699350357,
                85.34152221679688,
                85.1086654663086,
                0.16203872859477997,
                85.16336059570312,
                -0.06132090091705322,
                85.01110076904297,
                85.1817855834961,
                -0.16623543202877045,
                -0.07912231236696243,
                -0.16053269803524017,
                85.18798828125,
                85.1164321899414,
                84.9793701171875,
                85.3342514038086,
                85.3056869506836,
                -0.09238731116056442,
                -0.1282646656036377,
                85.3652572631836,
                -0.1281490921974182,
                85.0314712524414,
                0.03251148760318756,
                85.16803741455078,
                85.21684265136719,
                0.17313678562641144,
                85.19034576416016,
                0.08453371375799179,
                -0.09432509541511536,
                85.15120697021484,
                0.20194368064403534,
                0.1315193921327591,
                85.13289642333984,
                -0.09492418169975281,
                -0.14323803782463074,
                85.05294036865234,
                85.30929565429688,
                -0.2126333862543106,
                85.12641143798828,
                85.12601470947266,
                85.31703186035156,
                0.11517384648323059,
                0.20548109710216522,
                85.36325073242188,
                -0.09490781277418137,
                -0.01229817420244217,
                -0.060364097356796265,
                -0.05086154490709305,
                85.07472229003906,
                -0.023474738001823425,
                0.18342998623847961,
                0.013483265414834023,
                85.04278564453125,
                -0.1829604208469391,
                0.08077806979417801,
                -0.0026787221431732178,
                0.12486570328474045,
                85.10586547851562,
                85.24345397949219,
                85.10738372802734,
                85.16178894042969,
                85.00670623779297,
                -0.06400716304779053,
                -0.2007296234369278
            ],
            [
                85.14043426513672,
                -0.1736917644739151,
                85.12764739990234,
                85.12239837646484,
                -0.12615621089935303,
                85.17501068115234,
                -0.09140515327453613,
                85.35111236572266,
                85.06716918945312,
                -0.04990990832448006,
                0.07794848829507828,
                0.19102086126804352,
                85.00826263427734,
                85.2883071899414,
                85.04652404785156,
                85.21684265136719,
                85.44036865234375,
                0.20739541947841644,
                0.0035315752029418945,
                85.21549224853516,
                0.09117771685123444,
                85.06167602539062,
                -0.11463365703821182,
                85.01493835449219,
                84.98621368408203,
                0.055260997265577316,
                85.33446502685547,
                0.04701169580221176,
                -0.19278477132320404,
                85.04257202148438,
                0.07679713517427444,
                0.1852300614118576,
                85.30265045166016,
                -0.20176294445991516,
                0.05402638018131256,
                85.03762817382812,
                85.32000732421875,
                -0.17096129059791565,
                85.15804290771484,
                85.39282989501953,
                85.2328109741211,
                -0.027969427406787872,
                -0.14280053973197937,
                85.30233764648438,
                0.12220267951488495,
                -0.014053618535399437,
                -0.1917150914669037,
                0.11255650222301483,
                84.95174407958984,
                -0.027044251561164856,
                0.10956782102584839,
                0.13393047451972961,
                85.37074279785156,
                -0.12189672887325287,
                -0.03082343377172947,
                -0.09930066019296646,
                -0.054265160113573074,
                85.27537536621094,
                84.99922943115234,
                85.06108856201172,
                85.08084869384766,
                85.22345733642578,
                -0.16952911019325256,
                -0.12906023859977722
            ],
            [
                85.02224731445312,
                -0.0934743583202362,
                85.3790283203125,
                85.0829086303711,
                0.1077713742852211,
                85.04811096191406,
                -0.11808672547340393,
                85.12853240966797,
                85.40962219238281,
                0.04980438947677612,
                0.1546754390001297,
                -0.0883394405245781,
                85.2341079711914,
                85.43111419677734,
                85.23517608642578,
                85.17472839355469,
                85.26058197021484,
                0.15284420549869537,
                0.052500173449516296,
                85.28770446777344,
                0.02080865204334259,
                85.3543472290039,
                -0.11719443649053574,
                85.1354751586914,
                85.07332611083984,
                -0.16052398085594177,
                85.31727600097656,
                -0.12253062427043915,
                -0.12820298969745636,
                85.12993621826172,
                -0.08857470750808716,
                -0.013191230595111847,
                85.0577163696289,
                -0.040924057364463806,
                -0.012743934988975525,
                85.38140106201172,
                85.2291030883789,
                -0.13399314880371094,
                85.12891387939453,
                85.10482788085938,
                85.32007598876953,
                -0.006279319524765015,
                -0.15300019085407257,
                85.28759765625,
                0.16165465116500854,
                -0.0009477502899244428,
                0.1785767376422882,
                -0.23474831879138947,
                85.26571655273438,
                -0.11250174045562744,
                0.13640616834163666,
                -0.14558285474777222,
                85.10379028320312,
                0.12575609982013702,
                0.1675954908132553,
                0.08776800334453583,
                -0.09795176237821579,
                85.2582778930664,
                85.18772888183594,
                85.38805389404297,
                85.01231384277344,
                85.18260192871094,
                0.059635236859321594,
                -0.0973299965262413
            ],
            [
                -0.1744866669178009,
                0.21363835036754608,
                0.1193569153547287,
                -0.04504677653312683,
                0.04912535846233368,
                -0.09414777904748917,
                -0.08959151804447174,
                -0.025836870074272156,
                0.11923138797283173,
                -0.187968447804451,
                0.20426268875598907,
                -0.07066613435745239,
                0.18637718260288239,
                -0.1839776188135147,
                0.16758982837200165,
                0.02720049023628235,
                0.11953715980052948,
                0.07702572643756866,
                -0.02711734175682068,
                -0.12251166999340057,
                -0.027724996209144592,
                -0.04845374822616577,
                0.16054685413837433,
                -0.05832146108150482,
                0.011777997016906738,
                0.21323411166667938,
                0.07289142906665802,
                -0.02270953357219696,
                0.15676851570606232,
                0.1672237068414688,
                0.05891917645931244,
                0.061221376061439514,
                -0.18235570192337036,
                0.1172957569360733,
                -0.14653128385543823,
                -0.1997610479593277,
                -0.13753026723861694,
                0.028805598616600037,
                -0.15088851749897003,
                -0.03449226915836334,
                -0.156084343791008,
                0.1900593787431717,
                0.039811864495277405,
                0.0533040314912796,
                0.09445451200008392,
                0.1253623217344284,
                0.13688541948795319,
                -0.022025838494300842,
                0.07130227982997894,
                0.21169142425060272,
                0.0004327744245529175,
                0.09590886533260345,
                -0.05870772898197174,
                -0.017751410603523254,
                -0.21135486662387848,
                0.07080133259296417,
                -0.09647022932767868,
                0.011533364653587341,
                -0.1690947413444519,
                -0.1442381739616394,
                0.15332509577274323,
                0.15180154144763947,
                0.20552603900432587,
                0.09228314459323883
            ],
            [
                85.3870620727539,
                -0.12466743588447571,
                85.25231170654297,
                85.42803955078125,
                -0.13729694485664368,
                85.31785583496094,
                0.019558072090148926,
                85.23711395263672,
                85.25602722167969,
                -0.10486254096031189,
                -0.0056161582469940186,
                -0.010995492339134216,
                85.18830871582031,
                85.33843231201172,
                85.073974609375,
                85.28617858886719,
                85.10392761230469,
                -0.13197124004364014,
                0.14985553920269012,
                85.22904968261719,
                -0.008578836917877197,
                85.04642486572266,
                -0.11926311999559402,
                85.0827865600586,
                85.38973236083984,
                0.007720887660980225,
                85.09009552001953,
                0.1933331936597824,
                -0.13605152070522308,
                85.0645980834961,
                0.14018015563488007,
                0.17974285781383514,
                85.14404296875,
                0.03657917305827141,
                -0.02834196388721466,
                85.12923431396484,
                85.09852600097656,
                -0.04187798500061035,
                85.22594451904297,
                85.3489761352539,
                85.29224395751953,
                0.12217569351196289,
                0.13369137048721313,
                85.14817810058594,
                0.00024903714074753225,
                -0.13937504589557648,
                -0.1881343573331833,
                -0.08432373404502869,
                85.0759048461914,
                -0.09795314073562622,
                -0.2120262086391449,
                -0.20006071031093597,
                85.32723236083984,
                0.03857181966304779,
                -0.20371678471565247,
                0.08044613897800446,
                -0.0715545043349266,
                85.11659240722656,
                85.05594635009766,
                85.09056854248047,
                85.01970672607422,
                85.31788635253906,
                -0.2011251300573349,
                -0.11392808705568314
            ],
            [
                0.09444743394851685,
                0.12268273532390594,
                -0.05221854895353317,
                -0.19263909757137299,
                -0.185165137052536,
                -0.09619268774986267,
                0.011846020817756653,
                -0.1896800845861435,
                -0.05189213901758194,
                -0.05739293992519379,
                0.05216129124164581,
                0.20054878294467926,
                -0.18358244001865387,
                0.18282859027385712,
                -0.12482275068759918,
                -0.11037259548902512,
                0.13555777072906494,
                -0.06564679741859436,
                0.17236779630184174,
                0.21796265244483948,
                0.21056224405765533,
                0.00014444926637224853,
                0.02770848572254181,
                -0.18001683056354523,
                0.09541546553373337,
                0.016750602051615715,
                -0.13363632559776306,
                -0.04903204366564751,
                -0.18630476295948029,
                -0.11242605745792389,
                0.1472078412771225,
                0.025842374190688133,
                0.033537134528160095,
                -0.19961261749267578,
                0.046341672539711,
                -0.1399504393339157,
                -0.0099143385887146,
                -0.05697880685329437,
                -0.12292809784412384,
                -0.08642575889825821,
                0.12932661175727844,
                -0.0294191837310791,
                0.024778667837381363,
                -0.18017201125621796,
                0.06664207577705383,
                0.09819719940423965,
                -0.14522472023963928,
                -0.06999042630195618,
                0.05011426657438278,
                0.015153467655181885,
                -0.026450874283909798,
                0.2013082206249237,
                -0.11813956499099731,
                -0.18637889623641968,
                0.1367904245853424,
                0.12221114337444305,
                -0.15526001155376434,
                -0.09485024958848953,
                0.0033173770643770695,
                0.047524843364953995,
                -0.1309785395860672,
                -0.07746688276529312,
                -0.17065751552581787,
                0.18618690967559814
            ],
            [
                85.30367279052734,
                0.13190729916095734,
                85.190673828125,
                85.11598205566406,
                0.04352344572544098,
                85.02500915527344,
                0.028624355792999268,
                85.2244644165039,
                85.05896759033203,
                0.1513608694076538,
                0.1450965702533722,
                0.1993449181318283,
                85.43150329589844,
                85.04436492919922,
                85.17726135253906,
                84.95597076416016,
                85.22290802001953,
                -0.19088265299797058,
                0.1965535432100296,
                85.1827163696289,
                -0.11273784190416336,
                84.993408203125,
                0.09194065630435944,
                85.21186828613281,
                85.06632995605469,
                0.1585715413093567,
                84.99348449707031,
                -0.1973908394575119,
                0.16482950747013092,
                85.22215270996094,
                0.18678513169288635,
                -0.07485389709472656,
                85.24542999267578,
                -0.14014899730682373,
                0.08536338061094284,
                85.43022155761719,
                85.07928466796875,
                -0.06446218490600586,
                85.291259765625,
                85.38553619384766,
                85.05934143066406,
                0.18342308700084686,
                0.18040277063846588,
                85.38938903808594,
                0.1294378936290741,
                0.07482391595840454,
                0.19900311529636383,
                0.09577421844005585,
                85.1258773803711,
                -0.03145015239715576,
                -0.1598147451877594,
                -0.07014088332653046,
                85.38854217529297,
                -0.1415313482284546,
                -0.13851824402809143,
                0.04547871649265289,
                0.0997593104839325,
                85.34869384765625,
                85.05046081542969,
                85.07373046875,
                84.9933853149414,
                85.36456298828125,
                -0.023996755480766296,
                0.046093568205833435
            ],
            [
                85.2896728515625,
                0.17730671167373657,
                85.28436279296875,
                84.96702575683594,
                0.20410887897014618,
                84.97603607177734,
                -0.054809242486953735,
                85.21546936035156,
                85.36390686035156,
                0.1794682890176773,
                0.06288226693868637,
                -0.11855211853981018,
                84.98297882080078,
                85.32417297363281,
                85.2439956665039,
                85.18843078613281,
                85.05529022216797,
                -0.021692737936973572,
                0.17050781846046448,
                85.22315979003906,
                -0.0636686310172081,
                85.0676040649414,
                0.19879896938800812,
                85.28070068359375,
                84.95011901855469,
                -0.15157371759414673,
                85.25225830078125,
                -0.12147342413663864,
                0.07515116035938263,
                85.3497314453125,
                -0.03896726667881012,
                0.19729895889759064,
                84.97386932373047,
                -0.004355573561042547,
                0.021220652386546135,
                85.00637817382812,
                85.21147918701172,
                0.005222040694206953,
                85.28009796142578,
                85.3359375,
                85.34273529052734,
                0.12166491150856018,
                0.08966667205095291,
                85.31596374511719,
                -0.1261635273694992,
                -0.13592594861984253,
                0.042000070214271545,
                -0.16057339310646057,
                85.09062957763672,
                -0.11274517327547073,
                -0.02462846040725708,
                0.18308411538600922,
                85.09567260742188,
                0.027788445353507996,
                -0.010545790195465088,
                -0.19593122601509094,
                0.13582319021224976,
                85.19102478027344,
                85.28034973144531,
                85.14962768554688,
                85.00940704345703,
                85.03654479980469,
                0.1743842214345932,
                0.10009016841650009
            ],
            [
                -0.06726959347724915,
                0.068923220038414,
                0.17926524579524994,
                -0.18754826486110687,
                -0.07659836113452911,
                -0.054234981536865234,
                0.030140161514282227,
                -0.02149467170238495,
                0.0679837316274643,
                -0.11622796952724457,
                -0.20227500796318054,
                0.18018986284732819,
                -0.007470637559890747,
                0.04140876233577728,
                -0.1320117563009262,
                0.14302124083042145,
                0.07871828973293304,
                -0.15989042818546295,
                0.1554103046655655,
                -0.10929355770349503,
                -0.15366819500923157,
                0.14410783350467682,
                0.16191302239894867,
                -0.11992570757865906,
                -0.003873080015182495,
                0.055226221680641174,
                -0.03073790669441223,
                0.18368513882160187,
                -0.050539836287498474,
                -0.1507950872182846,
                -0.18739789724349976,
                -0.04301014542579651,
                0.21629281342029572,
                0.15134038031101227,
                0.020809993147850037,
                -0.0295867919921875,
                0.05936054885387421,
                0.09837041795253754,
                0.014221325516700745,
                -0.1999686062335968,
                -0.12030371278524399,
                0.11062727868556976,
                0.20695294439792633,
                -0.04079614579677582,
                -0.10153184831142426,
                0.1402244120836258,
                -0.09071831405162811,
                -0.030538395047187805,
                -0.018992945551872253,
                -0.006654277443885803,
                0.1837383657693863,
                0.024689748883247375,
                0.1587160974740982,
                0.07336215674877167,
                -0.19745682179927826,
                -0.04118335247039795,
                0.010570362210273743,
                -0.038781195878982544,
                -0.06725266575813293,
                -0.0761617124080658,
                0.11000312864780426,
                -0.014466986060142517,
                0.07092691957950592,
                0.03571285307407379
            ],
            [
                85.04112243652344,
                -0.11933748424053192,
                84.95600128173828,
                85.28527069091797,
                -0.2191469520330429,
                85.08841705322266,
                -0.12369689345359802,
                85.08977508544922,
                85.2213363647461,
                0.1538931280374527,
                -0.0060080052353441715,
                -0.05937492102384567,
                85.0128402709961,
                85.26123046875,
                85.03923797607422,
                85.27906036376953,
                85.28802490234375,
                0.014743760228157043,
                -0.007101829629391432,
                85.2787857055664,
                0.2014438509941101,
                85.3370361328125,
                -0.07708673179149628,
                85.19271850585938,
                85.1040267944336,
                0.027218913659453392,
                85.17902374267578,
                0.1194620355963707,
                -0.004891484975814819,
                85.13770294189453,
                0.07212541997432709,
                0.13982395827770233,
                85.14762878417969,
                0.12969781458377838,
                -0.1311035454273224,
                85.07198333740234,
                85.26335906982422,
                -0.1958267241716385,
                85.10833740234375,
                85.19805145263672,
                85.2301254272461,
                -0.18609876930713654,
                0.11831696331501007,
                84.94915008544922,
                -0.08004909753799438,
                0.027703743427991867,
                0.12797382473945618,
                -0.16964872181415558,
                85.03706359863281,
                -0.09823188930749893,
                -0.06170375645160675,
                -0.23391345143318176,
                85.14727783203125,
                0.04001365602016449,
                -0.06714247912168503,
                -0.21033243834972382,
                -0.08403082937002182,
                84.98440551757812,
                84.98918151855469,
                85.1223373413086,
                85.23503112792969,
                85.29595184326172,
                -0.006843484938144684,
                -0.06501249969005585
            ],
            [
                85.00434112548828,
                -0.1331954151391983,
                85.14459228515625,
                84.91756439208984,
                -0.10436246544122696,
                85.16569519042969,
                -0.06988854706287384,
                84.83087158203125,
                85.22218322753906,
                -0.02490472048521042,
                -0.1260119527578354,
                -0.10437376797199249,
                85.00000762939453,
                85.14757537841797,
                85.0549087524414,
                84.90618133544922,
                85.23270416259766,
                -0.17790979146957397,
                -0.09629782289266586,
                85.22086334228516,
                0.11472244560718536,
                84.95306396484375,
                -0.06414023041725159,
                85.2214584350586,
                85.1955795288086,
                -0.09001584351062775,
                84.7821044921875,
                -0.012042172253131866,
                0.035991743206977844,
                85.25292205810547,
                0.11400545388460159,
                -0.11882103979587555,
                85.1305923461914,
                -0.09203687310218811,
                -0.028183024376630783,
                85.19613647460938,
                85.00745391845703,
                -0.19324448704719543,
                85.08147430419922,
                85.27256774902344,
                85.1041030883789,
                0.12384001910686493,
                -0.14543288946151733,
                85.17896270751953,
                0.1409824788570404,
                0.07556770741939545,
                0.174671471118927,
                0.14292386174201965,
                85.16970825195312,
                0.16071628034114838,
                0.11532644927501678,
                0.02402045764029026,
                85.23597717285156,
                0.13440941274166107,
                -0.1186785027384758,
                -0.142889142036438,
                -0.075388602912426,
                85.0313720703125,
                85.31999206542969,
                85.22589874267578,
                84.79657745361328,
                85.2396469116211,
                -0.09920954704284668,
                0.10129628330469131
            ],
            [
                85.21090698242188,
                -0.0813949853181839,
                85.0733871459961,
                85.27900695800781,
                0.004108138848096132,
                85.09178161621094,
                -0.08463236689567566,
                85.00759887695312,
                85.2051773071289,
                -0.12734989821910858,
                -0.1503583937883377,
                -0.0567563995718956,
                84.90370178222656,
                85.06949615478516,
                84.92434692382812,
                85.23652648925781,
                85.31587219238281,
                -0.1289931833744049,
                -0.07475681602954865,
                85.2945556640625,
                -0.18261496722698212,
                85.09676361083984,
                0.1412942260503769,
                84.92415618896484,
                84.97978973388672,
                -0.14181986451148987,
                84.76451873779297,
                0.09993363916873932,
                -0.20448698103427887,
                85.18647003173828,
                -0.055767450481653214,
                0.13042336702346802,
                85.14968872070312,
                -0.17032065987586975,
                0.17171823978424072,
                84.94810485839844,
                84.89266967773438,
                0.02162765897810459,
                85.28471374511719,
                84.97098541259766,
                85.10440063476562,
                -0.1527341604232788,
                0.041121866554021835,
                85.17216491699219,
                0.18141154944896698,
                0.1715213805437088,
                0.05704129859805107,
                -0.19930730760097504,
                85.01776123046875,
                0.04561738669872284,
                0.15236862003803253,
                0.13508175313472748,
                85.16436767578125,
                -0.16646407544612885,
                -0.0197706688195467,
                -0.020229488611221313,
                -0.10190282016992569,
                84.89649200439453,
                84.92101287841797,
                85.10877227783203,
                85.12422180175781,
                85.04010009765625,
                -0.05495569854974747,
                0.08610819280147552
            ],
            [
                85.20399475097656,
                0.02066141925752163,
                85.0324935913086,
                85.34564971923828,
                0.06701831519603729,
                85.24957275390625,
                -0.08353111147880554,
                85.18024444580078,
                85.3187255859375,
                0.0564129613339901,
                0.07615742087364197,
                0.1696973592042923,
                85.10997009277344,
                85.18766784667969,
                85.09156036376953,
                85.26624298095703,
                85.15909576416016,
                -0.0519753098487854,
                0.19175435602664948,
                85.17676544189453,
                -0.01597137749195099,
                85.09927368164062,
                0.14083673059940338,
                84.96121978759766,
                85.09370422363281,
                -0.1554924100637436,
                85.00331115722656,
                0.07175859063863754,
                0.11716543138027191,
                85.10140991210938,
                0.12224656343460083,
                -0.08988510072231293,
                84.99295043945312,
                0.20623387396335602,
                -0.20815545320510864,
                85.11131286621094,
                85.10071563720703,
                0.03193075582385063,
                85.22547149658203,
                85.43138122558594,
                85.27913665771484,
                -0.2059723287820816,
                0.1554528772830963,
                85.08858489990234,
                -0.09972724318504333,
                0.09012208133935928,
                -0.19214138388633728,
                -0.16234663128852844,
                84.94871520996094,
                -0.19615045189857483,
                -0.1537322700023651,
                -0.1912742406129837,
                85.18846130371094,
                0.024166062474250793,
                0.12930403649806976,
                0.03217478096485138,
                0.15539343655109406,
                85.3277587890625,
                85.00679779052734,
                85.00923156738281,
                85.19207000732422,
                85.30314636230469,
                -0.1702014058828354,
                -0.12053806334733963
            ],
            [
                0.08776192367076874,
                0.17763449251651764,
                0.11771221458911896,
                -0.17654921114444733,
                -0.21003593504428864,
                0.11137567460536957,
                0.03611306846141815,
                -0.013625234365463257,
                0.0036003291606903076,
                0.2157985419034958,
                -0.08219030499458313,
                -0.07783742249011993,
                -0.19861969351768494,
                -0.11013159155845642,
                0.016264617443084717,
                0.07064424455165863,
                0.035521283745765686,
                -0.12457163631916046,
                0.04344601929187775,
                -0.0360201895236969,
                -0.0930868536233902,
                0.032371193170547485,
                0.030017763376235962,
                -0.1326882243156433,
                0.06265778839588165,
                0.0852152556180954,
                -0.08146965503692627,
                0.18438215553760529,
                -0.08420112729072571,
                -0.18085868656635284,
                0.15857084095478058,
                -0.07503177225589752,
                -0.2047555148601532,
                -0.11890281736850739,
                -0.08941110968589783,
                0.07183028757572174,
                -0.049767300486564636,
                -0.013965457677841187,
                0.2095661610364914,
                -0.046731993556022644,
                0.12763862311840057,
                0.20487923920154572,
                -0.13664251565933228,
                0.19948230683803558,
                0.1489550620317459,
                -0.05797809362411499,
                0.0644368976354599,
                0.20406220853328705,
                -0.005732983350753784,
                -0.02671682834625244,
                0.05298028886318207,
                -0.10834366083145142,
                0.1311473399400711,
                0.21516673266887665,
                0.11528225243091583,
                -0.021772384643554688,
                0.11833138763904572,
                0.001827836036682129,
                0.09567715227603912,
                -0.10670697689056396,
                -0.1727297008037567,
                -0.05800272524356842,
                -0.035560429096221924,
                0.18271996080875397
            ],
            [
                84.98021697998047,
                -0.0409710556268692,
                85.29029846191406,
                84.97776794433594,
                0.044330671429634094,
                85.1054916381836,
                0.08726401627063751,
                85.03671264648438,
                85.20266723632812,
                -0.1905108541250229,
                -0.09187859296798706,
                0.07636107504367828,
                85.3271484375,
                85.26862335205078,
                85.27681732177734,
                85.232666015625,
                85.3033676147461,
                0.08952023088932037,
                -0.010602970607578754,
                85.27153778076172,
                -0.018259067088365555,
                85.2192153930664,
                0.08342711627483368,
                85.0765151977539,
                84.89606475830078,
                0.09711457788944244,
                85.0003890991211,
                0.15921558439731598,
                -0.11312741041183472,
                85.0378646850586,
                0.1544739156961441,
                -0.12526440620422363,
                85.29426574707031,
                0.11044196784496307,
                -0.1601826250553131,
                85.14735412597656,
                85.22991943359375,
                -0.08734483271837234,
                85.0394515991211,
                85.0759048461914,
                85.07166290283203,
                -0.21904747188091278,
                -0.008617072366178036,
                84.9872055053711,
                -0.15652568638324738,
                0.06513851135969162,
                -0.031487882137298584,
                -0.20684856176376343,
                85.29612731933594,
                -0.11150151491165161,
                -0.006482998374849558,
                -0.06299568712711334,
                84.99160766601562,
                -0.03273969888687134,
                0.000926971435546875,
                0.15113787353038788,
                0.09507830440998077,
                85.09244537353516,
                85.21784210205078,
                85.30708312988281,
                84.90867614746094,
                85.2206802368164,
                -0.16904443502426147,
                -0.206025630235672
            ],
            [
                84.85809326171875,
                -0.20816349983215332,
                85.0426025390625,
                85.240478515625,
                0.18366120755672455,
                85.11186981201172,
                0.09521888196468353,
                85.10108947753906,
                85.0022964477539,
                -0.1939462274312973,
                0.09712574630975723,
                -0.1953476369380951,
                85.08417510986328,
                85.25599670410156,
                84.88934326171875,
                85.14794158935547,
                85.24469757080078,
                0.09349603950977325,
                0.056324053555727005,
                84.9391860961914,
                -0.08960206061601639,
                85.1335220336914,
                -0.13070335984230042,
                84.83294677734375,
                84.96463775634766,
                -0.14379462599754333,
                84.96870422363281,
                0.11137638986110687,
                0.1722065955400467,
                85.14817810058594,
                -0.16924521327018738,
                -0.020972799509763718,
                85.21744537353516,
                0.005414969753473997,
                0.052747759968042374,
                84.99510192871094,
                84.98981475830078,
                0.1154390275478363,
                85.0099868774414,
                84.96295166015625,
                85.1922607421875,
                -0.15826809406280518,
                0.1458883285522461,
                85.07178497314453,
                -0.036833927035331726,
                -0.18633022904396057,
                -0.0480826273560524,
                -0.13411489129066467,
                85.20816040039062,
                -0.08879755437374115,
                0.164630725979805,
                -0.16645875573158264,
                84.95332336425781,
                -0.20352274179458618,
                -0.11231154203414917,
                -0.1895638406276703,
                0.003974600229412317,
                85.22166442871094,
                85.27293395996094,
                85.05266571044922,
                84.78327941894531,
                85.18700408935547,
                0.10263713449239731,
                0.06386213004589081
            ],
            [
                84.95489501953125,
                0.1464943140745163,
                85.12881469726562,
                85.27647399902344,
                -0.003320814110338688,
                85.19420623779297,
                0.10901351273059845,
                84.89513397216797,
                85.2077865600586,
                -0.004075020086020231,
                -0.07764562219381332,
                0.20457303524017334,
                85.03911590576172,
                85.12774658203125,
                85.17022705078125,
                85.04546356201172,
                85.17524719238281,
                0.04756481945514679,
                -0.04899141192436218,
                84.96361541748047,
                -0.14548279345035553,
                85.05024719238281,
                -0.19911719858646393,
                85.18367004394531,
                84.97319030761719,
                -0.07876835763454437,
                85.17159271240234,
                0.1580759584903717,
                -0.18588149547576904,
                85.28865051269531,
                0.01695016771554947,
                0.029095934703946114,
                85.21021270751953,
                -0.030902668833732605,
                -0.007458493113517761,
                85.37596130371094,
                85.39431762695312,
                -0.041648294776678085,
                85.13043212890625,
                84.99939727783203,
                85.14171600341797,
                -0.20903125405311584,
                -0.18672719597816467,
                85.30317687988281,
                -0.1300976425409317,
                -0.01746886409819126,
                0.02416210249066353,
                -0.10429830849170685,
                85.09192657470703,
                -0.17958860099315643,
                0.13425098359584808,
                -0.12075891345739365,
                84.98912048339844,
                0.06586261093616486,
                -0.024504035711288452,
                0.16692517697811127,
                -0.1332266926765442,
                85.29084014892578,
                85.2985610961914,
                85.1681137084961,
                85.23788452148438,
                85.00348663330078,
                -0.19410942494869232,
                -0.10213243216276169
            ],
            [
                0.046007730066776276,
                0.14987735450267792,
                -0.1819293200969696,
                -0.11798740923404694,
                -3.4168362617492676e-05,
                -0.0950898826122284,
                -0.08002276718616486,
                0.09805146604776382,
                -0.16429801285266876,
                0.04847376048564911,
                -0.011281728744506836,
                0.07589329779148102,
                -0.12011860311031342,
                -0.11646471917629242,
                -0.11948709189891815,
                -0.1778852790594101,
                0.058091066777706146,
                -0.20462284982204437,
                0.03651900961995125,
                -0.18784384429454803,
                0.03140972554683685,
                0.19417747855186462,
                0.03704209625720978,
                0.09277398884296417,
                0.09686057269573212,
                0.16163118183612823,
                0.19619490206241608,
                -0.09651834517717361,
                -0.2114427089691162,
                -0.13924703001976013,
                -0.04056079313158989,
                0.12844260036945343,
                0.17525726556777954,
                0.057233259081840515,
                0.06474964320659637,
                -0.1516680121421814,
                0.08324949443340302,
                0.1950201839208603,
                -0.0322902612388134,
                0.15332303941249847,
                0.11788778752088547,
                -0.006157860159873962,
                -0.14560940861701965,
                -0.16539983451366425,
                0.17854709923267365,
                0.13036151230335236,
                -0.15556985139846802,
                -0.15912874042987823,
                -0.10234687477350235,
                -0.1585678905248642,
                -0.14965276420116425,
                -0.03192314878106117,
                0.11764577031135559,
                -0.015559718012809753,
                -0.19633358716964722,
                0.08109836280345917,
                -0.09953927248716354,
                0.010330293327569962,
                0.16144965589046478,
                -0.02162753976881504,
                0.027891933917999268,
                -0.19089633226394653,
                0.12129060924053192,
                -0.08987018465995789
            ],
            [
                84.91339111328125,
                -0.19115394353866577,
                84.91190338134766,
                84.92274475097656,
                0.10792594403028488,
                85.02735900878906,
                -0.06885156035423279,
                84.87086486816406,
                85.1767349243164,
                0.0717044249176979,
                -0.09710505604743958,
                -0.02190566062927246,
                85.17536926269531,
                85.16590118408203,
                85.06246185302734,
                85.24817657470703,
                85.35543823242188,
                -0.049287185072898865,
                -0.21059249341487885,
                85.0206527709961,
                0.09188489615917206,
                85.14350128173828,
                0.09289209544658661,
                85.04280090332031,
                85.14794921875,
                0.0959540605545044,
                85.0728988647461,
                -0.1354503184556961,
                -0.13077089190483093,
                85.24984741210938,
                -0.2258400171995163,
                -0.18138201534748077,
                85.26992797851562,
                0.033224135637283325,
                -0.21274827420711517,
                85.25397491455078,
                85.0261001586914,
                0.026973724365234375,
                84.91950988769531,
                85.36372375488281,
                84.91036224365234,
                -0.03582921251654625,
                -0.16965262591838837,
                85.23563385009766,
                -0.07557488977909088,
                -0.2375473976135254,
                0.17240343987941742,
                0.11611493676900864,
                85.21977233886719,
                0.18314950168132782,
                -0.19410842657089233,
                0.029796304181218147,
                85.04210662841797,
                -0.13469919562339783,
                0.12515778839588165,
                0.12765638530254364,
                -0.04366464912891388,
                85.23941802978516,
                85.2021484375,
                85.0494155883789,
                84.94413757324219,
                84.95870208740234,
                0.18217898905277252,
                -0.1203865110874176
            ],
            [
                -0.06757946312427521,
                0.10510163009166718,
                -0.11469674110412598,
                -0.17295558750629425,
                0.1122208684682846,
                0.03639499843120575,
                0.12172038853168488,
                -0.11093179136514664,
                0.2116537243127823,
                0.18162818253040314,
                -0.10260774195194244,
                0.09768973290920258,
                -0.19062131643295288,
                0.016962260007858276,
                0.07459522783756256,
                0.18591700494289398,
                0.08195813000202179,
                0.10870809853076935,
                -0.0797029435634613,
                -0.20234531164169312,
                0.1817769557237625,
                -0.2066885381937027,
                -0.16218072175979614,
                0.13422127068042755,
                0.06215594708919525,
                -0.18663233518600464,
                0.1829320639371872,
                -0.014886602759361267,
                0.197946235537529,
                0.1041441410779953,
                -0.14344915747642517,
                0.10289599001407623,
                0.15654121339321136,
                -0.14402182400226593,
                0.1292835921049118,
                -0.18112334609031677,
                0.03320787847042084,
                0.20273064076900482,
                -0.001175522804260254,
                0.1617470532655716,
                0.21048976480960846,
                0.03827853500843048,
                0.10710696876049042,
                0.07069309055805206,
                0.12239597737789154,
                -0.06565696001052856,
                -0.11814355105161667,
                0.14837120473384857,
                -0.21561746299266815,
                0.18583230674266815,
                0.12355048954486847,
                -0.1752939373254776,
                0.19339676201343536,
                -0.17737939953804016,
                0.13589675724506378,
                -0.06711912155151367,
                -0.07011328637599945,
                0.11491338908672333,
                0.00590398907661438,
                0.0521845668554306,
                0.04436282813549042,
                -0.119208924472332,
                0.11255867779254913,
                0.05837772786617279
            ],
            [
                85.16128540039062,
                -0.20471736788749695,
                85.17656707763672,
                85.08618927001953,
                0.0553407222032547,
                85.15550994873047,
                -0.1610962450504303,
                84.92991638183594,
                85.0574722290039,
                0.06896373629570007,
                0.03342963755130768,
                -0.17174625396728516,
                85.00245666503906,
                84.93473052978516,
                85.1410140991211,
                85.18976593017578,
                85.25054931640625,
                -0.0032154619693756104,
                0.17536625266075134,
                85.218505859375,
                0.020566657185554504,
                85.10797119140625,
                -0.1767301857471466,
                85.25653076171875,
                84.97406768798828,
                0.013732030987739563,
                84.92109680175781,
                0.17825493216514587,
                0.03868208825588226,
                85.11551666259766,
                0.13170453906059265,
                -0.1983998417854309,
                85.19791412353516,
                0.023115435615181923,
                0.055324990302324295,
                85.0810317993164,
                85.38123321533203,
                -0.06349974870681763,
                85.37681579589844,
                85.1937026977539,
                85.06257629394531,
                0.1698503941297531,
                0.17699646949768066,
                85.17948150634766,
                -0.19401752948760986,
                0.1316489726305008,
                -0.020023882389068604,
                0.15322904288768768,
                85.28812408447266,
                0.07729871571063995,
                0.004631791729480028,
                0.14989310503005981,
                84.9871826171875,
                -0.04014265537261963,
                0.08857189118862152,
                -0.155367910861969,
                -0.10655923187732697,
                85.05359649658203,
                85.06514739990234,
                85.06884765625,
                84.8563232421875,
                85.01823425292969,
                -0.1817312240600586,
                0.1293102502822876
            ],
            [
                84.98567962646484,
                -0.030185794457793236,
                85.08509063720703,
                85.04914093017578,
                -0.11600714176893234,
                85.10601043701172,
                0.013870209455490112,
                84.95487976074219,
                85.27926635742188,
                0.0559263601899147,
                0.13693371415138245,
                0.11711849272251129,
                85.12848663330078,
                85.13531494140625,
                84.92098236083984,
                85.17028045654297,
                85.25653839111328,
                0.010226786136627197,
                -0.1690405309200287,
                85.29488372802734,
                0.04687444865703583,
                84.96842193603516,
                0.1886107474565506,
                85.13383483886719,
                85.35977172851562,
                0.18318569660186768,
                84.97840881347656,
                0.1350736916065216,
                -0.130840003490448,
                84.96439361572266,
                0.1712276041507721,
                0.01980450749397278,
                85.3167495727539,
                -0.03414513170719147,
                0.12131597101688385,
                85.10700988769531,
                85.38331604003906,
                0.08367031067609787,
                84.96208190917969,
                85.16577911376953,
                85.2469711303711,
                0.11487574875354767,
                0.15126390755176544,
                85.16859436035156,
                -0.16898979246616364,
                -0.21423131227493286,
                0.14602331817150116,
                0.15960313379764557,
                85.24593353271484,
                -0.0992036685347557,
                -0.0892731323838234,
                0.00640076631680131,
                84.96697998046875,
                -0.11076784878969193,
                0.08816961199045181,
                0.00405101478099823,
                -0.1905863881111145,
                85.11997985839844,
                85.15982055664062,
                84.91812896728516,
                84.87638092041016,
                85.10853576660156,
                -0.16724517941474915,
                -0.008472248911857605
            ],
            [
                85.0782241821289,
                0.0011830786243081093,
                85.02111053466797,
                85.07816314697266,
                -0.06373879313468933,
                84.92414855957031,
                -0.045243144035339355,
                85.18052673339844,
                85.19851684570312,
                -0.17250117659568787,
                -0.1718323677778244,
                -0.22277095913887024,
                85.26136779785156,
                85.10543060302734,
                85.19019317626953,
                85.1272964477539,
                85.25872039794922,
                -0.03063322603702545,
                -0.10778575390577316,
                85.06489562988281,
                -0.040344592183828354,
                85.22069549560547,
                0.013739407062530518,
                85.04024505615234,
                85.21826934814453,
                -0.20252767205238342,
                85.00827026367188,
                0.19533079862594604,
                -0.1753816306591034,
                85.2623519897461,
                -0.06635808944702148,
                -0.06142989918589592,
                85.11759185791016,
                0.05065783113241196,
                0.15390120446681976,
                85.23484802246094,
                84.91446685791016,
                -0.013650828041136265,
                84.9574966430664,
                85.24176788330078,
                84.93910217285156,
                -0.1679285764694214,
                -0.16115227341651917,
                84.85456848144531,
                0.0676087737083435,
                -0.003023114986717701,
                0.09425088763237,
                0.07037582993507385,
                84.8538589477539,
                -0.0796675831079483,
                -0.027377067133784294,
                -0.006722284015268087,
                85.22320556640625,
                0.10676778852939606,
                0.02604973316192627,
                0.0031987279653549194,
                0.07984252274036407,
                85.08137512207031,
                85.29530334472656,
                85.02848815917969,
                85.0650634765625,
                84.93221282958984,
                -0.13362234830856323,
                -0.002092681359499693
            ],
            [
                -0.1109401062130928,
                0.0016161948442459106,
                0.1501341015100479,
                0.17023618519306183,
                -0.13477823138237,
                0.09732858836650848,
                -0.12863725423812866,
                -0.0948106199502945,
                0.1820831447839737,
                -0.07052268087863922,
                -0.09134021401405334,
                -0.19700737297534943,
                0.2142437845468521,
                -0.19217097759246826,
                0.1002512127161026,
                0.08074967563152313,
                0.15518786013126373,
                0.08545027673244476,
                -0.0011288076639175415,
                -0.19745346903800964,
                -0.07996237277984619,
                0.21136058866977692,
                -0.023484691977500916,
                0.060992494225502014,
                -0.008870795369148254,
                -0.06493708491325378,
                0.20845790207386017,
                -0.13592159748077393,
                -0.1041976660490036,
                0.1604415625333786,
                -0.12106411159038544,
                0.0715736597776413,
                -0.08697618544101715,
                -0.14146193861961365,
                -0.14235277473926544,
                -0.033577218651771545,
                0.122592493891716,
                -0.17179380357265472,
                0.08872835338115692,
                0.16389133036136627,
                0.20357884466648102,
                -0.10625788569450378,
                0.08934514224529266,
                -0.12169835716485977,
                -0.01634308695793152,
                0.024324893951416016,
                0.08179177343845367,
                -0.03948085010051727,
                0.19758473336696625,
                -0.025047779083251953,
                0.01759551465511322,
                0.1392737478017807,
                -0.027615979313850403,
                -0.09052391350269318,
                -0.2162870615720749,
                -0.16592082381248474,
                0.00342482328414917,
                -0.0901353657245636,
                -0.005587145686149597,
                -0.1779562532901764,
                -0.041098952293395996,
                -0.000916600227355957,
                0.015921667218208313,
                0.20335786044597626
            ],
            [
                85.18818664550781,
                0.19024501740932465,
                85.22148132324219,
                85.3895492553711,
                0.0329451858997345,
                85.35625457763672,
                0.20401455461978912,
                84.97649383544922,
                85.11317443847656,
                0.15622581541538239,
                -0.09508198499679565,
                -0.06961701810359955,
                84.9693603515625,
                85.35004425048828,
                84.97418975830078,
                85.20523071289062,
                85.04188537597656,
                0.10360847413539886,
                -0.12037088721990585,
                85.2786865234375,
                0.1540273278951645,
                85.37312316894531,
                0.20014019310474396,
                85.18580627441406,
                85.17115020751953,
                -0.00022175908088684082,
                84.88439178466797,
                -0.12699493765830994,
                0.16393859684467316,
                84.99134063720703,
                0.03924097865819931,
                0.12176305055618286,
                85.34835815429688,
                0.12522415816783905,
                0.11100239306688309,
                85.38632202148438,
                85.39737701416016,
                -0.05321860313415527,
                85.33951568603516,
                85.007568359375,
                85.40982055664062,
                -0.06134910136461258,
                -0.06989722698926926,
                85.37198638916016,
                0.12840507924556732,
                -0.03206662833690643,
                -0.014402776956558228,
                0.14425112307071686,
                85.1961669921875,
                -0.05931761860847473,
                0.1724015325307846,
                -0.07061926275491714,
                85.2046890258789,
                -0.12977680563926697,
                -0.061586275696754456,
                -0.05091045796871185,
                0.18715432286262512,
                85.0274658203125,
                85.00704956054688,
                84.9903335571289,
                85.21183776855469,
                85.0697250366211,
                0.03059980645775795,
                -0.15822377800941467
            ],
            [
                0.20660318434238434,
                -0.056207358837127686,
                -0.09305895119905472,
                0.1810651272535324,
                0.06568349897861481,
                0.1481046825647354,
                -0.20176830887794495,
                -0.1440136581659317,
                -0.18200545012950897,
                -0.06539741158485413,
                -0.12656578421592712,
                0.18306736648082733,
                0.03199875354766846,
                0.13763350248336792,
                0.20899632573127747,
                -0.055811502039432526,
                -0.16706989705562592,
                0.10868124663829803,
                -0.22552607953548431,
                -0.06880229711532593,
                0.15260671079158783,
                0.1338687390089035,
                -0.02773444354534149,
                0.05559395253658295,
                -0.144181489944458,
                0.20697833597660065,
                0.08620055019855499,
                0.09399339556694031,
                0.19670437276363373,
                0.14506050944328308,
                0.17467492818832397,
                -0.02557186223566532,
                -0.11760160326957703,
                -0.1594691127538681,
                -0.13943202793598175,
                -0.1479378044605255,
                0.04760424792766571,
                -0.059549182653427124,
                -0.025530757382512093,
                -0.005841836333274841,
                -0.09664974361658096,
                0.033803656697273254,
                0.08937808126211166,
                -0.12351647019386292,
                0.004915403202176094,
                0.14966793358325958,
                0.18360276520252228,
                0.08528761565685272,
                -0.0411234125494957,
                0.0758972018957138,
                -0.03216351941227913,
                -0.1371966302394867,
                0.0507340244948864,
                -0.15538154542446136,
                -0.2039322406053543,
                0.06184829771518707,
                0.014486554078757763,
                -0.16090652346611023,
                -0.0065094889141619205,
                0.01679133251309395,
                0.02102498710155487,
                -0.11564292013645172,
                0.20028947293758392,
                0.06879023462533951
            ],
            [
                85.25585174560547,
                0.2005780190229416,
                85.03166198730469,
                85.16976165771484,
                -0.20675714313983917,
                84.96990203857422,
                -0.07366850972175598,
                85.23458862304688,
                85.23921203613281,
                -0.11382952332496643,
                -0.09506294131278992,
                -0.10943566262722015,
                85.08240509033203,
                84.99605560302734,
                85.2197036743164,
                85.13578033447266,
                85.0493392944336,
                -0.20338651537895203,
                -0.14846821129322052,
                84.96867370605469,
                -0.02929648943245411,
                84.95904541015625,
                -0.08032339811325073,
                84.95502471923828,
                84.86568450927734,
                -0.05774376913905144,
                84.875732421875,
                -0.057077888399362564,
                0.023414641618728638,
                85.32086944580078,
                0.07579166442155838,
                -0.08055602014064789,
                85.0378646850586,
                -0.21340645849704742,
                0.09616394340991974,
                85.27098083496094,
                85.0538101196289,
                -0.11214687675237656,
                85.07549285888672,
                85.1980209350586,
                85.17426300048828,
                -0.1998908519744873,
                -0.23286134004592896,
                85.22726440429688,
                0.007098850328475237,
                0.19794920086860657,
                -0.11169188469648361,
                -0.19738563895225525,
                85.03015899658203,
                0.053522542119026184,
                -0.03644866496324539,
                0.005632274784147739,
                85.28331756591797,
                0.17571671307086945,
                -0.16585110127925873,
                0.04221014678478241,
                -0.039338141679763794,
                85.04715728759766,
                85.18421173095703,
                85.04994201660156,
                84.8235855102539,
                85.15654754638672,
                -0.036436133086681366,
                0.06517542153596878
            ]
        ],
        [
            81.52529907226562,
            -0.011130065657198429,
            81.54267883300781,
            81.60382843017578,
            -0.009984550066292286,
            81.56171417236328,
            0.0,
            81.4744873046875,
            81.61614227294922,
            -0.013956472277641296,
            -0.01812768541276455,
            -0.008154178038239479,
            81.64009857177734,
            81.6158218383789,
            81.58497619628906,
            81.52413177490234,
            81.6331558227539,
            0.0,
            -0.030420128256082535,
            81.6097640991211,
            -0.00018472259398549795,
            81.6427230834961,
            0.0,
            81.56562042236328,
            81.56352233886719,
            -0.0296031441539526,
            81.43861389160156,
            -0.01929480768740177,
            0.0,
            81.56873321533203,
            -0.02310921810567379,
            -0.02017434872686863,
            81.58797454833984,
            -0.014742760919034481,
            -0.024445615708827972,
            81.6760482788086,
            81.64119720458984,
            -0.009331162087619305,
            81.60472106933594,
            81.66070556640625,
            81.6460952758789,
            -0.022427154704928398,
            -0.028995070606470108,
            81.54144287109375,
            -0.023509854450821877,
            -0.020438317209482193,
            -0.011749549768865108,
            -0.019616805016994476,
            81.49526977539062,
            0.0,
            -0.024307232350111008,
            -0.024149103090167046,
            81.62297821044922,
            0.0,
            -0.048257362097501755,
            0.0,
            -0.019011855125427246,
            81.64046478271484,
            81.64680480957031,
            81.60540771484375,
            81.43206024169922,
            81.66676330566406,
            -0.02171620912849903,
            -0.032055098563432693
        ],
        [
            [
                41.417327880859375,
                41.610923767089844,
                41.3201904296875,
                41.625118255615234
            ],
            [
                0.25473350286483765,
                -0.026041757315397263,
                -0.15522338449954987,
                -0.1540704369544983
            ],
            [
                41.625064849853516,
                41.396949768066406,
                41.4093132019043,
                41.40618133544922
            ],
            [
                41.60499572753906,
                41.47117614746094,
                41.22985076904297,
                41.265419006347656
            ],
            [
                -0.09837272018194199,
                -0.17352412641048431,
                -0.19157721102237701,
                0.19940991699695587
            ],
            [
                41.70009231567383,
                41.321388244628906,
                41.47054672241211,
                41.117855072021484
            ],
            [
                0.2528754472732544,
                0.24091148376464844,
                -0.2743602693080902,
                0.2928791046142578
            ],
            [
                41.53007125854492,
                41.585445404052734,
                41.53801345825195,
                41.52114486694336
            ],
            [
                41.334529876708984,
                41.33237075805664,
                41.35298538208008,
                41.62405776977539
            ],
            [
                -0.2180939018726349,
                0.09386281669139862,
                -0.2845880389213562,
                -0.17350804805755615
            ],
            [
                -0.13922742009162903,
                -0.185769185423851,
                -0.2737162411212921,
                0.08907146751880646
            ],
            [
                -0.09085998684167862,
                0.02266809530556202,
                -0.08138681948184967,
                -0.22687792778015137
            ],
            [
                41.19682312011719,
                41.40514373779297,
                41.47574996948242,
                41.649017333984375
            ],
            [
                41.365901947021484,
                41.520023345947266,
                41.528018951416016,
                41.12065887451172
            ],
            [
                41.52560806274414,
                41.564884185791016,
                41.444374084472656,
                41.20112609863281
            ],
            [
                41.505489349365234,
                41.53399658203125,
                41.17650604248047,
                41.60763931274414
            ],
            [
                41.35982131958008,
                41.21714782714844,
                41.61251449584961,
                41.286922454833984
            ],
            [
                0.018046647310256958,
                -0.29213568568229675,
                0.03836190700531006,
                0.021933943033218384
            ],
            [
                0.12153865396976471,
                -0.052608683705329895,
                -0.17759796977043152,
                -0.2585693597793579
            ],
            [
                41.36094665527344,
                41.40776062011719,
                41.65089797973633,
                41.138694763183594
            ],
            [
                -0.08900883793830872,
                -0.05881456285715103,
                -0.028719462454319,
                0.23598594963550568
            ],
            [
                41.23126983642578,
                41.240875244140625,
                41.622398376464844,
                41.44297409057617
            ],
            [
                -0.010025203227996826,
                -0.2500869929790497,
                0.15760675072669983,
                -0.24989259243011475
            ],
            [
                41.51256561279297,
                41.59978485107422,
                41.082275390625,
                41.535091400146484
            ],
            [
                41.67949676513672,
                41.33380889892578,
                41.30571365356445,
                41.45142364501953
            ],
            [
                -0.022655002772808075,
                -0.2674022912979126,
                -0.01411477942019701,
                0.19037580490112305
            ],
            [
                41.632713317871094,
                41.60683059692383,
                41.608062744140625,
                41.4722785949707
            ],
            [
                0.10388099402189255,
                -0.18235038220882416,
                -0.23861445486545563,
                0.03641002997756004
            ],
            [
                0.14463165402412415,
                0.2951061725616455,
                -0.12323378026485443,
                0.11448577046394348
            ],
            [
                41.31167984008789,
                41.41054153442383,
                41.5730094909668,
                41.52580261230469
            ],
            [
                -0.22709594666957855,
                -0.22060775756835938,
                0.07084814459085464,
                -0.057192377746105194
            ],
            [
                0.26414954662323,
                -0.07859182357788086,
                -0.21477675437927246,
                -0.09810101985931396
            ],
            [
                41.13599395751953,
                41.46752166748047,
                41.53213882446289,
                41.649147033691406
            ],
            [
                -0.16598455607891083,
                -0.21552085876464844,
                -0.16547153890132904,
                -0.13314218819141388
            ],
            [
                -0.11001977324485779,
                -0.004602357279509306,
                -0.21227915585041046,
                0.06690912693738937
            ],
            [
                41.30336380004883,
                41.275875091552734,
                41.36175537109375,
                41.50547409057617
            ],
            [
                41.341861724853516,
                41.435813903808594,
                41.479278564453125,
                41.37255859375
            ],
            [
                0.10275169461965561,
                -0.2760199308395386,
                -0.12420166283845901,
                -0.0013373844558373094
            ],
            [
                41.33805465698242,
                41.54185104370117,
                41.393096923828125,
                41.48393249511719
            ],
            [
                41.261531829833984,
                41.5800895690918,
                41.395660400390625,
                41.285743713378906
            ],
            [
                41.3306770324707,
                41.0988655090332,
                41.50312423706055,
                41.49022674560547
            ],
            [
                0.039010148495435715,
                -0.09246490150690079,
                -0.21891294419765472,
                0.005151647143065929
            ],
            [
                -0.14764930307865143,
                -0.11631149798631668,
                0.25355878472328186,
                -0.00855882279574871
            ],
            [
                41.53676986694336,
                41.20112991333008,
                41.62629699707031,
                41.40412521362305
            ],
            [
                0.03178197145462036,
                -0.1985919326543808,
                -0.24450360238552094,
                0.11092820763587952
            ],
            [
                -0.08396901935338974,
                -0.26727476716041565,
                -0.021619601175189018,
                -0.20211172103881836
            ],
            [
                0.06377474218606949,
                -0.2331726849079132,
                0.1073533445596695,
                -0.19954268634319305
            ],
            [
                0.035570356994867325,
                -0.013783220201730728,
                0.03734280541539192,
                -0.264556348323822
            ],
            [
                41.47504425048828,
                41.65742111206055,
                41.519317626953125,
                41.37553787231445
            ],
            [
                0.25992459058761597,
                -0.04881271719932556,
                -0.13381625711917877,
                -0.12175410985946655
            ],
            [
                -0.13329361379146576,
                -0.19411063194274902,
                -0.2664515972137451,
                0.23028196394443512
            ],
            [
                -0.21478363871574402,
                0.16291458904743195,
                0.1843222975730896,
                -0.2515290677547455
            ],
            [
                41.287261962890625,
                41.649696350097656,
                41.234649658203125,
                41.40636444091797
            ],
            [
                0.18303868174552917,
                0.0013952553272247314,
                -0.060309574007987976,
                0.14132127165794373
            ],
            [
                0.019341474398970604,
                -0.12586107850074768,
                0.07700067013502121,
                -0.08019115030765533
            ],
            [
                -0.09242436289787292,
                0.038579463958740234,
                -0.12344163656234741,
                -0.13387787342071533
            ],
            [
                -0.1914484053850174,
                0.14244243502616882,
                -0.10544122755527496,
                -0.22857610881328583
            ],
            [
                41.15062713623047,
                41.60237121582031,
                41.44138717651367,
                41.40206527709961
            ],
            [
                41.34974670410156,
                41.298622131347656,
                41.265010833740234,
                41.609405517578125
            ],
            [
                41.509986877441406,
                41.12054443359375,
                41.146610260009766,
                41.64064407348633
            ],
            [
                41.66791915893555,
                41.61038589477539,
                41.636253356933594,
                41.43064498901367
            ],
            [
                41.57509231567383,
                41.1036376953125,
                41.25844192504883,
                41.14524459838867
            ],
            [
                -0.08760514855384827,
                0.18911319971084595,
                0.003728847950696945,
                -0.16249126195907593
            ],
            [
                0.10693053901195526,
                -0.17335544526576996,
                -0.06193426996469498,
                -0.15474636852741241
            ]
        ],
        [
            37.30171585083008,
            37.3800163269043,
            37.42518615722656,
            37.38323974609375
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
        activation: 'softmax'
    }));

    // Compile the model (using categorical crossentropy for multi-class classification)
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    console.log('Model created successfully.');


    //x,y,lx,ly,flag
    const inputFeatures = tf.tensor2d([[enemy.playerCollision.m_xf.position.x*40,enemy.playerCollision.m_xf.position.y*40, enemy.playerCollision.m_linearVelocity.x, enemy.playerCollision.m_linearVelocity.y, Number(enemy.hasFlag),
                                        player.playerCollision.m_xf.position.x*40,player.playerCollision.m_xf.position.y*40, player.playerCollision.m_linearVelocity.x, player.playerCollision.m_linearVelocity.y, Number(player.hasFlag)],
                                       [1, numFeatures]]);

    const predictions = model.predict(inputFeatures)
    console.log("Predictions:", predictions);
    /*const keys2 = {
        up: predictions[0] >= 0.5,
        down: predictions[1] >= 0.5,
        left: predictions[2] >= 0.5,
        right: predictions[3] >= 0.5
    };*/
    const keys2 = {
        up: false,
        down: false,
        left: false,
        right: false
    };
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
