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
                    0.24309876561164856,
                    0.017835557460784912,
                    0.08165770769119263,
                    -0.025511831045150757,
                    -0.13391518592834473,
                    -0.14201679825782776,
                    -0.02949690818786621,
                    -0.23854690790176392,
                    0.04662710428237915,
                    0.22471073269844055,
                    -0.26273614168167114,
                    0.24574628472328186,
                    -0.2765340507030487,
                    -0.02674850821495056,
                    0.05637305974960327,
                    0.2826261818408966,
                    -0.2223988175392151,
                    -0.03164675831794739,
                    -0.21822324395179749,
                    0.16652387380599976,
                    -0.2216322124004364,
                    -0.13274715840816498,
                    0.07417893409729004,
                    0.26625171303749084,
                    -0.1594332754611969,
                    0.07030117511749268,
                    0.24752888083457947,
                    -0.2805747389793396,
                    0.05661344528198242,
                    0.11802929639816284,
                    0.2028661072254181,
                    0.11461296677589417,
                    0.08124753832817078,
                    -0.1707558035850525,
                    -0.20099365711212158,
                    -0.05683135986328125,
                    -0.0731952041387558,
                    0.05108088254928589,
                    -0.014526903629302979,
                    0.08480918407440186,
                    0.23575308918952942,
                    0.05500161647796631,
                    0.011457651853561401,
                    0.13819736242294312,
                    0.20724433660507202,
                    -0.15773020684719086,
                    0.009694278240203857,
                    -0.0804980993270874,
                    -0.14085549116134644,
                    -0.19544121623039246,
                    0.15123042464256287,
                    -0.014056354761123657,
                    -0.18005695939064026,
                    -0.09502072632312775,
                    -0.16157007217407227,
                    0.24858924746513367,
                    -0.05008475482463837,
                    0.15335243940353394,
                    -0.06176859140396118,
                    0.007696658372879028,
                    0.2408742606639862,
                    0.17521902918815613,
                    0.2543865740299225,
                    -0.09268738329410553
                ],
                [
                    0.023631244897842407,
                    0.0518946647644043,
                    0.1344335377216339,
                    0.15667447447776794,
                    -0.06272237002849579,
                    0.1427111029624939,
                    -0.02321907877922058,
                    0.0214003324508667,
                    0.13193988800048828,
                    -0.08253525197505951,
                    -0.2629072070121765,
                    0.2579055726528168,
                    0.27386459708213806,
                    -0.1189439594745636,
                    -0.08826129138469696,
                    -0.16651925444602966,
                    0.04189983010292053,
                    -0.0012994110584259033,
                    -0.2558151185512543,
                    0.165968120098114,
                    0.2579646408557892,
                    -0.20582729578018188,
                    0.11116182804107666,
                    -0.2838733196258545,
                    -0.08355134725570679,
                    0.22805115580558777,
                    0.17070013284683228,
                    0.022749364376068115,
                    0.18349838256835938,
                    0.07758185267448425,
                    -0.123377725481987,
                    0.12240290641784668,
                    -0.1822528839111328,
                    -0.04218035936355591,
                    0.20225057005882263,
                    0.20235145092010498,
                    0.13024014234542847,
                    0.033552467823028564,
                    0.04058414697647095,
                    -0.2428564429283142,
                    -0.15786170959472656,
                    0.26697883009910583,
                    0.15642049908638,
                    -0.19308574497699738,
                    -0.020417779684066772,
                    0.11005538702011108,
                    0.10542669892311096,
                    -0.23030884563922882,
                    -0.20083773136138916,
                    -0.18669086694717407,
                    -0.2734930217266083,
                    -0.10906277596950531,
                    0.09897220134735107,
                    0.13309109210968018,
                    -0.026319503784179688,
                    0.1530713140964508,
                    0.05113670229911804,
                    -0.1663951575756073,
                    -0.19766941666603088,
                    0.17892226576805115,
                    -0.15813080966472626,
                    0.17402935028076172,
                    -0.019329577684402466,
                    0.19174927473068237
                ],
                [
                    -0.23798030614852905,
                    -0.025354743003845215,
                    -0.12852880358695984,
                    -0.2206653356552124,
                    0.18990257382392883,
                    -0.19657361507415771,
                    -0.021629661321640015,
                    0.05165672302246094,
                    -0.13361668586730957,
                    -0.27647292613983154,
                    0.19283026456832886,
                    0.21877118945121765,
                    -0.04903240501880646,
                    0.1457359790802002,
                    0.2296682894229889,
                    -0.205817312002182,
                    -0.026310056447982788,
                    0.2227688729763031,
                    -0.14917469024658203,
                    -0.24742543697357178,
                    -0.279923677444458,
                    -0.05587364733219147,
                    0.020926207304000854,
                    -0.25315210223197937,
                    -0.11519518494606018,
                    -0.22463977336883545,
                    -0.113123819231987,
                    -0.2801346778869629,
                    0.20772004127502441,
                    -0.16564741730690002,
                    0.2717722952365875,
                    0.01834389567375183,
                    0.08375346660614014,
                    -0.16647160053253174,
                    0.11160644888877869,
                    -0.0772075206041336,
                    -0.2168075442314148,
                    0.1285761296749115,
                    -0.039038583636283875,
                    0.08302697539329529,
                    -0.13934753835201263,
                    -0.1538705676794052,
                    -0.058492809534072876,
                    -0.19887709617614746,
                    0.00784417986869812,
                    0.14741188287734985,
                    -0.02259036898612976,
                    0.15279629826545715,
                    -0.24971452355384827,
                    -0.21040010452270508,
                    0.15087571740150452,
                    0.05065792798995972,
                    0.16578006744384766,
                    -0.009375810623168945,
                    -0.1821986436843872,
                    -0.13163241744041443,
                    0.16168156266212463,
                    0.0034697353839874268,
                    -0.18257243931293488,
                    -0.1110779196023941,
                    0.18396756052970886,
                    -0.13756342232227325,
                    0.19518861174583435,
                    -0.0015141963958740234
                ],
                [
                    -0.11246339976787567,
                    -0.029416054487228394,
                    0.2209758460521698,
                    -0.09293551743030548,
                    0.07628586888313293,
                    0.09337931871414185,
                    -0.2772446870803833,
                    0.09398630261421204,
                    0.15548864006996155,
                    -0.057307884097099304,
                    -0.17101433873176575,
                    -0.07027055323123932,
                    -0.16716189682483673,
                    0.1384151577949524,
                    -0.14599822461605072,
                    -0.18503770232200623,
                    -0.2017274796962738,
                    -0.16858132183551788,
                    -0.2474973350763321,
                    0.04101002216339111,
                    0.15173640847206116,
                    -0.2826263904571533,
                    0.19381991028785706,
                    0.21650013327598572,
                    -0.20383664965629578,
                    -0.0391494482755661,
                    0.10855463147163391,
                    0.1287272572517395,
                    0.14866212010383606,
                    0.022783517837524414,
                    0.04339286684989929,
                    -0.14724908769130707,
                    0.010908693075180054,
                    -0.114349365234375,
                    0.08597797155380249,
                    -0.08723175525665283,
                    0.22327890992164612,
                    0.056322455406188965,
                    -0.07116024196147919,
                    -0.05752207338809967,
                    0.078026682138443,
                    -0.021837472915649414,
                    0.2665557563304901,
                    -0.14774352312088013,
                    0.10871702432632446,
                    0.12757006287574768,
                    -0.25666752457618713,
                    0.2194172441959381,
                    0.2196597158908844,
                    -0.25105464458465576,
                    0.03762981295585632,
                    -0.1674252450466156,
                    0.18110406398773193,
                    0.17254209518432617,
                    -0.04490108788013458,
                    0.17915287613868713,
                    -0.27449947595596313,
                    -0.2285931557416916,
                    0.004232555627822876,
                    -0.14898847043514252,
                    -0.2378610372543335,
                    -0.22786225378513336,
                    -0.25191596150398254,
                    -0.27763715386390686
                ],
                [
                    -0.15986144542694092,
                    0.037607718259096146,
                    0.1998150497674942,
                    0.0030293669551610947,
                    -0.00012817978858947754,
                    -0.13547594845294952,
                    -0.27179470658302307,
                    -0.28837770223617554,
                    0.05045478790998459,
                    0.10895919054746628,
                    0.037621114403009415,
                    0.08979721367359161,
                    -0.014401565305888653,
                    0.026678573340177536,
                    -0.03914816677570343,
                    -0.0006012320518493652,
                    0.20887787640094757,
                    -0.03332898020744324,
                    -0.09226477146148682,
                    0.010103931650519371,
                    0.0915285274386406,
                    0.21629205346107483,
                    0.25125905871391296,
                    0.010103181004524231,
                    0.33894798159599304,
                    -0.26657578349113464,
                    0.03162071481347084,
                    0.08756402879953384,
                    0.12604400515556335,
                    0.008429678156971931,
                    0.11706572771072388,
                    -0.07935912907123566,
                    -0.17009618878364563,
                    -0.1328294426202774,
                    0.06661203503608704,
                    0.1061694473028183,
                    0.055378906428813934,
                    0.09943782538175583,
                    0.0777473896741867,
                    -0.009221933782100677,
                    0.021876636892557144,
                    0.11386126279830933,
                    -0.19753947854042053,
                    0.1140255257487297,
                    -0.03553394973278046,
                    -0.04249686002731323,
                    0.011535917408764362,
                    0.08502436429262161,
                    0.08001289516687393,
                    0.04988930746912956,
                    0.025198178365826607,
                    0.07297655940055847,
                    0.01617150381207466,
                    0.06294533610343933,
                    -0.16425427794456482,
                    0.09283307939767838,
                    0.06398455798625946,
                    0.010484036058187485,
                    0.07067713886499405,
                    -0.22821129858493805,
                    -0.25803691148757935,
                    0.07929907739162445,
                    -0.09355670213699341,
                    -0.01538306474685669
                ],
                [
                    -0.047717735171318054,
                    0.09710133075714111,
                    -0.22066831588745117,
                    -0.008012264966964722,
                    -0.16383974254131317,
                    -0.08288617432117462,
                    0.038021743297576904,
                    -0.06199324131011963,
                    0.07775777578353882,
                    -0.2575593888759613,
                    -0.09502574801445007,
                    -0.1649845540523529,
                    0.04011070728302002,
                    0.26487788558006287,
                    0.045297831296920776,
                    0.14651811122894287,
                    -0.10755237936973572,
                    -0.2101486325263977,
                    -0.2839629352092743,
                    0.2135651707649231,
                    -0.08473825454711914,
                    -0.1538400948047638,
                    -0.1832607090473175,
                    0.22201505303382874,
                    0.10901150107383728,
                    -0.15143871307373047,
                    0.2668239176273346,
                    0.03676342964172363,
                    -0.2042693793773651,
                    -0.20515009760856628,
                    0.25485458970069885,
                    0.11775842308998108,
                    0.09831619262695312,
                    0.1263750195503235,
                    0.21626314520835876,
                    0.21268096566200256,
                    0.04744890332221985,
                    0.24957814812660217,
                    0.039958953857421875,
                    -0.1539902687072754,
                    0.0023218095302581787,
                    0.24672606587409973,
                    0.21435999870300293,
                    0.2763570249080658,
                    0.14306867122650146,
                    0.15722715854644775,
                    0.27500417828559875,
                    -0.1785752773284912,
                    0.02439633011817932,
                    -0.012461662292480469,
                    -0.22283025085926056,
                    0.2581700384616852,
                    0.20484107732772827,
                    0.20611271262168884,
                    0.09864580631256104,
                    -0.059048011898994446,
                    -0.04054294526576996,
                    0.19684681296348572,
                    0.21000072360038757,
                    -0.14196433126926422,
                    -0.11783573031425476,
                    -0.0840170681476593,
                    -0.02958238124847412,
                    -0.152160182595253
                ],
                [
                    -0.19001050293445587,
                    0.2831858694553375,
                    -0.16415482759475708,
                    -0.2747897505760193,
                    0.20198911428451538,
                    0.19229477643966675,
                    0.17330285906791687,
                    0.242205411195755,
                    -0.05662545561790466,
                    0.16630107164382935,
                    -0.027728140354156494,
                    -0.2692223787307739,
                    -0.19194296002388,
                    -0.09627470374107361,
                    -0.22904501855373383,
                    0.05485266447067261,
                    -0.23969410359859467,
                    0.024679452180862427,
                    -0.05323982238769531,
                    -0.13073961436748505,
                    -0.2637885510921478,
                    -0.08718328177928925,
                    0.1781271994113922,
                    0.22014376521110535,
                    0.212217777967453,
                    0.18417063355445862,
                    -0.22877725958824158,
                    0.18456879258155823,
                    0.27008137106895447,
                    0.08659705519676208,
                    -0.21520251035690308,
                    -0.04426407814025879,
                    0.17812734842300415,
                    -0.2813463509082794,
                    -0.19004811346530914,
                    0.09596520662307739,
                    -0.22354832291603088,
                    0.052941590547561646,
                    0.148624986410141,
                    0.19627422094345093,
                    -0.27735739946365356,
                    0.08217033743858337,
                    -0.21580082178115845,
                    0.11609688401222229,
                    -0.21852833032608032,
                    -0.21751868724822998,
                    0.22712036967277527,
                    -0.05909058451652527,
                    0.2547648847103119,
                    -0.1795082688331604,
                    -0.16492997109889984,
                    -0.27475622296333313,
                    -0.1331096887588501,
                    0.02112865447998047,
                    0.09498041868209839,
                    -0.03207242488861084,
                    0.2205771505832672,
                    0.0428331196308136,
                    0.061368197202682495,
                    -0.1547759473323822,
                    -0.015851885080337524,
                    -0.034679561853408813,
                    -0.18446069955825806,
                    0.22677025198936462
                ],
                [
                    0.12967538833618164,
                    -0.1146792322397232,
                    -0.12012644112110138,
                    -0.12786512076854706,
                    0.2195529043674469,
                    -0.1210491955280304,
                    -0.13161124289035797,
                    0.04156270623207092,
                    0.07712781429290771,
                    -0.2573821246623993,
                    0.07129120826721191,
                    -0.24721166491508484,
                    0.07653087377548218,
                    0.22680768370628357,
                    0.11586782336235046,
                    -0.11684808135032654,
                    0.14753401279449463,
                    0.23166874051094055,
                    -0.10024906694889069,
                    -0.23770834505558014,
                    0.038373202085494995,
                    -0.26271411776542664,
                    -0.041545867919921875,
                    -0.2577943503856659,
                    -0.02069815993309021,
                    0.20881971716880798,
                    0.1296752393245697,
                    0.06263703107833862,
                    0.22941884398460388,
                    0.06431883573532104,
                    -0.1981128603219986,
                    0.17571571469306946,
                    -0.12127126753330231,
                    0.15046992897987366,
                    0.008306622505187988,
                    -0.05996689200401306,
                    -0.13756029307842255,
                    0.19859379529953003,
                    -0.05838629603385925,
                    -0.22447270154953003,
                    -0.04742105305194855,
                    -0.2550903260707855,
                    -0.14027781784534454,
                    0.0335422158241272,
                    0.12050017714500427,
                    -0.1114136278629303,
                    0.08540526032447815,
                    -0.2695244252681732,
                    0.1282564401626587,
                    -0.0655878335237503,
                    0.05106663703918457,
                    -0.05313235521316528,
                    -0.25946563482284546,
                    0.07338380813598633,
                    0.22832128405570984,
                    0.27216705679893494,
                    -0.23446018993854523,
                    -0.17562997341156006,
                    -0.028927117586135864,
                    0.1953772008419037,
                    0.1283649206161499,
                    0.16472473740577698,
                    0.11492478847503662,
                    0.08385792374610901
                ],
                [
                    -0.12137547135353088,
                    -0.02106216549873352,
                    -0.2657858431339264,
                    0.09449928998947144,
                    0.004717409610748291,
                    -0.026042252779006958,
                    -0.10636430978775024,
                    0.0584883987903595,
                    -0.15153566002845764,
                    0.15538281202316284,
                    -0.05601920187473297,
                    0.20693525671958923,
                    0.14572301506996155,
                    0.13175225257873535,
                    -0.11353577673435211,
                    -0.26364535093307495,
                    0.2476513683795929,
                    0.20194479823112488,
                    0.24434062838554382,
                    0.16040483117103577,
                    0.06120803952217102,
                    -0.09863840043544769,
                    -0.2069212645292282,
                    -0.14259997010231018,
                    -0.08395087718963623,
                    0.020347028970718384,
                    -0.1436377912759781,
                    -0.27668508887290955,
                    0.15217220783233643,
                    -0.20806458592414856,
                    0.05519095063209534,
                    -0.09968885779380798,
                    0.19493240118026733,
                    -0.16435027122497559,
                    -0.005108505487442017,
                    -0.06626333296298981,
                    0.08543777465820312,
                    -0.03252863883972168,
                    0.2534671127796173,
                    0.14668303728103638,
                    0.2535930573940277,
                    -0.10591699182987213,
                    0.08683928847312927,
                    -0.025723308324813843,
                    -0.09682868421077728,
                    0.18378257751464844,
                    0.030301809310913086,
                    0.04223814606666565,
                    -0.004166752099990845,
                    -0.2242572158575058,
                    0.16907373070716858,
                    -0.021567195653915405,
                    0.12147343158721924,
                    0.13737624883651733,
                    0.26338711380958557,
                    -0.08325941860675812,
                    0.08613961935043335,
                    0.22693321108818054,
                    0.17713066935539246,
                    -0.05612076818943024,
                    0.16233694553375244,
                    0.05785396695137024,
                    0.058735042810440063,
                    -0.047738850116729736
                ],
                [
                    -0.12958508729934692,
                    -0.06278802454471588,
                    -0.2549495995044708,
                    0.09970514476299286,
                    -0.1263619214296341,
                    -0.2739514112472534,
                    -0.23018860816955566,
                    -0.3215678930282593,
                    -0.07388045638799667,
                    0.042987972497940063,
                    -0.08599759638309479,
                    -0.009781391359865665,
                    0.14277170598506927,
                    -0.1787450611591339,
                    -0.237721785902977,
                    -0.0832211971282959,
                    -0.23351240158081055,
                    0.10686459392309189,
                    -0.11263352632522583,
                    0.08198463171720505,
                    -0.055948406457901,
                    0.2916264533996582,
                    0.07319856435060501,
                    -0.03616979345679283,
                    -0.14938874542713165,
                    -0.19315940141677856,
                    -0.22790291905403137,
                    0.07660750299692154,
                    -0.07556059956550598,
                    -0.035151466727256775,
                    0.07846485078334808,
                    -0.22074687480926514,
                    -0.07309772074222565,
                    -0.12788477540016174,
                    -0.04765622317790985,
                    0.029914863407611847,
                    -0.2791944742202759,
                    -0.2285776138305664,
                    -0.001954371342435479,
                    0.07807382196187973,
                    -0.17210157215595245,
                    0.09942413866519928,
                    -0.015818357467651367,
                    0.05058632418513298,
                    -0.18808428943157196,
                    -0.12547583878040314,
                    0.1157543957233429,
                    -0.2594374716281891,
                    0.010532990097999573,
                    -0.11429260671138763,
                    -0.00030162930488586426,
                    0.026631921529769897,
                    -0.24699808657169342,
                    -0.07425318658351898,
                    0.08647532761096954,
                    -0.08823725581169128,
                    -0.1877320110797882,
                    0.020512407645583153,
                    0.03759043291211128,
                    -0.24124811589717865,
                    0.05721144378185272,
                    -0.013162881135940552,
                    0.03188392519950867,
                    -0.005124502815306187
                ]
            ],
            [
                0.0,
                -0.04227562993764877,
                -0.0199750829488039,
                -0.10279469192028046,
                0.0,
                -0.004174685105681419,
                0.0,
                0.3113396465778351,
                -0.09205882996320724,
                -0.11117134243249893,
                -0.039192892611026764,
                -0.09223361313343048,
                -0.1594405621290207,
                -0.03749532252550125,
                0.0,
                0.0,
                -0.006284940987825394,
                -0.11581024527549744,
                0.0,
                -0.08368286490440369,
                -0.12240716814994812,
                0.0026340032927691936,
                -0.07522407919168472,
                -0.01299284491688013,
                -0.0029668728820979595,
                0.0,
                -0.08690562099218369,
                -0.09314928203821182,
                -0.14810016751289368,
                -0.013181040994822979,
                -0.11892624199390411,
                0.0,
                0.0,
                -0.0020586480386555195,
                -0.07167215645313263,
                -0.18005339801311493,
                -0.06378678977489471,
                -0.10460827499628067,
                -0.07881171256303787,
                -0.08176342397928238,
                -0.026550564914941788,
                -0.17366710305213928,
                0.0,
                -0.12214643508195877,
                0.0,
                0.0,
                -0.11905065923929214,
                -0.08983832597732544,
                -0.08191027492284775,
                -0.08562307059764862,
                -0.03158590570092201,
                -0.0790775939822197,
                -0.02367221564054489,
                -0.07010422646999359,
                -0.08815580606460571,
                -0.09463762491941452,
                -0.07408317923545837,
                -0.024470306932926178,
                -0.07470094412565231,
                0.20133401453495026,
                -0.06101277843117714,
                -0.08384490013122559,
                -0.036954738199710846,
                -0.008461114019155502
            ],
            [
                [
                    -0.08509476482868195,
                    -0.17860984802246094,
                    0.12541837990283966,
                    -0.016568660736083984,
                    -0.1926504671573639,
                    0.1042589396238327,
                    -0.20873725414276123,
                    -0.11240717023611069,
                    -0.21123959124088287,
                    0.1217462569475174,
                    0.17358125746250153,
                    0.14877305924892426,
                    -0.06666487455368042,
                    0.025028258562088013,
                    0.1242862194776535,
                    -0.15117377042770386,
                    -0.047667741775512695,
                    0.058459505438804626,
                    -0.07441136240959167,
                    0.20059944689273834,
                    0.1300424486398697,
                    0.1138731986284256,
                    0.18716426193714142,
                    0.20338620245456696,
                    -0.0699351578950882,
                    -0.14022591710090637,
                    0.12587471306324005,
                    0.07261185348033905,
                    4.439055919647217e-05,
                    0.12944670021533966,
                    -0.029339641332626343,
                    -0.11591551452875137,
                    0.03823448717594147,
                    0.1964365690946579,
                    0.10374666750431061,
                    -0.11091620475053787,
                    -0.1383655071258545,
                    0.012522593140602112,
                    0.2116166204214096,
                    0.014575690031051636,
                    0.11090950667858124,
                    -0.16438326239585876,
                    -0.07007205486297607,
                    -0.159841850399971,
                    0.1340273767709732,
                    0.04247252643108368,
                    0.13003717362880707,
                    -0.18701039254665375,
                    0.13469265401363373,
                    0.042986080050468445,
                    0.06829793751239777,
                    0.01519775390625,
                    0.03547804057598114,
                    0.19753776490688324,
                    0.19035764038562775,
                    0.2029232233762741,
                    0.07483454048633575,
                    0.2082412987947464,
                    0.18807612359523773,
                    -0.024766653776168823,
                    -0.1164226233959198,
                    0.08237703144550323,
                    -0.1173359751701355,
                    -0.04595956206321716
                ],
                [
                    0.06284216791391373,
                    -0.03546169772744179,
                    -0.0426471084356308,
                    0.11256703734397888,
                    0.0859995186328888,
                    0.1254422962665558,
                    0.08562086522579193,
                    -0.18750637769699097,
                    0.0794089213013649,
                    -0.17768341302871704,
                    -0.018247000873088837,
                    -0.004239112138748169,
                    -0.021823706105351448,
                    -0.14837372303009033,
                    -0.1998300552368164,
                    -0.13797727227210999,
                    -0.1074393093585968,
                    0.14773230254650116,
                    -0.008499398827552795,
                    0.1544550061225891,
                    -0.12310699373483658,
                    -0.191314235329628,
                    -0.09247051924467087,
                    0.1438046544790268,
                    -0.055621031671762466,
                    -0.06288744509220123,
                    -0.10808145999908447,
                    -0.06443095207214355,
                    0.10819240659475327,
                    -0.014610687270760536,
                    0.14979161322116852,
                    -0.14233188331127167,
                    -0.27492496371269226,
                    0.1511402130126953,
                    -0.14851903915405273,
                    0.013572401367127895,
                    0.17228154838085175,
                    0.05424470826983452,
                    0.1587909609079361,
                    0.13506163656711578,
                    -0.23261778056621552,
                    -0.20857200026512146,
                    0.0643882006406784,
                    -0.033062200993299484,
                    -0.011787597090005875,
                    -0.0489615872502327,
                    0.06883088499307632,
                    0.09703849256038666,
                    0.029656698927283287,
                    0.08023035526275635,
                    0.01142590306699276,
                    -0.1665152758359909,
                    0.10511685907840729,
                    -0.19764158129692078,
                    0.07463021576404572,
                    0.07911999523639679,
                    -0.061696529388427734,
                    -0.07792612165212631,
                    0.13075651228427887,
                    0.07517830282449722,
                    -0.033763229846954346,
                    0.1615903079509735,
                    -0.11735496670007706,
                    -0.16946732997894287
                ],
                [
                    0.02425977773964405,
                    0.30521416664123535,
                    -0.13802267611026764,
                    -0.04392179474234581,
                    -0.20167392492294312,
                    -0.020252130925655365,
                    0.006274266634136438,
                    0.1385878622531891,
                    0.0558934211730957,
                    0.08661064505577087,
                    -0.11116302013397217,
                    -0.045533325523138046,
                    -0.23217196762561798,
                    -0.018112167716026306,
                    -0.0671461895108223,
                    0.03912338614463806,
                    -0.0201638825237751,
                    -0.04558047652244568,
                    0.2047875076532364,
                    0.01502139400690794,
                    -0.21678148210048676,
                    0.10569091141223907,
                    -0.13809219002723694,
                    0.12203614413738251,
                    -0.18568585813045502,
                    -0.09293921291828156,
                    -0.1302868127822876,
                    -0.1174158826470375,
                    0.025318538770079613,
                    0.09667278826236725,
                    -0.12674880027770996,
                    -0.2891107201576233,
                    0.16631460189819336,
                    0.06911077350378036,
                    0.1717780977487564,
                    0.14756979048252106,
                    0.13004347681999207,
                    0.16401691734790802,
                    -0.004572582896798849,
                    0.05411508306860924,
                    -0.26019859313964844,
                    -0.18952108919620514,
                    0.15992693603038788,
                    -0.16643202304840088,
                    -0.1834494024515152,
                    -0.10803396999835968,
                    0.06111917272210121,
                    -0.023427031934261322,
                    -0.20648193359375,
                    -0.3875875174999237,
                    0.18127436935901642,
                    -0.1394692212343216,
                    -0.013936947099864483,
                    -0.21647174656391144,
                    -0.1765081286430359,
                    0.08309640735387802,
                    -0.0339229553937912,
                    -0.3644927740097046,
                    -0.11618214100599289,
                    0.07742274552583694,
                    0.1362193375825882,
                    -0.07896101474761963,
                    0.033436939120292664,
                    -0.20408515632152557
                ],
                [
                    -0.04931457340717316,
                    -0.13193640112876892,
                    -0.1584070473909378,
                    -0.36462461948394775,
                    -0.22293731570243835,
                    0.15996287763118744,
                    -0.058059513568878174,
                    -0.057030677795410156,
                    -0.14921905100345612,
                    0.06725673377513885,
                    -0.10792812705039978,
                    -0.12301592528820038,
                    -0.17145824432373047,
                    -0.11416260153055191,
                    -0.26415297389030457,
                    -0.3507513403892517,
                    -0.2065095454454422,
                    0.07153519243001938,
                    0.08343430608510971,
                    -0.028230365365743637,
                    -0.015045017935335636,
                    -0.1921994686126709,
                    0.13236592710018158,
                    -0.053987883031368256,
                    -0.14519965648651123,
                    -0.05348486080765724,
                    -0.23653490841388702,
                    0.000873575743753463,
                    0.04307430982589722,
                    0.11999683082103729,
                    -0.20295405387878418,
                    0.07789693772792816,
                    -0.1300431191921234,
                    -0.15434296429157257,
                    -0.024732034653425217,
                    0.10971800237894058,
                    -0.20070981979370117,
                    0.15882770717144012,
                    0.08529635518789291,
                    0.036239128559827805,
                    -0.2292444109916687,
                    0.019645338878035545,
                    -0.01270955428481102,
                    -0.0232964176684618,
                    0.04892675578594208,
                    -0.14949963986873627,
                    0.024777814745903015,
                    -0.04689992219209671,
                    0.03176911547780037,
                    -0.1887803077697754,
                    -0.10459400713443756,
                    0.09231007844209671,
                    -0.20586110651493073,
                    -0.21213853359222412,
                    -0.14356514811515808,
                    -0.036384567618370056,
                    -0.1353483647108078,
                    0.17543014883995056,
                    0.04694560170173645,
                    0.0790407657623291,
                    -0.21793539822101593,
                    -0.06302312761545181,
                    -0.027866482734680176,
                    -0.4095965027809143
                ],
                [
                    -0.02566833794116974,
                    0.1714196652173996,
                    0.11603997647762299,
                    -0.12129051238298416,
                    -0.10889454185962677,
                    0.13798831403255463,
                    -0.1698095053434372,
                    -0.14698347449302673,
                    -0.03156045079231262,
                    -0.0642409473657608,
                    0.0681571215391159,
                    0.041527554392814636,
                    -0.10320683568716049,
                    0.1715518981218338,
                    -0.19516508281230927,
                    0.10646848380565643,
                    -0.07958178222179413,
                    0.029891088604927063,
                    -0.0625121146440506,
                    0.0999240130186081,
                    0.1211397796869278,
                    -0.17328202724456787,
                    0.08398903906345367,
                    -0.0018614381551742554,
                    0.03471939265727997,
                    0.17047540843486786,
                    -0.02616429328918457,
                    0.19982077181339264,
                    0.03768812119960785,
                    0.1359236091375351,
                    -0.14835679531097412,
                    -0.05628679692745209,
                    -0.12925808131694794,
                    -0.03575652837753296,
                    0.11114667356014252,
                    -0.17618529498577118,
                    0.025789082050323486,
                    0.10897894203662872,
                    0.09776808321475983,
                    0.0012495964765548706,
                    -0.2018364518880844,
                    0.05114440619945526,
                    0.0792018324136734,
                    -0.20770162343978882,
                    -0.059767067432403564,
                    -0.1452575922012329,
                    -0.21200861036777496,
                    -0.1635013371706009,
                    0.1369757503271103,
                    0.04222889244556427,
                    0.011518344283103943,
                    -0.018647417426109314,
                    -0.04556673765182495,
                    0.15102721750736237,
                    0.12353645265102386,
                    0.011400803923606873,
                    0.03775443136692047,
                    0.05391643941402435,
                    0.016241133213043213,
                    0.16140829026699066,
                    -0.14479203522205353,
                    -0.12006858736276627,
                    0.18444068729877472,
                    0.029166623950004578
                ],
                [
                    0.00481825927272439,
                    -0.1782730221748352,
                    -0.055982787162065506,
                    -0.22082041203975677,
                    -0.09435297548770905,
                    0.04437434673309326,
                    0.08577092736959457,
                    -0.2405068576335907,
                    -0.05971262603998184,
                    0.17786207795143127,
                    -0.1595383733510971,
                    0.13769537210464478,
                    0.1187245100736618,
                    0.18216769397258759,
                    0.03686007112264633,
                    -0.04952797293663025,
                    -0.10540533810853958,
                    -0.13955801725387573,
                    -0.08319792151451111,
                    0.007293601054698229,
                    -0.020222170278429985,
                    -0.0937935933470726,
                    -0.08703608810901642,
                    -0.015779824927449226,
                    0.05724455416202545,
                    -0.16775016486644745,
                    -0.07749900966882706,
                    0.1309807449579239,
                    -0.04016866534948349,
                    -0.13329221308231354,
                    -0.20153088867664337,
                    -0.15210044384002686,
                    0.04599811136722565,
                    -0.031152281910181046,
                    0.20956774055957794,
                    -0.1685643345117569,
                    -0.21415145695209503,
                    0.12765836715698242,
                    0.0778210461139679,
                    -0.05331280827522278,
                    0.12641507387161255,
                    -0.05459693819284439,
                    -0.19800186157226562,
                    0.1456202119588852,
                    -0.33876731991767883,
                    -0.2552352249622345,
                    -0.0773385614156723,
                    -0.03160741180181503,
                    -0.11120381951332092,
                    -0.03973455727100372,
                    -0.0695786401629448,
                    -0.01555491890758276,
                    -0.24473656713962555,
                    0.26409077644348145,
                    0.022977935150265694,
                    -0.11512931436300278,
                    0.18700508773326874,
                    -0.1052609458565712,
                    0.14810451865196228,
                    0.011986920610070229,
                    -0.24639160931110382,
                    -0.2444818615913391,
                    -0.20238985121250153,
                    -0.08986595273017883
                ],
                [
                    0.07300867140293121,
                    -0.05023285746574402,
                    -0.15667042136192322,
                    0.17649616301059723,
                    -0.06442904472351074,
                    0.02677108347415924,
                    -0.11208217591047287,
                    -0.03584164381027222,
                    -0.061425790190696716,
                    0.029105141758918762,
                    0.2022385150194168,
                    0.14615385234355927,
                    0.17529098689556122,
                    -0.21429942548274994,
                    0.09823895990848541,
                    0.13775573670864105,
                    -0.12305299937725067,
                    -0.14778196811676025,
                    -0.044106170535087585,
                    0.057045742869377136,
                    0.13488678634166718,
                    0.0880715399980545,
                    -0.17493343353271484,
                    -0.09427295625209808,
                    0.04956020414829254,
                    -0.12071806192398071,
                    -0.008377999067306519,
                    -0.05726461112499237,
                    0.18951119482517242,
                    -0.017354920506477356,
                    0.13508491218090057,
                    0.055686935782432556,
                    0.18938858807086945,
                    -0.18008780479431152,
                    -0.1260576993227005,
                    -0.009409800171852112,
                    -0.145776629447937,
                    0.09259532392024994,
                    -0.036227598786354065,
                    -0.10028183460235596,
                    -0.04760037362575531,
                    0.1950671225786209,
                    -0.09204992651939392,
                    0.19619520008563995,
                    0.17966286838054657,
                    0.03152726590633392,
                    -0.1594877541065216,
                    0.16540850698947906,
                    -0.025310873985290527,
                    0.13399316370487213,
                    -0.10460158437490463,
                    0.12685300409793854,
                    0.20267163217067719,
                    0.1925220936536789,
                    0.05562819540500641,
                    -0.08858318626880646,
                    -0.12283170968294144,
                    -0.19832289218902588,
                    -0.12417204678058624,
                    -0.12161829322576523,
                    0.0682259351015091,
                    -0.04047730565071106,
                    -0.213389590382576,
                    0.21339382231235504
                ],
                [
                    0.016861608251929283,
                    0.1698901355266571,
                    -0.1233462318778038,
                    0.0008416621712967753,
                    0.04586669057607651,
                    -0.20427478849887848,
                    -0.021446719765663147,
                    0.15729165077209473,
                    -0.05215819925069809,
                    -0.19074471294879913,
                    0.0467599481344223,
                    -0.06632618606090546,
                    -0.018028823658823967,
                    -0.030647829174995422,
                    0.10638762265443802,
                    0.2416612207889557,
                    0.15582382678985596,
                    -0.005706342402845621,
                    0.07291094958782196,
                    0.01018303819000721,
                    0.06524459272623062,
                    0.014667168259620667,
                    -0.13101856410503387,
                    0.126225546002388,
                    0.05459875613451004,
                    -0.0510808527469635,
                    -0.06661635637283325,
                    -0.03429841995239258,
                    -0.115672267973423,
                    -0.13772176206111908,
                    0.14502166211605072,
                    -0.32661521434783936,
                    0.014298449270427227,
                    0.09296239167451859,
                    -0.20464985072612762,
                    0.0833922028541565,
                    -0.10280618071556091,
                    -0.21225012838840485,
                    0.029330505058169365,
                    0.1510111540555954,
                    0.5688347816467285,
                    0.02895338088274002,
                    -0.11570914834737778,
                    -0.1286596804857254,
                    -0.35819587111473083,
                    -0.22038312256336212,
                    0.0880773738026619,
                    0.1373060792684555,
                    -0.15255948901176453,
                    -0.1138334721326828,
                    -0.02800685353577137,
                    -0.129764586687088,
                    0.0687747374176979,
                    0.6852055788040161,
                    -0.10275477170944214,
                    -0.04200543090701103,
                    -0.21388477087020874,
                    -0.0670156255364418,
                    0.10678279399871826,
                    -0.23511846363544464,
                    -0.04361923038959503,
                    0.07892373204231262,
                    -0.16929951310157776,
                    0.5886089205741882
                ],
                [
                    0.028629058972001076,
                    -0.11750763654708862,
                    -0.050452589988708496,
                    0.08721316605806351,
                    0.06489384174346924,
                    -0.2404600828886032,
                    0.008249047212302685,
                    -0.05979600176215172,
                    0.03562912717461586,
                    0.04757409170269966,
                    0.010957092046737671,
                    0.1383974850177765,
                    0.1390618085861206,
                    -0.1404789686203003,
                    -0.167448490858078,
                    0.10194142162799835,
                    -0.08805342018604279,
                    -0.05488240346312523,
                    0.04432044178247452,
                    0.004516358952969313,
                    0.06394192576408386,
                    0.07196130603551865,
                    -0.00577448308467865,
                    -0.08785467594861984,
                    -0.1836405247449875,
                    0.1265266388654709,
                    -0.04953260347247124,
                    0.02608056366443634,
                    0.21281175315380096,
                    0.15774653851985931,
                    -0.1595858782529831,
                    -0.022265519946813583,
                    -0.08947394788265228,
                    -0.14457987248897552,
                    0.08314269781112671,
                    -0.13424919545650482,
                    -0.22411347925662994,
                    0.08920785039663315,
                    -0.1400454193353653,
                    0.04559635370969772,
                    -0.2795413136482239,
                    -0.062148790806531906,
                    0.011426039040088654,
                    0.06453399360179901,
                    0.024979377165436745,
                    -0.015392540954053402,
                    -0.18678946793079376,
                    -0.14914341270923615,
                    0.013810829259455204,
                    -0.37408801913261414,
                    -0.17004825174808502,
                    0.14179417490959167,
                    0.06986011564731598,
                    -0.08493359386920929,
                    0.05152355134487152,
                    -0.18060001730918884,
                    -0.041270479559898376,
                    -0.14784683287143707,
                    0.020225917920470238,
                    -0.19926300644874573,
                    0.06814582645893097,
                    -0.0005022489931434393,
                    0.016924340277910233,
                    -0.2529976963996887
                ],
                [
                    0.010296291671693325,
                    0.10415937751531601,
                    0.09653400629758835,
                    0.07076700776815414,
                    0.1327052116394043,
                    -0.0955769270658493,
                    0.19591984152793884,
                    -0.13075003027915955,
                    -0.031312551349401474,
                    0.15997721254825592,
                    -0.04856975004076958,
                    0.007824315689504147,
                    0.018002646043896675,
                    -0.016480745747685432,
                    -0.13200759887695312,
                    -0.0857723131775856,
                    0.05093942582607269,
                    -0.10946540534496307,
                    -0.1513119786977768,
                    0.14990448951721191,
                    -0.04277735576033592,
                    0.007045815233141184,
                    -0.016362130641937256,
                    -0.2121812254190445,
                    0.035604674369096756,
                    0.1635380983352661,
                    0.04481462016701698,
                    -0.03284851461648941,
                    0.06440592557191849,
                    0.025396307930350304,
                    0.11053555458784103,
                    0.1743704080581665,
                    0.0026094738859683275,
                    -0.16327999532222748,
                    0.05153187736868858,
                    -0.005679468624293804,
                    0.16428527235984802,
                    -0.0307992622256279,
                    -0.19070151448249817,
                    0.06320833414793015,
                    0.10338994860649109,
                    -0.03776475414633751,
                    0.0978802964091301,
                    -0.09037093818187714,
                    -0.10968832671642303,
                    -0.05183304101228714,
                    -0.16300657391548157,
                    0.007662424352020025,
                    0.13176345825195312,
                    -0.0867919772863388,
                    -0.10609840601682663,
                    0.11264768242835999,
                    0.08735046535730362,
                    -0.2941121757030487,
                    -0.07607251405715942,
                    -0.10032318532466888,
                    0.0471998006105423,
                    0.04169326275587082,
                    -0.048216938972473145,
                    0.07237553596496582,
                    -0.1686505526304245,
                    0.11219076812267303,
                    0.16144053637981415,
                    0.1455000936985016
                ],
                [
                    0.04956406354904175,
                    -0.15548060834407806,
                    -0.17194056510925293,
                    0.003395323408767581,
                    0.09127132594585419,
                    -0.004819847177714109,
                    0.11159491539001465,
                    -0.09252523630857468,
                    -0.011197676882147789,
                    -0.16146951913833618,
                    0.12109534442424774,
                    -0.03813374042510986,
                    0.013297121040523052,
                    0.1839924305677414,
                    -0.11538735032081604,
                    -0.21764278411865234,
                    0.1800728589296341,
                    0.16203881800174713,
                    0.006487026810646057,
                    -0.0443120039999485,
                    -0.17917807400226593,
                    -0.19868235290050507,
                    0.2130240648984909,
                    -0.20129583775997162,
                    -0.04679112881422043,
                    0.09598706662654877,
                    0.1770462989807129,
                    -0.20210807025432587,
                    -0.0030720937065780163,
                    0.008850827813148499,
                    -0.0888875350356102,
                    0.03296182304620743,
                    -0.21098512411117554,
                    -0.13764868676662445,
                    -0.21269091963768005,
                    0.10631275177001953,
                    0.19499152898788452,
                    -0.13068853318691254,
                    -0.0016207679873332381,
                    -0.044025808572769165,
                    -0.2774023413658142,
                    0.10851520299911499,
                    0.13801296055316925,
                    0.20837503671646118,
                    -0.09679114818572998,
                    0.010571077466011047,
                    0.18601684272289276,
                    0.10351093113422394,
                    0.11924124509096146,
                    -0.2998866140842438,
                    -0.1923762857913971,
                    -0.009459927678108215,
                    -0.11824113130569458,
                    -0.29620361328125,
                    -0.11378968507051468,
                    0.07287536561489105,
                    0.052332982420921326,
                    -0.23465189337730408,
                    -0.04301327466964722,
                    0.1562103033065796,
                    0.11530040949583054,
                    -0.030845917761325836,
                    -0.0755559653043747,
                    -0.17539185285568237
                ],
                [
                    -0.15639321506023407,
                    0.006006825249642134,
                    -0.06079085171222687,
                    0.027810154482722282,
                    0.11368546634912491,
                    0.08526835590600967,
                    -0.11180230230093002,
                    -0.1836918592453003,
                    -0.18830876052379608,
                    0.026902813464403152,
                    -0.0236331969499588,
                    -0.010971511714160442,
                    -0.17896947264671326,
                    0.06471844017505646,
                    -0.0016167372232303023,
                    -0.028308169916272163,
                    0.06468956172466278,
                    -0.21287457644939423,
                    0.07520225644111633,
                    0.14199690520763397,
                    0.087333545088768,
                    -0.20570433139801025,
                    0.2047935575246811,
                    0.0325591042637825,
                    -0.05478845164179802,
                    0.20789332687854767,
                    -0.09841752052307129,
                    -0.21170902252197266,
                    0.16970334947109222,
                    0.20049409568309784,
                    -0.1242503896355629,
                    -0.022885801270604134,
                    -0.13454706966876984,
                    0.0144887026399374,
                    -0.1734522581100464,
                    0.15549473464488983,
                    -0.1893823742866516,
                    -0.18378549814224243,
                    -0.20349757373332977,
                    -0.18140816688537598,
                    -0.28641173243522644,
                    -0.16493752598762512,
                    0.10015535354614258,
                    -0.16265293955802917,
                    -0.17824111878871918,
                    0.04842144995927811,
                    0.11237892508506775,
                    -0.08968176692724228,
                    0.023372182622551918,
                    0.01816619001328945,
                    0.08025424182415009,
                    -0.22058403491973877,
                    -0.22466666996479034,
                    -0.008153751492500305,
                    -0.15332499146461487,
                    0.03205357491970062,
                    -0.2029256671667099,
                    -0.025913944467902184,
                    0.05939456447958946,
                    0.1280379295349121,
                    -0.17150920629501343,
                    -0.23399795591831207,
                    0.1920049637556076,
                    -0.23887398838996887
                ],
                [
                    -0.0791187658905983,
                    0.1002223789691925,
                    -0.15199372172355652,
                    -0.026494774967432022,
                    -0.03319128602743149,
                    -0.159358412027359,
                    0.005638890899717808,
                    -0.09013479948043823,
                    0.145381361246109,
                    -0.12953625619411469,
                    -0.18852779269218445,
                    0.13001830875873566,
                    -0.06164782494306564,
                    0.166102796792984,
                    0.0029824578668922186,
                    -0.14490653574466705,
                    -0.16183941066265106,
                    -0.1695246398448944,
                    0.09520716220140457,
                    -0.39511221647262573,
                    0.0208475012332201,
                    0.1475316882133484,
                    -0.13026098906993866,
                    0.09126754105091095,
                    -0.21594546735286713,
                    -0.20651516318321228,
                    -0.04311395436525345,
                    -0.24857527017593384,
                    0.1256200522184372,
                    -0.0761207789182663,
                    0.15399080514907837,
                    0.16127394139766693,
                    -0.10066954791545868,
                    0.008354506455361843,
                    0.10237234830856323,
                    -0.208120658993721,
                    -0.28684067726135254,
                    0.01128088217228651,
                    -0.18399523198604584,
                    0.015074378810822964,
                    -0.7418403029441833,
                    -0.30903005599975586,
                    0.05979512259364128,
                    0.11744225770235062,
                    -0.04682430997490883,
                    -0.13336631655693054,
                    -0.12487462162971497,
                    -0.07330859452486038,
                    0.1626421958208084,
                    -0.15452058613300323,
                    -0.12693201005458832,
                    0.10583175718784332,
                    -0.18619103729724884,
                    -0.796650230884552,
                    -0.03698325157165527,
                    -0.09568855911493301,
                    0.12426747381687164,
                    0.12657691538333893,
                    0.0826122835278511,
                    -0.1491347700357437,
                    0.04521140828728676,
                    0.21000491082668304,
                    -0.06956081092357635,
                    -0.6517382264137268
                ],
                [
                    -0.12059298902750015,
                    0.005199416074901819,
                    0.11622342467308044,
                    -0.02435721829533577,
                    -0.005097249988466501,
                    -0.05681036412715912,
                    0.03432866930961609,
                    -0.1933971345424652,
                    -0.13686513900756836,
                    -0.12081766873598099,
                    0.002221539616584778,
                    -0.19140426814556122,
                    0.1742810159921646,
                    0.10058428347110748,
                    0.05575057119131088,
                    -0.06349387019872665,
                    -0.07524701952934265,
                    0.13349048793315887,
                    0.08539943397045135,
                    0.06177505850791931,
                    0.04900236427783966,
                    0.0683291032910347,
                    -0.16733485460281372,
                    0.18358458578586578,
                    -0.009534139186143875,
                    0.013659035786986351,
                    0.08246078342199326,
                    0.061027251183986664,
                    -0.19854530692100525,
                    -0.15747883915901184,
                    -0.062188200652599335,
                    -0.1926397830247879,
                    -0.044018521904945374,
                    0.06540683656930923,
                    -0.07531340420246124,
                    0.0025385906919837,
                    0.10503843426704407,
                    -0.11916600167751312,
                    0.022706272080540657,
                    -0.13369417190551758,
                    -0.0019429525127634406,
                    -0.08435796946287155,
                    -0.16202080249786377,
                    0.060063883662223816,
                    0.15702937543392181,
                    -0.20650188624858856,
                    -0.12428604811429977,
                    -0.06358388066291809,
                    0.20268641412258148,
                    -0.20340731739997864,
                    -0.11048848181962967,
                    0.023520201444625854,
                    0.06425308436155319,
                    -0.22928281128406525,
                    0.08557017147541046,
                    -0.03096771240234375,
                    0.12088514864444733,
                    0.14963378012180328,
                    0.20416980981826782,
                    0.14935408532619476,
                    -0.10453154146671295,
                    -0.03832176700234413,
                    0.009182319045066833,
                    0.1986938863992691
                ],
                [
                    0.11688466370105743,
                    0.1283292919397354,
                    -0.11001870036125183,
                    -0.011002928018569946,
                    -0.10006415843963623,
                    0.08611057698726654,
                    -0.10906823724508286,
                    -0.1345384120941162,
                    0.04611261188983917,
                    -0.11966869235038757,
                    0.012130334973335266,
                    -0.11553297191858292,
                    0.1664501279592514,
                    -0.05087830126285553,
                    0.11115752160549164,
                    0.1981249302625656,
                    -0.06049230694770813,
                    0.12423147261142731,
                    -0.2112177014350891,
                    0.016683250665664673,
                    -0.16374988853931427,
                    0.21528758108615875,
                    -0.0881318747997284,
                    -0.17069405317306519,
                    -0.06414957344532013,
                    -0.20535516738891602,
                    0.1921047419309616,
                    0.17766134440898895,
                    0.044460996985435486,
                    0.026409119367599487,
                    0.08992631733417511,
                    -0.025885194540023804,
                    -0.07961921393871307,
                    0.07989613711833954,
                    -0.14904622733592987,
                    -0.0952177420258522,
                    0.15159426629543304,
                    0.08004201948642731,
                    -0.058782175183296204,
                    0.0903986245393753,
                    0.16639061272144318,
                    0.09371857345104218,
                    0.0017171651124954224,
                    0.06961531937122345,
                    0.2141083925962448,
                    -0.21498513221740723,
                    0.18430443108081818,
                    -0.16307103633880615,
                    0.17697538435459137,
                    -0.06102997064590454,
                    -0.010563954710960388,
                    -0.18318681418895721,
                    0.13485173881053925,
                    0.20747660100460052,
                    -0.1341671645641327,
                    -0.2045629620552063,
                    0.1368079036474228,
                    -0.15405544638633728,
                    -0.012732580304145813,
                    0.13041166961193085,
                    -0.20307587087154388,
                    -0.060216814279556274,
                    0.010574281215667725,
                    -0.0014846175909042358
                ],
                [
                    -0.04598294198513031,
                    0.024600550532341003,
                    0.0432804673910141,
                    0.09693925082683563,
                    0.16819702088832855,
                    0.1204073578119278,
                    -0.13485638797283173,
                    -0.17903585731983185,
                    -0.09988988935947418,
                    0.1260673552751541,
                    0.1559460610151291,
                    0.06002222001552582,
                    -0.07984407246112823,
                    -0.05133208632469177,
                    -0.1879620999097824,
                    -0.07492361962795258,
                    -0.025313913822174072,
                    -0.01779894530773163,
                    -0.1823447048664093,
                    -0.07428546249866486,
                    0.0785854309797287,
                    0.10618354380130768,
                    -0.12309646606445312,
                    -0.1484435796737671,
                    -0.03951755166053772,
                    -0.2076835036277771,
                    -0.1715892255306244,
                    0.0007751137018203735,
                    -0.18855144083499908,
                    -0.011739179491996765,
                    0.18972386419773102,
                    -0.06987650692462921,
                    -0.028614908456802368,
                    0.05170769989490509,
                    0.08473055064678192,
                    0.07955534756183624,
                    -0.2029402256011963,
                    0.10660718381404877,
                    0.15602390468120575,
                    -0.16541455686092377,
                    -0.08442294597625732,
                    0.17475689947605133,
                    0.08109469711780548,
                    -0.050896674394607544,
                    0.025477081537246704,
                    -0.16194693744182587,
                    -0.16332733631134033,
                    -0.19092684984207153,
                    0.1006026417016983,
                    0.16100208461284637,
                    -0.11114910989999771,
                    -0.21584995090961456,
                    0.2045200616121292,
                    0.023310422897338867,
                    0.20209701359272003,
                    -0.08496163785457611,
                    -0.0504019558429718,
                    0.02858792245388031,
                    -0.16645225882530212,
                    -0.10781802237033844,
                    -0.15839646756649017,
                    -0.14675000309944153,
                    0.002857998013496399,
                    -0.12269754707813263
                ],
                [
                    -0.052248138934373856,
                    -0.11978194862604141,
                    0.08925627917051315,
                    0.13008414208889008,
                    0.10742152482271194,
                    -0.05876019969582558,
                    0.05428415164351463,
                    -0.06424308568239212,
                    0.10819709300994873,
                    -0.13752517104148865,
                    0.1340828537940979,
                    0.10368947684764862,
                    0.01752398908138275,
                    -0.1525355875492096,
                    -0.21015097200870514,
                    -0.0036188988015055656,
                    -0.19782759249210358,
                    -0.12910141050815582,
                    -0.011803805828094482,
                    -0.028683004900813103,
                    0.12906716763973236,
                    0.013379639014601707,
                    -0.05438666418194771,
                    -0.07313703000545502,
                    0.08801136165857315,
                    -0.08631307631731033,
                    0.16130658984184265,
                    0.08310984075069427,
                    -0.023922137916088104,
                    -0.14847905933856964,
                    0.0923212468624115,
                    -0.20890888571739197,
                    -0.25375914573669434,
                    0.06470518559217453,
                    -0.21233293414115906,
                    -0.01970929652452469,
                    -0.20876993238925934,
                    0.07134608179330826,
                    -0.18011260032653809,
                    -0.00041202513966709375,
                    -0.22341983020305634,
                    0.0338212214410305,
                    0.1937011033296585,
                    0.06991420686244965,
                    -0.018502673134207726,
                    0.16318398714065552,
                    0.10339280217885971,
                    0.13356637954711914,
                    0.11463683098554611,
                    -0.4027178883552551,
                    -0.0762774795293808,
                    -0.10266952961683273,
                    0.1790747046470642,
                    0.132881760597229,
                    -0.1808653324842453,
                    0.0371369868516922,
                    -0.029883816838264465,
                    -0.4383961856365204,
                    -0.13570712506771088,
                    -0.05070095881819725,
                    -0.1506660133600235,
                    0.07111068814992905,
                    -0.050286803394556046,
                    -0.2074183076620102
                ],
                [
                    0.0731167420744896,
                    0.10951568186283112,
                    -0.21468695998191833,
                    0.11378588527441025,
                    -0.17933261394500732,
                    0.06493544578552246,
                    -0.15828090906143188,
                    0.033155545592308044,
                    0.12788423895835876,
                    -0.1239611878991127,
                    -0.13561055064201355,
                    0.07113415002822876,
                    0.18840645253658295,
                    -0.02361445501446724,
                    -0.224564328789711,
                    -0.07296154648065567,
                    -0.09267807751893997,
                    -0.14486470818519592,
                    0.026356684044003487,
                    -0.1934804469347,
                    -0.17411816120147705,
                    0.06316458433866501,
                    -0.15666654706001282,
                    -0.011749683879315853,
                    0.008496865630149841,
                    -0.15025421977043152,
                    0.21399228274822235,
                    0.06526672095060349,
                    0.08794165402650833,
                    -0.026793628931045532,
                    -0.002448290353640914,
                    0.1960354447364807,
                    0.1329926699399948,
                    0.20270971953868866,
                    0.03771219775080681,
                    0.09238498657941818,
                    -0.10986027121543884,
                    -0.09460519254207611,
                    -0.09171651303768158,
                    -0.21498699486255646,
                    0.021913496777415276,
                    -0.12910544872283936,
                    0.032701727002859116,
                    0.06903035938739777,
                    0.010005409829318523,
                    0.07445643097162247,
                    0.13619020581245422,
                    0.03131808340549469,
                    -0.23048369586467743,
                    -0.03502573445439339,
                    0.2035810798406601,
                    0.1168021559715271,
                    0.17971670627593994,
                    0.08047643303871155,
                    0.05725748836994171,
                    -0.21037280559539795,
                    -0.16149330139160156,
                    -0.1012846827507019,
                    -0.015673020854592323,
                    0.16036109626293182,
                    -0.07449249923229218,
                    0.09630788862705231,
                    -0.19067741930484772,
                    0.11103116720914841
                ],
                [
                    0.14625509083271027,
                    0.09897743165493011,
                    -0.017167851328849792,
                    0.11230362951755524,
                    0.08813212811946869,
                    0.12058477103710175,
                    -0.207978755235672,
                    -0.16420310735702515,
                    0.1208004504442215,
                    -0.14400969445705414,
                    -0.0318799763917923,
                    -0.14420022070407867,
                    -0.043500110507011414,
                    -0.21412144601345062,
                    -0.18755461275577545,
                    -0.07537209987640381,
                    0.09202469885349274,
                    -0.1319231390953064,
                    -0.0011869370937347412,
                    0.11872567236423492,
                    0.08550404012203217,
                    0.1302073448896408,
                    -0.09555388242006302,
                    0.012037575244903564,
                    -0.0480702668428421,
                    -0.08662232756614685,
                    -0.06865458190441132,
                    -0.020746245980262756,
                    0.20753680169582367,
                    -0.13418591022491455,
                    0.030326083302497864,
                    -0.1825057566165924,
                    0.04432941973209381,
                    0.15970970690250397,
                    0.20655308663845062,
                    -0.19747529923915863,
                    -0.03768785297870636,
                    -0.07375791668891907,
                    0.12184356153011322,
                    0.02228449285030365,
                    0.17659913003444672,
                    0.14329780638217926,
                    0.16305415332317352,
                    -0.0936957523226738,
                    0.052371636033058167,
                    -0.03577490150928497,
                    0.05910895764827728,
                    0.1925121694803238,
                    -0.09350961446762085,
                    0.16776509582996368,
                    0.03729669749736786,
                    -0.08988955616950989,
                    -0.04798917472362518,
                    -0.056557223200798035,
                    0.1260053664445877,
                    -0.09222698211669922,
                    0.18437649309635162,
                    -0.2143719494342804,
                    0.13892535865306854,
                    0.1072302907705307,
                    -0.05580601096153259,
                    0.1110692173242569,
                    -0.1536867320537567,
                    0.08251096308231354
                ],
                [
                    0.1604136973619461,
                    -0.0021873910445719957,
                    0.05809806287288666,
                    0.14042042195796967,
                    -0.24421723186969757,
                    -0.011428499594330788,
                    0.12746474146842957,
                    0.020373091101646423,
                    -0.01342607568949461,
                    -0.13420304656028748,
                    -0.09389247000217438,
                    0.09421039372682571,
                    0.10023088753223419,
                    -0.034533221274614334,
                    -0.15314237773418427,
                    -0.048853568732738495,
                    0.09880749881267548,
                    -0.03839385509490967,
                    0.021970054134726524,
                    -0.2085234522819519,
                    -0.13755296170711517,
                    -0.10041794180870056,
                    0.040500834584236145,
                    0.03262116014957428,
                    -0.09301356226205826,
                    0.03671349585056305,
                    -0.05230647325515747,
                    -0.18999777734279633,
                    -0.19834935665130615,
                    0.025382786989212036,
                    0.09926247596740723,
                    -0.17092938721179962,
                    0.033343806862831116,
                    0.13126590847969055,
                    0.04639967903494835,
                    0.12801839411258698,
                    0.09759355336427689,
                    0.06661639362573624,
                    0.22328072786331177,
                    0.16771428287029266,
                    -0.18824157118797302,
                    -0.15646803379058838,
                    0.12995031476020813,
                    -0.16429822146892548,
                    0.1984795331954956,
                    -0.11626502871513367,
                    -0.1707809418439865,
                    0.10848937928676605,
                    -0.005463538225740194,
                    0.18519453704357147,
                    -0.017537513747811317,
                    -0.1398327350616455,
                    0.11608150601387024,
                    -0.2956122159957886,
                    0.046617552638053894,
                    0.1718311756849289,
                    -0.13928323984146118,
                    -0.15322327613830566,
                    -0.09831437468528748,
                    -0.03283170238137245,
                    -0.11398810148239136,
                    -0.14663173258304596,
                    -0.1172642707824707,
                    -0.28906282782554626
                ],
                [
                    0.025648951530456543,
                    -0.10683401674032211,
                    0.11604394763708115,
                    -0.16361361742019653,
                    -0.015423758886754513,
                    0.0196370929479599,
                    0.10380450636148453,
                    0.035221878439188004,
                    0.026666006073355675,
                    0.12774352729320526,
                    0.003258331911638379,
                    0.11880065500736237,
                    -0.14126074314117432,
                    -0.13570722937583923,
                    0.017462320625782013,
                    -0.07595959305763245,
                    -0.10474200546741486,
                    0.11473807692527771,
                    -0.09068800508975983,
                    0.08570442348718643,
                    0.1409105360507965,
                    -0.15363192558288574,
                    -0.05510968342423439,
                    -0.2021789848804474,
                    0.05121654272079468,
                    -0.129141166806221,
                    -0.08037082850933075,
                    -0.18172842264175415,
                    -0.03486230596899986,
                    0.023631958290934563,
                    -0.05481040105223656,
                    -0.07254321873188019,
                    0.0569748692214489,
                    0.048034053295850754,
                    -0.1841062605381012,
                    -0.06659487634897232,
                    -0.10555902868509293,
                    0.1471811681985855,
                    0.029332444071769714,
                    -0.024286892265081406,
                    -0.25353899598121643,
                    -0.0988263413310051,
                    0.17948566377162933,
                    0.060755521059036255,
                    0.03934540972113609,
                    -0.08804088830947876,
                    0.05558900907635689,
                    0.07179999351501465,
                    -0.1783834844827652,
                    0.058083970099687576,
                    0.14004483819007874,
                    -0.1819741129875183,
                    0.15926842391490936,
                    0.11196502298116684,
                    0.06851452589035034,
                    -0.026886701583862305,
                    0.14476467669010162,
                    -0.21532247960567474,
                    -0.10830052196979523,
                    -0.09822073578834534,
                    -0.11201533675193787,
                    0.17210613191127777,
                    0.04463954269886017,
                    -0.18289780616760254
                ],
                [
                    -0.075019970536232,
                    -0.02311541698873043,
                    0.06596695631742477,
                    -0.24249428510665894,
                    0.1134067252278328,
                    -0.13187816739082336,
                    -0.17869706451892853,
                    -0.1430220901966095,
                    -0.036225855350494385,
                    -0.07351991534233093,
                    -0.14874109625816345,
                    -0.22657790780067444,
                    -0.11912879347801208,
                    -0.24879345297813416,
                    0.05168162286281586,
                    -0.2398650050163269,
                    -0.024776209145784378,
                    -0.06022130325436592,
                    -0.05892123281955719,
                    -0.011600456200540066,
                    -0.048687901347875595,
                    -0.253130167722702,
                    -0.20058168470859528,
                    -0.19494201242923737,
                    -0.017798922955989838,
                    0.08177566528320312,
                    0.08872181177139282,
                    0.11268313974142075,
                    -0.07848905771970749,
                    -0.029920225962996483,
                    0.01942351460456848,
                    -0.19891200959682465,
                    -0.20158728957176208,
                    -0.11422640830278397,
                    0.1146581694483757,
                    -0.04103585705161095,
                    0.09380307793617249,
                    -0.03438940271735191,
                    -0.011010240763425827,
                    0.14670485258102417,
                    -0.8385461568832397,
                    -0.23007626831531525,
                    0.015401089563965797,
                    -0.08139286190271378,
                    -0.1382071077823639,
                    -0.03577493876218796,
                    -0.10837987810373306,
                    0.11432143300771713,
                    -0.18188980221748352,
                    0.058897264301776886,
                    0.04748568311333656,
                    -0.2333981841802597,
                    -0.24535436928272247,
                    -0.6786535382270813,
                    -0.1558235138654709,
                    -0.11399234086275101,
                    -0.1349695324897766,
                    -0.02641299180686474,
                    0.08673805743455887,
                    0.05200197547674179,
                    0.07985568046569824,
                    -0.13630981743335724,
                    -0.21821542084217072,
                    -0.7385398745536804
                ],
                [
                    0.07525739818811417,
                    -0.2061157077550888,
                    0.05403181165456772,
                    -0.2099369317293167,
                    -0.131920725107193,
                    -0.2334710657596588,
                    0.03976907208561897,
                    0.1863102912902832,
                    -0.19189316034317017,
                    -0.18020132184028625,
                    0.026712918654084206,
                    -0.14963601529598236,
                    -0.04740535095334053,
                    0.06065117567777634,
                    0.06330842524766922,
                    -0.5157113671302795,
                    0.01945873722434044,
                    0.01268867589533329,
                    -0.2134997397661209,
                    -0.014897740446031094,
                    0.042379532009363174,
                    -0.09552202373743057,
                    -0.1548588126897812,
                    0.0624888613820076,
                    0.07722056657075882,
                    0.031461991369724274,
                    -0.2569427788257599,
                    -0.09038657695055008,
                    0.008988955989480019,
                    0.1344035267829895,
                    -0.21219901740550995,
                    -0.12188205122947693,
                    -0.3755687475204468,
                    0.04376053810119629,
                    -0.17855876684188843,
                    -0.06297119706869125,
                    -0.11205252259969711,
                    -0.21679657697677612,
                    -0.13306179642677307,
                    -0.09368488192558289,
                    -0.762101948261261,
                    -0.1335921585559845,
                    -0.1191665381193161,
                    -0.04095235839486122,
                    0.10771753638982773,
                    0.14073026180267334,
                    0.12876050174236298,
                    -0.11943282186985016,
                    -0.09949470311403275,
                    0.13661706447601318,
                    -0.19419565796852112,
                    0.06448058784008026,
                    -0.1377326250076294,
                    -0.5109845399856567,
                    -0.1272692233324051,
                    -0.09477877616882324,
                    0.05837433412671089,
                    -0.1189434677362442,
                    0.09550441056489944,
                    -0.18621084094047546,
                    -0.013713767752051353,
                    -0.24861225485801697,
                    -0.18681664764881134,
                    -0.5292718410491943
                ],
                [
                    0.2014034390449524,
                    0.07672465592622757,
                    -0.19461213052272797,
                    0.07957366108894348,
                    -0.1656767874956131,
                    0.011593824252486229,
                    0.18340477347373962,
                    -0.1499340534210205,
                    0.14883944392204285,
                    0.19732536375522614,
                    -0.1436445266008377,
                    0.12535704672336578,
                    0.03741253539919853,
                    -0.14616215229034424,
                    -0.05943939834833145,
                    0.11380065977573395,
                    0.08089219033718109,
                    0.07816100865602493,
                    0.1332962065935135,
                    -0.20025892555713654,
                    -0.1994839310646057,
                    -0.040347620844841,
                    -0.04892074689269066,
                    0.01404513232409954,
                    -0.02947409637272358,
                    0.18511267006397247,
                    0.16245265305042267,
                    0.10823910683393478,
                    0.004440693184733391,
                    0.1971302330493927,
                    0.18133045732975006,
                    0.10994074493646622,
                    -0.09766701608896255,
                    0.11913063377141953,
                    -0.2334698885679245,
                    -0.02733636274933815,
                    -0.19546163082122803,
                    -0.017865201458334923,
                    0.15602423250675201,
                    0.11669791489839554,
                    0.2201380431652069,
                    -0.003875922644510865,
                    -0.1751483529806137,
                    0.01700444146990776,
                    -0.16587528586387634,
                    0.06341703981161118,
                    -0.185710608959198,
                    0.0898674726486206,
                    -0.03691082075238228,
                    -0.22852712869644165,
                    -0.2375752031803131,
                    -0.021039122715592384,
                    -0.09621056914329529,
                    0.14721210300922394,
                    0.16793468594551086,
                    -0.15689058601856232,
                    -0.13204604387283325,
                    0.1391553431749344,
                    -0.05628904327750206,
                    -0.17042364180088043,
                    -0.1490229070186615,
                    0.12810659408569336,
                    0.02095457911491394,
                    0.02705184929072857
                ],
                [
                    0.1310224086046219,
                    0.040104612708091736,
                    0.01776811107993126,
                    -0.1510096937417984,
                    0.07268758863210678,
                    -0.2029908150434494,
                    0.16992534697055817,
                    -0.00777648389339447,
                    0.13808657228946686,
                    0.0735771581530571,
                    -0.06731204688549042,
                    -0.1998235583305359,
                    0.1332017481327057,
                    -0.18676164746284485,
                    -0.113885298371315,
                    -0.16950209438800812,
                    0.1834404319524765,
                    0.010790986008942127,
                    0.03708551824092865,
                    0.046137575060129166,
                    0.07663363218307495,
                    -0.25332069396972656,
                    -0.01684775948524475,
                    -0.19737866520881653,
                    -0.17293532192707062,
                    -0.10094023495912552,
                    -0.12142423540353775,
                    -0.1480512171983719,
                    -0.13579177856445312,
                    -0.20123423635959625,
                    -0.1286015659570694,
                    -0.10213683545589447,
                    0.05774594843387604,
                    -0.013471128419041634,
                    -0.21587499976158142,
                    0.055660489946603775,
                    0.10518778860569,
                    -0.10881198942661285,
                    0.16681043803691864,
                    -0.04533734545111656,
                    -0.10897713899612427,
                    -0.22490772604942322,
                    -0.18698139488697052,
                    0.17852815985679626,
                    -0.10241032391786575,
                    -0.13329634070396423,
                    -0.012041502632200718,
                    0.05057040601968765,
                    0.15026190876960754,
                    -0.42492949962615967,
                    0.036620091646909714,
                    -0.14119166135787964,
                    -0.2240350991487503,
                    -0.3003290295600891,
                    0.027911018580198288,
                    -0.11798198521137238,
                    -0.16986629366874695,
                    -0.35205134749412537,
                    -0.1486150473356247,
                    0.023134956136345863,
                    0.10831353813409805,
                    -0.05009884014725685,
                    0.17662838101387024,
                    -0.24415019154548645
                ],
                [
                    -0.11117114871740341,
                    0.16057072579860687,
                    -0.06700406968593597,
                    -0.013816073536872864,
                    -0.029818251729011536,
                    0.17521025240421295,
                    0.06665708124637604,
                    -0.04562754929065704,
                    -0.11927277594804764,
                    0.07259725034236908,
                    -0.02901531755924225,
                    -0.12295466661453247,
                    -0.011243879795074463,
                    -0.1739821881055832,
                    -0.05234278738498688,
                    0.013552546501159668,
                    0.1995086818933487,
                    0.11411415040493011,
                    0.131286159157753,
                    0.15728046000003815,
                    -0.07598161697387695,
                    -0.03170803189277649,
                    0.0717632919549942,
                    -0.193484365940094,
                    0.046769723296165466,
                    -0.051744669675827026,
                    -0.06001979112625122,
                    0.15782715380191803,
                    0.13542987406253815,
                    -0.19438527524471283,
                    -0.10691298544406891,
                    0.006693512201309204,
                    0.18415699899196625,
                    0.15641485154628754,
                    0.0981011837720871,
                    0.1287888139486313,
                    0.0759052187204361,
                    0.08408628404140472,
                    0.1380445510149002,
                    -0.15986399352550507,
                    0.20070768892765045,
                    -0.10487041622400284,
                    -0.12315277755260468,
                    0.07565407454967499,
                    -0.17663753032684326,
                    -0.19944658875465393,
                    0.004662707448005676,
                    -0.15800271928310394,
                    -0.1179620623588562,
                    0.126052126288414,
                    0.14935500919818878,
                    -0.07677820324897766,
                    0.04225711524486542,
                    0.02430972456932068,
                    -0.19661067426204681,
                    -0.08471809327602386,
                    -0.07547615468502045,
                    0.053190842270851135,
                    0.14402519166469574,
                    -0.07118247449398041,
                    -0.21628619730472565,
                    -0.01987600326538086,
                    -0.0649452805519104,
                    -0.08279135823249817
                ],
                [
                    -0.0192408449947834,
                    0.1178482323884964,
                    -0.2366543561220169,
                    -0.17452551424503326,
                    0.013983500190079212,
                    -0.27516844868659973,
                    -0.22320117056369781,
                    -0.1955321580171585,
                    -0.14097289741039276,
                    -0.09703762829303741,
                    0.09344248473644257,
                    -0.01487085223197937,
                    -0.12556010484695435,
                    0.10103277862071991,
                    -0.09090359508991241,
                    -0.1914408653974533,
                    -0.20716503262519836,
                    0.13531158864498138,
                    -0.15006136894226074,
                    0.0008456881041638553,
                    -0.0940260961651802,
                    0.031998272985219955,
                    0.13239985704421997,
                    0.04264576733112335,
                    -0.11705885827541351,
                    0.07629018276929855,
                    0.08991994708776474,
                    -0.09397827833890915,
                    -0.15931321680545807,
                    -0.20161475241184235,
                    -0.07675202190876007,
                    -0.10883232206106186,
                    -0.15283510088920593,
                    -0.1853930801153183,
                    -0.09045164287090302,
                    -0.15418186783790588,
                    -0.06717544049024582,
                    0.16260866820812225,
                    -0.1116347461938858,
                    -0.07869282364845276,
                    -0.17591823637485504,
                    0.11460685729980469,
                    0.0051238685846328735,
                    0.10366848111152649,
                    -0.3212197422981262,
                    0.13441936671733856,
                    -0.10124558955430984,
                    -0.1699395328760147,
                    -0.09413931518793106,
                    -0.36363157629966736,
                    0.062411364167928696,
                    -0.10890506207942963,
                    -0.015775322914123535,
                    -0.15354613959789276,
                    0.09293108433485031,
                    -0.10912749916315079,
                    0.032862186431884766,
                    -0.07487478852272034,
                    0.1469976156949997,
                    0.16840693354606628,
                    0.03992537409067154,
                    0.12062618881464005,
                    -0.1964789479970932,
                    0.05021318793296814
                ],
                [
                    0.00010722602746682242,
                    0.002403033897280693,
                    0.11206851154565811,
                    -0.16088254749774933,
                    0.028716636821627617,
                    0.06026323139667511,
                    -0.07309173792600632,
                    0.10101576149463654,
                    0.19806894659996033,
                    -0.12471441179513931,
                    -0.09034433215856552,
                    0.152523934841156,
                    -0.08882022649049759,
                    -0.25137564539909363,
                    -0.11415240913629532,
                    -0.3344288170337677,
                    -0.1478504240512848,
                    -0.1405806690454483,
                    -0.12528616189956665,
                    0.02365793287754059,
                    -0.07015903294086456,
                    -0.13537392020225525,
                    0.14538751542568207,
                    -0.196213960647583,
                    -0.033614397048950195,
                    -0.05924660712480545,
                    -0.14333780109882355,
                    -0.24411973357200623,
                    0.18386711180210114,
                    -0.030049383640289307,
                    0.026241721585392952,
                    -0.07433876395225525,
                    -0.010927063412964344,
                    -0.14340952038764954,
                    0.07843035459518433,
                    -0.23657339811325073,
                    0.08036176860332489,
                    -0.07285331934690475,
                    0.06660941988229752,
                    -0.08892843872308731,
                    -0.38089120388031006,
                    -0.054781991988420486,
                    -0.07835139334201813,
                    0.1609925478696823,
                    0.07767820358276367,
                    -0.17426449060440063,
                    -0.14383256435394287,
                    -0.12030068039894104,
                    0.12728306651115417,
                    -0.07653243839740753,
                    -0.02615266852080822,
                    0.10758832097053528,
                    -0.14370039105415344,
                    -0.03868256136775017,
                    -0.10795053094625473,
                    -0.10167436301708221,
                    -0.07218286395072937,
                    0.09819766879081726,
                    -0.14752352237701416,
                    -0.18606866896152496,
                    -0.15140561759471893,
                    -0.14155101776123047,
                    0.10369588434696198,
                    -0.035944461822509766
                ],
                [
                    -0.0911153256893158,
                    -0.015049964189529419,
                    -0.22215330600738525,
                    0.019379373639822006,
                    -0.16723772883415222,
                    0.16740483045578003,
                    -0.1004074364900589,
                    0.2072441428899765,
                    0.04426593333482742,
                    -0.2105322778224945,
                    0.12492143362760544,
                    -0.06227560341358185,
                    0.09977195411920547,
                    -0.08561591804027557,
                    0.1302480697631836,
                    0.08252184838056564,
                    -0.1980021744966507,
                    0.19816069304943085,
                    -0.05284741520881653,
                    0.06296408921480179,
                    -0.15249153971672058,
                    -0.10429655015468597,
                    0.11301985383033752,
                    -0.20668601989746094,
                    0.046997666358947754,
                    0.12049131840467453,
                    0.18435584008693695,
                    -0.012914168648421764,
                    -0.12355570495128632,
                    0.05781222879886627,
                    0.17389819025993347,
                    -0.2137906700372696,
                    -0.304536372423172,
                    -0.047879550606012344,
                    0.20834656059741974,
                    -0.17344701290130615,
                    -0.04349113628268242,
                    0.08749916404485703,
                    0.05442512407898903,
                    0.026494570076465607,
                    0.0518832802772522,
                    0.07300808280706406,
                    -0.1716638207435608,
                    0.06697899103164673,
                    -0.22825899720191956,
                    0.041194599121809006,
                    -0.09522691369056702,
                    -0.015177115797996521,
                    0.13538327813148499,
                    -0.11461182683706284,
                    -0.033016808331012726,
                    0.21007810533046722,
                    0.15125373005867004,
                    0.06152639538049698,
                    0.19084377586841583,
                    -0.1184268370270729,
                    0.12717266380786896,
                    0.011903193779289722,
                    0.05710707977414131,
                    -0.17597810924053192,
                    0.17354997992515564,
                    0.12930770218372345,
                    -0.08118142187595367,
                    -0.1980581432580948
                ],
                [
                    0.08947309851646423,
                    -0.14831028878688812,
                    -0.053684283047914505,
                    0.03418837860226631,
                    -0.2038136124610901,
                    -0.1555526703596115,
                    -0.04311986267566681,
                    -0.2071300894021988,
                    -0.06992550194263458,
                    0.20434989035129547,
                    0.1288469135761261,
                    -0.09385070949792862,
                    0.13401241600513458,
                    0.1347508281469345,
                    -0.004410970956087112,
                    -0.1586228311061859,
                    -0.13629496097564697,
                    0.11793865263462067,
                    0.14912070333957672,
                    -0.12874694168567657,
                    0.09476194530725479,
                    -0.0024289265275001526,
                    -0.0802994966506958,
                    0.0892377644777298,
                    -0.1364617943763733,
                    0.019961198791861534,
                    0.2075629085302353,
                    0.01875390112400055,
                    0.08525118976831436,
                    0.048772744834423065,
                    -0.04178312420845032,
                    -0.1587265133857727,
                    0.029265809804201126,
                    0.18748164176940918,
                    -0.06256125867366791,
                    0.11909148842096329,
                    0.049162857234478,
                    0.13889311254024506,
                    -0.21458710730075836,
                    0.21106235682964325,
                    0.026292212307453156,
                    -0.03826287016272545,
                    0.1750805824995041,
                    -0.17941126227378845,
                    -0.1148536205291748,
                    -0.08902618288993835,
                    0.01391804963350296,
                    -0.025661006569862366,
                    0.15173493325710297,
                    0.015035179443657398,
                    -0.0008080313564278185,
                    -0.0751899778842926,
                    0.20350736379623413,
                    -0.04992648586630821,
                    -0.0452168732881546,
                    0.014097914099693298,
                    0.12592296302318573,
                    0.12866413593292236,
                    -0.08211413025856018,
                    0.03044961765408516,
                    0.060381095856428146,
                    -0.11518146842718124,
                    -0.2114122062921524,
                    0.05728469789028168
                ],
                [
                    0.0034229287412017584,
                    0.09768935292959213,
                    -0.15103702247142792,
                    -0.09963634610176086,
                    -0.024798355996608734,
                    0.018940038979053497,
                    0.08804505318403244,
                    -0.16976691782474518,
                    -0.1963118463754654,
                    -0.1807718425989151,
                    0.026267319917678833,
                    -0.18930967152118683,
                    -0.13224458694458008,
                    -0.1886923760175705,
                    0.04939544200897217,
                    -0.4289890229701996,
                    -0.029649674892425537,
                    0.04411919414997101,
                    0.015366350300610065,
                    0.02730182558298111,
                    -0.24668245017528534,
                    -0.08582764863967896,
                    -0.16386225819587708,
                    0.11787214130163193,
                    -0.26062285900115967,
                    -0.17315813899040222,
                    0.04053670912981033,
                    0.08253201842308044,
                    0.049502771347761154,
                    -0.14295965433120728,
                    -0.06594371795654297,
                    0.15429998934268951,
                    0.010328061878681183,
                    0.136788472533226,
                    0.057174619287252426,
                    0.12846416234970093,
                    0.12968173623085022,
                    0.18748565018177032,
                    0.17037397623062134,
                    -0.21204444766044617,
                    -0.1415403038263321,
                    -0.22672197222709656,
                    -0.07824490964412689,
                    -0.015149466693401337,
                    -0.09684384614229202,
                    -0.1723508983850479,
                    0.10037966817617416,
                    0.0048546926118433475,
                    0.11716002970933914,
                    -0.08136861771345139,
                    0.12630978226661682,
                    -0.11370723694562912,
                    -0.042595598846673965,
                    -0.32518625259399414,
                    0.031091034412384033,
                    0.020897850394248962,
                    0.07936994731426239,
                    0.025290390476584435,
                    -0.09554395824670792,
                    0.1527143120765686,
                    0.037815194576978683,
                    -0.11400295048952103,
                    0.001370742917060852,
                    -0.3956589102745056
                ],
                [
                    -0.21539174020290375,
                    0.02167782187461853,
                    0.10285581648349762,
                    0.045036718249320984,
                    -0.16051031649112701,
                    0.06330601871013641,
                    0.20965276658535004,
                    0.07833550870418549,
                    0.02382124960422516,
                    0.018184900283813477,
                    0.09622843563556671,
                    -0.19591273367404938,
                    -0.16150031983852386,
                    0.03357572853565216,
                    -0.10948392748832703,
                    0.018875882029533386,
                    0.05043606460094452,
                    -0.026318639516830444,
                    0.17568866908550262,
                    0.18387024104595184,
                    0.18847669661045074,
                    0.2128586322069168,
                    0.08758838474750519,
                    -0.12475065141916275,
                    -0.011937543749809265,
                    0.10654152929782867,
                    -0.03813193738460541,
                    0.007947176694869995,
                    -0.050092145800590515,
                    0.14578519761562347,
                    0.02202083170413971,
                    -0.13210508227348328,
                    -0.175959974527359,
                    0.20988480746746063,
                    0.14848585426807404,
                    0.20254503190517426,
                    0.14175398647785187,
                    0.12601299583911896,
                    0.1417032927274704,
                    0.1892855018377304,
                    0.03730271756649017,
                    0.0004334449768066406,
                    0.05065421760082245,
                    -0.01049622893333435,
                    0.02420850098133087,
                    -0.08011537790298462,
                    -0.1821955144405365,
                    -0.07584591209888458,
                    0.02669648826122284,
                    0.05129159986972809,
                    -0.0365375280380249,
                    0.1822037249803543,
                    0.056398048996925354,
                    -0.19855692982673645,
                    -0.08298709988594055,
                    -0.07482802867889404,
                    0.049643322825431824,
                    -0.006027773022651672,
                    0.1558588296175003,
                    -0.1660933941602707,
                    0.050042524933815,
                    0.0804339200258255,
                    -0.11053179949522018,
                    -0.007864013314247131
                ],
                [
                    0.13026882708072662,
                    0.07730202376842499,
                    -0.16801130771636963,
                    -0.036320045590400696,
                    0.16941316425800323,
                    0.05799822509288788,
                    -0.19783571362495422,
                    -0.18390390276908875,
                    -0.19548527896404266,
                    -0.17281374335289001,
                    -0.19570016860961914,
                    0.10250939428806305,
                    -0.09730439633131027,
                    -0.10054932534694672,
                    0.08424438536167145,
                    -0.008062809705734253,
                    -0.14768797159194946,
                    -0.13245180249214172,
                    0.020680218935012817,
                    0.05675472319126129,
                    0.19349603354930878,
                    0.16919277608394623,
                    -0.18705417215824127,
                    0.08023126423358917,
                    -0.06953531503677368,
                    0.0357653945684433,
                    0.001762479543685913,
                    0.13090993463993073,
                    0.035574451088905334,
                    0.18957974016666412,
                    -0.015212208032608032,
                    -0.05312506854534149,
                    -0.10133115202188492,
                    -0.11731702834367752,
                    0.172366663813591,
                    0.09817121922969818,
                    0.05410964787006378,
                    0.1950167864561081,
                    -0.1857665330171585,
                    0.016221001744270325,
                    0.2162574976682663,
                    -0.15186597406864166,
                    0.19943223893642426,
                    0.059550926089286804,
                    -0.21123753488063812,
                    0.19666187465190887,
                    -0.010049983859062195,
                    -0.04211001098155975,
                    0.015830859541893005,
                    0.1293044239282608,
                    -0.12876836955547333,
                    -0.0026393383741378784,
                    0.16688038408756256,
                    0.1411580592393875,
                    -0.010515645146369934,
                    0.030281230807304382,
                    0.21138624846935272,
                    -0.14788593351840973,
                    -0.18323172628879547,
                    -0.1287749707698822,
                    -0.00883224606513977,
                    -0.009270846843719482,
                    -0.16458694636821747,
                    -0.17064543068408966
                ],
                [
                    0.02593279257416725,
                    -0.16344085335731506,
                    -0.060053177177906036,
                    -0.2694721519947052,
                    0.2925867438316345,
                    -0.051900990307331085,
                    0.19258233904838562,
                    -0.1120692566037178,
                    -0.06702136993408203,
                    -0.12946319580078125,
                    0.14487184584140778,
                    0.11100954562425613,
                    -0.1726405769586563,
                    -0.027775827795267105,
                    -0.15032333135604858,
                    0.07570444792509079,
                    -0.14643585681915283,
                    -0.15644390881061554,
                    -0.09228510409593582,
                    0.0497174896299839,
                    0.06480609625577927,
                    -0.07976766675710678,
                    0.0510292612016201,
                    0.09518639743328094,
                    -0.0863799974322319,
                    0.08280166238546371,
                    0.21234622597694397,
                    0.04357393831014633,
                    -0.18566809594631195,
                    -0.05426543578505516,
                    -0.08387023955583572,
                    0.13425813615322113,
                    -0.007379720453172922,
                    0.025858581066131592,
                    -0.08615342527627945,
                    0.1119973286986351,
                    -0.04998026415705681,
                    -0.06759007275104523,
                    0.019107531756162643,
                    0.12330718338489532,
                    0.0919649749994278,
                    -0.10048197954893112,
                    -0.08554916083812714,
                    -0.2503626346588135,
                    -0.14536191523075104,
                    0.02912202663719654,
                    -0.13751690089702606,
                    -0.22714336216449738,
                    -0.19476760923862457,
                    0.03677460551261902,
                    -0.10811442881822586,
                    0.004306098446249962,
                    -0.2732051908969879,
                    0.26648107171058655,
                    0.15716353058815002,
                    -0.2256292998790741,
                    -0.1585005819797516,
                    -0.009881741367280483,
                    -0.20309236645698547,
                    0.19599707424640656,
                    -0.07062197476625443,
                    0.09785806387662888,
                    0.10346086323261261,
                    -0.05909479036927223
                ],
                [
                    -0.0008582490845583379,
                    -0.04343550279736519,
                    -0.2518773078918457,
                    0.023036153987050056,
                    0.11500702798366547,
                    -0.03620350733399391,
                    0.0756915807723999,
                    0.024539202451705933,
                    -0.07299919426441193,
                    0.09817178547382355,
                    -0.1353321224451065,
                    0.12917275726795197,
                    -0.21655161678791046,
                    0.20971129834651947,
                    -0.03751126676797867,
                    -0.20044884085655212,
                    -0.19191433489322662,
                    0.08737324178218842,
                    0.09497497975826263,
                    -0.013211354613304138,
                    0.05413205921649933,
                    -0.026221593841910362,
                    0.048860982060432434,
                    0.17743019759655,
                    -0.16475647687911987,
                    -0.13498631119728088,
                    0.15389645099639893,
                    -0.16443079710006714,
                    -0.1964191198348999,
                    -0.18303313851356506,
                    -0.10344167798757553,
                    -0.23495158553123474,
                    0.016402406617999077,
                    -0.18482714891433716,
                    -0.21204929053783417,
                    0.14624443650245667,
                    0.17790770530700684,
                    -0.10544180870056152,
                    0.053214333951473236,
                    -0.12722253799438477,
                    -0.01916523277759552,
                    -0.09552724659442902,
                    0.2157679945230484,
                    0.04792581871151924,
                    -0.18069590628147125,
                    -0.23775790631771088,
                    0.02239534631371498,
                    -0.04616795480251312,
                    0.06986433267593384,
                    0.018062928691506386,
                    0.07669588178396225,
                    -0.15240874886512756,
                    -0.11485369503498077,
                    -0.004776671063154936,
                    0.18420566618442535,
                    -0.06290854513645172,
                    -0.15968787670135498,
                    0.030260169878602028,
                    0.15019333362579346,
                    -0.20471514761447906,
                    0.09038041532039642,
                    0.10013969242572784,
                    0.0726059228181839,
                    0.07592269033193588
                ],
                [
                    -0.1269647777080536,
                    -0.22048057615756989,
                    0.06411805003881454,
                    -0.18267939984798431,
                    0.12496064603328705,
                    -0.08145029097795486,
                    -0.018627192825078964,
                    -0.12758296728134155,
                    -0.22098320722579956,
                    -0.00035369262332096696,
                    -0.04570508003234863,
                    0.0069493139162659645,
                    0.13451352715492249,
                    -0.19990341365337372,
                    -0.15923035144805908,
                    -0.2351488173007965,
                    0.09370879828929901,
                    -0.12322385609149933,
                    -0.22903253138065338,
                    -0.0014295863220468163,
                    -0.2355688214302063,
                    -0.00012021875591017306,
                    0.005776077508926392,
                    0.1447763293981552,
                    -0.2288479506969452,
                    0.09266103059053421,
                    -0.06671646982431412,
                    0.017449239268898964,
                    -0.17961619794368744,
                    -0.004508316516876221,
                    -0.19957374036312103,
                    0.0692322850227356,
                    -0.35143640637397766,
                    0.022156693041324615,
                    -0.1704418957233429,
                    -0.022155923768877983,
                    0.12429052591323853,
                    -0.005004762206226587,
                    -0.19328904151916504,
                    0.1164303570985794,
                    -0.21890400350093842,
                    -0.2558816075325012,
                    -0.22257624566555023,
                    -0.21373678743839264,
                    -0.09793486446142197,
                    -0.008733218535780907,
                    0.08249378204345703,
                    -0.20051203668117523,
                    -0.13067252933979034,
                    -0.1375434249639511,
                    -0.13023021817207336,
                    0.05232132971286774,
                    -0.11785060912370682,
                    -0.36781179904937744,
                    0.08925850689411163,
                    0.12877069413661957,
                    -0.08150950074195862,
                    -0.18907012045383453,
                    0.1431300938129425,
                    0.14596855640411377,
                    -0.20750707387924194,
                    0.12379105389118195,
                    -0.18691985309123993,
                    -0.21940357983112335
                ],
                [
                    0.027408074587583542,
                    -0.12283061444759369,
                    0.08028041571378708,
                    -0.11439377814531326,
                    -0.22398819029331207,
                    -0.08791026473045349,
                    -0.1494947373867035,
                    -0.03473702818155289,
                    -0.05718010291457176,
                    -0.11987531185150146,
                    -0.07531455159187317,
                    0.17642459273338318,
                    -0.06931521743535995,
                    0.052050814032554626,
                    0.12518088519573212,
                    0.05471153184771538,
                    -0.206650510430336,
                    0.08226633071899414,
                    -0.12424266338348389,
                    -0.06024762988090515,
                    -0.19181109964847565,
                    0.12013678252696991,
                    0.17164963483810425,
                    -0.07858333736658096,
                    -0.1231696754693985,
                    0.13005569577217102,
                    -0.12422358989715576,
                    0.08927125483751297,
                    -0.12116922438144684,
                    -0.11733640730381012,
                    -0.10802468657493591,
                    -0.1384468674659729,
                    0.10749367624521255,
                    -0.0213598795235157,
                    -0.168328195810318,
                    -0.16115863621234894,
                    -0.2014787346124649,
                    -0.13723541796207428,
                    0.1076594889163971,
                    -0.223907470703125,
                    -0.1300538182258606,
                    -0.11834162473678589,
                    -0.0969429537653923,
                    0.10524055361747742,
                    -0.022311195731163025,
                    -0.20369964838027954,
                    -0.21635250747203827,
                    0.12958349287509918,
                    0.13976289331912994,
                    -0.07212409377098083,
                    0.02854081057012081,
                    -0.18002963066101074,
                    -0.1980406641960144,
                    -0.17899513244628906,
                    -0.06001758575439453,
                    -0.13022981584072113,
                    0.17449890077114105,
                    -0.07375765591859818,
                    0.007306486368179321,
                    0.1348670870065689,
                    -0.10403022915124893,
                    -0.11273222416639328,
                    0.10559172928333282,
                    -0.060249775648117065
                ],
                [
                    -0.004900498781353235,
                    -0.15005017817020416,
                    -0.20394213497638702,
                    -0.07185248285531998,
                    -0.09937860071659088,
                    0.02653377503156662,
                    -0.14126558601856232,
                    0.12511228024959564,
                    -0.13958393037319183,
                    0.16846705973148346,
                    -0.20112378895282745,
                    -0.08917678892612457,
                    -0.0790875181555748,
                    0.09103105962276459,
                    0.0390191525220871,
                    -0.16633059084415436,
                    -0.17829373478889465,
                    0.06615667045116425,
                    0.1416887491941452,
                    0.014135384932160378,
                    -0.0041020214557647705,
                    0.006976066157221794,
                    0.1755598783493042,
                    0.08181124925613403,
                    0.0344746857881546,
                    -0.1092403456568718,
                    -0.18995915353298187,
                    0.14176246523857117,
                    0.19664610922336578,
                    -0.02984979748725891,
                    -0.09184745699167252,
                    -0.19824504852294922,
                    -0.1894306242465973,
                    0.10587206482887268,
                    -0.20882733166217804,
                    -0.1519114375114441,
                    -0.061006806790828705,
                    -0.09365031868219376,
                    -0.021533606573939323,
                    -0.20491425693035126,
                    -0.29509326815605164,
                    -0.2740280330181122,
                    -0.06048832833766937,
                    -0.08880584686994553,
                    -0.07165665179491043,
                    0.16907070577144623,
                    0.027262883260846138,
                    -0.08447933942079544,
                    -0.25105249881744385,
                    -0.01727527566254139,
                    0.10671968758106232,
                    -0.16028591990470886,
                    -0.12204999476671219,
                    0.012314782477915287,
                    0.13012008368968964,
                    -0.024516820907592773,
                    0.20996244251728058,
                    -0.324151873588562,
                    -0.1945626586675644,
                    0.0037755747325718403,
                    0.037740565836429596,
                    -0.04906068369746208,
                    -0.0860777497291565,
                    -0.004002027213573456
                ],
                [
                    0.16667726635932922,
                    -0.06568045169115067,
                    -0.0751880556344986,
                    -0.2304769605398178,
                    -0.2077241837978363,
                    -0.18960842490196228,
                    -0.08078261464834213,
                    -0.04089340567588806,
                    -0.06693951040506363,
                    -0.06619192659854889,
                    -0.10724429786205292,
                    -0.12012293934822083,
                    0.05598386749625206,
                    -0.13993752002716064,
                    0.01669035293161869,
                    0.07283254712820053,
                    -0.11308497935533524,
                    -0.009459484368562698,
                    -0.03821041062474251,
                    -0.09489331394433975,
                    0.12968118488788605,
                    -0.2656877338886261,
                    -0.11753857880830765,
                    -0.009271413087844849,
                    -0.19072571396827698,
                    -0.15631963312625885,
                    0.0019065887900069356,
                    -0.1302143782377243,
                    0.052724067121744156,
                    0.027596063911914825,
                    0.12215419858694077,
                    0.14102250337600708,
                    0.032635800540447235,
                    -0.18126973509788513,
                    0.09101579338312149,
                    0.10171164572238922,
                    0.07108796387910843,
                    -0.16402819752693176,
                    0.11900705844163895,
                    -0.18984569609165192,
                    -0.058364544063806534,
                    0.06988799571990967,
                    -0.16483047604560852,
                    -0.21495001018047333,
                    0.13914306461811066,
                    0.1984521448612213,
                    0.11255712062120438,
                    -0.17044679820537567,
                    -0.07426255941390991,
                    -0.1149204671382904,
                    0.10946217179298401,
                    -0.09723413735628128,
                    0.04441908374428749,
                    -0.14227600395679474,
                    0.13319744169712067,
                    0.1785697489976883,
                    0.06747086346149445,
                    0.03463853523135185,
                    -0.1050991341471672,
                    0.15733610093593597,
                    0.08433184772729874,
                    -0.002892041113227606,
                    -0.2119092494249344,
                    0.1348482370376587
                ],
                [
                    0.0343298576772213,
                    0.08100020885467529,
                    -0.10061907023191452,
                    -0.1358088254928589,
                    0.1283964365720749,
                    -0.20473352074623108,
                    0.04804527387022972,
                    -0.035780057311058044,
                    -0.00766394380480051,
                    -0.0016086548566818237,
                    0.09248320758342743,
                    -0.05814593657851219,
                    0.1468968689441681,
                    -0.17932048439979553,
                    -0.23134906589984894,
                    -0.17682193219661713,
                    -0.1396392583847046,
                    0.09940497577190399,
                    0.15600362420082092,
                    -0.1804608851671219,
                    -0.11955582350492477,
                    0.12986695766448975,
                    0.1411421149969101,
                    -0.224759042263031,
                    0.08493372797966003,
                    -0.16739630699157715,
                    -0.10196451097726822,
                    0.14113369584083557,
                    0.09082068502902985,
                    -0.21191203594207764,
                    0.19460918009281158,
                    -0.19476903975009918,
                    0.059088218957185745,
                    0.12121286243200302,
                    0.13148841261863708,
                    -0.035395942628383636,
                    0.10110747814178467,
                    0.20369663834571838,
                    0.09869280457496643,
                    -0.14834906160831451,
                    -0.46312761306762695,
                    -0.20151184499263763,
                    -0.030325179919600487,
                    -0.08836832642555237,
                    -0.037405166774988174,
                    0.13700170814990997,
                    -0.14329807460308075,
                    0.11490403860807419,
                    0.08122324198484421,
                    0.02638102136552334,
                    -0.010227738879621029,
                    -0.07025706768035889,
                    -0.054181717336177826,
                    -0.17817136645317078,
                    -0.15856236219406128,
                    0.14942197501659393,
                    0.18595655262470245,
                    0.07508031278848648,
                    -0.11870986968278885,
                    0.10163778811693192,
                    -0.20686174929141998,
                    -0.17238081991672516,
                    0.059786513447761536,
                    -0.3387143611907959
                ],
                [
                    0.15391945838928223,
                    0.03510667756199837,
                    0.0597677156329155,
                    0.015599875710904598,
                    0.08618480712175369,
                    0.08863820135593414,
                    -0.04559537395834923,
                    -0.0056679742410779,
                    -0.026528071612119675,
                    -0.09985174983739853,
                    0.08656962215900421,
                    0.17113323509693146,
                    0.14738287031650543,
                    -0.13183733820915222,
                    -0.006238728761672974,
                    -0.004518824629485607,
                    -0.11962264776229858,
                    -0.11323849856853485,
                    -0.0962570384144783,
                    -0.07766860723495483,
                    -0.06101645529270172,
                    -0.03638164699077606,
                    0.05265939235687256,
                    -0.18705779314041138,
                    -0.03925010934472084,
                    0.03726345673203468,
                    -0.20283755660057068,
                    0.18235009908676147,
                    0.046658195555210114,
                    -0.09464172273874283,
                    -0.20130306482315063,
                    -0.13545666635036469,
                    0.05778304114937782,
                    -0.011298424564301968,
                    -0.08962903916835785,
                    -0.14102129638195038,
                    -0.07885854691267014,
                    0.07415731996297836,
                    -0.121726855635643,
                    -0.11760227382183075,
                    0.09297357499599457,
                    -0.18378916382789612,
                    0.075515016913414,
                    0.17517396807670593,
                    -0.05605914816260338,
                    -0.07821439206600189,
                    -0.04294625297188759,
                    -0.03139987587928772,
                    0.09530702233314514,
                    -0.13288836181163788,
                    0.001830578432418406,
                    0.18297089636325836,
                    -0.04933810606598854,
                    -0.09434939175844193,
                    -0.011213123798370361,
                    -0.1805926412343979,
                    -0.1491747498512268,
                    -0.057651251554489136,
                    -0.13425180315971375,
                    -0.2144666314125061,
                    -0.05032924562692642,
                    -0.0804794505238533,
                    0.0968053787946701,
                    -0.1893734633922577
                ],
                [
                    0.018019072711467743,
                    -0.23576924204826355,
                    0.06073785573244095,
                    -0.3385887145996094,
                    -0.19958962500095367,
                    -0.18041254580020905,
                    -0.06039857864379883,
                    0.05688275396823883,
                    0.03686270862817764,
                    -0.028347738087177277,
                    -0.12017244845628738,
                    0.15690915286540985,
                    0.02718663029372692,
                    0.12190283834934235,
                    0.11459355801343918,
                    -0.3400796055793762,
                    -0.12576909363269806,
                    -0.1452658474445343,
                    0.13082608580589294,
                    0.0043645440600812435,
                    -0.15772534906864166,
                    -0.07137038558721542,
                    0.0796852856874466,
                    0.016502149403095245,
                    0.07597234100103378,
                    -0.07278028130531311,
                    0.1174200251698494,
                    -0.04532232508063316,
                    -0.134770467877388,
                    -0.21167206764221191,
                    -0.20901203155517578,
                    0.09643807262182236,
                    0.007488473318517208,
                    -0.13445603847503662,
                    -0.10304257273674011,
                    -0.009222744032740593,
                    0.13856668770313263,
                    0.06636665761470795,
                    0.045909035950899124,
                    -0.16751834750175476,
                    -0.6178713440895081,
                    -0.11314404010772705,
                    -0.20976567268371582,
                    -0.13717834651470184,
                    -0.04944507032632828,
                    -0.09202221781015396,
                    -0.12737084925174713,
                    -0.020446425303816795,
                    0.09680802375078201,
                    0.020712552592158318,
                    -0.1785459965467453,
                    -0.0789625346660614,
                    -0.14100682735443115,
                    -0.47526049613952637,
                    -0.11870191991329193,
                    0.06822238862514496,
                    -0.14822782576084137,
                    -0.023780828341841698,
                    0.0651160255074501,
                    -0.09725745767354965,
                    -0.23701059818267822,
                    0.11593271046876907,
                    -0.062041521072387695,
                    -0.25353896617889404
                ],
                [
                    0.13183291256427765,
                    -0.030939936637878418,
                    0.15329758822917938,
                    -0.012820333242416382,
                    0.019773125648498535,
                    0.18675173819065094,
                    -0.16759994626045227,
                    -0.04363396763801575,
                    -0.09832077473402023,
                    -0.1161094531416893,
                    0.02265605330467224,
                    0.05140383541584015,
                    0.09627912938594818,
                    0.20222054421901703,
                    -0.03283028304576874,
                    0.0888335257768631,
                    0.028563708066940308,
                    -0.18205563724040985,
                    0.1449175626039505,
                    -0.20093445479869843,
                    0.02182157337665558,
                    -0.02163858711719513,
                    -0.04681210219860077,
                    0.06337369978427887,
                    -0.13299520313739777,
                    -0.031679898500442505,
                    -0.018819153308868408,
                    -0.06634628772735596,
                    -0.1851504147052765,
                    -0.001335233449935913,
                    -0.03520879149436951,
                    0.06259404122829437,
                    0.07048679888248444,
                    -0.12014643102884293,
                    0.005988702178001404,
                    0.2043193131685257,
                    -0.09434579312801361,
                    -0.01957675814628601,
                    0.10195843875408173,
                    -0.1960974782705307,
                    -0.16737133264541626,
                    -0.005697041749954224,
                    -0.19053272902965546,
                    -0.1981632262468338,
                    0.09783823788166046,
                    0.0026328861713409424,
                    0.03869916498661041,
                    -0.1504596620798111,
                    -0.04613006114959717,
                    -0.14372558891773224,
                    0.13374249637126923,
                    -0.046200573444366455,
                    0.05597062408924103,
                    0.11090315878391266,
                    0.1559465080499649,
                    0.20057548582553864,
                    0.051310136914253235,
                    -0.1921752542257309,
                    0.00342637300491333,
                    -0.13613148033618927,
                    0.13187579810619354,
                    0.12883640825748444,
                    0.1692088097333908,
                    -0.1544608175754547
                ],
                [
                    0.13177059590816498,
                    -0.06959773600101471,
                    0.05361030250787735,
                    -0.21679745614528656,
                    -0.009122821502387524,
                    0.13224002718925476,
                    0.09865297377109528,
                    0.013652846217155457,
                    0.19798587262630463,
                    -0.23112913966178894,
                    -0.17453818023204803,
                    0.07357226312160492,
                    -0.2067687064409256,
                    0.02310744673013687,
                    -0.14151489734649658,
                    -0.196160688996315,
                    0.10696317255496979,
                    0.0841527134180069,
                    0.05294591933488846,
                    -0.1064244881272316,
                    0.013669910840690136,
                    -0.02537643350660801,
                    0.12930716574192047,
                    0.02179119363427162,
                    0.005505302455276251,
                    -0.19445191323757172,
                    0.051941946148872375,
                    -0.22655163705348969,
                    0.16520558297634125,
                    -0.11422421783208847,
                    0.15820713341236115,
                    -0.15042242407798767,
                    -0.024319611489772797,
                    -0.005999166052788496,
                    0.1622277945280075,
                    -0.19158855080604553,
                    0.004654431715607643,
                    0.02229728363454342,
                    -0.06543220579624176,
                    0.08411286771297455,
                    -0.334680438041687,
                    -0.18314404785633087,
                    0.04536556452512741,
                    -0.16386881470680237,
                    -0.1049913838505745,
                    0.12061437219381332,
                    -0.13608799874782562,
                    -0.14397796988487244,
                    0.0556095615029335,
                    -0.017206426709890366,
                    0.14453697204589844,
                    -0.1949048787355423,
                    -0.22214250266551971,
                    -0.148943692445755,
                    -0.183003768324852,
                    0.023926809430122375,
                    0.034623995423316956,
                    0.002523403614759445,
                    -0.01074975449591875,
                    -0.09042097628116608,
                    0.16042618453502655,
                    -0.2448727935552597,
                    0.11620815098285675,
                    0.09807512909173965
                ],
                [
                    -0.1659967601299286,
                    -0.009955272078514099,
                    0.1913238912820816,
                    -0.1703716367483139,
                    -0.19535835087299347,
                    0.07523302733898163,
                    0.19141243398189545,
                    -0.11497140675783157,
                    0.0680181235074997,
                    -0.17661383748054504,
                    0.21626238524913788,
                    0.17904804646968842,
                    -0.1625252217054367,
                    0.08930523693561554,
                    -0.03856202960014343,
                    -0.12999087572097778,
                    0.08903045952320099,
                    0.009705901145935059,
                    0.19701774418354034,
                    -0.1568826287984848,
                    0.008204907178878784,
                    -0.0667237788438797,
                    -0.1313476264476776,
                    -0.17170481383800507,
                    0.05007658898830414,
                    0.07867969572544098,
                    0.1259012371301651,
                    0.19085334241390228,
                    -0.062101587653160095,
                    -0.11311296373605728,
                    0.1472501903772354,
                    0.032797038555145264,
                    -0.16593219339847565,
                    0.1431010514497757,
                    0.11684150993824005,
                    -0.14370271563529968,
                    -0.08170896768569946,
                    0.13102959096431732,
                    -0.17393501102924347,
                    0.17172999680042267,
                    -0.063260018825531,
                    -0.12733417749404907,
                    -0.1756289005279541,
                    -0.10415683686733246,
                    0.11652342975139618,
                    -0.20895333588123322,
                    -0.10472681373357773,
                    -0.07595761120319366,
                    -0.21249528229236603,
                    0.038537755608558655,
                    -0.12163522839546204,
                    0.07489101588726044,
                    0.1069752424955368,
                    -0.0693269819021225,
                    0.030081316828727722,
                    0.12002651393413544,
                    -0.07373762130737305,
                    -0.021450132131576538,
                    -0.10648428648710251,
                    0.022631630301475525,
                    0.20623363554477692,
                    0.16702456772327423,
                    0.15860004723072052,
                    -0.02640695869922638
                ],
                [
                    0.0988774448633194,
                    -0.009315237402915955,
                    -0.005624160170555115,
                    -0.008657872676849365,
                    -0.1227065846323967,
                    0.19017837941646576,
                    -0.12940049171447754,
                    0.031874656677246094,
                    0.15453128516674042,
                    -0.0009982585906982422,
                    -0.08910603821277618,
                    -0.08580385148525238,
                    -0.15220288932323456,
                    0.1348387449979782,
                    -0.04093289375305176,
                    0.0265548974275589,
                    -0.1797603964805603,
                    0.10027249157428741,
                    0.023061618208885193,
                    0.12950848042964935,
                    -0.08557389676570892,
                    0.048667147755622864,
                    -0.017619311809539795,
                    -0.14905527234077454,
                    -0.017576321959495544,
                    -0.17055954039096832,
                    0.15890945494174957,
                    0.16671235859394073,
                    -0.16611501574516296,
                    -0.1807664930820465,
                    0.07392887771129608,
                    0.09446121752262115,
                    0.09311695396900177,
                    -0.20626278221607208,
                    0.20484469830989838,
                    -0.10929179936647415,
                    -0.0720951110124588,
                    -0.15449613332748413,
                    -0.06694269180297852,
                    -0.16745196282863617,
                    0.07220469415187836,
                    0.15070582926273346,
                    0.051097527146339417,
                    -0.02531026303768158,
                    0.05175267159938812,
                    0.12613455951213837,
                    0.13575147092342377,
                    0.13085053861141205,
                    -0.048489153385162354,
                    0.08326993882656097,
                    -0.08614614605903625,
                    -0.126414954662323,
                    -0.14355427026748657,
                    0.13041909039020538,
                    -0.19387187063694,
                    0.026900798082351685,
                    0.1860934942960739,
                    0.14892373979091644,
                    0.018634721636772156,
                    -0.09901830554008484,
                    0.047074273228645325,
                    -0.05546000599861145,
                    0.06450347602367401,
                    0.020513445138931274
                ],
                [
                    -0.17304280400276184,
                    -0.15932463109493256,
                    0.15118496119976044,
                    -0.17542734742164612,
                    -0.022877853363752365,
                    0.09504572302103043,
                    -0.05715373903512955,
                    -0.0723053514957428,
                    -0.20129650831222534,
                    0.09247368574142456,
                    0.021465152502059937,
                    0.1378810852766037,
                    0.07714645564556122,
                    0.02592102251946926,
                    -0.00359547627158463,
                    -0.3326370418071747,
                    0.18539229035377502,
                    -0.1495581716299057,
                    -0.019370898604393005,
                    0.022203750908374786,
                    0.08890349417924881,
                    -0.05922083184123039,
                    -0.11200407892465591,
                    -0.18198706209659576,
                    0.14141862094402313,
                    -0.016444651409983635,
                    -0.00709649920463562,
                    0.16186681389808655,
                    -0.06140280142426491,
                    -0.0644431859254837,
                    0.09330270439386368,
                    0.02332283928990364,
                    -0.22697362303733826,
                    -0.06399288773536682,
                    -0.12452944368124008,
                    0.13014596700668335,
                    0.09396132081747055,
                    -0.02453809790313244,
                    -0.17020632326602936,
                    0.030989915132522583,
                    -0.565116286277771,
                    -0.17283369600772858,
                    -0.03566284477710724,
                    -0.10048261284828186,
                    0.04691718518733978,
                    -0.047411564737558365,
                    0.1006409153342247,
                    -0.012913128361105919,
                    -0.019443636760115623,
                    -0.15689681470394135,
                    -0.05352460965514183,
                    0.139875590801239,
                    -0.039499521255493164,
                    -0.2625201642513275,
                    0.1601824313402176,
                    0.04744391143321991,
                    -0.18943630158901215,
                    0.15471243858337402,
                    -0.06953289359807968,
                    0.11055045574903488,
                    0.00964395422488451,
                    -0.1144542470574379,
                    0.12850506603717804,
                    -0.386361300945282
                ],
                [
                    0.07478310167789459,
                    -0.13742464780807495,
                    -0.1077655553817749,
                    0.06271538138389587,
                    -0.20830388367176056,
                    -0.03763358294963837,
                    0.15132245421409607,
                    0.07169567048549652,
                    0.14465805888175964,
                    -0.1404656320810318,
                    -0.09144630283117294,
                    -0.07130424678325653,
                    0.10884498804807663,
                    0.014982357621192932,
                    -0.10488579422235489,
                    0.09690367430448532,
                    -0.11584407836198807,
                    -0.06176431477069855,
                    -0.16316504776477814,
                    0.029532333835959435,
                    0.13409966230392456,
                    0.12515568733215332,
                    -0.06434381008148193,
                    0.026390433311462402,
                    -0.06632772088050842,
                    0.04004829749464989,
                    -0.017396770417690277,
                    -0.0020053426269441843,
                    0.19500088691711426,
                    0.19880875945091248,
                    0.12414191663265228,
                    0.15480750799179077,
                    0.09776008874177933,
                    0.1191413402557373,
                    0.04596234858036041,
                    0.011140535585582256,
                    -0.06662248075008392,
                    -0.07373341172933578,
                    -0.13010698556900024,
                    0.1497700959444046,
                    0.01147050317376852,
                    0.022657018154859543,
                    0.20140786468982697,
                    0.20558857917785645,
                    -0.14181993901729584,
                    -0.17105978727340698,
                    0.011536716483533382,
                    -0.10896577686071396,
                    -0.23007357120513916,
                    0.10741297155618668,
                    -0.06250226497650146,
                    -0.09851935505867004,
                    -0.15536154806613922,
                    -0.12040308862924576,
                    -0.07497412711381912,
                    0.06307129561901093,
                    -0.14896389842033386,
                    -0.23782582581043243,
                    0.1506924331188202,
                    -0.2100098431110382,
                    -0.07684613764286041,
                    0.14915896952152252,
                    0.027131125330924988,
                    -0.11939997971057892
                ],
                [
                    0.1398538500070572,
                    0.10899492353200912,
                    -0.022335002198815346,
                    0.13423067331314087,
                    -0.03498237207531929,
                    -0.08902150392532349,
                    -0.01269444078207016,
                    -0.04054102301597595,
                    0.127043217420578,
                    -0.15538935363292694,
                    0.15089885890483856,
                    -0.2421943098306656,
                    -0.19461625814437866,
                    -0.16582342982292175,
                    -0.1044086441397667,
                    -0.24175433814525604,
                    -0.09936461597681046,
                    0.13247869908809662,
                    0.17523975670337677,
                    -0.12503498792648315,
                    -0.10027411580085754,
                    0.142857626080513,
                    -0.014865638688206673,
                    -0.19216598570346832,
                    -0.06147061660885811,
                    -0.21187904477119446,
                    0.016345670446753502,
                    -0.21156807243824005,
                    -0.16331003606319427,
                    0.10100137442350388,
                    0.11026137322187424,
                    -0.15073777735233307,
                    -0.12074236571788788,
                    0.011088819243013859,
                    -0.02425513043999672,
                    0.08800536394119263,
                    -0.0757986307144165,
                    0.07020040601491928,
                    -0.11634767800569534,
                    0.07119626551866531,
                    -0.11404766887426376,
                    -0.0006178948096930981,
                    -0.23702086508274078,
                    0.09371372312307358,
                    0.18018172681331635,
                    -0.061027612537145615,
                    0.019568322226405144,
                    -0.16321979463100433,
                    0.14512376487255096,
                    0.006409875117242336,
                    -0.09552114456892014,
                    -0.18500038981437683,
                    -0.26088160276412964,
                    0.006411882117390633,
                    0.03897404670715332,
                    0.0751153975725174,
                    -0.02229316532611847,
                    -0.18714329600334167,
                    -0.10287977010011673,
                    -0.14636151492595673,
                    0.13870090246200562,
                    0.12150215357542038,
                    0.02674722671508789,
                    0.06202882528305054
                ],
                [
                    0.029285483062267303,
                    0.11836328357458115,
                    0.14152969419956207,
                    0.09753400832414627,
                    -0.045280326157808304,
                    -0.05659247562289238,
                    -0.08666469156742096,
                    -0.039522185921669006,
                    -0.038118526339530945,
                    0.037444740533828735,
                    0.023236453533172607,
                    -0.15540523827075958,
                    -0.10370077192783356,
                    0.09011669456958771,
                    -0.18511010706424713,
                    -0.0036615391727536917,
                    -0.1379462033510208,
                    -0.1320783495903015,
                    0.018901169300079346,
                    0.011554458178579807,
                    -0.013516321778297424,
                    -0.11183574795722961,
                    -0.04011183977127075,
                    0.08013404905796051,
                    -0.03494944050908089,
                    0.18399350345134735,
                    0.002071650233119726,
                    -0.09807826578617096,
                    0.02837534435093403,
                    -0.10271722823381424,
                    0.0427834577858448,
                    -0.06837484985589981,
                    0.10088806599378586,
                    -0.16239513456821442,
                    0.15225426852703094,
                    -0.015218469314277172,
                    0.09386181831359863,
                    -0.08241946995258331,
                    -0.00904846377670765,
                    -0.16901782155036926,
                    -0.07766668498516083,
                    -0.28901493549346924,
                    0.11348487436771393,
                    -0.002272124169394374,
                    -0.06073928251862526,
                    -0.03916162624955177,
                    -0.2616308033466339,
                    -0.07613753527402878,
                    -0.08434190601110458,
                    -0.12627583742141724,
                    -0.16933409869670868,
                    -0.013452255167067051,
                    -0.2663297951221466,
                    -0.02917107753455639,
                    -0.0054533034563064575,
                    0.08590550720691681,
                    -0.12462206929922104,
                    -0.19173216819763184,
                    0.012915411964058876,
                    0.114390067756176,
                    0.08210189640522003,
                    0.08887484669685364,
                    -0.0390164852142334,
                    -0.17128340899944305
                ],
                [
                    -0.11870655417442322,
                    0.15197432041168213,
                    0.15844963490962982,
                    0.11731302738189697,
                    -0.06334974616765976,
                    -0.03348191827535629,
                    -0.148289754986763,
                    -0.017854750156402588,
                    -0.13967597484588623,
                    -0.11930380761623383,
                    -0.12682491540908813,
                    0.08787952363491058,
                    -0.14759564399719238,
                    -0.03735588490962982,
                    0.05618676915764809,
                    -0.16777758300304413,
                    -0.0956103578209877,
                    -0.024764493107795715,
                    -0.09133227169513702,
                    -0.02579362690448761,
                    0.1722363382577896,
                    -0.15085884928703308,
                    -0.2089253067970276,
                    -0.09866058081388474,
                    0.1571989357471466,
                    0.21463720500469208,
                    0.01993674412369728,
                    -0.10961948335170746,
                    -0.08461185544729233,
                    0.09130506217479706,
                    0.01884782500565052,
                    0.18481110036373138,
                    0.14057475328445435,
                    -0.09684362262487411,
                    0.1328892856836319,
                    0.11667300015687943,
                    0.003994099795818329,
                    -0.029244551435112953,
                    -0.14560580253601074,
                    0.1724778562784195,
                    0.06154250353574753,
                    -0.19465860724449158,
                    0.03616456687450409,
                    0.11711898446083069,
                    -0.015308842062950134,
                    0.019895464181900024,
                    -0.031156769022345543,
                    0.031189724802970886,
                    -0.13452306389808655,
                    -0.08160887658596039,
                    0.11321602016687393,
                    0.14446063339710236,
                    0.01676834002137184,
                    -0.263048380613327,
                    -0.1493104100227356,
                    0.027569368481636047,
                    0.16088514029979706,
                    0.05958952754735947,
                    -0.12976042926311493,
                    -0.10232842713594437,
                    0.04821328818798065,
                    -0.09349831938743591,
                    -0.11603661626577377,
                    0.07267703860998154
                ],
                [
                    0.1263974905014038,
                    0.16333213448524475,
                    -0.1564735770225525,
                    -0.1953948736190796,
                    0.07935324311256409,
                    -0.0004621296830009669,
                    -0.12243162840604782,
                    -0.10821706801652908,
                    0.08958696573972702,
                    0.019325584173202515,
                    -0.16827009618282318,
                    -0.09027253836393356,
                    -0.1727721393108368,
                    -0.048816923052072525,
                    0.04834218695759773,
                    0.11415135860443115,
                    0.06114770472049713,
                    -0.006258413195610046,
                    -0.0861494168639183,
                    -0.14345592260360718,
                    -0.07252602279186249,
                    0.15719909965991974,
                    0.020016923546791077,
                    0.18016763031482697,
                    0.04782755300402641,
                    0.16460852324962616,
                    -0.08390606194734573,
                    -0.1488853394985199,
                    0.03980662301182747,
                    0.16039259731769562,
                    0.09073074162006378,
                    -0.07837500423192978,
                    -0.25141432881355286,
                    0.13085030019283295,
                    -0.15806904435157776,
                    0.13163259625434875,
                    0.01159569714218378,
                    0.038045112043619156,
                    -0.00315571716055274,
                    0.03934936225414276,
                    -0.15314796566963196,
                    -0.14808812737464905,
                    0.05958164110779762,
                    -0.03457976505160332,
                    0.1357852816581726,
                    0.08786451816558838,
                    0.01642947643995285,
                    0.06562794744968414,
                    -0.22654683887958527,
                    -0.21176236867904663,
                    -0.15144015848636627,
                    -0.23008416593074799,
                    -0.12341051548719406,
                    -0.10609003901481628,
                    -0.06892592459917068,
                    -0.08712396025657654,
                    -0.03886719048023224,
                    -0.14833353459835052,
                    0.1275467872619629,
                    0.050461381673812866,
                    0.11172395944595337,
                    0.008232813328504562,
                    -0.011332675814628601,
                    0.061097484081983566
                ],
                [
                    0.07506763935089111,
                    0.10840807855129242,
                    0.011643829755485058,
                    -0.02283061482012272,
                    -0.21327365934848785,
                    -0.19173835217952728,
                    0.12645643949508667,
                    0.06082849204540253,
                    0.05431323125958443,
                    0.15462155640125275,
                    0.04934145510196686,
                    -0.12957867980003357,
                    -0.023875705897808075,
                    0.004790768027305603,
                    0.06793127954006195,
                    0.09191350638866425,
                    -0.04581435024738312,
                    -0.10986756533384323,
                    -0.07284584641456604,
                    -0.1893908530473709,
                    -0.04789109528064728,
                    0.19806042313575745,
                    0.1960216611623764,
                    -0.21480436623096466,
                    -0.17687496542930603,
                    -0.1141970157623291,
                    -0.13467861711978912,
                    -0.16343291103839874,
                    -0.03349221870303154,
                    0.08059945702552795,
                    0.08707540482282639,
                    -0.16996891796588898,
                    -0.009715810418128967,
                    0.18166209757328033,
                    0.18303845822811127,
                    0.05344131216406822,
                    0.198222815990448,
                    0.08068498969078064,
                    -0.005278230179101229,
                    -0.08657479286193848,
                    0.001206622808240354,
                    0.10792302340269089,
                    -0.054863810539245605,
                    -0.007806106936186552,
                    0.12279300391674042,
                    -0.054297298192977905,
                    0.001420553307980299,
                    -0.16233237087726593,
                    0.04168583080172539,
                    0.11535803973674774,
                    -0.06064457446336746,
                    -0.03195218741893768,
                    0.09006944298744202,
                    -0.19820557534694672,
                    -0.19220860302448273,
                    -0.10307639092206955,
                    0.12354765832424164,
                    -0.11497217416763306,
                    0.1529178023338318,
                    -0.20788195729255676,
                    0.13916191458702087,
                    0.05242694541811943,
                    0.1063588410615921,
                    -0.01375851035118103
                ],
                [
                    0.10296209901571274,
                    0.027870656922459602,
                    0.20299553871154785,
                    -0.03377079218626022,
                    0.13395288586616516,
                    0.13811835646629333,
                    0.16953469812870026,
                    -0.09299677610397339,
                    0.055753011256456375,
                    0.07085070013999939,
                    -0.11510571837425232,
                    0.09382902085781097,
                    0.05637079477310181,
                    -0.14448004961013794,
                    0.07606451958417892,
                    0.14256738126277924,
                    0.09142805635929108,
                    -0.10173764824867249,
                    -0.08926884829998016,
                    0.17592984437942505,
                    0.1153566986322403,
                    -0.23421664535999298,
                    0.04337514936923981,
                    -0.20765304565429688,
                    0.12023232132196426,
                    -0.21478985249996185,
                    0.08011098951101303,
                    0.010899588465690613,
                    0.19924218952655792,
                    0.1941559761762619,
                    -0.007423575967550278,
                    -0.09606236219406128,
                    -0.04007848724722862,
                    -0.05797625705599785,
                    -0.2036610245704651,
                    -0.0020481040701270103,
                    0.15076342225074768,
                    -0.07987178862094879,
                    0.03742147982120514,
                    0.142209991812706,
                    0.1251831352710724,
                    -0.13050107657909393,
                    -0.17726397514343262,
                    -0.04630332067608833,
                    -0.08118094503879547,
                    0.014663144946098328,
                    0.010996467433869839,
                    -0.0019637495279312134,
                    -0.049713920801877975,
                    -0.05138235539197922,
                    -0.11611541360616684,
                    0.12379388511180878,
                    -0.013157054781913757,
                    0.010624833405017853,
                    -0.13506633043289185,
                    -0.04115067422389984,
                    0.19318746030330658,
                    0.04592279717326164,
                    -0.09326119720935822,
                    0.05601730942726135,
                    0.1331973820924759,
                    0.14645281434059143,
                    0.10991944372653961,
                    -0.12687359750270844
                ],
                [
                    -0.19220341742038727,
                    0.007259246427565813,
                    0.10705043375492096,
                    -0.2530294954776764,
                    -0.2755235433578491,
                    -0.01226764265447855,
                    -0.17218542098999023,
                    0.03980515897274017,
                    -0.0702395886182785,
                    -0.19424058496952057,
                    -0.021821260452270508,
                    -0.0943291038274765,
                    -0.11564468592405319,
                    -0.0002957839169539511,
                    -0.1762252151966095,
                    0.05061269551515579,
                    -0.0909833237528801,
                    0.18378664553165436,
                    0.07228174060583115,
                    -0.4117892384529114,
                    -0.112057164311409,
                    -0.1967485547065735,
                    0.06084878742694855,
                    0.04555920138955116,
                    0.07059110701084137,
                    -0.09634885936975479,
                    -0.1911740005016327,
                    0.07692255824804306,
                    -0.11341386288404465,
                    -0.09394708275794983,
                    0.12107246369123459,
                    0.10161923617124557,
                    -0.0657961294054985,
                    -0.31829768419265747,
                    -0.00019556036568246782,
                    -0.13383208215236664,
                    0.008884940296411514,
                    -0.15629413723945618,
                    0.00945711974054575,
                    -0.023676052689552307,
                    -0.26989659667015076,
                    -0.22776953876018524,
                    0.09212648868560791,
                    -0.13364775478839874,
                    -0.08267792314291,
                    -0.2269856482744217,
                    0.03123006410896778,
                    -0.2220580130815506,
                    0.07433655858039856,
                    -0.04339621588587761,
                    0.12902958691120148,
                    -0.1156197264790535,
                    0.18887946009635925,
                    -0.2992725074291229,
                    0.02790328860282898,
                    -0.09811316430568695,
                    0.019875839352607727,
                    0.01219777762889862,
                    -0.12362360209226608,
                    0.06090821325778961,
                    -0.10069293528795242,
                    -0.09353361278772354,
                    -0.0730501115322113,
                    -0.3055453598499298
                ],
                [
                    -0.035079535096883774,
                    -0.15783849358558655,
                    0.031940579414367676,
                    0.009210057556629181,
                    0.12225706875324249,
                    0.007110122591257095,
                    -0.2355666160583496,
                    0.10207328200340271,
                    -0.013494335114955902,
                    0.03787441924214363,
                    0.189169242978096,
                    -0.17732834815979004,
                    -0.12594589591026306,
                    0.015837788581848145,
                    -0.20216946303844452,
                    0.04220513626933098,
                    -0.1689121127128601,
                    -0.07266446948051453,
                    -0.017969965934753418,
                    -0.04729193076491356,
                    0.18445463478565216,
                    -0.2952365577220917,
                    0.11317537724971771,
                    -0.21004684269428253,
                    0.08348919451236725,
                    -0.21276605129241943,
                    -0.11870303004980087,
                    0.041051819920539856,
                    -0.16191762685775757,
                    -0.0397738479077816,
                    0.04747339338064194,
                    -0.1874103844165802,
                    -0.2751101553440094,
                    0.0831306204199791,
                    -0.15963444113731384,
                    -0.14560799300670624,
                    -0.22861410677433014,
                    0.1377672702074051,
                    -0.05659950152039528,
                    0.042118534445762634,
                    -0.17447757720947266,
                    0.09060275554656982,
                    0.13695620000362396,
                    0.05618797242641449,
                    -0.18462789058685303,
                    -0.07907279580831528,
                    -0.03988949954509735,
                    0.07318206876516342,
                    -0.05693797022104263,
                    -0.31176692247390747,
                    0.030296217650175095,
                    -0.03656923398375511,
                    0.00861950870603323,
                    -0.08929707854986191,
                    -0.16990794241428375,
                    -0.01833765208721161,
                    0.19130928814411163,
                    -0.1862802654504776,
                    0.0594337098300457,
                    0.06402593851089478,
                    -0.15933920443058014,
                    -0.02692648582160473,
                    -0.05858802795410156,
                    0.07925935834646225
                ],
                [
                    0.08352021127939224,
                    0.11357716470956802,
                    0.19002559781074524,
                    0.010675645433366299,
                    0.17303119599819183,
                    -0.045511394739151,
                    0.07842516899108887,
                    -0.18289223313331604,
                    0.179385244846344,
                    0.0966925248503685,
                    -0.0778331384062767,
                    0.12106864154338837,
                    -0.18084944784641266,
                    0.061603888869285583,
                    0.20015645027160645,
                    -0.15420448780059814,
                    -0.1448897421360016,
                    -0.16716857254505157,
                    -0.026214778423309326,
                    0.06017589569091797,
                    0.19762901961803436,
                    -0.08206900209188461,
                    -0.18898499011993408,
                    0.2142210751771927,
                    0.11116895824670792,
                    -0.03935243561863899,
                    0.15560433268547058,
                    0.0254267156124115,
                    0.14458464086055756,
                    0.041073694825172424,
                    -0.16280731558799744,
                    0.1875518411397934,
                    -0.0419459231197834,
                    0.014659161679446697,
                    0.20167739689350128,
                    -0.010455652140080929,
                    0.07343491166830063,
                    -0.00037467762012965977,
                    0.021720517426729202,
                    -0.09792692214250565,
                    0.11086812615394592,
                    -0.12234644591808319,
                    -0.11788148432970047,
                    -0.07977969944477081,
                    0.03597289323806763,
                    -0.16861483454704285,
                    -0.023919126018881798,
                    0.2092924565076828,
                    -0.016351813450455666,
                    -0.13080410659313202,
                    0.08799265325069427,
                    -0.17748357355594635,
                    0.16847006976604462,
                    -0.01971633918583393,
                    0.13283507525920868,
                    -0.20313477516174316,
                    -0.0796770304441452,
                    0.032986003905534744,
                    0.17868974804878235,
                    0.022059351205825806,
                    0.18125075101852417,
                    0.0783931240439415,
                    -0.1294841170310974,
                    0.007471338380128145
                ],
                [
                    -0.13211290538311005,
                    0.0016819988377392292,
                    -0.2028956562280655,
                    0.1815880686044693,
                    0.05564289540052414,
                    0.09093723446130753,
                    -0.009599604643881321,
                    -0.005282988306134939,
                    0.1618969589471817,
                    0.15852993726730347,
                    0.08424755185842514,
                    0.045820679515600204,
                    -0.17021656036376953,
                    0.15053799748420715,
                    -0.03824053332209587,
                    0.11439342051744461,
                    0.1703314185142517,
                    -0.07904887944459915,
                    0.13844314217567444,
                    0.04661615937948227,
                    0.02300388365983963,
                    -0.004393101669847965,
                    -0.041752081364393234,
                    -0.016899053007364273,
                    0.09713608771562576,
                    -0.15517424046993256,
                    -0.1624380201101303,
                    -0.02892282046377659,
                    -0.16374386847019196,
                    0.1949802041053772,
                    -0.09219952672719955,
                    0.02891743741929531,
                    -0.1518552303314209,
                    0.16059193015098572,
                    -0.02103419601917267,
                    -0.1248350739479065,
                    -0.07165542989969254,
                    -0.1820937544107437,
                    0.0005393610917963088,
                    -0.21353968977928162,
                    0.12743116915225983,
                    -0.12285585701465607,
                    -0.019873276352882385,
                    0.08379413932561874,
                    0.1397504359483719,
                    -0.17224334180355072,
                    0.07681369036436081,
                    -0.08091475814580917,
                    -0.1254645586013794,
                    0.021018726751208305,
                    -0.04033832624554634,
                    0.07470352947711945,
                    -0.04378029331564903,
                    -0.09681975841522217,
                    -0.20296458899974823,
                    0.13931910693645477,
                    -0.0823945701122284,
                    -0.022594183683395386,
                    -0.23869816958904266,
                    0.04419661685824394,
                    -0.07787374407052994,
                    -0.08970184624195099,
                    0.04915188252925873,
                    0.009570765309035778
                ],
                [
                    -0.14032196998596191,
                    0.07386791706085205,
                    -0.2216290831565857,
                    0.014493049122393131,
                    0.0821092501282692,
                    -0.10313550382852554,
                    0.19007977843284607,
                    -0.0043546962551772594,
                    0.03600208833813667,
                    0.12299587577581406,
                    0.07128141075372696,
                    -0.20896103978157043,
                    -0.11523785442113876,
                    -0.12477756291627884,
                    -0.057871315628290176,
                    0.08722452074289322,
                    -0.02598705142736435,
                    0.013186619617044926,
                    0.06688812375068665,
                    0.13539810478687286,
                    -0.15243354439735413,
                    0.027277572080492973,
                    -0.08991457521915436,
                    0.14942589402198792,
                    0.06161561980843544,
                    0.1837281435728073,
                    -0.12748266756534576,
                    -0.16779780387878418,
                    0.19381684064865112,
                    -0.07465879619121552,
                    0.12387783080339432,
                    -0.006675661075860262,
                    -0.2836654782295227,
                    0.10819347202777863,
                    -0.036752164363861084,
                    0.134747713804245,
                    -0.21859291195869446,
                    -0.19056902825832367,
                    -0.0745033398270607,
                    -0.21741338074207306,
                    -0.21502803266048431,
                    -0.13434921205043793,
                    0.07072680443525314,
                    -0.030205607414245605,
                    0.16548307240009308,
                    -0.06020226702094078,
                    -0.09760507196187973,
                    -0.031013982370495796,
                    -0.12642762064933777,
                    -0.061475418508052826,
                    0.1459483653306961,
                    -0.04369201511144638,
                    -0.21689951419830322,
                    0.05094530060887337,
                    -0.07459090650081635,
                    -0.0581451952457428,
                    0.03469930589199066,
                    -0.03936323523521423,
                    -0.25667691230773926,
                    -0.054367516189813614,
                    -0.22968271374702454,
                    0.16170014441013336,
                    -0.13282909989356995,
                    -0.0876162201166153
                ],
                [
                    -0.005375564098358154,
                    -0.010177014395594597,
                    0.11513219773769379,
                    -0.03869142383337021,
                    0.05466717854142189,
                    0.13690310716629028,
                    -0.08594345301389694,
                    0.004502642899751663,
                    0.02422763779759407,
                    -0.1407286822795868,
                    -0.09058962762355804,
                    -0.07743453979492188,
                    -0.17330342531204224,
                    -0.2164251059293747,
                    0.07642297446727753,
                    0.20755331218242645,
                    -0.12342055141925812,
                    0.009133592247962952,
                    -0.12584823369979858,
                    0.04389793798327446,
                    -0.1404101848602295,
                    0.07846914231777191,
                    0.044178370386362076,
                    -0.14656740427017212,
                    0.043702106922864914,
                    -0.056929100304841995,
                    -0.10951125621795654,
                    -0.15903162956237793,
                    0.12150866538286209,
                    -0.02835448645055294,
                    0.06688925623893738,
                    -0.037439726293087006,
                    -0.10045592486858368,
                    0.10166256874799728,
                    0.09139944612979889,
                    -0.020364608615636826,
                    0.11754033714532852,
                    -0.008584832772612572,
                    0.0880439504981041,
                    -0.23698095977306366,
                    0.3965504467487335,
                    -0.13284006714820862,
                    0.10003648698329926,
                    -0.23169437050819397,
                    -0.19321894645690918,
                    0.03270620107650757,
                    0.09762817621231079,
                    -0.12064620107412338,
                    -0.2034837305545807,
                    -0.09398841112852097,
                    0.1151496171951294,
                    -0.039363667368888855,
                    -0.08560016751289368,
                    0.46518373489379883,
                    -0.21058078110218048,
                    0.1804947704076767,
                    -0.03903232514858246,
                    0.16983851790428162,
                    -0.05396915227174759,
                    -0.046899233013391495,
                    -0.09523915499448776,
                    0.07324536144733429,
                    -0.06780411303043365,
                    0.3479958474636078
                ],
                [
                    0.01076898816972971,
                    0.05382222682237625,
                    -0.008424724452197552,
                    -0.21632927656173706,
                    -0.029995856806635857,
                    -0.002723373705521226,
                    0.14942879974842072,
                    -0.06920035183429718,
                    0.14822840690612793,
                    0.18369020521640778,
                    0.18105530738830566,
                    0.1818806529045105,
                    -0.049113452434539795,
                    0.05886413902044296,
                    -0.16798806190490723,
                    -0.08826614916324615,
                    0.10779205709695816,
                    0.09702529013156891,
                    0.007123169489204884,
                    0.025647643953561783,
                    -0.04277021810412407,
                    0.19653934240341187,
                    -0.1904258280992508,
                    0.14946776628494263,
                    0.13667234778404236,
                    -0.012512016110122204,
                    0.04482392221689224,
                    0.07528192549943924,
                    -0.1029394268989563,
                    0.13076795637607574,
                    0.04550550878047943,
                    0.1705671101808548,
                    0.1533089429140091,
                    -0.11050848662853241,
                    -0.03680696338415146,
                    -0.07451305538415909,
                    -0.06877806782722473,
                    -0.1070730984210968,
                    0.03781796991825104,
                    -0.031379133462905884,
                    -0.03627222031354904,
                    -0.007277720142155886,
                    -0.018041647970676422,
                    0.06881440430879593,
                    0.020717039704322815,
                    0.19770477712154388,
                    -0.24238704144954681,
                    0.1315235048532486,
                    0.04758286103606224,
                    -0.13146166503429413,
                    0.08991163969039917,
                    -0.15409427881240845,
                    0.12248548120260239,
                    0.09434373676776886,
                    -0.1561356782913208,
                    0.08508940041065216,
                    -0.2096003293991089,
                    0.09649184346199036,
                    0.15674029290676117,
                    -0.0951453372836113,
                    -0.028458518907427788,
                    -0.14447802305221558,
                    -0.02499222755432129,
                    -0.1619361937046051
                ],
                [
                    0.03486106917262077,
                    -0.17920158803462982,
                    0.03428930789232254,
                    0.0023472218308597803,
                    0.09930803626775742,
                    -0.176946222782135,
                    -0.14531467854976654,
                    0.08068953454494476,
                    -0.18438780307769775,
                    -0.1390184611082077,
                    0.13345374166965485,
                    -0.17706865072250366,
                    -0.05423184484243393,
                    -0.014314249157905579,
                    -0.05347800627350807,
                    0.11785967648029327,
                    0.21598263084888458,
                    -0.08350969851016998,
                    -0.1452920138835907,
                    -0.06411780416965485,
                    -0.006887078285217285,
                    -0.047159481793642044,
                    0.03989209234714508,
                    0.12891395390033722,
                    -0.11374570429325104,
                    0.10480393469333649,
                    0.1334330290555954,
                    -0.0907234251499176,
                    0.14028207957744598,
                    -0.13258591294288635,
                    -0.02274835854768753,
                    -0.19002605974674225,
                    -0.0419657938182354,
                    -0.03047478012740612,
                    -0.04625275731086731,
                    0.008701208047568798,
                    0.0750555470585823,
                    0.002687260042876005,
                    0.164296492934227,
                    0.07406266033649445,
                    -0.19926320016384125,
                    -0.019617049023509026,
                    0.0825037807226181,
                    -0.03362753987312317,
                    0.006416007876396179,
                    -0.04954501986503601,
                    0.10407058894634247,
                    0.0017668753862380981,
                    0.1665031611919403,
                    -0.13940589129924774,
                    -0.014552107080817223,
                    0.12061615288257599,
                    -0.0652485266327858,
                    -0.0393330417573452,
                    -0.14913341403007507,
                    -0.17469382286071777,
                    -0.058263808488845825,
                    0.07346389442682266,
                    -0.013577158562839031,
                    0.11820953339338303,
                    -0.06258805841207504,
                    -0.16292965412139893,
                    -0.02301006019115448,
                    -0.0035055233165621758
                ],
                [
                    0.21810214221477509,
                    0.05389193817973137,
                    0.02327164076268673,
                    -0.01257804874330759,
                    -0.1789979785680771,
                    -0.17189572751522064,
                    0.17228838801383972,
                    0.21053500473499298,
                    0.07271037995815277,
                    -0.0904732197523117,
                    -0.12648075819015503,
                    0.0704985111951828,
                    -0.025103524327278137,
                    0.1370367556810379,
                    -0.048275988548994064,
                    -0.024018872529268265,
                    -0.14110204577445984,
                    -0.18773116171360016,
                    -0.14483177661895752,
                    0.10087321698665619,
                    -0.16826790571212769,
                    -0.04097304120659828,
                    -0.21186697483062744,
                    0.09962555766105652,
                    -0.2030249983072281,
                    -0.09725220501422882,
                    0.13148091733455658,
                    -0.016809822991490364,
                    -0.1114988848567009,
                    0.1002432256937027,
                    0.03163868561387062,
                    -0.030656889081001282,
                    -0.06874243915081024,
                    -0.18086302280426025,
                    0.08529159426689148,
                    -0.012252036482095718,
                    0.002141984412446618,
                    0.13852638006210327,
                    -0.14534832537174225,
                    0.20046217739582062,
                    0.027921175584197044,
                    0.19179318845272064,
                    -0.032328784465789795,
                    -0.19179275631904602,
                    0.11676178872585297,
                    0.07198385149240494,
                    0.15006132423877716,
                    -0.2040877491235733,
                    0.0026243096217513084,
                    0.05072842165827751,
                    0.10805487632751465,
                    0.014062222093343735,
                    0.16596119105815887,
                    -0.06429595500230789,
                    -0.12532496452331543,
                    -0.1799427568912506,
                    -0.11043909192085266,
                    0.17222771048545837,
                    0.050363801419734955,
                    -0.050956398248672485,
                    -0.19714875519275665,
                    -0.10756121575832367,
                    0.020573526620864868,
                    -0.21792788803577423
                ],
                [
                    0.14115212857723236,
                    -0.0382479690015316,
                    0.19031625986099243,
                    0.12069953978061676,
                    -0.18609276413917542,
                    0.17175652086734772,
                    -0.02187289297580719,
                    0.16474680602550507,
                    -0.09304095059633255,
                    -0.17953285574913025,
                    0.044215187430381775,
                    0.11617450416088104,
                    0.019618883728981018,
                    0.14735688269138336,
                    -0.10518214106559753,
                    0.08200334012508392,
                    -0.08672086894512177,
                    -0.16000084578990936,
                    -0.1188051700592041,
                    0.19019301235675812,
                    -0.11552274972200394,
                    -0.1052091121673584,
                    0.1486416906118393,
                    -0.14856848120689392,
                    0.017891133204102516,
                    0.03675206005573273,
                    -0.06610056757926941,
                    0.21646417677402496,
                    -0.0014532228233292699,
                    0.0365401953458786,
                    -0.05197630822658539,
                    -0.021036935970187187,
                    -0.034719958901405334,
                    0.11034408956766129,
                    -0.03745041415095329,
                    -0.06385649740695953,
                    0.02700783684849739,
                    -0.14887134730815887,
                    -0.19594143331050873,
                    0.10866077244281769,
                    0.050097957253456116,
                    0.057956114411354065,
                    0.08949322998523712,
                    0.015767991542816162,
                    -0.20633582770824432,
                    -0.05538226664066315,
                    0.17760755121707916,
                    -0.11888305097818375,
                    -0.13882362842559814,
                    0.17149317264556885,
                    0.13624338805675507,
                    0.04394841939210892,
                    0.12556596100330353,
                    0.20579011738300323,
                    0.002132236957550049,
                    -0.14697641134262085,
                    0.15682552754878998,
                    -0.18586434423923492,
                    -0.01596515253186226,
                    0.168547585606575,
                    0.05781339108943939,
                    0.20115454494953156,
                    0.19037334620952606,
                    -0.009101122617721558
                ]
            ],
            [
                -0.04762330278754234,
                -0.0645943209528923,
                -0.10052367299795151,
                0.0028827101923525333,
                -0.07405870407819748,
                0.0022152417805045843,
                -0.052771423012018204,
                -0.056210655719041824,
                -0.052961207926273346,
                -0.009508694522082806,
                -0.014872035942971706,
                -0.030038515105843544,
                -0.0709918737411499,
                -0.04451436176896095,
                -0.06281648576259613,
                0.024943817406892776,
                -0.06449095159769058,
                -0.03728850930929184,
                -0.0307150911539793,
                -0.02247120626270771,
                -0.06893490254878998,
                -0.05067511275410652,
                -0.007719406392425299,
                -0.026648489758372307,
                -0.046957630664110184,
                -0.03451252728700638,
                -0.04121244326233864,
                -0.06039537116885185,
                -0.06220545247197151,
                -0.037440601736307144,
                -0.08771110326051712,
                0.005207109730690718,
                -0.0026432389859110117,
                -0.054794952273368835,
                -0.06575179845094681,
                -0.06557131558656693,
                -0.06023731455206871,
                -0.027297871187329292,
                -0.036199137568473816,
                -0.0637688934803009,
                0.2113141268491745,
                0.007802380248904228,
                -0.05989769101142883,
                -0.051449887454509735,
                0.016719913110136986,
                -0.05044872686266899,
                -0.08214191347360611,
                -0.09946196526288986,
                -0.06517259031534195,
                0.15458209812641144,
                -0.059219229966402054,
                -0.028903702273964882,
                -0.01065520104020834,
                0.16538922488689423,
                -0.005008826032280922,
                -0.0315043181180954,
                -0.00796265248209238,
                0.23599594831466675,
                -0.0949864536523819,
                -0.03242656961083412,
                -0.06848188489675522,
                -0.044454969465732574,
                -0.02916567213833332,
                0.17569990456104279
            ],
            [
                [
                    -0.0011070157634094357,
                    -0.10961209237575531,
                    -0.02781202271580696,
                    -0.02193758822977543
                ],
                [
                    -0.14114704728126526,
                    -0.08938632905483246,
                    -0.015515122562646866,
                    0.010152896866202354
                ],
                [
                    0.061667490750551224,
                    0.13403676450252533,
                    0.05327644571661949,
                    0.05621786043047905
                ],
                [
                    -0.2176772803068161,
                    -0.12999285757541656,
                    -0.1149679571390152,
                    -0.23896002769470215
                ],
                [
                    0.013489831238985062,
                    -0.15660437941551208,
                    0.1350758820772171,
                    0.02304103597998619
                ],
                [
                    -0.17708367109298706,
                    -0.023796651512384415,
                    -0.22248196601867676,
                    -0.16437824070453644
                ],
                [
                    0.1445915400981903,
                    0.18261821568012238,
                    -0.14553146064281464,
                    -0.028650201857089996
                ],
                [
                    0.2482537478208542,
                    -0.05558003485202789,
                    -0.21444188058376312,
                    -0.25102317333221436
                ],
                [
                    0.005194486118853092,
                    0.21148692071437836,
                    0.089410200715065,
                    0.17770563066005707
                ],
                [
                    -0.16541916131973267,
                    -0.07447536289691925,
                    -0.1128779873251915,
                    -0.20379233360290527
                ],
                [
                    0.2737129330635071,
                    -0.00467950152233243,
                    0.0328601710498333,
                    -0.09437815099954605
                ],
                [
                    0.1025286316871643,
                    -0.223186656832695,
                    0.21706371009349823,
                    0.061936426907777786
                ],
                [
                    -0.07952693849802017,
                    0.10291067510843277,
                    -0.12876462936401367,
                    -0.18738070130348206
                ],
                [
                    0.2599209249019623,
                    -0.18312501907348633,
                    0.020171277225017548,
                    -0.12586641311645508
                ],
                [
                    -0.13547052443027496,
                    -0.08662669360637665,
                    -0.0356193408370018,
                    -0.04713205248117447
                ],
                [
                    -0.2896602153778076,
                    -0.28795933723449707,
                    -0.04767191410064697,
                    -0.27719646692276
                ],
                [
                    0.042386602610349655,
                    -0.019745448604226112,
                    -0.10984447598457336,
                    -0.12621396780014038
                ],
                [
                    0.24150098860263824,
                    0.21725736558437347,
                    0.10313215106725693,
                    0.11130605638027191
                ],
                [
                    0.07654424756765366,
                    -0.24319210648536682,
                    0.008619187399744987,
                    0.26430371403694153
                ],
                [
                    -0.052907831966876984,
                    -0.10553997755050659,
                    0.08995790034532547,
                    0.09115692228078842
                ],
                [
                    -0.039521463215351105,
                    0.18159271776676178,
                    0.2831430733203888,
                    -0.24911059439182281
                ],
                [
                    -0.12062477320432663,
                    -0.057061366736888885,
                    -0.1466565728187561,
                    -0.08202660828828812
                ],
                [
                    0.059611573815345764,
                    0.293544203042984,
                    0.03317445144057274,
                    0.1511218398809433
                ],
                [
                    0.06651269644498825,
                    0.2750403583049774,
                    -0.19933409988880157,
                    0.23644717037677765
                ],
                [
                    -0.07649893313646317,
                    -0.02494366094470024,
                    0.01308375783264637,
                    -0.024404356256127357
                ],
                [
                    -0.03173113241791725,
                    -0.20409448444843292,
                    0.13078276813030243,
                    0.027480047196149826
                ],
                [
                    -0.2707135081291199,
                    0.15565882623195648,
                    -0.07278241962194443,
                    0.11184506863355637
                ],
                [
                    0.1440611034631729,
                    0.11319182813167572,
                    -0.17277388274669647,
                    -0.010046686045825481
                ],
                [
                    0.10794153064489365,
                    0.214921772480011,
                    0.11341680586338043,
                    -0.2150699496269226
                ],
                [
                    0.07556729018688202,
                    -0.13596539199352264,
                    0.06853020936250687,
                    0.07774011790752411
                ],
                [
                    0.15668702125549316,
                    0.06581620872020721,
                    -0.06698980927467346,
                    0.03224465623497963
                ],
                [
                    -0.014910509809851646,
                    0.11991727352142334,
                    -0.07559908926486969,
                    -0.0578945130109787
                ],
                [
                    -0.2873210608959198,
                    -0.1898595094680786,
                    0.11361411958932877,
                    -0.011941974982619286
                ],
                [
                    -0.05482139810919762,
                    -0.14780011773109436,
                    -0.047058768570423126,
                    0.12756982445716858
                ],
                [
                    0.2654750645160675,
                    -0.019466103985905647,
                    0.023268001154065132,
                    0.07641147077083588
                ],
                [
                    -0.010564636439085007,
                    0.10131428390741348,
                    0.17359831929206848,
                    -0.05105751007795334
                ],
                [
                    0.24860349297523499,
                    -0.02851802669465542,
                    0.17474637925624847,
                    -0.015517058782279491
                ],
                [
                    0.16939787566661835,
                    -0.253032922744751,
                    0.20535911619663239,
                    0.09978055953979492
                ],
                [
                    -0.11197725683450699,
                    -0.057536933571100235,
                    -0.056296657770872116,
                    -0.08216817677021027
                ],
                [
                    0.14639608561992645,
                    0.26725050806999207,
                    0.19903820753097534,
                    0.0270219873636961
                ],
                [
                    -0.7255560159683228,
                    -0.6867692470550537,
                    -0.3583833873271942,
                    -0.6197275519371033
                ],
                [
                    -0.15376026928424835,
                    -0.21107684075832367,
                    0.05431419610977173,
                    -0.12748225033283234
                ],
                [
                    0.18718978762626648,
                    0.10663887858390808,
                    0.16634610295295715,
                    0.26253175735473633
                ],
                [
                    -0.08513660728931427,
                    -0.10290692001581192,
                    0.11353977769613266,
                    0.16422834992408752
                ],
                [
                    0.0011463504051789641,
                    0.1311105191707611,
                    -0.055700331926345825,
                    0.02362675592303276
                ],
                [
                    0.16185899078845978,
                    0.18075361847877502,
                    -0.011256521567702293,
                    0.09365339577198029
                ],
                [
                    -0.032474860548973083,
                    0.07241801172494888,
                    0.01065304595977068,
                    0.17473135888576508
                ],
                [
                    -0.017271284013986588,
                    0.07479644566774368,
                    0.15138697624206543,
                    -0.10945332050323486
                ],
                [
                    0.09145756810903549,
                    0.05722444877028465,
                    0.0295803751796484,
                    -0.019526967778801918
                ],
                [
                    -0.048251960426568985,
                    0.31662052869796753,
                    -0.3346359133720398,
                    -0.27100253105163574
                ],
                [
                    0.01623981073498726,
                    0.01401016116142273,
                    0.14685535430908203,
                    0.14489677548408508
                ],
                [
                    -0.017265042290091515,
                    -0.19596053659915924,
                    0.06797929853200912,
                    -0.2033143937587738
                ],
                [
                    -0.14253605902194977,
                    -0.11162884533405304,
                    -0.12370985746383667,
                    -0.2882669270038605
                ],
                [
                    -0.5453811883926392,
                    -0.8803466558456421,
                    -0.18149280548095703,
                    -0.6738665103912354
                ],
                [
                    0.17779412865638733,
                    0.2865975797176361,
                    0.09882320463657379,
                    -0.05058243125677109
                ],
                [
                    -0.21486863493919373,
                    0.1621500700712204,
                    0.29342758655548096,
                    -0.1625535935163498
                ],
                [
                    0.11692588031291962,
                    -0.026847857981920242,
                    -0.09197086840867996,
                    0.15770204365253448
                ],
                [
                    -0.08958262205123901,
                    0.3683643341064453,
                    -0.3769920766353607,
                    -0.32988202571868896
                ],
                [
                    0.09567916393280029,
                    -0.06308763474225998,
                    0.11864448338747025,
                    0.09858875721693039
                ],
                [
                    -0.22407658398151398,
                    0.2034386396408081,
                    0.2028893083333969,
                    -0.0928376168012619
                ],
                [
                    0.10707399249076843,
                    -0.08257991820573807,
                    0.039247412234544754,
                    0.16485005617141724
                ],
                [
                    0.03688504174351692,
                    -0.1755407154560089,
                    -0.03185340017080307,
                    0.1527872383594513
                ],
                [
                    -0.14295348525047302,
                    -0.056096915155649185,
                    0.28645390272140503,
                    0.019571304321289062
                ],
                [
                    -0.7143266797065735,
                    -0.8166031837463379,
                    -0.2501305043697357,
                    -0.454402357339859
                ]
            ],
            [
                -0.16715334355831146,
                -0.04314615577459335,
                -0.026034383103251457,
                0.05836643651127815
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
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        console.log('Model created successfully.');
        const future = new PIXI.Graphics();
        // Set the fill color and draw the circle
        future.beginFill(0xffffff); // Red color
        future.drawCircle(0 * 40, 0 * 40, 19); // x, y, radius
        future.endFill();
        app.stage.addChild(future);
        app.ticker.add(delta => ofmLoop(delta, player, enemy, world, keys, app, spawn, [940,60], model, future));
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

function ofmLoop(delta, player, enemy, world, keys, app, pspawn, espawn, model, circle) {

    //x,y,lx,ly,flag
    const inputFeatures = tf.tensor2d([[enemy.playerCollision.m_xf.position.x*40,enemy.playerCollision.m_xf.position.y*40, enemy.playerCollision.m_linearVelocity.x, enemy.playerCollision.m_linearVelocity.y, Number(enemy.hasFlag),
                                        player.playerCollision.m_xf.position.x*40,player.playerCollision.m_xf.position.y*40, player.playerCollision.m_linearVelocity.x, player.playerCollision.m_linearVelocity.y, Number(player.hasFlag)],
                                       [1, 10]]);

    const locAngle2 = Math.atan2(enemy.playerCollision.m_xf.position.x - player.playerCollision.m_xf.position.x, enemy.playerCollision.m_xf.position.y - player.playerCollision.m_xf.position.y) + Math.PI;
    const speedAngle = Math.atan2(enemy.playerCollision.m_linearVelocity.x - player.playerCollision.m_linearVelocity.x, enemy.playerCollision.m_linearVelocity.y - player.playerCollision.m_linearVelocity.y) + Math.PI;
    //create two lines, find intersection point and see which way it is more skewed?
    //avg with maxSpeed?
    //console.log("ANGLE: " + locAngle);
    //console.log("SPEEDANGLE: " + speedAngle);
    const speed = Math.sqrt(player.playerCollision.m_linearVelocity.x * player.playerCollision.m_linearVelocity.x + player.playerCollision.m_linearVelocity.y * player.playerCollision.m_linearVelocity.y);
    const playerLine = getLineEquation(player.playerCollision.m_xf.position.x, player.playerCollision.m_xf.position.y,  player.playerCollision.m_linearVelocity.y / player.playerCollision.m_linearVelocity.x);
    const enemyLine = getLineEquation(enemy.playerCollision.m_xf.position.x, enemy.playerCollision.m_xf.position.y,  enemy.playerCollision.m_linearVelocity.y / enemy.playerCollision.m_linearVelocity.x);
    const intersectionPoint = findIntersection(playerLine[0], playerLine[1], playerLine[2], enemyLine[0], enemyLine[1], enemyLine[2]);
    //map speed to time desired in future, faster speed is harder to change
    //ranges from 0 to 1.5, speed 0 to 7ish
    const futurePoint = getFuturePos(player.playerCollision.m_xf.position.x, player.playerCollision.m_xf.position.y, player.playerCollision.m_linearVelocity.x, player.playerCollision.m_linearVelocity.y, 0.0384 * speed * speed);
    const locAngle = Math.atan2(enemy.playerCollision.m_xf.position.x - futurePoint[0], enemy.playerCollision.m_xf.position.y - futurePoint[1]) + Math.PI;

    circle.x = futurePoint[0] * 40;
    circle.y = futurePoint[1] * 40;


    const keys2 = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    if (locAngle >= 7 * Math.PI / 4 || locAngle <= 1 * Math.PI / 4) {
        keys2.down = true;
    }
    if (locAngle >= 5 * Math.PI / 4 && locAngle <= 7 * Math.PI / 4) {
        keys2.left = true;
    }
    if (locAngle <= 3 * Math.PI / 4 && locAngle >= 1 * Math.PI / 4) {
        keys2.right = true;
    }
    if (locAngle >= 3 * Math.PI / 4 && locAngle <= 5 * Math.PI / 4) {
        keys2.up = true;
    }


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

function findIntersection(A1, B1, C1, A2, B2, C2) { // Ax + By = C
    A1 = convertInfinity(A1);
    B1 = convertInfinity(B1);
    C1 = convertInfinity(C1);
    A2 = convertInfinity(A2);
    B2 = convertInfinity(B2);
    C2 = convertInfinity(C2);
    const denominator = A1 * B2 - A2 * B1;

    if (denominator === 0) {
        return null; // Lines are parallel or coincident
    }

    const x = (B1 * C2 - B2 * C1) / denominator;
    const y = (A2 * C1 - A1 * C2) / denominator;

    return { x, y };
}
function getLineEquation(x,y,m){
    return [-1 * m, 1, m * x - y]; //A,B,C
}
function convertInfinity(val){
    if(val == Infinity){
        val = 99999999;
    }
    else if (val == -Infinity){
        val = -99999999;
    }
    return val;
}
function getFuturePos(x,y,v_x,v_y,t){
    return [x + v_x * t, y + v_y * t];
}
