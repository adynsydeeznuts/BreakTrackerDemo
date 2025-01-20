class breakBlock {
    cxRep;
    minutesFromStart;
    duration;
    breakWidth;
    xPos;
    yPos;
    overlapping;
    constructor(rep, minutes, duration, width, left, top, overlap) {
        this.cxRep = rep;
        this.minutesFromStart = minutes;
        this.duration = duration;
        this.breakWidth = width;
        this.xPos = left;
        this.yPos = top;
        this.overlapping = overlap;
    }
    newLayer() {
        this.yPos = 100;
        this.overlapping = true;
    }
}
export { breakBlock };
