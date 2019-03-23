const MUSIC_ON = true;
const SOUND_ON = true;


/** @type {HTMLcanvasssElement} */
        /** @type {HTMLCanvasElement} */
var canvas = document.getElementById("gameCanvas");
var c = canvas.getContext("2d");

// set up sound effects
var fxExplode = new Sound("sounds/explode.m4a");
var fxHit = new Sound("sounds/hit.m4a", 5);
var fxLaser = new Sound("sounds/laser.m4a", 5, 0.5);
var fxThrust = new Sound("sounds/thrust.m4a");

// set up the music
var music = new Music("sounds/music-low.m4a", "sounds/music-high.m4a");

canvas.width = innerWidth
canvas.height = innerHeight - 10

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

let gravity = 1
let friction = .8

// Event Listeners
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})




function Music(srcLow, srcHigh) {
    this.soundLow = new Audio(srcLow);
    this.soundHigh = new Audio(srcHigh);
    this.low = true;
    this.tempo = 1.0; // seconds per beat
    this.beatTime = 0; // frames left until next beat

    this.play = function() {
        if (MUSIC_ON) {
            if (this.low) {
                this.soundLow.play();
            } else {
                this.soundHigh.play();
            }
            this.low = !this.low;
        }
    }

    this.setAsteroidRatio = function(ratio) {
        this.tempo = 1.0 - 0.75 * (1.0 - ratio);
    }

    this.tick = function() {
        if (this.beatTime == 0) {
            this.play();
            this.beatTime = Math.ceil(this.tempo * FPS);
        } else {
            this.beatTime--;
        }
    }
}

function Sound(src, maxStreams = 1, vol = 1.0) {
    this.streamNum = 0;
    this.streams = [];
    for (var i = 0; i < maxStreams; i++) {
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }

    this.play = function() {
        if (SOUND_ON) {
            this.streamNum = (this.streamNum + 1) % maxStreams;
            this.streams[this.streamNum].play();
        }
    }

    this.stop = function() {
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    }
}

function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = { x: 0, y: 3 }

}
Star.prototype.draw = function() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
}
Star.prototype.update = function() {
    this.draw()
    //When the Star hits the bottom of the screen
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * friction
        fxLaser.play();
    } else {
        this.velocity.y += gravity
    }
    this.y += this.velocity.y
}

// Implementation
let stars
function init() {
   
    //Create a stars array and push a new blue Star in to it
    stars = []
    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width/2,30,30,'blue'))
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach(Star => {
     Star.update()
    })
}

init()
animate()
