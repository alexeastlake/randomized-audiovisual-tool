//Random sound related fields.
let soundFiles, randomSounds, randomMuteButtons, randomGenerateButtons, randomGenerateAllButton;

// Sythesiser related fields.
let synth1, synth2, synth1GenerateButton, synth1MuteButton, synth2GenerateButton, synth2MuteButton, cScale;

// Visual shape canvas related fields.
// Uses p5.scribble.js from https://github.com/generative-light/p5.scribble.js/
let scribble, canvas;

// Master user interaction fields.
let speedSlider, generateAllButton;

function preload() {
  soundFormats("wav");
  
  // Preloads sound sample files.
  soundFiles = [];
  
  soundFiles.push(loadSound("samples/sample1.wav"));
  soundFiles.push(loadSound("samples/sample2.wav"));
  soundFiles.push(loadSound("samples/sample3.wav"));
  soundFiles.push(loadSound("samples/sample4.wav"));
}

function setup() {
  createCanvas(600, 700);
  
  // Creates Scribble object and ShapeCanvas object.
  scribble = new Scribble();
  canvas = new ShapeCanvas(0, 200, width, height - 200);
  
  // Creates RandomSound objects.
  randomSounds = [];
  
  randomSounds.push(new RandomSound(0, 0, soundFiles[0]));
  randomSounds.push(new RandomSound(200, 0, soundFiles[1]));
  randomSounds.push(new RandomSound(0, 100, soundFiles[2]));
  randomSounds.push(new RandomSound(200, 100, soundFiles[3]));
  
  // Creates mute and generate buttons for all RandomSound objects.
  randomMuteButtons = [];
  randomGenerateButtons = [];
  
  for (let i = 0; i < randomSounds.length; i++) {
    randomMuteButtons.push(createButton("Mute"));
    randomMuteButtons[i].position(randomSounds[i].x, randomSounds[i].y);
    randomMuteButtons[i].mousePressed(() => {
      randomSounds[i].toggleMute();
    });
    
    randomGenerateButtons.push(createButton("Generate"));
    randomGenerateButtons[i].position(randomSounds[i].x + 50, randomSounds[i].y);
    randomGenerateButtons[i].mousePressed(() => {
      randomSounds[i].generate();
    });
  }
  
  // Defines C scale for Synths.
  cScale = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", 
                "C3", "D3", "E3", "F3", "G3", "A3", "B3", 
                "C4", "D4", "E4", "F4", "G4", "A4", "B4",
                "C5", "D5", "E5", "F5", "G5", "A5", "B5"];
  
  // Creates Synth objects.
  synth1 = new Synth(400, 0, 2, 8, 0, 10, 5);
  synth2 = new Synth(400, 100, 1, 16, 10, 25, 6);
  
  
  // Creates mute and generate buttons for all Synth objects.
  synth1MuteButton = createButton("Mute");
  synth1MuteButton.position(synth1.x, synth1.y);
  synth1MuteButton.mousePressed(() => {
    synth1.toggleMute();
  });
  
  synth2MuteButton = createButton("Mute");
  synth2MuteButton.position(synth2.x, synth2.y);
  synth2MuteButton.mousePressed(() => {
    synth2.toggleMute();
  });
  
  synth1GenerateButton = createButton("Generate");
  synth1GenerateButton.position(synth1.x + 50, synth1.y);
  synth1GenerateButton.mousePressed(() => {
    synth1.generate();
  });
  
  synth2GenerateButton = createButton("Generate");
  synth2GenerateButton.position(synth2.x + 50, synth2.y);
  synth2GenerateButton.mousePressed(() => {
    synth2.generate();
  });
  
  // Creates slider to control speed.
  speedSlider = createSlider(5, 30, 20, 1);
  speedSlider.position(50, height - 35);
  
  // Creates master generate button.
  generateAllButton = createButton("Generate All");
  generateAllButton.position(10, height - 70);
  generateAllButton.mousePressed(() => {
    for (let i = 0; i < randomSounds.length; i++) {
      randomSounds[i].generate();
      synth1.generate();
      synth2.generate();
    }
  });
}

function draw() {
  background(225);
  
  // Checks if its the correct time to play the RandomSounds and higher Synth.
  if (frameCount % map(speedSlider.value(), 5, 30, 30, 5) === 0) {
      for (let i = 0; i < randomSounds.length; i++) {
        randomSounds[i].play();
      }
    
    synth2.play();
  }
  
  // Checks if its the correct time to play the lower Synth.
  if (frameCount % (map(speedSlider.value(), 5, 30, 30, 5) * 4) === 0) {
      synth1.play();
  }
  
  for (let i = 0; i < randomSounds.length; i++) {
    randomSounds[i].draw();
  }
  
  synth1.draw();
  synth2.draw();
  
  canvas.draw();
  
  // Draws text for speedSlider.
  noStroke();
  fill(0);
  
  text("Speed: ", 10, height - 20);
}

// Class for a pre-recorded sound with random properties.
class RandomSound {
  constructor(x, y, sound) {
    // x and y location to draw this RandomSound.
    this.x = x;
    this.y = y;
    
    // width and height for drawing this RandomSound.
    this.width = 200;
    this.height = 100;
    
    // Pre-recorded sound to play.
    this.sound = sound;
    
    this.muted = true;
    
    this.count = 0;
    
    this.generate();
  }
  
  // Generates this RandomSounds parameters.
  generate() {
    this.rhythm = [];
    this.rate = random(0.1, 4);
    
    for (let i = 0; i < 16; i++) {
      this.rhythm.push(round(random()));
    }
    
    // Generates new shape for this RandomSound.
    this.shape = new Shape(random(canvas.x + 25, canvas.width - 25), random(canvas.y + 25, canvas.height - 25), random(0, 255), random(0, 255), random(0, 255), 12.5, random(2));
  }
  
  // Plays this RandomSound if its rhythm says so at the current count, and advances the count either way.
  play() {
    if (this.rhythm[this.count] === 1 && this.sound.duration() > 0 && !this.muted) {
      this.sound.play(0, this.rate);
      canvas.addObject(this.shape);
    }
    
    this.count++;
    
    if (this.count >= this.rhythm.length) {
        this.count = 0;
    }
  }
  
  // Draws this RandomSounds interface.
  draw() {
    if (this.muted) {
      fill(75);
    } else {
      fill (200);
    }
    
    stroke (0);
    
    rect(this.x, this.y, this.width, this.height);
    
    noStroke();
    fill(0);
    
    textStyle(BOLD);
    text("Sound", this.x + 140, this.y + 15);
    
    this.shape.drawFixed(this.x + 100, this.y + 60);
  }
  
  // Toggles mute on this RandomSound.
  toggleMute() {
    this.muted = !this.muted;
  }
}

// Class for PolySynth with random attributes.
class Synth {
  constructor(x, y, numNotes, length, low, high, chance) {
    // x and y location to draw this Synth.
    this.x = x; 
    this.y = y;
    
    // Rhythm and note related fields.
    this.rhythm = [];
    this.length = length;
    this.notes = [];
    this.count = 0;
    
    // Chance to play at any given count (for generating rhythm).
    this.chance = chance;
    
    // width and height for drawing this Synth.
    this.width = 200;
    this.height = 100;
    
    this.muted = true;
    
    // Creates PolySynth object.
    this.polySynth = new p5.PolySynth()
    this.polySynth.setADSR(random(0.05, 0.25), 0.01, 1, random(0.25));
    
    // Number of notes to play simultaneously.
    this.numNotes = numNotes;
    
    // Lowest and highest notes to play.
    this.low = low;
    this.high = high;
    
    this.generate();
  }
  
  // Plays this Synth if its rhythm says so at the current count, and advances the count either way.
  play() {
    userStartAudio();
    
    if (this.rhythm[this.count] === 1 && !this.muted) {
      this.polySynth.play(this.notes[this.count], 0.75, 0, random(0.05, 0.2));
    
      // Plays more notes if needed, each 50 above the previous.
      if (this.numNotes > 1) {
        for (let i = 1; i < this.numNotes; i++) {
          this.polySynth.play(this.notes[this.count] + (i * 50), 0.75, 0, 0.5);
        }
      }
      
      this.line.height = map(cScale.indexOf(this.notes[this.count]), 0, cScale.length, canvas.height, canvas.y);
      
      canvas.addLine(this.line);
    }
    
    this.count++;
    
    if (this.count >= this.rhythm.length) {
        this.count = 0;
    }
  }
  
  // Generates this Synths parameters.
  generate() {
    this.rhythm = [];
    this.notes = [];
    
    for (let i = 0; i < this.length; i++) {
      let rand = random(10);
      
      if (rand > this.chance) {
        this.rhythm.push(0);
      } else {
        this.rhythm.push(1);
      }
      
      this.notes.push(cScale[round(random(this.low, this.high))])
    }
    
    this.line = new Line(0, random(255), random(255), random(255), map((this.low + this.height) / 2, 300, 0, 1, 10));
  }
  
  // Draws this Synths user interface.
  draw() {
    if (this.muted) {
      fill(75);
    } else {
      fill(200);
    }
    
    stroke(0);
    
    rect(this.x, this.y, this.width, this.height);
    
    noStroke();
    fill(0);
    
    textStyle(BOLD);
    text("Synth", this.x + 125, this.y + 15);
    
    this.line.drawFixed(this.x + 5, this.y + 50, this.width - 10);
  }
  
  // Toggles mute on this Synth.
  toggleMute() {
    this.muted = !this.muted;
  }
}

// Class for canvas area to display Shapes.
class ShapeCanvas {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    // Stores the current Shapes to show.
    this.shapes = [];
    
    // Stores the current Lines to show.
    this.lines = [];
  }
  
  // Draws this ShapeCanvas's Shapes and Lines.
  draw() {
    for (let i = 0; i < this.shapes.length; i++) {
      // Draw each Shape in this ShapeCanvas's stored Shapes.
      this.shapes[i].draw();
      
      if (this.shapes[i].life >= 255) {
        // If the Shape has reached the end of its life, remove it from the Shapes array.
          this.shapes.splice(i, 1);
      }
    }
    
    for (let i = 0; i < this.lines.length; i++) {
      // Draw and remove each Line in this ShapeCanvas's stored Lines.
      this.lines[i].draw();
      
      this.lines.splice(i, 1);
    }
  }
  
  // Add a new Shape to this ShapeCanvas.
  addObject(shape) {
    this.shapes.push(new Shape(shape.x, shape.y, shape.r, shape.g, shape.b, shape.deltaOpacity, shape.type));
  }
  
  // Add a new Line to this ShapeCanvas.
  addLine(line) {
    this.lines.push(new Line(line.height, line.r, line.g, line.b, line.weight));
  }
}

// Class for Shapes to be drawn on the ShapeCanvas.
class Shape {
  constructor(x, y, r, g, b, deltaOpacity, type) {
    // x and y location to draw this Shape at.
    this.x = x;
    this.y = y;
    
    // RGB values for this Shape.
    this.r = r;
    this.g = g;
    this.b = b;
    
    // How much to change the Shape's opacity per draw.
    this.deltaOpacity = deltaOpacity;
    this.life = 1;
    
    // Type of shape, either rectangle or circle.
    this.type = type;
  }
  
  // Draws this Shape.
  draw() {
    // Draws this Shape with opacity related to its length of time shown.
    stroke(this.r, this.g, this.b, 255 - (this.life));
    noFill();
    
    if (this.type < 1) {
        scribble.scribbleRect(this.x + random(-2.5, 2.5), this.y + random(-2.5, 2.5), 50, 50);
    } else {
      scribble.scribbleEllipse(this.x + random(-2.5, 2.5), this.y + random(-2.5, 2.5), 50, 50);
    }
    
    // Updates this Shape's life with the change in opacity.
    this.life += this.deltaOpacity;
  }
  
  // Draws this Shape at a fixed location, ignoring its x and y fields.
  drawFixed(x, y) {
    stroke(this.r, this.g, this.b);
    noFill();
    
    if (this.type < 1) {
      scribble.scribbleRect(x, y, 50, 50);
    } else {
      scribble.scribbleEllipse(x, y, 50, 50);
    }
  }
}

// Class for Lines to be drawn on the ShapeCanvas.
class Line {
  constructor(height, r, g, b, weight) {
    // y height to draw this Line at.
    this.y = height;
    
    // RGB values for this Line.
    this.r = r;
    this.g = g;
    this.b = b;
    
    // Weight/thickness of this Line.
    this.weight = weight;
  }
  
  // Draws this Line.
  draw() {
    stroke(this.r, this.g, this.b);
    strokeWeight(this.weight);
    
    scribble.scribbleLine(canvas.x, this.y, canvas.width, this.y);
    
    strokeWeight(1);
  }
  
  // Draws this Line at a fixed location, ignoring y field.
  drawFixed(x, y, width) {
    stroke(this.r, this.g, this.b);
    strokeWeight(this.weight);
    
    scribble.scribbleLine(x, y, x + width, y);
    
    strokeWeight(1);
  }
}