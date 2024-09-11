# Tiles and Texture Packs


## Diagonal Walls

We have the following 4 representations of diagonal walls
* 1.1	45 degree wall (◣)
* 1.2	45 degree wall (◤)
* 1.3	45 degree wall (◥)
* 1.4	45 degree wall (◢)

However, with dynamic texture packs that have special wall borders, there are actually many more representations. Each of the three major walls can have a border or be connected to another wall and if the two legs are connected but at least one is connected to a full wall it will result in a border area at the right angle. This leaves us with  subdivisions for each wall 5, for 20 types of diagonal walls in total.
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
