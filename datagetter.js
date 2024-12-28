// ==UserScript==
// @name         Get Frames
// @version      1.0
// @description  Show other team's spawns at start
// @author       Iodized Salt
// @include      http://*.koalabeast.com:*
// @include      http://*.jukejuice.com:*
// @include      http://*.newcompte.fr:*
// @include      https://*.koalabeast.com/game
// @include      https://*.koalabeast.com/game?*
// @grant        none
// ==/UserScript==

const keyPresses = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"up":1},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"left":2},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"left":-3},null,{"id":1,"right":4},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"up":-5},null,null,null,null,null,null,null,{"id":1,"down":6},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"down":-7},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"up":8,"rx":4.64,"ry":3.69,"lx":1.42,"ly":0.95,"a":-1.12,"ra":-1.5},null,null,null,null,{"id":1,"up":-9},null,null,null,null,null,null,null,null,null,{"id":1,"down":10,"rx":5.02,"ry":3.89,"lx":1.61,"ly":0.78,"a":-0.98,"ra":-1.76},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"down":-11,"rx":5.92,"ry":4.41,"lx":1.23,"ly":-0.25,"a":6.45,"ra":-2.15},null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"up":12},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"up":-13},null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"up":14},null,null,{"id":1,"up":-15},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"down":16},null,null,null,null,null,null,{"id":1,"down":-17},null,null,null,null,null,null,null,null,null,{"id":1,"right":-18,"rx":8.81,"ry":3.37,"lx":-0.31,"ly":-0.77,"a":3.82,"ra":5.01},null,{"id":1,"left":19},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"left":-20},null,null,null,{"id":1,"up":21,"rx":8.43,"ry":2.97,"lx":-0.87,"ly":-0.59,"a":2.83,"ra":6.98},null,{"id":1,"right":22},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":1,"right":-23},null,{"id":1,"up":-24},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];

tagpro.ready(function waitForId() {
    if (!tagpro.playerId) {
        return setTimeout(waitForId, 100);
    }

    const myId = tagpro.playerId;
    const frames = [];
    const frameInfo = [];
    let lastKeyState = null;
    let keyStateReceived = false;  // Flag to track if new data arrived in this frame
    const lastState = [false, false, false, false]; //not moving
    let lastKeyState2 = null;
    let keyStateReceived2 = false;  // Flag to track if new data arrived in this frame
    const lastState2 = [false, false, false, false]; //not moving
    let going = false;

    // Listen for keypress data
    tagpro.socket.on("p", function (data) {
        data = data.u || data;

        for (let i = 0, l = data.length; i != l; i++) {
            if (data[i].id == 1) {
                if (data[i].up || data[i].down || data[i].left || data[i].right) {
                    //console.log(data[i]);
                    lastKeyState = data[i];  // Store the latest key state
                    keyStateReceived = true;  // Mark that keypress data was received
                }
            }
            if (data[i].id == 2) {
                if (data[i].up || data[i].down || data[i].left || data[i].right) {
                    lastKeyState2 = data[i];  // Store the latest key state
                    keyStateReceived2 = true;  // Mark that keypress data was received
                }
            }
        }
    });

    tagpro.socket.on("end", function(data) {
        console.log(JSON.stringify(frames));
        console.log(JSON.stringify(frameInfo));

        console.log(frames.length);
        console.log(frameInfo.length);
    });
    tagpro.socket.on("time", function(data) {
        going = true;
    });

    // 60 FPS loop using requestAnimationFrame
    function gameLoop() {

        if (keyStateReceived) {
            //console.log(lastKeyState);  // Log the last received key state
            //frames.push(lastKeyState);
            keyStateReceived = false;   // Reset the key state for next change

            if(lastKeyState.up){
                lastState[0] = !lastState[0];
            }
            if(lastKeyState.down){
                lastState[1] = !lastState[1];
            }
            if(lastKeyState.left){
                lastState[2] = !lastState[2];
            }
            if(lastKeyState.right){
                lastState[3] = !lastState[3];
            }
            frames.push(lastState);
        }
        if (keyStateReceived2) {
            //console.log(lastKeyState);  // Log the last received key state
            //frames.push(lastKeyState);
            keyStateReceived2 = false;   // Reset the key state for next change

            if(lastKeyState2.up){
                lastState2[0] = !lastState2[0];
            }
            if(lastKeyState2.down){
                lastState2[1] = !lastState2[1];
            }
            if(lastKeyState2.left){
                lastState2[2] = !lastState2[2];
            }
            if(lastKeyState2.right){
                lastState2[3] = !lastState2[3];
            }
            frames.push(lastState2);
        }
        if(going){
            let data = [tagpro.players["1"].x,tagpro.players["1"].y,tagpro.players["1"].lx,tagpro.players["1"].ly,tagpro.players["1"].flag,tagpro.players["2"].x,tagpro.players["2"].y,tagpro.players["2"].lx,tagpro.players["2"].ly, tagpro.players["2"].flag];
            frameInfo.push(data); //what we use to predict
            frameInfo.push(data); //what we use to predict
            frames.push(lastState); //player1 info
            frames.push(lastState2); //player2 info
        }
        //console.log(JSON.stringify(frames));
        // Run the loop again at 60 FPS
        requestAnimationFrame(gameLoop);
    }

    // Start the loop
    requestAnimationFrame(gameLoop);

});






