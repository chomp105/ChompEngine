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

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
}

function Line(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

function CircleCircleCollision(c1, c2, cd) {
    this.c1 = c1;
    this.c2 = c2;
    this.cd = cd; // collision distance
    this.d = distance(c1.x, c1.y, c2.x, c2.y);
    this.xdist = c2.x - c1.x;
    this.ydist = c2.y - c1.y;
}

function CircleLineCollision(c, l) {
    this.c = c;
    this.l = l;
}

/* Circle Collision Detection */

function checkCircleCircleCollisions(circles, circleCircleCollisions) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let d = distance(circles[i].x, circles[i].y, circles[j].x, circles[j].y);
            if (d < circles[i].r + circles[j].r) {
                circleCircleCollisions.push(new CircleCircleCollision(circles[i], circles[j], circles[i].r + circles[j].r - d));
            }
        }
    }
}

/* Circle Collision Resoluion */

function resolveCircleCircleCollisions(circleCircleCollisions) {
    for (let i = 0; i < circleCircleCollisions.length; i++) {
        let xratio = circleCircleCollisions[i].xdist / circleCircleCollisions[i].d;
        let yratio = circleCircleCollisions[i].ydist / circleCircleCollisions[i].d;
        // moves the circles apart in opposite directions along a line formed by the centers of either circle
        circleCircleCollisions[i].c1.x -= circleCircleCollisions[i].cd * (xratio / 2);
        circleCircleCollisions[i].c1.y -= circleCircleCollisions[i].cd * (yratio / 2);
        circleCircleCollisions[i].c2.x += circleCircleCollisions[i].cd * (xratio / 2);
        circleCircleCollisions[i].c2.y += circleCircleCollisions[i].cd * (yratio / 2);
    }
    circleCircleCollisions = [];
}

/* Circle Edge Collision Detection and Resolution */

function wallCollisions(circles, wx1, wy1, wx2, wy2) {
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].x - circles[i].r < wx1) {
            circles[i].x = wx1 + circles[i].r;
        } else if (circles[i].x + circles[i].r > wx2) {
            circles[i].x = wx2 - circles[i].r;
        }
        if (circles[i].y - circles[i].r < wy1) {
            circles[i].y = wy1 + circles[i].r;
        } else if (circles[i].y + circles[i].r > wy2) {
            circles[i].y = wy2 - circles[i].r;
        }
    }
}

/* Circle Line Collision Detection */

function checkCircleLineCollisions(circles, lines) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < lines.length; j++) {
            let d = distance(lines[j].x1, lines[j].y1, lines[j].x2, lines[j].y2);
            // dot product of the line and the vector between one point of the line and the circle
            let dot = ((circles[i].x - lines[j].x1) * (lines[j].x2 - lines[j].x1) + (circles[i].y - lines[j].y1) * (lines[j].y2 - lines[j].y1)) / d;
            let xd = lines[j].x2 - lines[j].x1;
            let yd = lines[j].y2 - lines[j].y1;
            // closest point on line to the circle
            let px = dot * (xd / d) + lines[j].x1;
            let py = dot * (yd / d) + lines[j].y1;
            // checks if the circle is touching the point
            if ((circles[i].r > distance(circles[i].x, circles[i].y, px, py) && (circles[i].x > lines[j].x1 && circles[i].y > lines[j].y1 && circles[i].x < lines[j].x2 && circles[i].y < lines[j].y2))
            || (Math.sqrt((circles[i].x - lines[j].x1)**2 + (circles[i].y - lines[j].y1)**2) < circles[i].r || Math.sqrt((circles[i].x - lines[j].x2)**2 + (circles[i].y - lines[j].y2)**2) < circles[i].r)) {
                circleLineCollisions.push(circles[i], lines[j]);
            }
        }
    }
}

/* Circle Line Collision Resolution */

// ------------- IDEK WHAT TO DO. ITS NOT EVEN THAT I CANT FIGURE OUT HOW TO DO IT I JUST DONT KNOW WHAT SHOULD ACTUALLY HAPPEN ----------------

/* render */

function render(ctx, canvas, circles, lines) {
    ctx.clearRect(0, 0, returnCanvasX(canvas), returnCanvasY(canvas));
    ctx.strokeStyle = "magenta";
    for (let c of circles) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.stroke();
    }
    for (let l of lines) {
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
    }
}
