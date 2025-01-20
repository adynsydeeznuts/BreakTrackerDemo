class breakBlock {
    cxRep : string;
    minutesFromStart : number;
    duration : number;
    breakWidth : number;
    xPos : number;
    yPos : number;
    overlapping : boolean;

    constructor (rep: string, minutes: number, duration: number, width: number, left: number, top: number, overlap: boolean) {
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