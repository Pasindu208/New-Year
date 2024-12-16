// Get canvas and context
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for fireworks
let fireworks = [];
let particles = [];
let hue = 120;
let limiterTotal = 5;
let limiterTick = 0;
let timerTotal = 25
let timerTick = 0;
let mousedown = false;
let mx, my;

// Functions for random number and distance calculation
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    let xDistance = p1x - p2x;
    let yDistance = p1y - p2y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}

// Firework class
class Firework {
    constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = random(50, 70);
        this.targetRadius = 1;
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }

        this.speed *= this.acceleration;

        let vx = Math.cos(this.angle) * this.speed;
        let vy = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.tx, this.ty);
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],
                   this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = random(hue - 50, hue + 50);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;

        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],
                   this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    }
}

// Create particles
function createParticles(x, y) {
    let particleCount = 100;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// Main loop
function loop() {
    requestAnimationFrame(loop);

    hue += 0.5;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }

    if (timerTick >= timerTotal) {
        if (!mousedown) {
            fireworks.push(new Firework(
                canvas.width / 2,
                canvas.height,
                random(0, canvas.width),
                random(0, canvas.height / 2)
            ));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            fireworks.push(new Firework(
                canvas.width / 2,
                canvas.height,
                mx,
                my
            ));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

// Mouse events
canvas.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
});

canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();
    mousedown = false;
});

// Resize canvas
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Animate year counter with scrolling effect
function animateYearCounter() {
    const yearElement = document.getElementById('year');
    const startYear = 2000;
    const endYear = 2025;
    const duration = 1500; // 2.5 seconds

    // Create an array of years from 2000 to 2025
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
        years.push(y);
    }

    // Create a container for the years
    yearElement.innerHTML = '';
    const yearContainer = document.createElement('div');
    yearContainer.id = 'year-container';
    yearElement.appendChild(yearContainer);

    // Add each year to the container
    years.forEach((year) => {
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year-number');
        yearDiv.textContent = year;
        yearContainer.appendChild(yearDiv);
    });

    // Wait for rendering
    setTimeout(() => {
        // Calculate total height to scroll
        const totalHeight = yearContainer.scrollHeight - yearElement.clientHeight;

        // Create keyframes dynamically
        const keyframes = `
            @keyframes scrollYears {
                from {
                    transform: translateY(0);
                }
                to {
                    transform: translateY(-${totalHeight}px);
                }
            }
        `;

        // Append the keyframes to the document
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = keyframes;
        document.head.appendChild(styleSheet);

        // Start the animation
        yearContainer.style.animation = `scrollYears ${duration}ms linear forwards`;
    }, 0);
}

// Start the fireworks and the year counter animations
window.onload = function() {
    loop();
    animateYearCounter();
};