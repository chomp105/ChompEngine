/************************************************
 *  The Chomp105 2d game engine - aka ChompEngine
 ************************************************/

/* Utility */

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function returnCanvasX(canvas) {
    if (canvas != undefined) {
        return canvas.width; 
    }
    return 0;
}

function returnCanvasY(canvas) {
    if (canvas != undefined) {
        return canvas.height; 
    }
    return 0;
}

/* Objects */

function Circle(x, y, r, isStatic) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.isStatic = isStatic;
}

function Line(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

function CircleCircleCollision(c1, c2, cd, d) {
    this.c1 = c1;
    this.c2 = c2;
    this.cd = cd; // collision distance
    this.d = d;
    this.xdist = c2.x - c1.x;
    this.ydist = c2.y - c1.y;
}

function CircleLineCollision(c, l) {
    this.c = c;
    this.l = l;
}

/**************
 * Engine Class
 **************/

class Chomp {
    // setup
    constructor(wx1, wy1, wx2, wy2) {
        this.circles = [];
        this.lines = [];
        this.circleCircleCollisions = [];
        this.circleLineCollisions = [];
        this.wx1 = wx1;
        this.wy1 = wy1;
        this.wx2 = wx2;
        this.wy2 = wy2;
        this.player = 0;
        this.xoffset = 0;
        this.yoffset = 0;
    }
    /* Circle Collision Detection */
    checkCircleCircleCollisions = () => {
        for (let i = 0; i < this.circles.length; i++) {
            for (let j = i + 1; j < this.circles.length; j++) {
                let d = distance(this.circles[i].x, this.circles[i].y, this.circles[j].x, this.circles[j].y);
                if (d < this.circles[i].r + this.circles[j].r) {
                    this.circleCircleCollisions.push(new CircleCircleCollision(this.circles[i], this.circles[j], this.circles[i].r + this.circles[j].r - d, d));
                }
            }
        }
    }
    /* Circle Collision Resoluion */
    resolveCircleCircleCollisions = () => {
        for (let i = 0; i < this.circleCircleCollisions.length; i++) {
            let xratio = this.circleCircleCollisions[i].xdist / this.circleCircleCollisions[i].d;
            let yratio = this.circleCircleCollisions[i].ydist / this.circleCircleCollisions[i].d;
            // moves the this.circles apart in opposite directions along a line formed by the centers of either circle
            // circle one and two movement ratio
            let c1mr = 0.5 + (0.5 * (!this.circleCircleCollisions[i].c1.isStatic) + -0.5 * (!this.circleCircleCollisions[i].c2.isStatic));
            let c2mr = 1 - c1mr;
            this.circleCircleCollisions[i].c1.x -= this.circleCircleCollisions[i].cd * (xratio * c1mr);
            this.circleCircleCollisions[i].c1.y -= this.circleCircleCollisions[i].cd * (yratio * c1mr);
            this.circleCircleCollisions[i].c2.x += this.circleCircleCollisions[i].cd * (xratio * c2mr);
            this.circleCircleCollisions[i].c2.y += this.circleCircleCollisions[i].cd * (yratio * c2mr);
        }
        this.circleCircleCollisions = [];
    }
    /* Circle Edge Collision Detection and Resolution */
    wallCollisions = () => {
        for (let i = 0; i < this.circles.length; i++) {
            if (this.circles[i].x - this.circles[i].r < this.wx1) {
                this.circles[i].x = this.wx1 + this.circles[i].r;
            } else if (this.circles[i].x + this.circles[i].r > this.wx2) {
                this.circles[i].x = this.wx2 - this.circles[i].r;
            }
            if (this.circles[i].y - this.circles[i].r < this.wy1) {
                this.circles[i].y = this.wy1 + this.circles[i].r;
            } else if (this.circles[i].y + this.circles[i].r > this.wy2) {
                this.circles[i].y = this.wy2 - this.circles[i].r;
            }
        }
    }
    /* Circle Line Collision Detection */
    checkCircleLineCollisions = () => {
        for (let i = 0; i < this.circles.length; i++) {
            for (let j = 0; j < this.lines.length; j++) {
                let d = distance(this.lines[j].x1, this.lines[j].y1, this.lines[j].x2, this.lines[j].y2);
                // dot product of the line and the vector between one point of the line and the circle
                let dot = ((this.circles[i].x - this.lines[j].x1) * (this.lines[j].x2 - this.lines[j].x1) + (this.circles[i].y - this.lines[j].y1) * (this.lines[j].y2 - this.lines[j].y1)) / d;
                let xd = this.lines[j].x2 - this.lines[j].x1;
                let yd = this.lines[j].y2 - this.lines[j].y1;
                // closest point on line to the circle
                let px = dot * (xd / d) + this.lines[j].x1;
                let py = dot * (yd / d) + this.lines[j].y1;
                // checks if the circle is touching the point
                if ((this.circles[i].r > distance(this.circles[i].x, this.circles[i].y, px, py) && (this.circles[i].x > this.lines[j].x1 && this.circles[i].y > this.lines[j].y1 && this.circles[i].x < this.lines[j].x2 && this.circles[i].y < this.lines[j].y2))
                || ((this.circles[i].x - this.lines[j].x1)**2 + (this.circles[i].y - this.lines[j].y1)**2 < this.circles[i].r**2 || (this.circles[i].x - this.lines[j].x2)**2 + (this.circles[i].y - this.lines[j].y2)**2 < this.circles[i].r**2)) {
                    this.circleLineCollisions.push(this.circles[i], this.lines[j]);
                }
            }
        }
    }
    /* render */
    render = (ctx, canvas) => {
        ctx.clearRect(0, 0, returnCanvasX(canvas), returnCanvasY(canvas));
        ctx.strokeStyle = "magenta";
        if (this.circles.length > 0) {
            this.xoffset = -this.circles[this.player].x + (returnCanvasX(canvas) / 2);
            this.yoffset = -this.circles[this.player].y + (returnCanvasY(canvas) / 2);
            for (let c of this.circles) {
                ctx.beginPath();
                ctx.arc(c.x + this.xoffset, c.y + this.yoffset, c.r, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        for (let l of this.lines) {
            ctx.beginPath();
            ctx.moveTo(l.x1 + this.xoffset, l.y1 + this.yoffset);
            ctx.lineTo(l.x2 + this.xoffset, l.y2 + this.yoffset);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(this.wx1 + this.xoffset, this.wy1 + this.yoffset);
        ctx.lineTo(this.wx2 + this.xoffset, this.wy1 + this.yoffset);
        ctx.lineTo(this.wx2 + this.xoffset, this.wy2 + this.yoffset);
        ctx.lineTo(this.wx1 + this.xoffset, this.wy2 + this.yoffset);
        ctx.lineTo(this.wx1 + this.xoffset, this.wy1 + this.yoffset);
        ctx.stroke();
    }
}
