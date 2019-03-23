const MUSIC_ON = true;
const SOUND_ON = true;


/** @type {HTMLcanvasssElement} */
        /** @type {HTMLCanvasElement} */
var canvas = document.getElementById("gameCanvas");
var c = canvas.getContext("2d");

// set up sound effects
var fxHit = new Sound("sounds/hit.m4a",10);
var fxbasketball = new Sound("sounds/basketball.m4a",1);
var fxLaser = new Sound("sounds/laser.m4a", 5, 0.5);
var fxpingpong = new Sound("sounds/ping-pong.m4a");
var fxthud = new Sound("sounds/thud-2.m4a",5);
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


function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


// Objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = { x: randomIntFromRange(-10,10), y: 3 }
    this.gravity = 1
    this.friction = .8
}

Star.prototype.draw = function() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

Star.prototype.update = function() {
    this.draw()
    //When the Star hits the bottom of the screen
    //WHY DO WE HAVE TO ADD THIS.VELOCITY.Y TO THE LINE BELOW???
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
        fxHit.play();
        this.shatter()

    } else {
        this.velocity.y += this.gravity
    }
    this.y += this.velocity.y
    this.x += this.velocity.x
}
    

    //Called everytime the Star hits the bottom of the screen
    Star.prototype.shatter = function() {
        // Reduce the radius of the Star evertime it hits the bottom
        this.radius += -3
       for (let i = 0; i < 8; i++) {
        miniStars.push(new miniStar(this.x, this.y, 2))
        }
    }

function miniStar(x, y, radius, color) {
    //inherit some of the Main Star parameters
    Star.call(this, x, y, radius, color)
    // These properties will be different than the Main Star
    this.velocity = {x: randomIntFromRange(-5,5),
                        y: randomIntFromRange(-15,15)
        }
    
    this.friction = .8
    this.gravity = .2
    //Time to live
    this.ttl = 100
    this.opacity = 1
}

miniStar.prototype.draw = function() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(227,234,239,${this.opacity})`
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

miniStar.prototype.update = function() {
    this.draw()
    //When the Star hits the bottom of the screen
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
    } else {
        this.velocity.y += this.gravity
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 1/this.ttl

}

function createMountainRange(mountainAmount, height, color){
    for(let i = 0; i < mountainAmount; i++){
        const mountainWidth = canvas.width / mountainAmount
        c.beginPath()
        c.moveTo(i * mountainWidth, canvas.height)
        c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height)
        c.lineTo(i * mountainWidth + mountainWidth /2, canvas.height - height)
        c.lineTo(i * mountainWidth - 325, canvas.height)
        c.fillStyle = color
        c.fill()
        c.closePath()
    }
}

// Implementation
const backgoundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgoundGradient.addColorStop(0, '#171e26')
backgoundGradient.addColorStop(1, '#3f586b')

let stars //Create stars variable
let miniStars //create minitStars variable
let backgroundStars
let ticker = 0
let randomSpawnRate = 75
const groundHeight = 100



function init() {
    //assign arrays to our variables
    stars = [] 
    miniStars = []
    backgroundStars = []
    
    //Push Stars in to stars array 
    // for (let i = 0; i < 1; i++) {
    //     stars.push(new Star(canvas.width / 2, 30, 30, '#E3EAEF'))
    // }

  //Push background Stars in to backgroundStars array 
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 3
        backgroundStars.push(new Star(x, y, radius, 'white'))
    }
    console.log("Init Happened")
}



// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = backgoundGradient
    c.fillRect(0, 0, canvas.width, canvas.height)
 


        backgroundStars.forEach(Star => {
        Star.draw()
        
    })

    createMountainRange(1, canvas.height - 50, '#384551')
    createMountainRange(2, canvas.height - 100, '#2b3843')
    createMountainRange(3, canvas.height - 300, '#26333e')
    c.fillStyle = '#182018'
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

    stars.forEach((Star, index)=> {
        Star.update()
        //Remove Star from stars array if it's radius falls to zero
        if(Star.radius <= 0){
            stars.splice(index, 1)
        }
    })

    miniStars.forEach((miniStar, index) => {
        miniStar.update()
        //Remove miniStar from miniStars array when ttl is zero
        if(miniStar.ttl <= 0){
            miniStars.splice(index, 1)
        }
    })
ticker++

    if(ticker % randomSpawnRate == 0){
    const x = Math.random() * canvas.width
    stars.push (new Star(x,-100,randomIntFromRange(8,15),'#E3EAEF'))
    randomSpawnRate = randomIntFromRange(25,200)
    }

}



init()
animate()