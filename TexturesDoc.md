# Tiles and Texture Packs


## Diagonal Walls

We have the following 4 representations of diagonal walls
* 1.1	45 degree wall (◣)
* 1.2	45 degree wall (◤)
* 1.3	45 degree wall (◥)
* 1.4	45 degree wall (◢)

However, with dynamic texture packs that have special wall borders, there are actually many more representations. Each of the three major walls can have a border or be connected to another wall and if the two legs are connected but at least one is connected to a full wall it will result in a border area at the right angle. This leaves us with  subdivisions for each wall 6, for 24 types of diagonal walls in total.
> **_NOTE:_**  The hypotenuse will always have a border, leaving us with the only options being 3 borders, two types of two borders, 1 border no corner, and 1 border corner.

Since there are only 3 variables with these walls, we can make their full representations using 3 extra characters, one to represent each wall (Yes this could be optimized but it would just make me waste more time looking at this documentation I'm forcing myself to make). To avoid any confusion, we will not be using the numbers {1,2,3,4} again, instead using a 0 to represent no border, and a 5 to represent a border. This will work in the following order: **Left leg, Right leg, Corner**.

That leaves us with the following 24 wall representations: 
### Walls with all borders
* 1.1555	45 degree wall (◣)
* 1.2555	45 degree wall (◤)
* 1.3555	45 degree wall (◥)
* 1.4555	45 degree wall (◢)

### Walls Missing One Leg
* 1.1055	45 degree wall (◣)(left)
* 1.2055	45 degree wall (◤)(left)
* 1.3055	45 degree wall (◥)(top)
* 1.4055	45 degree wall (◢)(bottom)
* 1.1505	45 degree wall (◣)(bottom)
* 1.2505	45 degree wall (◤)(top)
* 1.3505	45 degree wall (◥)(right)
* 1.4505	45 degree wall (◢)(right)
* 1.1550	45 degree wall (◣)(corner)
* 1.2550	45 degree wall (◤)(corner)
* 1.3550	45 degree wall (◥)(corner)
* 1.4550	45 degree wall (◢)(corner)

### Walls Missing Two Legs but with Corner
* 1.1005	45 degree wall (◣)
* 1.2005	45 degree wall (◤)
* 1.3005	45 degree wall (◥)
* 1.4005	45 degree wall (◢)

### Walls with Only Hypotenuse
* 1.1000	45 degree wall (◣)
* 1.2000	45 degree wall (◤)
* 1.3000	45 degree wall (◥)
* 1.4000	45 degree wall (◢)

## Full Walls

The general subtype of walls will be represented as 1., followed by up to 8 0s or 5s, the first four for the edges, starting at the top and going clockwise, then four for the corners if any special ones exist, starting at the top left and going clockwise.

### All sides
* 1.5555

### 3 Sides
* 1.5550
* 1.5505
* 1.5055
* 1.0555

### 2 Sides No Corners
* 1.5500
* 1.5050
* 1.5005
* 1.0550
* 1.0055
* 1.0505

### 2 Sides Extra Corners
* 1.55000005 Bot left Corner
* 1.50050050 Bot Right
* 1.05505000 Top Left
* 1.00550500 Top Right

### 1 Side No Corners
* 1.5000
* 1.0500
* 1.0050
* 1.0005

### 1 Side with Corner(s)
* 1.50000055 Both
* 1.50000050 Bot Right
* 1.50000005 Bot Left
* 1.05005005 Both
* 1.05005000 Top Left
* 1.05000005 Bot Left
* 1.00505500 Both
* 1.00505000 Top Left
* 1.00500500 Top Right
* 1.00050550 Both
* 1.00050500 Top Right
* 1.00050050 Bot Right

### No Sides
* 1.0000
* 1.00005555 4 corners
* 1.00005550 All but bottom left
* 1.00005505 All but bottom right
* 1.00005055 All but top right
* 1.00000555 All but top left
* 1.00005500 Top 2
* 1.00005050 Top left bot right
* 1.00005005 Left 2
* 1.00000550 Right 2
* 1.00000505 Top right bot left
* 1.00000055 Both bot
* 1.00005000 Top left
* 1.00000500 Top Right
* 1.00000050 Bot Right
* 1.00000005 Bot left








