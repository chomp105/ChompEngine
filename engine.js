// the chomp105 game engine

/* Math */

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/* Objects */

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
} let circles = [];

function Line(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
} let lines = [];

function CircleCircleCollision(c1, c2, cd) {
    this.c1 = c1;
    this.c2 = c2;
    // collision distance
    this.cd = cd;
    this.d = distance(c1.x, c1.y, c2.x, c2.y);
    this.xdist = c2.x - c1.x;
    this.ydist = c2.y - c1.y;
} let circleCircleCollisions = [];

/* Circle Collision Detection */

function checkCircleCircleCollisions(circles) {
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

function resolveCircleCircleCollisions() {
    for (let i = 0; i < circleCircleCollisions.length; i++) {

        let xratio = circleCircleCollisions[i].xdist / circleCircleCollisions[i].d;
        let yratio = circleCircleCollisions[i].ydist / circleCircleCollisions[i].d;

        console.log(circleCircleCollisions[i]);

        circleCircleCollisions[i].c1.x -= circleCircleCollisions[i].cd * (xratio / 2);
        circleCircleCollisions[i].c1.y -= circleCircleCollisions[i].cd * (yratio / 2);
        circleCircleCollisions[i].c2.x += circleCircleCollisions[i].cd * (xratio / 2);
        circleCircleCollisions[i].c2.y += circleCircleCollisions[i].cd * (yratio / 2);
    }
    circleCircleCollisions = [];
}

/* Circle Edge Collision Detection and Resolution */

function wallCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].x - circles[i].r < 0) {
            circles[i].x = 0 + circles[i].r;
        } else if (circles[i].x + circles[i].r > 400) {
            circles[i].x = 400 - circles[i].r;
        }
        if (circles[i].y - circles[i].r < 0) {
            circles[i].y = 0 + circles[i].r;
        } else if (circles[i].y + circles[i].r > 400) {
            circles[i].y = 400 - circles[i].r;
        }
    }
}

/* Circle Line Collision Detection */

/* Circle Line Collision Resolution */

/* render */

let ctx = document.getElementById("gc").getContext("2d");

function render() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = "magenta";
    for (let c of circles) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.stroke();
    }
    for (let l in lines) {
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
    }
}

document.addEventListener("click", (e) => {
    circles.push(new Circle(e.clientX, e.clientY, 50));
});


let kp = {
    right: 0,
    left: 0,
    up: 0,
    down: 0,
}
let xf, yf;
xf = 0;
yf = 0;
document.addEventListener("keydown", (e) => {
    if (e.which == 39) {
        kp.right = true;
    } else if (e.which == 37) {
        kp.left = true;
    } else if (e.which == 38) {
        kp.up = true;
    } else if (e.which == 40) {
        kp.down = true;
    }
});
document.addEventListener("keyup", (e) => {
    if (e.which == 39) {
        kp.right = false;
    } else if (e.which == 37) {
        kp.left = false;
    } else if (e.which == 38) {
        kp.up = false;
    } else if (e.which == 40) {
        kp.down = false;
    }
});

function game() {

    if (circles.length > 0) {
    xf += (2 * kp.right) + (-2 * kp.left);
    yf += (2 * kp.down) + (-2 * kp.up);
    circles[0].x += xf / circles[0].r;
    circles[0].y += yf / circles[0].r;
    xf -= xf / 30;
    yf -= yf / 30;}

    if (circles.length > 0) {
        wallCollisions(circles);
        checkCircleCircleCollisions(circles);
        resolveCircleCircleCollisions();
        render();
    }

    window.requestAnimationFrame(game);
} window.requestAnimationFrame(game);