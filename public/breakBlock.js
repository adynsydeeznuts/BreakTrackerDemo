class breakBlock {
    cxRep;
    minutesFromStart;
    duration;
    breakWidth;
    xPos;
    yPos;
    colour;
    overlapping;
    constructor(rep, minutes, duration, width, left, top, colour, overlap) {
        this.cxRep = rep;
        this.minutesFromStart = minutes;
        this.duration = duration;
        this.breakWidth = width;
        this.xPos = left;
        this.yPos = top;
        this.colour = colour;
        this.overlapping = overlap;
    }
    newLayer() {
        this.yPos = 100;
        this.overlapping = true;
    }
}
export { breakBlock };
