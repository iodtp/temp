// ==UserScript==
// @name         TagPro Training Mode
// @version      1.0
// @description  TP practice while waiting for games
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/playersearch
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
        //const spawn = [80, 680];
        //const map = [["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","7","7","7","7","7","7","7","7","7","2","2","2","7"],["7","2","2","2","2","7","7","7","2","2","2","2","2","2","2","16","2","2","2","7"],["7","2","2","2","7","7","2","2","2","2","7","7","7","7","7","7","2","2","2","7"],["7","2","2","2","7","2","2","2","2","2","7","2","2","2","2","7","7","7","7","7"],["7","2","2","7","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","7"],["7","2","2","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","2","7"],["7","2","7","7","2","2","2","7","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","2","2","2","7","7","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","7","7","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","2","7","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","2","2","2","7","2","7","7","7","7","7","7","7","2","2","2","2","2","7"],["7","7","2","2","2","7","7","7","2","2","2","2","2","2","7","2","2","2","2","7"],["7","7","2","2","2","2","2","2","2","2","2","2","2","2","7","2","2","2","2","7"],["7","7","7","2","2","2","2","2","2","2","2","2","2","2","7","7","7","7","7","7"],["7","2","7","7","7","7","7","2","2","2","2","2","2","2","2","17","18","17","18","7"],["7","2","2","2","2","2","7","7","7","7","2","2","2","2","2","18","17","18","17","7"],["7","2","2","2","2","2","2","2","2","7","7","7","7","7","2","17","18","17","18","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
        const map =[["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","5","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","7"],["7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7","7"]];
        const spawn = [620,700];
        training(tilesExtracted, spawn, map, "Snipers (Easy)");
    }).catch(error => {
        console.error('Error loading texture:', error);
    });
}

function training(tiles, spawn, map, value){
    const spikeMaze = value === "Spike Maze (Easy)" || value === "Spike Maze (Medium)" || value === "Spike Maze (Hard)";
    const snipers = value === "Snipers (Easy)" || value === "Snipers (Medium)" || value === "Snipers (Hard)";
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
    player.playerFlag = null;
    player.playerCollision = playerCollision;
    player.hasFlag = false;
    player.flagLoc = null;
    player.dead = false;
    player.lost = false; //only set when we hit a spike
    player.hold = 0.0;
    player.tags = 0;

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
            console.log('2', fixtureB.GetBody());
            switch(type2){
                case '5':
                    //console.log('boost');
                    applyExtraForceToBall(fixtureA.GetBody());
                    break;
                case '14':
                    applyExtraForceToBall(fixtureA.GetBody());
                    //console.log('boost');
                    break;
                case '7':
                    console.log("SPIKE");
                    playerDeath(player, mapSprites, keys);
                    player.lost = true;
                    break;
                case '9.1':
                    playerDeath(player, mapSprites, keys);
                    break;
                case '9.3':
                    playerDeath(player, mapSprites, keys);
                    break;
                case '16': //nf
                    if(player.hasFlag){
                        break;
                    }
                    player.hasFlag = true;
                    player.flagLoc = pixelsToLoc(data2.x, data2.y);
                    player.playerFlag = player.playerFlagYellow;
                    player.playerFlag.visible = true;
                    mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = false;
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
                            playerDeath(player, mapSprites, keys);

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
                            playerDeath(player, mapSprites, keys);
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
                            playerDeath(player, mapSprites, keys);
                        }
                    }
                    break;
                case 'blueball':
                    if(enemy.hasFlag){
                        playerDeath(enemy, mapSprites, keys);
                    }
                    break;
            }
        }
        else if (type2 === 'redball') {
            console.log('1', fixtureA.GetBody());
            switch(type1){
                case '5':
                    applyExtraForceToBall(fixtureB.GetBody());
                    //console.log('boost');
                    break;
                case '14':
                    applyExtraForceToBall(fixtureB.GetBody());
                    //console.log('boost');
                    break;
                case '7':
                    console.log("SPIKE");
                    playerDeath(player, mapSprites, keys);
                    player.lost = true;
                    break;
                case '9.1':
                    playerDeath(player, mapSprites, keys);
                    break;
                case '9.3':
                    playerDeath(player, mapSprites, keys);
                    break;
                case '16':
                    if(player.hasFlag){
                        break;
                    }
                    player.hasFlag = true;
                    player.flagLoc = pixelsToLoc(data1.x, data1.y);
                    player.playerFlag = player.playerFlagYellow;
                    player.playerFlag.visible = true;
                    mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = false;
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
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            else{
                                mazeLeader.push(Math.round(player.hold * 100) / 100);
                                mazeLeader.sort();
                                mazeLeader = mazeLeader.slice(0, 10);
                            }
                            leaderboard.spikeMazeEasy = mazeLeader;
                            GM_setValue('leaderboard', JSON.stringify(leaderboard));
                            playerDeath(player, mapSprites, keys);
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
                            playerDeath(player, mapSprites, keys);
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
                            playerDeath(player, mapSprites, keys);
                        }
                    }
                    break;
                case 'blueball':
                    if(enemy.hasFlag){
                        playerDeath(enemy, mapSprites, keys);
                    }
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
    training(tilesExtracted, spawn, map, value);

}
function killApp(app){
    app.ticker.stop();
    app.destroy(true, { children: true, texture: true, baseTexture: true });
}
function pixelsToLoc(x,y){
    return [x/40, y/40];
}

function playerDeath(player, mapSprites, keys){
    player.dead = true;
    if(player.hasFlag){
        player.hasFlag = false;
        player.playerFlag.visible = false;
        if(player.flagLoc){
            mapSprites[player.flagLoc[0]][player.flagLoc[1]].visible = true;
        }
    }
    keys.up = false;
    keys.down = false;
    keys.right = false;
    keys.left = false;
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
